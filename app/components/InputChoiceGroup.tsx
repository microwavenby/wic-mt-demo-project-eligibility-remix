import { useTranslation } from "react-i18next";
import { ChangeEvent, ReactElement } from "react";
import {
  Fieldset,
  Checkbox,
  Radio,
  ErrorMessage,
} from "@trussworks/react-uswds";

import Required from "app/components/Required";
import { useField } from "remix-validated-form";
import { i18nKey } from "app/types";

export type Choice = {
  value: string;
  labelElement: ReactElement;
};

export type InputChoiceGroupProps = {
  name: string;
  choices: Choice[];
  titleKey: i18nKey;
  required?: boolean;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type: "checkbox" | "radio";
  error?: string;
  helpElement?: ReactElement;
};

const InputChoiceGroup = (props: InputChoiceGroupProps): ReactElement => {
  const { choices, titleKey, required, type, helpElement, name, handleChange } =
    props;
  const { getInputProps, error } = useField(name);
  const InputTypeClass = type == "checkbox" ? Checkbox : Radio;
  let { t } = useTranslation();
  if (!choices?.length) {
    return <></>;
  }
  return (
    <>
      <Fieldset legend={t(titleKey)} legendStyle="srOnly">
        <h2>
          {t(titleKey)}
          {required && <Required />}
        </h2>
        {error && (
          <ErrorMessage id="${titleKey}-error-message">{error}</ErrorMessage>
        )}
        {helpElement}
        {choices?.map((choice: Choice) => (
          <InputTypeClass
            tile={true}
            key={`${name}-${choice.value}`}
            {...getInputProps({
              id: `${name}-${choice.value}`,
              label: choice.labelElement,
              type: type,
              value: choice.value,
              onChange: handleChange,
            })}
          />
        ))}
      </Fieldset>
    </>
  );
};

export default InputChoiceGroup;
