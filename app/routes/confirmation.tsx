import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Alert, Button } from "@trussworks/react-uswds";
import { ReactComponentElement, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import ButtonLink from "~/components/ButtonLink";
import ReviewSection from "~/components/ReviewSection";
import StyledLink from "~/components/StyledLink";
import TransLinks from "~/components/TransLinks";
import { findEligibilityPages } from "~/utils/db.server";
import { cookieParser } from "~/utils/formSession";

export const action = async ({ request }: { request: Request }) => {
  const { headers } = await cookieParser(request, true);
  console.log(
    `Completed "Start a new application" action; routing to the start`
  );
  return redirect("", { headers: headers });
};

export const loader: LoaderFunction = async ({ request }) => {
  const { eligibilityID, headers } = await cookieParser(request);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE ?? "false";
  console.log(`Looking for ${eligibilityID}`);
  const eligibilityPages = await findEligibilityPages(eligibilityID);
  return json({
    eligibilityID: eligibilityID,
    headers: headers,
    demoMode: demoMode,
    eligibilityPages: eligibilityPages,
  });
};
type loaderData = Awaited<ReturnType<typeof loader>>;

export default function Confirmation() {
  const { eligibilityPages, demoMode } = useLoaderData<loaderData>();
  let { t } = useTranslation();
  return (
    <>
      <h1>
        <Trans i18nKey="Confirmation.title" />
      </h1>
      {demoMode === "true" && (
        <Alert type="warning" headingLevel="h3">
          <TransLinks
            i18nTextKey="demoAlertNotice.text"
            i18nLinkKey="demoAlertNotice.links"
          />
        </Alert>
      )}
      <p>
        <Trans i18nKey="Confirmation.body" />
      </p>
      <div className="content-group-small">
        <h2 className="font-sans-xs">
          <Trans i18nKey="Confirmation.interestedIn" />
        </h2>
        <p>
          <StyledLink
            href="https://dphhs.mt.gov/Assistance"
            textKey="Confirmation.learnAbout"
            external={true}
          />
        </p>
      </div>
      <div className="content-group-small">
        <Form method="post">
          <h2 className="font-sans-xs">
            <Trans i18nKey="Confirmation.submitAnother" />
          </h2>
          <Button type="submit" className="margin-top-1" outline>
            {t("Confirmation.startNew")}
          </Button>
        </Form>
      </div>
      <div className="content-group-small">
        <h2 className="font-sans-xs">
          <Trans i18nKey="Confirmation.keepCopy" />
        </h2>
      </div>
      <ReviewSection editable={false} session={eligibilityPages} />
    </>
  );
}
