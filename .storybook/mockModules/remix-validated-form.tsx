import { Form } from "@remix-run/react";
export {
  validationError,
  setFormDefaults,
  createValidator,
  FieldErrors,
  Validator,
} from "../../node_modules/remix-validated-form";
// This is duplicative of the jest helper remixValidatedFormMock,
// but the Jest global missing breaks the component in Storybook
export const ValidatedForm = Form;
type MinimalInputProps = {
  onChange?: (...args: any[]) => void;
  onBlur?: (...args: any[]) => void;
  defaultValue?: any;
  defaultChecked?: boolean;
  name?: string;
  type?: string;
};

export const getInputProps = <T extends MinimalInputProps>(
  props = {} as any
) => {
  return props as T;
};
export const useField = (args: any) => {
  return { error: undefined, getInputProps };
};
