import { UrlObject } from "url";
import { useLocation } from "@remix-run/react";

import { SessionData } from "app/types";
import {
  isValidChooseClinic,
  isValidContact,
  isValidEligibility,
  isValidIncome,
} from "app/utils/dataValidation";

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

export function routeFromEligibility(eligibilityForm: any): string {
  if (
    eligibilityForm.residential == "no" ||
    eligibilityForm.categorical.includes("none")
  ) {
    return "/other-benefits";
  } else if (eligibilityForm.adjunctive.includes("none")) {
    return "/income";
  }
  return "/review";
}

export function routeFromIncome(incomeForm: any): string {
  if (incomeForm.householdSize != "") {
    return "/choose-clinic";
  }
  return "";
}

export function getForwardRoute(): string {
  const location = useLocation();
  const reviewMode = location.hash.includes("review");
  const position = pageFlow.indexOf(location.pathname);

  // Check for simple review mode cases.
  const reviewModePages = ["/income", "/choose-clinic", "/contact"];
  if (reviewMode && reviewModePages.includes(location.pathname)) {
    return "/review";
  }

  // Check for edge cases.
  // /other-benefits always routes forward to /
  if (location.pathname === "/other-benefits") {
    return "/";
  }
  // There is no action button on /confirmation, so return empty string.
  else if (location.pathname === "/confirmation") {
    return "";
  }
  // /eligibility has different behaviour depending on user data.
  else if (location.pathname === "/eligibility") {
    // Typescript believes it's possible for session to be the function:
    // `(value: SessionData) => void`. If this actually happens at runtime, we
    // throw an error.
    // if (typeof session === "function") {
    //   throw new Error(
    //     "Forward route error: expected a session, but none was found"
    //   );
    // }
    // // Otherwise, we can do actual checks against user data to get the correct route.
    // else {
    //   if (
    //     !isValidEligibility(session.eligibility) ||
    //     session.eligibility.residential === "no" ||
    //     session.eligibility.categorical.includes("none")
    //   ) {
    //     return "/other-benefits";
    //   } else if (session.eligibility.adjunctive.includes("none")) {
    //     if (reviewMode) {
    //       if (!isValidIncome(session.income)) {
    //         return "/income" //{ pathname: "/income", query: { mode: "review" } };
    //       } else {
    //         return "/review";
    //       }
    //     } else {
    //       return "/income";
    //     }
    //   } else {
    //     if (reviewMode) {
    //       return "/review";
    //     } else {
    //       return "/choose-clinic";
    //     }
    //   }
    // }
    return "/vegan-ham-sandwich";
  }

  // Otherwise handle simple cases.
  if (position !== -1) {
    return pageFlow[position + 1];
  }
  // Unknown page! It probably doesn't have an action button.
  else {
    return "";
  }
}

export function getBackRoute(): string {
  const location = useLocation();
  const position = pageFlow.indexOf(location.pathname);

  // Check for edge cases first.
  // /other-benefits always routes back to /eligibility
  if (location.pathname === "/other-benefits") {
    return "/eligibility";
  }
  // There are no back buttons on / or /confirmation, so return empty string.
  else if (location.pathname === "/" || location.pathname === "/confirmation") {
    return "";
  }
  // /choose-clinic has different behavior depending on user data.
  else if (location.pathname === "/choose-clinic") {
    // Typescript believes it's possible for session to be the function:
    // `(value: SessionData) => void`. If this actually happens at runtime, we
    // throw an error.
    // if (typeof session === "function") {
    //   throw new Error(
    //     "Back route error: expected a session, but none was found"
    //   );
    // }
    // // Otherwise, we can do actual checks against user data to get the correct route.
    // else {
    //   // If the user has qualifying adjunctive criteria, they should skip the /income page.
    //   if (
    //     session.eligibility.adjunctive.length > 0 &&
    //     !session.eligibility.adjunctive.includes("none")
    //   ) {
    //     return "/eligibility";
    //   }
    //   // If the user has no qualifying adjunctive criteria, they should see the /income page.
    //   else {
    //     return "/income";
    //   }
    // }
    return "vegan-ham-sandwich";
  } else {
    // Lookup the current path in the page flow and return the expected previous page.
    if (position > 0) {
      return pageFlow[position - 1];
    }
    // Unknown page! It probably doesn't have a back link.
    else {
      return "";
    }
  }
}

export function hasRoutingIssues(
  session: SessionData | ((value: SessionData) => void)
) {
  const location = useLocation();

  const pass = {
    error: false,
    cause: "",
  };
  // These pages have restricted access based on user data.
  // All other pages have no routing issues.
  const restrictedPages: RestrictedPages = {
    "/income": ["/eligibility"],
    "/choose-clinic": ["/eligibility", "/income"],
    "/contact": ["/eligibility", "/income", "/choose-clinic"],
    "/review": ["/eligibility", "/income", "/choose-clinic", "/contact"],
  };
  if (!Object.keys(restrictedPages).includes(location.pathname)) {
    return pass;
  } else {
    // Same as getBackLink(), typescript warns that session might be a function.
    if (typeof session === "function") {
      throw new Error("Routing error: expected a session, but none was found");
    }
    // If it's not, handle each restricted page.
    else {
      for (
        let i = 0, len = restrictedPages[location.pathname].length;
        i < len;
        i++
      ) {
        const check = restrictedPages[location.pathname][i];
        // Check first for /eligibility requirements.
        if (
          check === "/eligibility" &&
          !isValidEligibility(session.eligibility)
        ) {
          return {
            error: true,
            cause: "eligibility",
          };
        }

        // Then, check for /income requirements.
        if (
          check === "/income" &&
          session.eligibility.adjunctive.includes("none") &&
          !isValidIncome(session.income)
        ) {
          return {
            error: true,
            cause: "income",
          };
        }

        // Then, check for /choose-clinic requirements.
        if (
          check === "/choose-clinic" &&
          !isValidChooseClinic(session.chooseClinic)
        ) {
          return {
            error: true,
            cause: "choose-clinic",
          };
        }

        // Then, check for /contact requirements.
        if (check === "/contact" && !isValidContact(session.contact)) {
          return {
            error: true,
            cause: "contact",
          };
        }
      }

      // If none of the other checks failed, pass.
      return pass;
    }
  }
}
