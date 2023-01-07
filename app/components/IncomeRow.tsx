import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

export type IncomeRowProps = {
  periods: string[];
  householdSize: string;
  incomeForHouseholdSize: {
    [key: string]: string;
  };
};

const IncomeRow = (props: IncomeRowProps): ReactElement => {
  const { periods, householdSize, incomeForHouseholdSize } = props;
  const { t } = useTranslation("common");

  // If the householdSize is not an empty string, then use it
  // to lookup the income amounts for each time period.
  // Otherwise, return a placeholder row.

  return (
    <tr>
      {periods.map((period: string) => (
        <td key={period} data-label={t(`Income.incomePeriods.${period}`)}>
          {householdSize !== "" ? incomeForHouseholdSize[period] : "$XX,XXX"}
        </td>
      ))}
    </tr>
  );
};

export default IncomeRow;
