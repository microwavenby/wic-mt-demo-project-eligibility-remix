import { Trans } from "react-i18next";
import { Alert } from "@trussworks/react-uswds";
import BackLink from "app/components/BackLink";
import ButtonLink from "app/components/ButtonLink";
import { initialSessionData } from "app/utils/sessionData";
import { useSessionStorage } from "app/utils/useSessionStorage";
import {
  getBackRoute,
  getForwardRoute,
  hasRoutingIssues,
} from "app/utils/routing";

export default function HowItWorks() {
  const listCopyKeys: string[] = ["apply", "eligible", "appointment"];
  const sessionKey = "session";
  const [session, setSession] = useSessionStorage(
    sessionKey,
    initialSessionData
  );
  // Handle back link.
  const backRoute = getBackRoute();

  // Handle action button.
  const forwardRoute = getForwardRoute();
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
      <ButtonLink href={forwardRoute} labelKey="HowItWorks.button" />
    </div>
  );
}
