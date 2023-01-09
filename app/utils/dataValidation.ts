import { zfd } from "zod-form-data";
import { z } from "zod";

import type {
  ChooseClinicData,
  ContactData,
  EligibilityData,
  IncomeData,
  SessionData,
} from "app/types";

export const validEligibilityOptions = {
  residential: ["yes", "no"],
  categorical: ["pregnant", "baby", "child", "guardian", "loss", "none"],
  previouslyEnrolled: ["yes", "no"],
  adjunctive: ["insurance", "snap", "tanf", "fdpir", "none"],
};

// Validation function for zip codes.
export function isValidZipCode(zipCode: string): boolean {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipCode);
}

export const clinicFormSchema = zfd.formData({
  clinic: zfd.text(
    z.string().min(1, {
      message: "You must select a WIC clinic to continue",
    })
  ),
});

export const contactSchema = zfd.formData({
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
      if (parsed.length != 10) {
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

export const eligibilitySchema = zfd.formData({
  residential: zfd
    .text()
    .refine((val) => validEligibilityOptions.residential.includes(val), {
      message: `Residential must be one of [${validEligibilityOptions.residential.join(
        ", "
      )}]`,
    }),
  categorical: zfd
    .repeatable(
      z.array(zfd.text()).min(1, {
        message: "You must select at least one option",
      })
    )
    .superRefine((val, ctx) => {
      if (
        val.every((item) =>
          validEligibilityOptions.categorical.includes(item)
        ) === false
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `categorical must be one of [${validEligibilityOptions.categorical.join(
            ", "
          )}]`,
        });
        return z.NEVER;
      }
      if (val.includes("none") && val.length != 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Cannot select None and another option`,
        });
      }
    }),
  previouslyEnrolled: zfd
    .text()
    .refine((val) => validEligibilityOptions.previouslyEnrolled.includes(val), {
      message: `previouslyEnrolled must be one of [${validEligibilityOptions.previouslyEnrolled.join(
        ", "
      )}]`,
    }),
  adjunctive: zfd.repeatable(
    z.array(zfd.text()).superRefine((val, ctx) => {
      if (val.length == 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You must select at least one option",
        });
      }
      if (
        val.every((selection) =>
          validEligibilityOptions.adjunctive.includes(selection)
        ) === false
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Adjunctive must be one of [${validEligibilityOptions.adjunctive.join(
            ", "
          )}]`,
        });
      }
      if (val.includes("none") && val.length != 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Cannot select None and another option`,
        });
      }
    })
  ),
});

export const incomeSchema = zfd.formData({
  householdSize: zfd.text(
    z.string().refine((adj) => adj != "", {
      message: `You must select a household size`,
    })
  ),
});
