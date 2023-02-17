import IncomeRow from "~/components/IncomeRow";
import type { IncomeRowProps } from "~/components/IncomeRow";

import { ReactElement } from "react";
import { Trans } from "react-i18next";
const incomePeriods = ["annual", "biweekly", "monthly", "weekly"];

export default {
  component: IncomeRow,
  title: "Components/IncomeRow",
  argTypes: {
    periods: {
      description: "Time periods for the income",
      defaultValue: incomePeriods,
    },
    householdSize: {
      description: "Household size; if empty string, will display $XX,XXXX",
      defaultValue: "",
    },
    incomeForHouseholdSize: {
      description: "Map of dollars to periods",
      defaultValue: {
        annual: "$50,000",
        monthly: "$4,167",
        biweekly: "$2,083",
        weekly: "1,041",
      },
    },
  },
};

const IncomeRowTemplate = {
  render: (props: IncomeRowProps) => {
    return (
      <table>
        <thead>
          <tr>
            {incomePeriods.map((period: string) => (
              <th scope="col" key={period}>
                {period}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <IncomeRow {...props} />
        </tbody>
      </table>
    );
  },
};

export const Example = {
  ...IncomeRowTemplate,
  args: {
    householdSize: "1",
  },
};

export const EmptyHouseholdSize = {
  ...IncomeRowTemplate,
};
