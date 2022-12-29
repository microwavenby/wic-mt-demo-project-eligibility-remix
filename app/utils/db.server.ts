import { Prisma, PrismaClient } from "@prisma/client";
import { Location } from "@remix-run/react";
import {
  EligibilityPagesType,
  EligibilityData,
  ChooseClinicData,
  ContactData,
  IncomeData,
  EligibilityForm,
} from "~/types";
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

type pathType = "eligibility" | "income" | "choose-clinic" | "contact";

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

export const findEligibility = async (eligibilityID: string) => {
  const existingEligibility = await db.eligibilityForm.findUnique({
    where: {
      eligibility_form_id: eligibilityID,
    },
    select: {
      eligibility_form_id: true,
      submitted: true,
      completed: true,
      updated_at: true,
    },
  });
  return existingEligibility as EligibilityForm;
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

export const findEligibilityPages = async (
  eligibilityID: string
): Promise<EligibilityPagesType> => {
  const existingEligibilityPages = await db.eligibilityFormPage.findMany({
    where: {
      eligibility_form_id: eligibilityID,
    },
    select: {
      form_route: true,
      form_data: true,
    },
  });
  const mapped = new Map(
    existingEligibilityPages.map((obj) => [
      obj.form_route,
      obj.form_data as Prisma.JsonObject,
    ])
  );
  const pageData: EligibilityPagesType = {
    eligibility: mapped.get("eligibility") as EligibilityData,
    income: mapped.get("income") as IncomeData,
    clinic: mapped.get("choose-clinic") as ChooseClinicData,
    contact: mapped.get("contact") as ContactData,
  };
  return pageData;
};

export const findEligibilityPageData = async (
  eligibilityID: string,
  path: pathType
) => {
  const eligibilityPage = await db.eligibilityFormPage.findFirst({
    where: {
      eligibility_form_id: eligibilityID,
      form_route: path,
    },
    select: {
      form_data: true,
    },
  });
  return eligibilityPage?.form_data;
};

export const removeEligibilityPageData = async (eligibilityID: string) => {
  await db.eligibilityFormPage.deleteMany({
    where: {
      eligibility_form_id: eligibilityID,
    },
  });
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
        form_data: formData,
      },
    });
  }
  return await db.eligibilityFormPage.create({
    data: {
      eligibility_form_id: eligibilityID,
      form_route: page,
      form_data: formData,
    },
  });
};

export const updateEligibility = async (
  eligibilityID: string,
  completed?: boolean,
  submitted?: boolean
) => {
  const eligibilityForm = await findEligibility(eligibilityID);
  if (eligibilityForm) {
    const updatedEligibilityForm = await db.eligibilityForm.update({
      where: {
        eligibility_form_id: eligibilityForm.eligibility_form_id,
      },
      data: {
        completed: completed,
        submitted: submitted,
      },
    });
  }
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
