import { useActionData, useLoaderData, useLocation } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Trans, useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";
import { ValidatedForm, validationError } from "remix-validated-form";
import Accordion from "app/components/Accordion";
import BackLink from "app/components/BackLink";
import Dropdown from "app/components/Dropdown";
import RequiredQuestionStatement from "app/components/RequiredQuestionStatement";
import StyledLink from "app/components/StyledLink";
import IncomeRow from "app/components/IncomeRow";
import { Table, Fieldset, Button } from "@trussworks/react-uswds";

import { IncomeData, IncomeDataMap, parseObjectAsIncome } from "app/types";
import incomeData from "public/data/income.json";
import { incomeSchema } from "~/utils/dataValidation";
import { getBackRoute, routeFromIncome } from "app/utils/routing";
import { withZod } from "@remix-validated-form/with-zod";
import { cookieParser } from "~/utils/formSession";
import {
  findEligibilityPageData,
  upsertEligibilityAndEligibilityPage,
} from "~/utils/db.server";

export const incomeValidator = withZod(incomeSchema);

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const reviewMode = url.searchParams.get("mode") == "review";
  const { eligibilityID, headers } = await cookieParser(request);
  const existingIncomePage = (await findEligibilityPageData(
    eligibilityID,
    "income"
  )) as IncomeData;
  console.log(`FOUND INCOME ${JSON.stringify(existingIncomePage)}`);
  return json({
    eligibilityID: eligibilityID,
    reviewMode: reviewMode,
    income: incomeData as IncomeDataMap,
    selected: existingIncomePage,
    ...headers,
  });
};

type loaderData = Awaited<ReturnType<typeof loader>>;

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const reviewMode = formData.get("action") == "updateAndReturn" ? true : false;
  const validationResult = await incomeValidator.validate(formData);
  if (validationResult.error) {
    console.log(`Validation error: ${validationResult.error}`);
    return validationError(validationResult.error, validationResult.data);
  }
  const parsedForm = incomeSchema.parse(formData);
  const { eligibilityID } = await cookieParser(request);
  await upsertEligibilityAndEligibilityPage(
    eligibilityID,
    "income",
    parsedForm
  );
  const routeTarget = routeFromIncome(parsedForm, reviewMode);
  console.log(`Completed income form; routing to ${routeTarget}`);
  return redirect(routeTarget);
};

export default function Income() {
  const { income, reviewMode, selected } = useLoaderData<loaderData>();
  const incomeData = parseObjectAsIncome(income);
  const data = useActionData();
  // Handle back link.
  const location = useLocation();
  const backRoute = getBackRoute(location.pathname);
  const [selectedSize, setSelectedSize] = useState(
    selected?.householdSize || ""
  );

  // Handle action button.
  // Initialize form as a state with blank values.
  const initialIncomeData: IncomeData = {
    householdSize: selectedSize,
  };
  const [incomeState, setIncomeState] = useState<IncomeData>(initialIncomeData);

  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  const actionButtonLabel = reviewMode ? "updateAndReturn" : "continue";

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState(true);

  // Page-specific consts.
  // Get the allowed household sizes from the json file.
  const householdSizes: string[] = Object.keys(incomeData);
  console.log(`Household sizes ${householdSizes}`);
  // Get the list of allowed income periods.
  const incomePeriods: string[] = Object.keys(
    incomeData[householdSizes[0] as keyof typeof incomeData]
  );
  console.log(`Periods for income ${incomePeriods}`);
  // Initialize translations.
  const { t } = useTranslation("common");

  // Handle form element changes.
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name }: { value: string; name: string } = e.target;
    setSelectedSize(value);
    const newIncomeState = { ...incomeState, [name]: value };
    // Update the income state.
    setIncomeState(newIncomeState);
  };

  return (
    <>
      <BackLink href={backRoute} />
      <h1>
        <Trans i18nKey="Income.header" />
      </h1>
      <RequiredQuestionStatement />

      <div className="content-group">
        <h2>
          <Trans i18nKey="Income.title" />
        </h2>
        <p>
          <Trans i18nKey="Income.enrolled" />
        </p>
        <p>
          <Trans i18nKey="Income.notEnrolled" />
        </p>
        <p>
          <Trans i18nKey="Income.unsure" />
        </p>
      </div>

      <ValidatedForm
        validator={incomeValidator}
        method="post"
        id="incomeForm"
        className="usa-form usa-form--large"
      >
        <Fieldset>
          <h2>
            <Trans i18nKey="Income.householdSizeHeader" />
          </h2>
          <Accordion
            bodyKey={"Income.accordionBody"}
            headerKey={"Income.accordionHeader"}
            id="income-accordion"
          />
          <Dropdown
            id="householdSize"
            labelKey="Income.householdSize"
            handleChange={handleChange}
            options={householdSizes}
            required={true}
            selectedOption={selectedSize}
          />
        </Fieldset>

        <Fieldset>
          <Table bordered={false} caption={t("Income.estimatedIncome")}>
            <thead>
              <tr>
                {incomePeriods.map((period: string) => (
                  <th scope="col" key={period}>
                    {t(`Income.incomePeriods.${period}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <IncomeRow
                periods={incomePeriods}
                householdSize={incomeState.householdSize}
                incomeForHouseholdSize={
                  incomeData[
                    incomeState.householdSize as keyof typeof incomeData
                  ]
                }
              />
            </tbody>
          </Table>
          <p>
            <StyledLink
              href="https://dphhs.mt.gov/Assistance"
              textKey="Income.assistance"
              external={true}
            />
          </p>
        </Fieldset>
        <Button type="submit" value={actionButtonLabel} name="action">
          <Trans i18nKey={actionButtonLabel} />
        </Button>
      </ValidatedForm>
    </>
  );
}
