import { Page, expect } from "@playwright/test";

export async function fillEligibilityNoAdjunctive(
  page: Page,
  expectedRoute: string,
  expectedButton: string
): Promise<void> {
  await page
    .getByRole("group", { name: "Do you live or work in Montana?" })
    .getByText("Yes")
    .click();
  await page.getByText("I'm pregnant").click();
  await page
    .getByRole("group", {
      name: "Have you or someone in your household received WIC benefits before?",
    })
    .getByText("No")
    .click();
  await page
    .getByRole("group", {
      name: "Are you or someone in your household currently enrolled in any of the following programs in Montana?",
    })
    .getByText("None of the above")
    .click();
  const eligibilityButton = page.getByTestId("button");
  expect(await eligibilityButton.textContent()).toBe(expectedButton);
  await eligibilityButton.click();
  await expect(page).toHaveURL(expectedRoute);
}

export async function fillEligibilityAdjunctive(
  page: Page,
  expectedRoute: string,
  expectedButton: string
): Promise<void> {
  await page
    .getByRole("group", { name: "Do you live or work in Montana?" })
    .getByText("Yes")
    .click();
  await page.getByText("I'm pregnant").click();
  await page
    .getByRole("group", {
      name: "Have you or someone in your household received WIC benefits before?",
    })
    .getByText("No")
    .click();
  await page
    .getByRole("group", {
      name: "Are you or someone in your household currently enrolled in any of the following programs in Montana?",
    })
    .getByText("SNAP (Supplemental Nutrition Assistance Program)")
    .click();
  const eligibilityButton = page.getByTestId("button");
  expect(await eligibilityButton.textContent()).toBe(expectedButton);
  await eligibilityButton.click();
  await expect(page).toHaveURL(expectedRoute);
}

export async function fillIncome(
  page: Page,
  expectedRoute: string,
  expectedButton: string
): Promise<void> {
  await page.getByTestId("dropdown").selectOption("2");
  const incomeButton = page.getByTestId("button");
  expect(await incomeButton.textContent()).toBe(expectedButton);
  await incomeButton.click();
  await expect(page).toHaveURL(expectedRoute);
}

export async function fillClinic(
  page: Page,
  expectedRoute: string,
  expectedButton: string
): Promise<void> {
  await page.getByTestId("textInput").type("59873");
  await page.getByRole("button").click();
  await page
    .getByRole("group", {
      name: "Choose a clinic from the following list",
    })
    .getByText("THOMPSON FALLS", { exact: true })
    .click();
  const updateButton = page.getByRole("button", { name: expectedButton });
  expect(await updateButton.textContent()).toBe(expectedButton);
  await updateButton.click();
  await expect(page).toHaveURL(expectedRoute);
}

export async function fillContact(
  page: Page,
  expectedRoute: string,
  expectedButton: string,
  fillComments: boolean
): Promise<void> {
  await page.getByLabel("First name").type("Jane");
  await page.getByLabel("Last name").type("McIntyre");
  await page.getByLabel("Phone number").type("123-456-7890");
  if (fillComments) {
    await page
      .getByLabel("Comments, questions, other information")
      .type("WIC is awesome!");
  }
  const updateButton = page.getByTestId("button");
  expect(await updateButton.textContent()).toBe(expectedButton);
  await updateButton.click();
  await expect(page).toHaveURL(expectedRoute);
}
