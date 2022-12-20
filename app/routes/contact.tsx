import { Trans } from "react-i18next";
// import { PatternFormat } from "react-number-format";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { PatternFormat } from "react-number-format";
import { Alert, Button, Fieldset } from "@trussworks/react-uswds";
import BackLink from "~/components/BackLink";
import ButtonLink from "~/components/ButtonLink";
import Required from "~/components/Required";
import RequiredQuestionStatement from "~/components/RequiredQuestionStatement";
import TextField from "~/components/TextField";

import type { ContactData } from "~/types";
import { isValidContact } from "~/utils/dataValidation";
import { useLocation } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { cookieParser } from "~/utils/formSession";
import { upsertEligibilityAndEligibilityPage } from "~/utils/db.server";
import { routeFromContact } from "~/utils/routing";

const contactSchema = zfd.formData({
  firstName: zfd.text(
    z
      .string()
      .min(1, { message: "You must enter a first name for us to call you" })
  ),
  lastName: zfd.text(
    z
      .string()
      .min(1, { message: "You must enter a last name for us to call you" })
  ),
  comments: zfd.text(z.string().optional()),
  phone: zfd.text(
    z.string().transform((val, ctx) => {
      const parsed = val.replace(/[^0-9]/g, "");
      if (parsed.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number should be 10 digits",
        });
        return z.NEVER;
      }
      return parsed;
    })
  ),
});

export const contactValidator = withZod(contactSchema);

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const validationResult = await contactValidator.validate(formData);
  if (validationResult.error) {
    console.log(`Validation error: ${validationResult.error}`);
    return validationError(validationResult.error, validationResult.data);
  }
  const parsedForm = contactSchema.parse(formData);
  const { eligibilityID } = await cookieParser(request);
  await upsertEligibilityAndEligibilityPage(
    eligibilityID,
    "contact",
    parsedForm
  );

  const routeTarget = routeFromContact(parsedForm);
  console.log(`Completed eligibility form; routing to ${routeTarget}`);
  return redirect(routeTarget);
};

export default function Contact() {
  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  const location = useLocation();
  const reviewMode = location.hash.includes("review");
  const actionButtonLabel = reviewMode ? "updateAndReturn" : "continue";

  return (
    <>
      <BackLink href="" />
      <ValidatedForm
        validator={contactValidator}
        method="post"
        className="usa-form usa-form--large"
      >
        <h1>
          <Trans i18nKey="Contact.title" />
        </h1>
        <RequiredQuestionStatement />
        <Fieldset>
          <h2>
            <Trans i18nKey="Contact.name" />
            <Required />
          </h2>
          <TextField
            id="firstName"
            labelKey="Contact.firstName"
            required
            inputType="text"
          />
          <TextField
            id="lastName"
            labelKey="Contact.lastName"
            required
            inputType="text"
          />
        </Fieldset>
        <Fieldset>
          <h2>
            <Trans i18nKey="Contact.phoneHeader" />
            <Required />
          </h2>
          <Alert type="info" headingLevel="h3">
            <Trans i18nKey="Contact.phoneAlert" />
          </Alert>
          <PatternFormat
            format="###-###-####"
            valueIsNumericString={true}
            customInput={TextField}
            inputType="tel"
            id="phone"
            labelKey="Contact.phone"
          />
        </Fieldset>
        <Fieldset>
          <h2>
            <Trans i18nKey="Contact.commentsHeader" />
          </h2>
          <TextField
            id="comments"
            labelKey="Contact.comments"
            type="textarea"
            inputType="text"
          />
        </Fieldset>
        <Button type="submit">
          <Trans i18nKey={actionButtonLabel} />
        </Button>{" "}
      </ValidatedForm>
    </>
  );
}
