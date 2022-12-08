import { ReactElement } from "react";
import { Trans } from "react-i18next";
import { Alert } from "@trussworks/react-uswds";
import { i18nKey } from "app/types";

export type PageErrorProps = {
  alertBody: i18nKey;
};

export const PageError = (props: PageErrorProps): ReactElement => {
  const { alertBody } = props;
  return (
    <Alert type="error" headingLevel="h2">
      <Trans i18nKey={alertBody} />
    </Alert>
  );
};

export default PageError;
