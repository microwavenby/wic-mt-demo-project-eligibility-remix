import { render, screen } from "@testing-library/react";
import { getMockSession } from "tests/helpers/mockData";
import ReviewSection from "app/components/ReviewSection";
import { renderWithRouter } from "tests/helpers/setup";
/**
 * Test setup
 */

const route = "/review";
/**
 * Begin tests
 */

it("should not display edit buttons if it is not editable", () => {
  renderWithRouter(
    <ReviewSection session={getMockSession()} editable={false} />
  );

  const buttons = screen.queryByRole("button", { name: /Edit/i });
  expect(buttons).not.toBeInTheDocument;
});

it("button should route to edit page for eligibility", async () => {
  renderWithRouter(
    <ReviewSection session={getMockSession()} editable={true} />
  );
  const anchor = screen.getAllByRole("link", { name: /Edit/i })[0];
  expect(anchor?.getAttribute("href")).toBe("/eligibility?mode=review");
});

it("should route to edit page for choose clinic", async () => {
  renderWithRouter(
    <ReviewSection session={getMockSession()} editable={true} />
  );

  const anchor = screen.getAllByRole("link", { name: /Edit/i })[1];
  expect(anchor?.getAttribute("href")).toBe(
    "/choose-clinic?mode=review&zip=12345"
  );
});

it("should route to edit page for contact", async () => {
  renderWithRouter(
    <ReviewSection session={getMockSession()} editable={true} />
  );
  const anchor = screen.getAllByRole("link", { name: /Edit/i })[2];
  expect(anchor?.getAttribute("href")).toBe("/contact?mode=review");
});

it("should route to edit page for income", async () => {
  // Income section only displays if session.eligibility.adjunctive includes 'none'
  // and session.income.householdSize is not ''
  let mockSession = getMockSession();
  mockSession.eligibility.adjunctive = ["none"];
  mockSession.income.householdSize = "5";
  renderWithRouter(<ReviewSection session={mockSession} editable={true} />);
  const anchor = screen.getAllByRole("link", { name: /Edit/i })[1];
  expect(anchor?.getAttribute("href")).toBe("/income?mode=review");
});

it("it should not show income section if there is adjunctive eligibility", async () => {
  // Income section only displays if session.eligibility.adjunctive includes 'none'
  // and session.income.householdSize is not ''
  renderWithRouter(
    <ReviewSection session={getMockSession()} editable={true} />
  );
  const anchors = screen.getAllByRole("link", { name: /Edit/i });
  expect(anchors.length).toBe(3);
  anchors.map((anchor) =>
    expect(anchor?.getAttribute("href")).not.toBe("/income?mode=review")
  );
});
