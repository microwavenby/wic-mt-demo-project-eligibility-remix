import {
  ChooseClinicData,
  ContactData,
  IncomeData,
  EligibilityData,
  SessionData,
} from "app/types";
// Helper functions to create valid data for each section of the session.
export function getMockEligibilityData() {
  return {
    residential: "yes",
    categorical: ["pregnant", "guardian"],
    previouslyEnrolled: "no",
    adjunctive: ["fdpir", "snap"],
  } as EligibilityData;
}

export function getMockChooseClinicData() {
  return {
    zipCode: "12345",
    clinic: "CLINIC ZERO",
    clinicAddress: "0000 St, Helena, MT 00000",
    clinicTelephone: "(000) 000-0000",
  } as ChooseClinicData;
}

export function getMockIncomeData() {
  return {
    householdSize: "3",
  } as IncomeData;
}

export function getMockContactData() {
  return {
    firstName: "Jack",
    lastName: "O Lantern",
    phone: "1231231234",
    comments: "comments",
  } as ContactData;
}

export function getMockSession() {
  return {
    eligibility: getMockEligibilityData(),
    contact: getMockContactData(),
    income: getMockIncomeData(),
    clinic: getMockChooseClinicData(),
  } as SessionData;
}
