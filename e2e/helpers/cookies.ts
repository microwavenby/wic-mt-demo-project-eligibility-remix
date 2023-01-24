import { Cookie } from "@playwright/test";
import { expect } from "@playwright/test";
import { validate } from "uuid";

export const validateCookie: Function = async (cookie: Cookie) => {
  await expect(cookie.name).toBe("eligibility-form");
  await expect(validate(await parseEligibilityID(cookie))).toBe(true);
};

export const parseEligibilityID: Function = async (cookie: Cookie) => {
  return JSON.parse(
    Buffer.from(cookie.value, "base64").toString("utf8").slice(0, -1)
  ).eligibilityID;
};
