import { incomeSchema } from "app/utils/dataValidation";
import { withZod } from "@remix-validated-form/with-zod";
import { IncomeData } from "app/types";
import { createForm, FormObject } from "tests/helpers/setup";

const incomeValidator = withZod(incomeSchema);

it("should be valid if householdSize is set", async () => {
  const income = { householdSize: "3" } as FormObject;
  const validationResult = await incomeValidator.validate(createForm(income));
  expect(validationResult.data).toStrictEqual(income as IncomeData);
  expect(validationResult.error).toBeUndefined();
});

it("should be invalid if householdSize is not set", async () => {
  const income = { householdSize: "" } as FormObject;
  const validationResult = await incomeValidator.validate(createForm(income));
  expect(validationResult.data).toBeUndefined();
  expect(validationResult.error?.fieldErrors).toStrictEqual({
    householdSize: "Required",
  });
});
