import { render, screen } from "@testing-library/react";
import { renderWithRouter } from "tests/helpers/setup";
import Dropdown, { DropdownProps } from "app/components/Dropdown";
import { useField } from "remix-validated-form";
jest.mock("remix-validated-form");
import { mockUseFieldReturnValue } from "tests/helpers/remixValidatedFormMock";

const mockedUseField = jest.mocked(useField);
mockedUseField.mockReturnValue(mockUseFieldReturnValue);

const testProps: DropdownProps = {
  handleChange: (e) => {},
  id: "test-id",
  labelKey: "dropdown label",
  options: ["a", "b", "c"],
};

it("should match snapshot", () => {
  const { container } = renderWithRouter(<Dropdown {...testProps} />);
  expect(container).toMatchSnapshot();
});

it("should match display required marker if required is true", () => {
  renderWithRouter(<Dropdown {...testProps} required={true} />);
  const required = screen.getByText("*");
  expect(required).toBeInTheDocument;
});

it("should show the selected element if passed in", () => {
  renderWithRouter(<Dropdown {...testProps} selectedOption="c" />);
  const required = screen.getByRole("option", {
    name: "c",
  }) as HTMLOptionElement;
  expect(required.selected).toBe(true);
});
