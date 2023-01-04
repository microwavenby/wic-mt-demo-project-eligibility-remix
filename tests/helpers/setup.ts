import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { SessionData } from "app/types";

/*
 * Types
 */
// Return type taken from
// https://github.com/testing-library/user-event/pull/983#issuecomment-1185537044
export type UserEventReturn = ReturnType<typeof userEvent["setup"]>;

/*
 * Mocks
 */

// A mock function for setSession()
export const setMockSession = jest.fn();

// // Set the router to the default page path.
// export function setupDefaultRoute(route: string): void {
//   act(() => {
//     mockRouter.setCurrentUrl(route);
//   });
// }

// Setup userEvent
// See https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent
export function setupUserEvent(): UserEventReturn {
  // Set up userEvent
  const user = userEvent.setup();
  return user;
}

// Setup function using AHA principle.
// See https://kentcdodds.com/blog/avoid-nesting-when-youre-testing#apply-aha-avoid-hasty-abstractions
// export function setup(route: string) {
//   // setupDefaultRoute(route);

//   // Reset the mock session before each test.

//   return {
//   };
// }

export type FormObject = {
  [inputName: string]: any;
};

export function createForm(obj: FormObject): FormData {
  const parsedForm = new FormData();
  let key: string;
  for (key in obj) {
    if (!!obj[key].forEach) {
      // This lets us pass in arrays or strings and build correct form data
      obj[key].forEach((item: any) => {
        parsedForm.append(key, item);
      });
    } else {
      parsedForm.append(key, obj[key]);
    }
  }
  return parsedForm;
}
