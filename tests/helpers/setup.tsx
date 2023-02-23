import userEvent from "@testing-library/user-event";

import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n from "app/i18n"; // your i18n configuration file
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import common from "public/locales/en/common.json";
export const i18nwrapper = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .init({
      ...i18n, // spread the configuration
      ns: ["common"],
      defaultNS: "common",
      lng: "en",
      fallbackLng: "en",
      resources: {
        en: {
          common: common,
          test: {
            transLine: {
              plainStringOneLink: {
                text: "first <0>second</0> third",
                links: ["https://external.com"],
              },
              plainStringLinks: {
                text: "first <0>second</0> <1>third</1>",
                links: ["https://external.com", "/relative/link"],
              },
              plainStringLinksComplicated: {
                text: "<1>first</1> <0>second</0> third <0>fourth</0> <1>fifth</1>",
                links: ["https://external.com", "/relative/link"],
              },
              styledStringOneLink: {
                text: "first <strong>second</strong> <0>third</0>",
                links: ["https://external.com"],
              },
              styledLink: {
                text: "first <strong><0>second</0></strong>",
                links: ["https://external.com"],
              },
            },
          },
        },
      },
      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ["htmlTag"],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
    });

  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </BrowserRouter>
  );
};

export const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: i18nwrapper, ...options });

/*
 * Types
 */
// Return type taken from
// https://github.com/testing-library/user-event/pull/983#issuecomment-1185537044
export type UserEventReturn = ReturnType<typeof userEvent["setup"]>;

/*
 * Mocks
 */

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
