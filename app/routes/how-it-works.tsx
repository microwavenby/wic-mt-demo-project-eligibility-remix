import { Trans, useTranslation } from "react-i18next";
import { Alert, Button } from "@trussworks/react-uswds";
import BackLink from "app/components/BackLink";
import { routeFromHowItWorks, getBackRoute } from "app/utils/routing";
import { Link, useLocation } from "@remix-run/react";

export default function HowItWorks() {
  const listCopyKeys: string[] = ["apply", "eligible", "appointment"];
  // Handle back link.
  const location = useLocation();
  const backRoute = getBackRoute(location.pathname);

  // Handle action button.
  const forwardRoute = routeFromHowItWorks();
  let { t } = useTranslation();
  return (
    <div>
      <BackLink href={backRoute} />
      <h1>
        <Trans i18nKey="HowItWorks.title" />
      </h1>
      <ol className="usa-process-list">
        {listCopyKeys.map((key: string) => (
          <li className="usa-process-list__item" key={key}>
            <h2 className="usa-process-list__heading">
              <Trans i18nKey={`HowItWorks.${key}Header`} />
            </h2>
            <p className="margin-top-1">
              <Trans i18nKey={`HowItWorks.${key}`} />
            </p>
          </li>
        ))}
      </ol>
      <Alert type="warning" headingLevel="h2" noIcon={true}>
        <Trans i18nKey={"HowItWorks.note"} />
      </Alert>
      <Link to={forwardRoute}>
        <Button className="margin-top-6" type="button">
          {t("HowItWorks.button")}
        </Button>
      </Link>
    </div>
  );
}
