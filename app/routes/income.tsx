import { useLoaderData, useLocation } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { Trans, useTranslation } from "react-i18next";
import { ChangeEvent, useEffect, useState } from "react";

import Accordion from "app/components/Accordion";
import BackLink from "app/components/BackLink";
import ButtonLink from "app/components/ButtonLink";
import Dropdown from "app/components/Dropdown";
import RequiredQuestionStatement from "app/components/RequiredQuestionStatement";
import StyledLink from "app/components/StyledLink";
import IncomeRow from "app/components/IncomeRow";

import { IncomeData, IncomeDataMap, parseObjectAsIncome } from "app/types";
import incomeData from "public/data/income.json";

import { isValidIncome } from "app/utils/dataValidation";
import {
  getBackRoute,
  getForwardRoute,
  hasRoutingIssues,
} from "app/utils/routing";

export const loader: LoaderFunction = async () => {
  return json<IncomeDataMap>(incomeData);
};

export default function Income() {
  const incomeData = parseObjectAsIncome(useLoaderData());

  const location = useLocation();
  const reviewMode = location.hash.includes("review");
  // Handle back link.
  const backRoute = getBackRoute();

  // Handle action button.
  // Initialize form as a state with blank values.

  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  const actionButtonLabel = reviewMode ? "updateAndReturn" : "continue";

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState(true);

  // Page-specific consts.
  // Get the allowed household sizes from the json file.
  const householdSizes: string[] = Object.keys(incomeData);
  // Get the list of allowed income periods.
  const incomePeriods: string[] = Object.keys(
    incomeData[householdSizes[0] as keyof typeof incomeData]
  );
  // Initialize translations.
  const { t } = useTranslation("common");

  // Handle form element changes.
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name }: { value: string; name: string } = e.target;
  };
  const incomeForHouseholdSize = incomeData[0];
  // invariant(incomeForHouseholdSize, "Missing income for household size");

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

      <form className="usa-form usa-form--large">
        <fieldset className="usa-fieldset">
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
            // selectedOption={form.householdSize}
          />
        </fieldset>

        <fieldset className="usa-fieldset">
          <table className="usa-table usa-table--stacked usa-table--borderless">
            <caption>
              <h2>
                <Trans i18nKey="Income.estimatedIncome" />
              </h2>
            </caption>
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
                householdSize={"0"}
                incomeForHouseholdSize={incomeForHouseholdSize}
              />
            </tbody>
          </table>
          <p>
            <StyledLink
              href="https://dphhs.mt.gov/Assistance"
              textKey="Income.assistance"
              external={true}
            />
          </p>
        </fieldset>
        <ButtonLink
          href={"/vegan-ham-sandwich"}
          labelKey={actionButtonLabel}
          disabled={disabled}
        />
      </form>
    </>
  );
}
