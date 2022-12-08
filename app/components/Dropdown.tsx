import { useTranslation } from "react-i18next";
import { ChangeEvent, ReactElement } from "react";

import Required from "app/components/Required";

import { i18nKey } from "app/types";

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
  let { t } = useTranslation();
  return (
    <>
      <label className="usa-label" htmlFor={id}>
        {t(labelKey)}
        {required && <Required />}
      </label>
      <select
        className="usa-select"
        id={id}
        name={id}
        onChange={handleChange}
        value={selectedOption}
      >
        <option value="">
          -&nbsp;
          {t("select")}
          &nbsp;-
        </option>
        {options.map((option: string) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};

export default Dropdown;
