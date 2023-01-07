import { screen } from "@testing-library/react";
import { renderWithRouter } from "tests/helpers/setup";
import { ChangeEvent } from "react";

import InputChoiceGroup, {
  InputChoiceGroupProps,
  Choice,
} from "app/components/InputChoiceGroup";
import Accordion from "app/components/Accordion";
import { useField } from "remix-validated-form";
jest.mock("remix-validated-form");
import { mockUseFieldReturnValue } from "tests/helpers/remixValidatedFormMock";

const mockedUseField = jest.mocked(useField);
mockedUseField.mockReturnValue(mockUseFieldReturnValue);

const choices: Choice[] = ["a", "b", "c"].map((option) => {
  return {
    value: option,
    labelElement: <div>label {option}</div>,
  };
});

const testProps: InputChoiceGroupProps = {
  choices: choices,
  name: "test-choices",
  titleKey: "title",
  required: false,
  type: "checkbox",
  handleChange: (e: ChangeEvent<HTMLInputElement>) => {},
};

it("should match snapshot when it is a set of checkboxes", () => {
  const { container } = renderWithRouter(<InputChoiceGroup {...testProps} />);
  expect(container).toMatchSnapshot();
});

it("should match snapshot when it is a set of radio buttons", () => {
  const { container } = renderWithRouter(
    <InputChoiceGroup {...testProps} type="radio" />
  );
  expect(container).toMatchSnapshot();
});

it("should match display required marker if required is true", () => {
  renderWithRouter(<InputChoiceGroup {...testProps} required={true} />);
  const required = screen.getByText("*");
  expect(required).toBeInTheDocument;
});

it("should display an helpElement if passed as props", () => {
  renderWithRouter(
    <InputChoiceGroup
      {...testProps}
      helpElement={
        <Accordion
          headerKey="accordion header"
          bodyKey="accordion body"
          id="test-accordion"
        />
      }
    />
  );
  const accordionElement = screen.getByText("accordion header");
  expect(accordionElement).toBeInTheDocument;
});
