import { useTranslation } from "react-i18next";
import { ChangeEvent, ReactElement } from "react";

import Required from "app/components/Required";

import { i18nKey } from "app/types";
import {
  ErrorMessage,
  Label,
  Textarea,
  TextInput,
} from "@trussworks/react-uswds";
import { useField } from "remix-validated-form";

export type TextFieldProps = {
  handleChange?: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  id: string;
  labelKey: i18nKey;
  required?: boolean;
  type?: "input" | "textarea";
  inputType:
    | "number"
    | "search"
    | "text"
    | "email"
    | "password"
    | "tel"
    | "url";
  value?: string;
};

const TextField = (props: TextFieldProps): ReactElement => {
  const {
    handleChange,
    id,
    labelKey,
    required,
    type,
    inputType,
    value,
    ...otherProps
  } = props;
  let { t } = useTranslation();
  const { getInputProps, error } = useField(id);
  const TextTypeClass = type == "textarea" ? Textarea : TextInput;
  return (
    <>
      <Label htmlFor={id}>
        {t(labelKey)}
        {required && <Required />}
      </Label>
      {error && (
        <ErrorMessage id="${titleKey}-error-message">{error}</ErrorMessage>
      )}
      <TextTypeClass
        onChange={handleChange}
        {...getInputProps({
          id: id,
          type: inputType,
          value: value,
          ...otherProps,
        })}
      />
    </>
  );
};

export default TextField;
