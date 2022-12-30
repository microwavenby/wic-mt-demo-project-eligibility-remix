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

export const eligibilitySchema = zfd.formData({
  residential: zfd.text(),
  categorical: zfd
    .repeatable(
      z.array(zfd.text()).min(1, {
        message: "You must select at least one option",
      })
    )
    .refine(
      (adj) =>
        (adj.includes("none") && adj.length == 1) || !adj.includes("none"),
      {
        message: `Cannot select None and another option`,
      }
    ),
  previouslyEnrolled: zfd.text(),
  adjunctive: zfd
    .repeatable(
      z.array(zfd.text()).min(1, {
        message: "You must select at least one option",
      })
    )
    .refine(
      (adj) =>
        (adj.includes("none") && adj.length == 1) || !adj.includes("none"),
      {
        message: `Cannot select None and another option`,
      }
    ),
});

export const incomeSchema = zfd.formData({
  householdSize: zfd.text(
    z.string().refine((adj) => adj != "", {
      message: `You must select a household size`,
    })
  ),
});
