import { PrismaClient } from "@prisma/client";
import { stringify } from "uuid";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };

export const serializeFormData = async (
  data: FormData,
  complexFields: Array<string>
) => {
  const flattened = Object.fromEntries(
    Array.from(data.keys()).map((key) => [
      key,
      complexFields.includes(key) ? data.getAll(key) : data.get(key),
    ])
  );
  return JSON.stringify(flattened);
};

export const upsertEligibility = async (eligibilityID: string) => {
  const existingEligibilityForm = await db.eligibilityForm.upsert({
    where: {
      eligibility_form_id: eligibilityID,
    },
    select: {
      eligibility_form_id: true,
      submitted: true,
      completed: true,
      updated_at: true,
    },
    create: {
      eligibility_form_id: eligibilityID,
    },
    update: {},
  });
  return existingEligibilityForm;
};

export const upsertEligibilityPage = async (
  eligibilityID: string,
  page: string,
  formData: any
) => {
  const existingEligibilityPage = await db.eligibilityFormPage.findFirst({
    where: {
      eligibility_form_id: eligibilityID,
      form_route: page,
    },
  });
  if (existingEligibilityPage) {
    return await db.eligibilityFormPage.update({
      where: {
        eligibility_form_page_id:
          existingEligibilityPage.eligibility_form_page_id,
      },
      data: {
        form_data: JSON.stringify(formData),
      },
    });
  }
  return await db.eligibilityFormPage.create({
    data: {
      eligibility_form_id: eligibilityID,
      form_route: "eligibility",
      form_data: JSON.stringify(formData),
    },
  });
};
