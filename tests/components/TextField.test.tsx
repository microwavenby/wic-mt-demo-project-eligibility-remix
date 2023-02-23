import { screen } from "@testing-library/react";
import { ChangeEvent } from "react";
import { renderWithRouter } from "tests/helpers/setup";
import TextField, { TextFieldProps } from "app/components/TextField";
import { useField } from "remix-validated-form";
jest.mock("remix-validated-form");
import { mockUseFieldReturnValue } from "tests/helpers/remixValidatedFormMock";

const mockedUseField = jest.mocked(useField);
mockedUseField.mockReturnValue(mockUseFieldReturnValue);

const testProps: TextFieldProps = {
  handleChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {},
  id: "input-id",
  labelKey: "input label",
  required: false,
  inputType: "text",
};

it("should match snapshot when it is a textfield", () => {
  const { container } = renderWithRouter(
    <TextField {...testProps} type="input" />
  );
  expect(container).toMatchSnapshot();
});

it("should match snapshot when it is a textarea", () => {
  const { container } = renderWithRouter(
    <TextField {...testProps} type="textarea" />
  );
  expect(container).toMatchSnapshot();
});

it("should be a textfield by default", () => {
  renderWithRouter(<TextField {...testProps} />);
  const element = screen.getByRole("textbox");
  expect(element).toBeInTheDocument;
});

it("should match display required marker if required is true", () => {
  renderWithRouter(<TextField {...testProps} required={true} />);
  const required = screen.getByText("*");
  expect(required).toBeInTheDocument;
});

it("should display the value when it is a textfield", () => {
  renderWithRouter(
    <TextField {...testProps} type="input" value="textfield value" />
  );
  const textbox = screen.getByRole("textbox");
  expect(textbox.getAttribute("value")).toBe("textfield value");
});
it("should display the value when it is a textarea", () => {
  renderWithRouter(
    <TextField {...testProps} type="textarea" value="textarea value" />
  );
  const textbox = screen.getByRole("textbox");
  expect(textbox.textContent).toBe("textarea value");
});
