import { json, redirect, Request } from "@remix-run/node";
import { Trans, useTranslation } from "react-i18next";
import { useEffect, useState, MouseEvent } from "react";

import BackLink from "~/components/BackLink";
import Required from "~/components/Required";
import RequiredQuestionStatement from "~/components/RequiredQuestionStatement";

import type { ChooseClinicData, Clinic, EligibilityData } from "~/types";
import { isValidZipCode } from "~/utils/dataValidation";
import {
  Form,
  ThrownResponse,
  useActionData,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import {
  Alert,
  Label,
  TextInput,
  Button,
  Icon,
  Title,
} from "@trussworks/react-uswds";
import { cookieParser } from "~/utils/formSession";
import {
  findClinics,
  findClinicByName,
  upsertEligibilityAndEligibilityPage,
  findEligibilityPageData,
} from "~/utils/db.server";
import InputChoiceGroup from "~/components/InputChoiceGroup";
import {
  setFormDefaults,
  ValidatedForm,
  validationError,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { clinicFormSchema } from "~/utils/dataValidation";
import ClinicInfo from "~/components/ClinicInfo";
import { getBackRoute, routeFromClinic } from "~/utils/routing";

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

export const clinicValidator = withZod(clinicFormSchema);

export async function loader({ request }: { request: Request }) {
  // read a cookie
  const { eligibilityID, headers } = await cookieParser(request);

  const url = new URL(request.url);
  const zipcode = url.searchParams.get("zip");
  const reviewMode = url.searchParams.get("mode") == "review";
  const existingClinicPage = (await findEligibilityPageData(
    eligibilityID,
    "choose-clinic"
  )) as ChooseClinicData;
  const existingEligibilityPage = (await findEligibilityPageData(
    eligibilityID,
    "eligibility"
  )) as EligibilityData;
  const backRoute = getBackRoute(url.pathname, existingEligibilityPage);
  console.log(
    `QUERY PARMS ${zipcode} VALID? ${zipcode && isValidZipCode(zipcode)}`
  );
  if (existingClinicPage && !zipcode) {
    return redirect(`/choose-clinic?zip=${existingClinicPage.zipCode}`);
  } else if (existingClinicPage && zipcode == existingClinicPage.zipCode) {
    return json(
      {
        eligibilityID: eligibilityID,
        reviewMode: reviewMode,
        backRoute: backRoute,
        zipCode: zipcode,
        clinics: [existingClinicPage],
        ...setFormDefaults("clinicForm", existingClinicPage),
      },
      { headers: headers }
    );
  }
  if (!zipcode) {
    return json(
      {
        eligibilityID: eligibilityID,
        reviewMode: reviewMode,
        backRoute: backRoute,
      },
      { headers: headers }
    );
  }

  if (!isValidZipCode(zipcode)) {
    console.log(`ERROR: Bad zipcode ${zipcode}`);
    return json(
      {
        invalidZip: true,
        eligibilityID: eligibilityID,
        backRoute: backRoute,
        reviewMode: reviewMode,
      },
      { headers: headers }
    );
  }
  const clinicsByDistance = await findClinics(zipcode, 8);
  if (!clinicsByDistance.length) {
    console.log(`ERROR: No results for ${zipcode}`);
    return json(
      {
        noResults: true,
        eligibilityID: eligibilityID,
        backRoute: backRoute,
        reviewMode: reviewMode,
        zipCode: zipcode,
      },
      { headers: headers }
    );
  }
  console.log(`Found ${clinicsByDistance.length} clinics for zip ${zipcode}`);
  return json(
    {
      clinics: clinicsByDistance,
      noResults: zipcode && !clinicsByDistance.length,
      eligibilityID: eligibilityID,
      backRoute: backRoute,
      reviewMode: reviewMode,
      zipCode: zipcode,
    },
    { headers: headers }
  );
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const reviewMode = formData.get("action") == "updateAndReturn" ? true : false;
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
    zipCode: zipcode,
    ...clinic,
  });

  const routeTarget = routeFromClinic(clinic, reviewMode);
  console.log(`Completed clinic form; routing to ${routeTarget}`);
  return redirect(routeTarget);
};

export default function ChooseClinic() {
  // Initialize form as a state using blank values.
  const { clinics, zipCode, noResults, invalidZip, reviewMode, backRoute } =
    useLoaderData();
  const data = useActionData();

  const { t } = useTranslation("common");

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
  }, [noResults, clinics, zipCode]);
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
      <BackLink href={backRoute} />
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
            <span className="usa-error-message" role="alert">
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
              defaultValue={zipCode}
              onChange={(e) => handleZipCodeChange()}
            />
            {reviewMode ? (
              <input type="hidden" name="mode" value="review" />
            ) : (
              ""
            )}
            <Button type="submit" aria-label="Search for clinics">
              <Icon.Search size={3} aria-label="A magnifying glass" />
            </Button>
          </Form>
        </section>
        {zipNotInStateError && (
          <Alert type="error" headingLevel="h3" role="alert">
            {t("ChooseClinic.zipSearchError")}
          </Alert>
        )}
      </div>
      <ValidatedForm
        className="usa-form usa-form--large"
        validator={clinicValidator}
        method="post"
        id="clinicForm"
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
        {filteredClinics?.length >= 1 && (
          <Button type="submit" value={actionButtonLabel} name="action">
            <Trans i18nKey={actionButtonLabel} />
          </Button>
        )}
      </ValidatedForm>
    </>
  );
}
