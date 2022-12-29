import { Trans, useTranslation } from "react-i18next";
import { LoaderFunction, redirect } from "@remix-run/node";
import { findEligibilityPages, updateEligibility } from "~/utils/db.server";
import { Form, useLoaderData, useLocation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { cookieParser } from "~/utils/formSession";
import ReviewSection from "~/components/ReviewSection";
import { Button } from "@trussworks/react-uswds";
import BackLink from "~/components/BackLink";
import { getBackRoute, routeFromReview } from "~/utils/routing";

export const action = async ({ request }: { request: Request }) => {
  console.log(`Generating new session`);
  const { eligibilityID, headers } = await cookieParser(request);
  console.log(`Marking form for ${eligibilityID} as completed`);
  updateEligibility(eligibilityID, true);
  const routeTarget = routeFromReview();
  console.log(`Completed review form; routing to ${routeTarget}`);
  return redirect(routeTarget);
};

export const loader: LoaderFunction = async ({ request }) => {
  const { eligibilityID, headers } = await cookieParser(request);
  console.log(`Looking for ${eligibilityID}`);
  const eligibilityPages = await findEligibilityPages(eligibilityID);
  return json({
    eligibilityID: eligibilityID,
    headers: headers,
    eligibilityPages: eligibilityPages,
  });
};
type loaderData = Awaited<ReturnType<typeof loader>>;

export default function Review() {
  const { t } = useTranslation("common");
  // Initialize form as a state using blank values.
  const { eligibilityPages } = useLoaderData<loaderData>();
  const location = useLocation();
  const backRoute = getBackRoute(location.pathname);
  return (
    <>
      <BackLink href={backRoute} />
      <h1>
        <Trans i18nKey="Review.title" />
      </h1>
      <p>
        <Trans i18nKey="Review.subHeader" />
      </p>
      <ReviewSection editable={true} session={eligibilityPages} />
      <Form method="post">
        <Button className="margin-top-6" type="submit">
          {t("Review.button")}
        </Button>
      </Form>
    </>
  );
}
