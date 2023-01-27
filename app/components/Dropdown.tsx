import { useTranslation } from "react-i18next";
import { ChangeEvent, ReactElement } from "react";
import {
  Dropdown as USWDS_Dropdown,
  Label,
  ErrorMessage,
} from "@trussworks/react-uswds";

import Required from "app/components/Required";

import { i18nKey } from "app/types";
import { useField } from "remix-validated-form";

export interface DropdownProps {
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  labelKey: i18nKey;
  options: string[];
  required?: boolean;
  selectedOption?: string;
}

// @TODO: This component expects pre-translated option strings.
//        It should be refactored if itos ever used with non-integer options.
const Dropdown = (props: DropdownProps): ReactElement => {
  const { handleChange, id, labelKey, options, required, selectedOption } =
    props;
  const { getInputProps, error } = useField(id);
  let { t } = useTranslation();
  return (
    <>
      <Label htmlFor={id}>
        {t(labelKey)}
        {required && <Required />}
      </Label>
      {error && (
        <ErrorMessage id="${titleKey}-error-message">{error}</ErrorMessage>
      )}
      <USWDS_Dropdown
        id={id}
        name={id}
        onChange={handleChange}
        value={selectedOption}
      >
        <option
          value=""
          {...getInputProps({ id: `${id}-unselected`, label: "" })}
        >
          -&nbsp;
          {t("select")}
          &nbsp;-
        </option>
        {options.map((option: string, index: number) => (
          <option
            key={option}
            {...getInputProps({
              id: `${id}-${index + 1}`,
              label: option,
              value: option,
            })}
          >
            {option}
          </option>
        ))}
      </USWDS_Dropdown>
    </>
  );
};

export default Dropdown;
