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

export const findClinicByName = async (name: string) => {
  return await db.clinic.findFirst({
    where: {
      clinic: name,
    },
    select: {
      clinic: true,
      clinicAddress: true,
      clinicTelephone: true,
    },
  });
};

export const findClinics = async (zipcode: string, results: number = 4) => {
  const clinicsByDistance = await db.zipClinicDistance.findMany({
    orderBy: {
      distanceTenthMiles: "asc",
    },
    take: results,
    where: {
      zip: zipcode,
    },
    select: {
      distance: true,
      clinic: {
        select: {
          clinic: true,
          clinicAddress: true,
          clinicTelephone: true,
        },
      },
    },
  });
  return clinicsByDistance.map(({ distance, clinic }) => ({
    ["distance"]: distance,
    ...clinic,
  }));
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
      form_route: page,
      form_data: JSON.stringify(formData),
    },
  });
};

export const upsertEligibilityAndEligibilityPage = async (
  eligibilityID: string,
  page: string,
  formData: any
) => {
  const eligibilityForm = await upsertEligibility(eligibilityID);
  console.log(
    `Using the form with eligibilityID ${eligibilityID} updated time ${eligibilityForm.updated_at}`
  );
  await upsertEligibilityPage(eligibilityID, page, formData);
};
