import { withZod } from "@remix-validated-form/with-zod";
import { EligibilityData } from "app/types";
import { createForm, FormObject } from "tests/helpers/setup";
import {
  eligibilitySchema,
  validEligibilityOptions,
} from "app/utils/dataValidation";

const eligibilityValidator = withZod(eligibilitySchema);

const validResidential = validEligibilityOptions.residential[0];
const validCategorical = validEligibilityOptions.categorical[0];
const validPreviouslyEnrolled = validEligibilityOptions.previouslyEnrolled[0];
const validAdjunctive = validEligibilityOptions.adjunctive[0];

type ErrorObject = {
  residential?: string;
  categorical?: string;
  adjunctive?: string;
  previouslyEnrolled?: string;
};

export const invalidEligibilityCombinations = [
  [
    "no values are set",
    "",
    [],
    "",
    [],
    {
      adjunctive: "You must select at least one option",
      categorical: "You must select at least one option",
      previouslyEnrolled: "Required",
      residential: "Required",
    } as ErrorObject,
  ],
  [
    "residential is not set",
    "",
    [validCategorical],
    validPreviouslyEnrolled,
    [validAdjunctive],
    { residential: "Required" } as ErrorObject,
  ],
  [
    "categorical is not set",
    validResidential,
    [],
    validPreviouslyEnrolled,
    [validAdjunctive],
    { categorical: "You must select at least one option" } as ErrorObject,
  ],
  [
    "previouslyEnrolled is not set",
    validResidential,
    [validCategorical],
    "",
    [validAdjunctive],
    { previouslyEnrolled: "Required" } as ErrorObject,
  ],
  [
    "adjunctive is not set",
    validResidential,
    [validCategorical],
    validPreviouslyEnrolled,
    [],
    { adjunctive: "You must select at least one option" } as ErrorObject,
  ],

  [
    "residential is not a valid option",
    "something else",
    [validCategorical],
    validPreviouslyEnrolled,
    [validAdjunctive],
    { residential: "Residential must be one of [yes, no]" } as ErrorObject,
  ],
  [
    "categorical is not a valid option",
    validResidential,
    ["something else"],
    validPreviouslyEnrolled,
    [validAdjunctive],
    {
      categorical:
        "categorical must be one of [pregnant, baby, child, guardian, loss, none]",
    } as ErrorObject,
  ],
  [
    "categorical contains none and another option",
    validResidential,
    [validCategorical, "none"],
    validPreviouslyEnrolled,
    [validAdjunctive],
    { categorical: "Cannot select None and another option" } as ErrorObject,
  ],
  [
    "previouslyEnrolled is not a valid option",
    validResidential,
    [validCategorical],
    "something else",
    [validAdjunctive],
    {
      previouslyEnrolled: "previouslyEnrolled must be one of [yes, no]",
    } as ErrorObject,
  ],
  [
    "adjunctive is not a valid option",
    validResidential,
    [validCategorical],
    validPreviouslyEnrolled,
    ["something else"],
    {
      adjunctive:
        "Adjunctive must be one of [insurance, snap, tanf, fdpir, none]",
    } as ErrorObject,
  ],
  [
    "adjunctive contains none and another option",
    validResidential,
    [validCategorical],
    validPreviouslyEnrolled,
    [validAdjunctive, "none"],
    { adjunctive: "Cannot select None and another option" } as ErrorObject,
  ],
];

it.each(invalidEligibilityCombinations)(
  "should be invalid if %s",
  async (
    description,
    residential,
    categorical,
    previouslyEnrolled,
    adjunctive,
    errorObject
  ) => {
    const eligibility: FormObject = {
      residential: residential,
      categorical: categorical,
      previouslyEnrolled: previouslyEnrolled,
      adjunctive: adjunctive,
    };
    const validationResult = await eligibilityValidator.validate(
      createForm(eligibility)
    );
    expect(validationResult.data).toBeUndefined();
    expect(validationResult.error?.fieldErrors).toStrictEqual(errorObject);
  }
);

it("should be valid if all the requirements are met", async () => {
  const eligibility = {
    residential: validResidential,
    categorical: [validCategorical],
    previouslyEnrolled: validPreviouslyEnrolled,
    adjunctive: [validAdjunctive],
  };
  const validationResult = await eligibilityValidator.validate(
    createForm(eligibility)
  );
  expect(validationResult.data).toStrictEqual(eligibility as EligibilityData);
  expect(validationResult.error).toBeUndefined();
});
