import { act, render, screen } from "@testing-library/react";
import { renderWithRouter } from "./setup";
import { axe } from "jest-axe";
import { ReactElement } from "react";

import { UserEventReturn } from "./setup";

export async function testAccessibility(element: ReactElement) {
  const { container } = renderWithRouter(element);

  // Must call axe() like this to satisfy react testing.
  let results;
  await act(async () => {
    results = await axe(container);
  });

  expect(results).toHaveNoViolations;
}

export function testBackLink(element: ReactElement, route: string) {
  render(element);
  const link = screen.getByRole("link", { name: /Back/i });
  expect(link).toHaveAttribute("href", route);
}

export function testActionButtonReviewMode(
  element: ReactElement,
  route: string
) {
  // Set the path to review mode.
  act(() => {
    //mockRouter.setCurrentUrl(`${route}?mode=review`);
  });
  render(element);

  const button = screen.getByRole("button", { name: /Update/i });
  expect(button).toBeInTheDocument();
}

export async function testActionButtonRoute(
  element: ReactElement,
  route: string,
  buttonText: string,
  user: UserEventReturn
) {
  render(element);
  const button = screen.getByRole("button", {
    name: new RegExp(buttonText, "i"),
  });
  await user.click(button);
  // expect(singletonRouter).toMatchObject({ asPath: route });
}
