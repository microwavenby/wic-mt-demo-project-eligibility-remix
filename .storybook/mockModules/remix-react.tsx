export {
  Link,
  useLocation,
  useCatch,
} from "../../node_modules/@remix-run/react";
import { FormProps } from "../../node_modules/@remix-run/react";
import React from "react";
import { ReactElement } from "react";
import {
  getMockChooseClinicData,
  getMockSession,
} from "../../tests/helpers/mockData";
import incomeData from "../../public/data/income.json";
import { IncomeDataMap } from "../../app/types";
export const useActionData = () => {};

export function useLoaderData<T>() {
  return {
    backRoute: "#back",
    clinics: [getMockChooseClinicData()],
    eligibilityPages: getMockSession(),
    income: incomeData as IncomeDataMap,
  };
}
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
