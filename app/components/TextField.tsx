import { useTranslation } from "react-i18next";
import { ChangeEvent, ReactElement } from "react";

import Required from "app/components/Required";

import { i18nKey } from "app/types";

export type TextFieldProps = {
  handleChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  id: string;
  labelKey: i18nKey;
  required?: boolean;
  type?: "input" | "textarea";
  value: string;
};

const TextField = (props: TextFieldProps): ReactElement => {
  const { handleChange, id, labelKey, required, type, value } = props;
  let textfield: ReactElement;
  let { t } = useTranslation();
  if (type === "textarea") {
    textfield = (
      <textarea
        className="usa-textarea"
        id={id}
        name={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    );
  } else {
    textfield = (
      <input
        className="usa-input"
        id={id}
        name={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    );
  }
  return (
    <>
      <label className="usa-label" htmlFor={id}>
        {t(labelKey)}
        {required && <Required />}
      </label>
      {textfield}
    </>
  );
};

export default TextField;
