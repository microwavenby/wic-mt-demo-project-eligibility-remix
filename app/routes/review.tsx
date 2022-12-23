import { Trans, useTranslation } from "react-i18next";
import type { LoaderFunction } from "@remix-run/node";
import { findEligibilityPages } from "~/utils/db.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { cookieParser } from "~/utils/formSession";
import ReviewSection from "~/components/ReviewSection";

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
  console.log(JSON.stringify(eligibilityPages));
  return (
    <>
      <h1>
        <Trans i18nKey="Review.title" />
      </h1>
      <p>
        <Trans i18nKey="Review.subHeader" />
      </p>
      <ReviewSection editable={true} session={eligibilityPages} />
    </>
  );
}
