import { screen } from "@testing-library/react";
import { renderWithRouter } from "tests/helpers/setup";
import ReviewElement from "app/components/ReviewElement";

it("should match snapshot", () => {
  const { container } = renderWithRouter(
    <ReviewElement labelKey="label">This is a child</ReviewElement>
  );
  expect(container).toMatchSnapshot();
});

it("should render children", () => {
  renderWithRouter(
    <ReviewElement labelKey="label">This is a child</ReviewElement>
  );
  const child = screen.getByText("This is a child");
  expect(child).toBeInTheDocument;
});
