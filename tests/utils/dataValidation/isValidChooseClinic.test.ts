import { createForm, FormObject } from "tests/helpers/setup";
import { getMockClinic } from "../../helpers/setupClinics";
import { clinicFormSchema } from "app/utils/dataValidation";
import { withZod } from "@remix-validated-form/with-zod";
const clinicForm = createForm({
  clinic: getMockClinic().clinic,
} as FormObject);

const clinicValidator = withZod(clinicFormSchema);

it("should be undefined error if all requirements are met", async () => {
  const validationResult = await clinicValidator.validate(clinicForm);
  expect(validationResult.error).toBeUndefined();
});

it("should have a clinic parsed if all requirements are met", async () => {
  const validationResult = await clinicValidator.validate(clinicForm);
  expect(validationResult.data).toStrictEqual({
    clinic: getMockClinic().clinic,
  });
});

it("should have an error if there is no clinic presented", async () => {
  const validationResult = await clinicValidator.validate(
    createForm({ clinic: "" } as FormObject)
  );
  expect(validationResult.data).toBeUndefined();
  expect(validationResult.error?.fieldErrors).toStrictEqual({
    clinic: "Required",
  });
});
