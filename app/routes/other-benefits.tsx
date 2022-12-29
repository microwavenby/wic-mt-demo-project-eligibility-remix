import { Trans } from "react-i18next";
import { Button } from "@trussworks/react-uswds";
import { Form, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { findEligibility, removeEligibilityPageData } from "~/utils/db.server";
import { cookieParser } from "~/utils/formSession";

export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const response = await cookieParser(request);
  return json(response);
};

export const action = async ({ request }: { request: Request }) => {
  const { eligibilityID } = await cookieParser(request);
  const eligibilityForm = await findEligibility(eligibilityID);
  if (eligibilityForm && eligibilityForm.completed == false) {
    console.log(`Removing existing eligibility page data for ${eligibilityID}`);
    await removeEligibilityPageData(eligibilityID);
  } else if (eligibilityForm.completed == true) {
    console.log(`Generating new session`);
    const { headers } = await cookieParser(request, true);
    return redirect("", { headers: headers });
  }

  console.log(`Completed Other Benefits action; routing to the start`);
  return redirect("");
};

type loaderData = Awaited<ReturnType<typeof loader>>;

export default function OtherBenefits() {
  return (
    <>
      <h1>
        <Trans i18nKey="OtherBenefits.title" />
      </h1>
      <h2>
        <Trans i18nKey="OtherBenefits.subHeader" />
      </h2>
      <p>
        <Trans
          components={[
            <a
              key="0"
              href="https://dphhs.mt.gov/Assistance"
              className="usa-link usa-link--external"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
          i18nKey={"OtherBenefits.assistance"}
        />
      </p>
      <p>
        <Trans
          components={[
            <a
              key="0"
              href="https://www.signupwic.com/"
              className="usa-link usa-link--external"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
          i18nKey={"OtherBenefits.location"}
        />
      </p>
      <Form method="post">
        <Button type="submit" value="reset" name="action">
          <Trans i18nKey={"OtherBenefits.button"} />
        </Button>
      </Form>
    </>
  );
}
