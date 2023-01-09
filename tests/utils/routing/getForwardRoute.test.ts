import {
  getMockChooseClinicData,
  getMockContactData,
  getMockEligibilityData,
  getMockIncomeData,
} from "tests/helpers/mockData";
import {
  routeFromClinic,
  routeFromHowItWorks,
  routeFromContact,
  routeFromIncome,
  routeFromEligibility,
  routeFromReview,
} from "app/utils/routing";

it("from /income in review mode, it should route to review", () => {
  const forwardRoute = routeFromIncome(getMockIncomeData(), true);
  expect(forwardRoute).toBe("/review");
});

it("from /choose-clinic in review mode, it should route forward to /review", () => {
  const forwardRoute = routeFromClinic(getMockChooseClinicData(), true);
  expect(forwardRoute).toBe("/review");
});

it("from /contact as long as a contact is presented, it should route to /review", () => {
  const forwardRoute = routeFromContact(getMockContactData());
  expect(forwardRoute).toBe("/review");
});

it("from /eligibility?mode=review it should route to /review if there is qualifying adjunctive criteria", () => {
  const forwardRoute = routeFromEligibility(getMockEligibilityData(), true);
  expect(forwardRoute).toBe("/review");
});

it("from /eligibility it should route to /choose-clinic if there is qualifying adjunctive criteria", () => {
  const forwardRoute = routeFromEligibility(getMockEligibilityData(), false);
  expect(forwardRoute).toBe("/choose-clinic");
});

it("from /eligibility it should route to /income if there is no qualifying adjunctive criteria", () => {
  const mockEligibility = getMockEligibilityData();
  mockEligibility.adjunctive = ["none"];
  const forwardRoute = routeFromEligibility(mockEligibility, false);
  expect(forwardRoute).toBe("/income");
});

it("from /eligibility it should route to /other-benefits if residential is not met, but categorical is met", () => {
  const mockEligibility = getMockEligibilityData();
  mockEligibility.residential = "no";
  const forwardRoute = routeFromEligibility(mockEligibility, false);
  expect(forwardRoute).toBe("/other-benefits");
});

it("from /eligibility it should route to /other-benefits if residential is met, but categorical is not met", () => {
  const mockEligibility = getMockEligibilityData();
  mockEligibility.categorical = ["none"];
  const forwardRoute = routeFromEligibility(mockEligibility, false);
  expect(forwardRoute).toBe("/other-benefits");
});

it("from /eligibility it should route to /other-benefits if residential is not met and categorical is not met", () => {
  const mockEligibility = getMockEligibilityData();
  mockEligibility.categorical = ["none"];
  mockEligibility.residential = "no";
  const forwardRoute = routeFromEligibility(mockEligibility, false);
  expect(forwardRoute).toBe("/other-benefits");
});

it("from /eligibility?mode=review it should route to /income?mode=review if there is no qualifying adjunctive criteria and invalid income", () => {
  const mockEligibility = getMockEligibilityData();
  mockEligibility.adjunctive = ["none"];
  const forwardRoute = routeFromEligibility(mockEligibility, true);
  expect(forwardRoute).toBe("/income?mode=review");
});

it("from /eligibility?mode=review it should route to /other-benefits if residential is not met, but categorical is met", () => {
  const mockEligibility = getMockEligibilityData();
  mockEligibility.residential = "no";
  const forwardRoute = routeFromEligibility(mockEligibility, true);
  expect(forwardRoute).toBe("/other-benefits");
});

it("from /eligibility?mode=review it should route to /other-benefits if residential is met, but categorical is not met", () => {
  const mockEligibility = getMockEligibilityData();
  mockEligibility.categorical = ["none"];
  const forwardRoute = routeFromEligibility(mockEligibility, true);
  expect(forwardRoute).toBe("/other-benefits");
});

it("from /eligibility?mode=review it should route to /other-benefits if residential is not met and categorical is not met", () => {
  const mockEligibility = getMockEligibilityData();
  mockEligibility.residential = "no";
  mockEligibility.categorical = ["none"];
  const forwardRoute = routeFromEligibility(mockEligibility, true);
  expect(forwardRoute).toBe("/other-benefits");
});
