import {
  getMockEligibilityData,
  getMockChooseClinicData,
  getMockIncomeData,
  getMockContactData,
  getMockSession,
} from "../../../tests/helpers/mockData";
type pathType = "eligibility" | "income" | "choose-clinic" | "contact";

export const findClinics = async () => {
  return [{ distance: "1.0mi", ...getMockChooseClinicData() }];
};
export const findClinicByName = async () => {
  return getMockChooseClinicData();
};
export const findEligibility = async () => {
  return getMockEligibilityData();
};
export const upsertEligibility = findEligibility;
export const findEligibilityPages = async () => {
  return getMockSession();
};
export const findEligibilityPageData = async (
  eligibilityID: string,
  path: pathType
) => {
  if (path == "eligibility") {
    return getMockEligibilityData();
  } else if (path == "income") {
    return getMockIncomeData();
  } else if (path == "choose-clinic") {
    return getMockChooseClinicData();
  } else {
    return getMockContactData();
  }
};
export const removeEligibilityPageData = async () => {};
export const upsertEligibilityPage = async () => {};
export const updateEligibility = async () => {};
export const upsertEligibilityAndEligibilityPage = async () => {};
