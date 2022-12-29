import {
  ChooseClinicData,
  ContactData,
  EligibilityData,
  IncomeData,
} from "app/types";

interface RestrictedPages {
  [key: string]: string[];
}

const pageFlow = [
  "/",
  "/how-it-works",
  "/eligibility",
  "/income",
  "/choose-clinic",
  "/contact",
  "/review",
  "/confirmation",
];

export function routeFromHowItWorks(): string {
  return "/eligibility";
}

export function routeFromEligibility(
  eligibilityForm: EligibilityData,
  reviewMode: boolean
): string {
  if (
    eligibilityForm.residential == "no" ||
    eligibilityForm.categorical.includes("none")
  ) {
    return "/other-benefits";
  }
  if (reviewMode) {
    return "/review";
  }
  if (eligibilityForm.adjunctive.includes("none")) {
    return "/income";
  }

  return "/choose-clinic";
}

export function routeFromIncome(
  incomeForm: IncomeData,
  reviewMode: boolean
): string {
  if (incomeForm.householdSize != "" && !reviewMode) {
    return "/choose-clinic";
  } else if (incomeForm.householdSize != "") {
    return "/review";
  }
  return "/income";
}

export function routeFromClinic(
  clinic: ChooseClinicData,
  reviewMode: boolean
): string {
  if (clinic && !reviewMode) {
    return "/contact";
  } else if (clinic) {
    return "/review";
  }
  return "/choose-clinic";
}

export function routeFromContact(contact: ContactData): string {
  if (contact) {
    return "/review";
  }
  return "/contact";
}

export function routeFromReview(): string {
  return "/confirmation";
}

export function getBackRoute(
  location: string,
  eligibilityData?: EligibilityData
): string {
  const position = pageFlow.indexOf(location);
  // Check for edge cases first.
  // /other-benefits always routes back to /eligibility
  if (location === "/other-benefits") {
    return "/eligibility";
  }
  // There are no back buttons on / or /confirmation, so return empty string.
  else if (location === "/" || location === "/confirmation") {
    return "";
  }
  // /choose-clinic has different behavior depending on user data.
  else if (location === "/choose-clinic") {
    // If the user has qualifying adjunctive criteria, they should skip the /income page.
    if (eligibilityData) {
      if (
        eligibilityData.adjunctive.length > 0 &&
        !eligibilityData.adjunctive.includes("none")
      ) {
        return "/eligibility";
      }
    }
    // If the user has no qualifying adjunctive criteria, they should see the /income page.
    return "/income";
  } else if (position > 0) {
    return pageFlow[position - 1];
  }
  // Unknown page! It probably doesn't have a back link.
  return "";
}
