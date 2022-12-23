import { Trans } from "react-i18next";
import { useLocation, useLoaderData, useActionData } from "@remix-run/react";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import {
  ValidatedForm,
  useIsSubmitting,
  validationError,
  setFormDefaults,
} from "remix-validated-form";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Button } from "@trussworks/react-uswds";
import Accordion from "~/components/Accordion";
import BackLink from "~/components/BackLink";
import InputChoiceGroup from "~/components/InputChoiceGroup";
import RequiredQuestionStatement from "~/components/RequiredQuestionStatement";
import { validEligibilityOptions } from "~/utils/dataValidation";
import { Request } from "@remix-run/node";
import {
  findEligibilityPageData,
  upsertEligibilityAndEligibilityPage,
} from "~/utils/db.server";
import { getBackRoute, routeFromEligibility } from "~/utils/routing";
import { cookieParser } from "~/utils/formSession";
import { EligibilityData } from "~/types";

const eligibilitySchema = zfd.formData({
  residential: zfd.text(),
  categorical: zfd
    .repeatable(
      z.array(zfd.text()).min(1, {
        message: "You must select at least one option",
      })
    )
    .refine(
      (adj) =>
        (adj.includes("none") && adj.length == 1) || !adj.includes("none"),
      {
        message: `Cannot select None and another option`,
      }
    ),
  previouslyEnrolled: zfd.text(),
  adjunctive: zfd
    .repeatable(
      z.array(zfd.text()).min(1, {
        message: "You must select at least one option",
      })
    )
    .refine(
      (adj) =>
        (adj.includes("none") && adj.length == 1) || !adj.includes("none"),
      {
        message: `Cannot select None and another option`,
      }
    ),
});

export const eligibilityValidator = withZod(eligibilitySchema);

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const reviewMode = url.searchParams.get("mode") == "review";
  const { eligibilityID, headers } = await cookieParser(request);
  const existingEligibilityPage = (await findEligibilityPageData(
    eligibilityID,
    "eligibility"
  )) as EligibilityData;
  return json({
    eligibilityID: eligibilityID,
    reviewMode: reviewMode,
    ...headers,
    ...setFormDefaults("eligiblityForm", existingEligibilityPage),
  });
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const validationResult = await eligibilityValidator.validate(formData);
  if (validationResult.error) {
    console.log(`Validation error: ${validationResult.error}`);
    return validationError(validationResult.error, validationResult.data);
  }
  const parsedForm = eligibilitySchema.parse(formData);
  const { eligibilityID } = await cookieParser(request);
  await upsertEligibilityAndEligibilityPage(
    eligibilityID,
    "eligibility",
    parsedForm
  );
  const reviewMode = formData.get("action") == "updateAndReturn" ? true : false;
  const routeTarget = routeFromEligibility(parsedForm, reviewMode);
  console.log(`Completed eligibility form; routing to ${routeTarget}`);
  return redirect(routeTarget);
};

type loaderData = Awaited<ReturnType<typeof loader>>;

export default function Eligibility() {
  // Use useEffect() to properly load the data from session storage during react hydration.
  const { reviewMode } = useLoaderData<loaderData>();
  const data = useActionData();

  // Handle back link.
  const backRoute = getBackRoute();

  // Handle action button.
  // Set up action button and routing
  const actionButtonLabel = reviewMode ? "updateAndReturn" : "continue";
  return (
    <>
      <BackLink href={backRoute} />
      <h1>
        <Trans i18nKey="Eligibility.header" />
      </h1>
      <RequiredQuestionStatement />
      <ValidatedForm
        validator={eligibilityValidator}
        className="usa-form usa-form--large"
        method="post"
        id="eligiblityForm"
      >
        <InputChoiceGroup
          required
          titleKey="Eligibility.residential"
          type="radio"
          name="residential"
          choices={validEligibilityOptions.residential.map((option) => {
            return {
              labelElement: <Trans i18nKey={`Eligibility.${option}`} />,
              value: option,
            };
          })}
        />
        <InputChoiceGroup
          required
          titleKey="Eligibility.categorical"
          type="checkbox"
          name="categorical"
          choices={validEligibilityOptions.categorical.map((option) => {
            return {
              labelElement: <Trans i18nKey={`Eligibility.${option}`} />,
              value: option,
            };
          })}
          helpElement={
            <Accordion
              headerKey="Eligibility.accordionHeader"
              bodyKey="Eligibility.accordionBody"
              id="eligibility-accordion"
            />
          }
        />
        <InputChoiceGroup
          required
          titleKey="Eligibility.previouslyEnrolled"
          type="radio"
          name="previouslyEnrolled"
          choices={validEligibilityOptions.previouslyEnrolled.map((option) => {
            return {
              labelElement: <Trans i18nKey={`Eligibility.${option}`} />,
              value: option,
            };
          })}
        />
        <InputChoiceGroup
          required
          titleKey="Eligibility.adjunctive"
          type="checkbox"
          name="adjunctive"
          choices={validEligibilityOptions.adjunctive.map((option) => {
            return {
              labelElement: <Trans i18nKey={`Eligibility.${option}`} />,
              value: option,
            };
          })}
        />
        <Button type="submit" value={actionButtonLabel} name="action">
          <Trans i18nKey={actionButtonLabel} />
        </Button>
      </ValidatedForm>
    </>
  );
}
