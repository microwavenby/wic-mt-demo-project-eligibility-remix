// app/sessions.js
import { createCookie } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { Request } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";

export const eligibilityCookie = createCookie("eligibility-form");

export const cookieParser: Function = async (request: Request) => {
  const cookie = await eligibilityCookie.parse(request.headers.get("Cookie"));
  if (cookie) {
    if (cookie.eligibilityID) {
      const eligibilityID = cookie.eligibilityID;
      console.log(`Found ID ${eligibilityID} in cookie`);
      return { eligibilityID: eligibilityID, headers: {} };
    }
  }
  const eligibilityID = uuidv4();
  console.log(`Generating ${eligibilityID}`);
  return {
    eligibilityID: eligibilityID,
    headers: {
      "Set-cookie": await eligibilityCookie.serialize({
        eligibilityID: eligibilityID,
      }),
    },
  };
};
