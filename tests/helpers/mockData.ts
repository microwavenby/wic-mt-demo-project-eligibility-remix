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

export function getMockChooseClinicList() {
  return [
    {
      zipCode: "12345",
      clinic: "CLINIC Zero",
      clinicAddress: "0000 Zero St, Helena, MT 12345",
      clinicTelephone: "(000) 000-0000",
    },
    {
      zipCode: "23456",
      clinic: "CLINIC One",
      clinicAddress: "1111 One St, Helena, MT 23456",
      clinicTelephone: "(111) 111-1111",
    },
    {
      zipCode: "34567",
      clinic: "CLINIC Two",
      clinicAddress: "2222 Two St, Helena, MT 34567",
      clinicTelephone: "(222) 222-2222",
    },
    {
      zipCode: "45678",
      clinic: "CLINIC Three",
      clinicAddress: "3333 Three St, Helena, MT 45678",
      clinicTelephone: "(333) 333-3333",
    },
    {
      zipCode: "56789",
      clinic: "CLINIC Four",
      clinicAddress: "4444 Four St, Helena, MT 56789",
      clinicTelephone: "(444) 444-4444",
    },
    {
      zipCode: "67890",
      clinic: "CLINIC Five",
      clinicAddress: "5555 Five St, Helena, MT 67890",
      clinicTelephone: "(555) 555-5555",
    },
    {
      zipCode: "78901",
      clinic: "CLINIC Six",
      clinicAddress: "6666 Six St, Helena, MT 78901",
      clinicTelephone: "(666) 666-6666",
    },
    {
      zipCode: "89012",
      clinic: "CLINIC Seven",
      clinicAddress: "7777 Seven St, Helena, MT 89012",
      clinicTelephone: "(777) 777-7777",
    },
  ] as ChooseClinicData[];
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
