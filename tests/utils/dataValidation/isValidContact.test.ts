import { withZod } from "@remix-validated-form/with-zod";
import { ContactData } from "app/types";
import { contactSchema } from "app/utils/dataValidation";
import { createForm, FormObject } from "tests/helpers/setup";
const contactValidator = withZod(contactSchema);

type ErrorObject = {
  firstName?: string;
  lastName?: string;
  phone: string;
};

export const invalidContactCombinations = [
  [
    "no values are set",
    "",
    "",
    "",
    {
      firstName: "Required",
      lastName: "Required",
      phone: "Required",
    } as ErrorObject,
  ],
  [
    "firstName is not set",
    "",
    "anything",
    "1234445552",
    {
      firstName: "Required",
    } as ErrorObject,
  ],
  [
    "lastName is not set",
    "anything",
    "",
    "1234445552",
    {
      lastName: "Required",
    } as ErrorObject,
  ],
  [
    "phone is not set",
    "anything",
    "anything",
    "",
    { phone: "Required" } as ErrorObject,
  ],
  [
    "phone is under 10 digits",
    "anything",
    "anything",
    "3333",
    { phone: "Phone number should be 10 digits" } as ErrorObject,
  ],
  [
    "phone is over 10 digits",
    "anything",
    "anything",
    "12312312345",
    { phone: "Phone number should be 10 digits" } as ErrorObject,
  ],
];

it.each(invalidContactCombinations)(
  "should be invalid if %s",
  async (description, firstName, lastName, phone, errorObject) => {
    const contact: FormObject = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      comments: "",
    };
    const validationResult = await contactValidator.validate(
      createForm(contact)
    );
    expect(validationResult.data).toBeUndefined();
    expect(validationResult.error?.fieldErrors).toStrictEqual(errorObject);
  }
);

it("should be valid if all the requirements are met", async () => {
  const contact: FormObject = {
    firstName: "anything",
    lastName: "anything",
    phone: "1231231234",
    comments: "anything",
  };
  const validationResult = await contactValidator.validate(createForm(contact));
  expect(validationResult.data).toStrictEqual(contact as ContactData);
  expect(validationResult.error).toBeUndefined();
});
