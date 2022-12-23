import { json, redirect, Request } from "@remix-run/node";
import { Trans, useTranslation } from "react-i18next";
import { useEffect, useState, MouseEvent } from "react";

import BackLink from "~/components/BackLink";
import Required from "~/components/Required";
import RequiredQuestionStatement from "~/components/RequiredQuestionStatement";

import type { Clinic } from "~/types";
import { isValidZipCode } from "~/utils/dataValidation";
import {
  Form,
  ThrownResponse,
  useActionData,
  useCatch,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { Alert, Label, TextInput, Button, Icon } from "@trussworks/react-uswds";
import { cookieParser } from "~/utils/formSession";
import {
  findClinics,
  findClinicByName,
  upsertEligibility,
  upsertEligibilityPage,
  upsertEligibilityAndEligibilityPage,
} from "~/utils/db.server";
import InputChoiceGroup from "~/components/InputChoiceGroup";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { withZod } from "@remix-validated-form/with-zod";
import ClinicInfo from "~/components/ClinicInfo";
import { z } from "zod";
import { routeFromClinic } from "~/utils/routing";

type ZipError = {
  message: string;
  errorType: string;
};

type ThrownResponses = ThrownResponse<400, ZipError>;

export function CatchBoundary() {
  // this returns { status, statusText, data }
  const caught = useCatch<ThrownResponses>();

  switch (caught.data.errorType) {
    case "invalidZip":
      return (
        <Alert type="error" headingLevel="h3">
          <Trans i18nKey="ChooseClinic.zipValidationError" />
        </Alert>
      );
    case "noResults":
      return (
        <Alert type="error" headingLevel="h3">
          <Trans i18nKey="ChooseClinic.zipSearchError" />
        </Alert>
      );
  }
}

const clinicFormSchema = zfd.formData({
  clinic: zfd.text(
    z.string().min(1, {
      message: "You must select a WIC clinic to continue",
    })
  ),
});

export const clinicValidator = withZod(clinicFormSchema);

export async function loader({ request }: { request: Request }) {
  // read a cookie
  const { eligibilityID, headers } = await cookieParser(request);

  const url = new URL(request.url);

  const zipcode = url.searchParams.get("zip");
  console.log(
    `QUERY PARMS ${zipcode} IS IT VALID? ${zipcode && isValidZipCode(zipcode)}`
  );
  if (!zipcode) {
    return json({
      eligibilityID: eligibilityID,
      headers: headers,
    });
  }
  if (!isValidZipCode(zipcode)) {
    console.log(`ERROR: Bad zipcode ${zipcode}`);
    return json({
      eligibilityID: eligibilityID,
      invalidZip: true,
      headers: headers,
    });
  }
  const clinicsByDistance = await findClinics(zipcode, 8);
  if (!clinicsByDistance.length) {
    console.log(`ERROR: No results for ${zipcode}`);
    return json({
      eligibilityID: eligibilityID,
      noResults: true,
      zipcode: zipcode,
      headers: headers,
    });
  }
  console.log(`Found ${clinicsByDistance.length} clinics for zip ${zipcode}`);
  return json({
    eligibilityID: eligibilityID,
    zipcode: zipcode,
    clinics: clinicsByDistance,
    headers: headers,
    noResults: zipcode && !clinicsByDistance.length,
  });
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const url = new URL(request.url);
  const zipcode = url.searchParams.get("zip");
  const validationResult = await clinicValidator.validate(formData);
  if (validationResult.error) {
    console.log(`Validation error: ${validationResult.error}`);
    return validationError(validationResult.error, validationResult.data);
  }
  const parsedForm = clinicFormSchema.parse(formData);
  const clinic = await findClinicByName(parsedForm.clinic);
  if (!clinic) {
    console.log(`Clinic "${parsedForm.clinic}" not found in database`);
    return validationError(
      {
        fieldErrors: { clinic: "Unable to find clinic; please choose another" },
      },
      validationResult.data
    );
  }
  const { eligibilityID } = await cookieParser(request);
  await upsertEligibilityAndEligibilityPage(eligibilityID, "choose-clinic", {
    zipcode: zipcode,
    ...clinic,
  });

  const routeTarget = routeFromClinic(clinic);
  console.log(`Completed clinic form; routing to ${routeTarget}`);
  return redirect(routeTarget);
};

export default function ChooseClinic() {
  // Initialize form as a state using blank values.
  const { clinics, zipcode, noResults, invalidZip } = useLoaderData();
  const data = useActionData();

  const { t } = useTranslation("common");

  // Page specific states & consts.
  const location = useLocation();
  const reviewMode = location.hash.includes("review");

  const actionButtonLabel = reviewMode
    ? "updateAndReturn"
    : "ChooseClinic.button";
  // A state for handling whether the list of clinics shown to the user is expanded.
  const [expandList, setExpandList] = useState<boolean>(false);
  // A state for holding nearest clinics by zip code.
  const [filteredClinics, setFilteredClinics] =
    useState<(Clinic | undefined)[]>(clinics);

  // A state for tracking whether the zip code the user entered is out of state.
  const [zipNotInStateError, setZipNotInStateError] =
    useState<boolean>(noResults);

  useEffect(() => {
    setZipNotInStateError(noResults);
    setFilteredClinics(clinics);
  }, [noResults, clinics]);
  // Change handler for any updates to the zip code search field.
  const handleZipCodeChange = () => {
    // Reset all the clinic result states.
    setZipNotInStateError(false);
    setFilteredClinics([]);
    setExpandList(false);
  };

  const handleExpandClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setExpandList(true);
  };

  // @TODO: zip code search box and alert are not set to the correct form max-width on non-mobile
  // @TODO: Switch zip code field to use react-number-format. Requires react-number-format to support type=search
  return (
    <>
      <BackLink href="" />
      <h1>
        <Trans i18nKey="ChooseClinic.title" />
      </h1>
      <RequiredQuestionStatement />

      <div className="content-group">
        <p>
          <Trans i18nKey="ChooseClinic.body" />
        </p>
      </div>

      <div className="content-group">
        <h2>
          <Trans i18nKey="ChooseClinic.searchLabel" />
          <Required />
        </h2>
        <section aria-label="Search clinic by zip">
          {invalidZip && (
            <span className="usa-error-message">
              <Trans i18nKey="ChooseClinic.zipValidationError" />
            </span>
          )}

          <Form
            className="usa-search usa-search--small"
            role="search"
            method="get"
          >
            <Label className="usa-sr-only" htmlFor="search-field-en-small">
              <Trans i18nKey="ChooseClinic.searchLabel" />
            </Label>
            <TextInput
              className="usa-input usa-input-error"
              id="search-field-en-small"
              name="zip"
              type="search"
              defaultValue={zipcode}
              onChange={(e) => handleZipCodeChange()}
            />
            <Button type="submit">
              <Icon.Search size={3} />
            </Button>
          </Form>
        </section>
        {zipNotInStateError && (
          <Alert type="error" headingLevel="h3">
            {t("ChooseClinic.zipSearchError")}
          </Alert>
        )}
      </div>
      <ValidatedForm
        className="usa-form usa-form--large"
        validator={clinicValidator}
        method="post"
      >
        <InputChoiceGroup
          required
          titleKey="ChooseClinic.listTitle"
          type="radio"
          name="clinic"
          choices={filteredClinics
            ?.slice(0, expandList ? filteredClinics.length : 4)
            .map((clinic: any) => {
              return {
                value: clinic.clinic,
                labelElement: (
                  <ClinicInfo
                    name={clinic.clinic}
                    streetAddress={clinic.clinicAddress}
                    phone={clinic.clinicTelephone}
                    isFormElement={true}
                  />
                ),
              };
            })}
        />
        {filteredClinics?.length > 1 && !expandList && (
          <Button
            type="button"
            className="margin-top-0"
            unstyled={true}
            onClick={handleExpandClick}
          >
            <Trans i18nKey={"ChooseClinic.showMoreOptions"} />
          </Button>
        )}{" "}
        <div />
        {filteredClinics?.length > 1 && (
          <Button type="submit">
            <Trans i18nKey={actionButtonLabel} />
          </Button>
        )}
      </ValidatedForm>
    </>
  );
}
