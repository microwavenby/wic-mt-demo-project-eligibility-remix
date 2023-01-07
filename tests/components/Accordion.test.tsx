import { render, screen } from "@testing-library/react";

import Accordion from "app/components/Accordion";

import { setupUserEvent } from "../helpers/setup";

const testProps = {
  bodyKey: "body",
  headerKey: "header",
  id: "test-accordion",
};

it("should match snapshot", () => {
  const { container } = render(<Accordion {...testProps} />);
  expect(container).toMatchSnapshot();
});

it("should expand the accordion on click", async () => {
  const user = setupUserEvent();
  render(<Accordion {...testProps} />);

  const body = screen.getByText(testProps.bodyKey);
  expect(body.hidden).toBe(true);

  const button = screen.getByText(testProps.headerKey);
  await user.click(button);
  expect(body.hidden).toBe(false);
});
