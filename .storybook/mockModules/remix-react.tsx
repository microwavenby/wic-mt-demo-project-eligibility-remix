export {
  Link,
  useLocation,
  useCatch,
} from "../../node_modules/@remix-run/react";
import { FormProps } from "../../node_modules/@remix-run/react";
import React from "react";
import { ReactElement } from "react";
import {
  getMockChooseClinicList,
  getMockSession,
} from "../../tests/helpers/mockData";
import incomeData from "../../public/data/income.json";
import { IncomeDataMap } from "../../app/types";
export const useActionData = () => {};

// There are almost certainly more elegant or flexible solutions
// to providing loader data to pages in Storybook, but I
// settled for legibility and shallow call stack depth
export function useLoaderData<T>() {
  return {
    backRoute: "#back",
    clinics: getMockChooseClinicList(),
    eligibilityPages: getMockSession(),
    income: incomeData as IncomeDataMap,
  };
}

// The purpose of this is two-fold - to centralize
// deactivating forms in Storybook, and to prevent another Remix
// component (Form) from complaining about where it's being rendered
export const Form = (props: FormProps): ReactElement => {
  const { children, method, onSubmit, ...rest } = props;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      {...rest}
    >
      {children}
    </form>
  );
};
