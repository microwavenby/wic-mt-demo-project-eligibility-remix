import { renderWithRouter } from "tests/helpers/setup";
import IncomeRow from "app/components/IncomeRow";

const testProps = {
  periods: ["weekly", "monthly", "annual"],
  householdSize: "1",
  incomeForHouseholdSize: {
    weekly: "$100",
    monthly: "$200",
    annual: "$300",
  },
};

it("should match snapshot when householdSize is not empty string", () => {
  const { container } = renderWithRouter(<IncomeRow {...testProps} />);
  expect(container).toMatchSnapshot();
});

it("should match snapshot when householdSize is an empty string", () => {
  const { container } = renderWithRouter(
    <IncomeRow {...testProps} householdSize="" />
  );
  expect(container).toMatchSnapshot();
});
