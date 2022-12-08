import { useTranslation } from "react-i18next";
import { ReactElement } from "react";

export const RequiredQuestionStatement = (): ReactElement => {
  let { t } = useTranslation();
  return (
    <p>
      {t("asterisk")}
      <abbr className="usa-hint usa-hint--required"> (*).</abbr>
    </p>
  );
};

export default RequiredQuestionStatement;
