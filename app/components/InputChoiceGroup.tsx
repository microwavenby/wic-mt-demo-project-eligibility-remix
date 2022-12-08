import { useTranslation } from "react-i18next";
import { ReactElement } from "react";
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
  labelKey: i18nKey;
  name: string;
  value: string;
};

export type InputChoiceGroupProps = {
  choices: Choice[];
  titleKey: i18nKey;
  required?: boolean;
  type: "checkbox" | "radio";
  error?: string;
  helpElement?: ReactElement;
};

const InputChoiceGroup = (props: InputChoiceGroupProps): ReactElement => {
  const { choices, titleKey, required, type, helpElement } = props;
  const { getInputProps, error } = useField(choices[0].name);
  const InputTypeClass = type == "checkbox" ? Checkbox : Radio;
  let { t } = useTranslation();
  return (
    <Fieldset legend={t(titleKey)} legendStyle="srOnly">
      <h2>
        {t(titleKey)}
        {required && <Required />}
      </h2>
      {error && (
        <ErrorMessage id="${titleKey}-error-message">{error}</ErrorMessage>
      )}
      {helpElement}
      {choices.map((choice: Choice) => (
        <InputTypeClass
          value={choice.value}
          tile={true}
          key={`${choice.name}-${choice.value}`}
          {...getInputProps({
            id: `${choice.name}-${choice.value}`,
            label: t(choice.labelKey),
          })}
        />
      ))}
    </Fieldset>
  );
};

export default InputChoiceGroup;
