import { getBackRoute } from "app/utils/routing";
import { getMockEligibilityData } from "tests/helpers/mockData";
const simplePaths = [
  ["/", ""],
  ["/how-it-works", "/"],
  ["/eligibility", "/how-it-works"],
  ["/income", "/eligibility"],
  ["/contact", "/choose-clinic"],
  ["/review", "/contact"],
  ["/confirmation", ""],
  ["/other-benefits", "/eligibility"],
];
it.each(simplePaths)("from %s it should route back to %s", (from, to) => {
  const backRoute = getBackRoute(from);
  expect(backRoute).toBe(to);
});

it("from /choose-clinic it should route to /eligibility if there is qualifying adjunctive criteria", () => {
  const backRoute = getBackRoute("/choose-clinic", getMockEligibilityData());
  expect(backRoute).toBe("/eligibility");
});

it("from /choose-clinic it should route to /income if there is no qualifying adjunctive criteria", () => {
  const backRoute = getBackRoute("/choose-clinic");
  expect(backRoute).toBe("/income");
});

it("from /choose-clinic it should route to /income if adjunctive is empty", () => {
  const backRoute = getBackRoute("/choose-clinic");
  expect(backRoute).toBe("/income");
});

it("should return empty string on an unknown page", () => {
  const backRoute = getBackRoute("/unknown");
  expect(backRoute).toBe("");
});
