import {
  findClinicByName,
  findClinics,
  findEligibilityPages,
  updateEligibility,
  upsertEligibilityAndEligibilityPage,
  ZipClinicDistanceWithClinic,
} from "app/utils/db.server";
import { prismaMock, pagifyMock } from "tests/helpers/prismaMock";
import {
  getMockChooseClinicData,
  getMockEligibilityData,
  getMockContactData,
  getMockIncomeData,
  getMockSession,
} from "tests/helpers/mockData";
import { Clinic, ZipClinicDistance } from "@prisma/client";
import { EligibilityPagesType } from "app/types";

it("returns a clinic record", async () => {
  const mockClinic = getMockChooseClinicData();
  prismaMock.clinic.findFirst.mockResolvedValue(mockClinic as Clinic);
  const foundClinic = await findClinicByName(mockClinic.clinic);
  expect(prismaMock.clinic.findFirst).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { clinic: mockClinic.clinic },
    })
  );
  expect(foundClinic).toMatchObject(mockClinic);
});

it("flattens clinic details into the result object", async () => {
  const mockClinic = getMockChooseClinicData();
  prismaMock.zipClinicDistance.findMany.mockResolvedValue([
    { distance: "339.9", clinic: mockClinic },
  ] as ZipClinicDistanceWithClinic[]);
  const foundClinicDistance = await findClinics("98765", 1);
  expect(prismaMock.zipClinicDistance.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { zip: "98765" },
      take: 1,
    })
  );
  expect(foundClinicDistance).toMatchObject([
    {
      distance: "339.9",
      ...mockClinic,
    },
  ]);
});

it("hydrates eligibility page records into an eligibilityForm with types", async () => {
  // This test ensures that the DB helper returns something that looks like a session
  // from a list of page records in the database
  const mockClinicPage = pagifyMock("choose-clinic", getMockChooseClinicData());
  const mockIncomePage = pagifyMock("income", getMockIncomeData());
  const mockEligibilityPage = pagifyMock(
    "eligibility",
    getMockEligibilityData()
  );
  const mockContactPage = pagifyMock("contact", getMockContactData());

  prismaMock.eligibilityFormPage.findMany.mockResolvedValue([
    mockClinicPage,
    mockIncomePage,
    mockEligibilityPage,
    mockContactPage,
  ]);
  const result = await findEligibilityPages("fakeFormID");
  expect(prismaMock.eligibilityFormPage.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { eligibility_form_id: "fakeFormID" },
    })
  );
  expect(result).toEqual(getMockSession());
});

it("creates a form page and eligibility page", async () => {
  const mockEligibilityPage = getMockEligibilityData();
  const eligibilityID = "test eligibility ID";
  const formRoute = "eligibility";
  prismaMock.eligibilityForm.upsert.mockResolvedValue({
    eligibility_form_id: eligibilityID,
    submitted: false,
    completed: false,
    updated_at: new Date(),
  });
  prismaMock.eligibilityFormPage.create.mockResolvedValue({
    eligibility_form_id: eligibilityID,
    form_route: formRoute,
    form_data: mockEligibilityPage,
    eligibility_form_page_id: "bogus page ID",
    updated_at: new Date(),
  });
  await upsertEligibilityAndEligibilityPage(
    eligibilityID,
    formRoute,
    mockEligibilityPage
  );
  expect(prismaMock.eligibilityForm.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { eligibility_form_id: eligibilityID },
      create: { eligibility_form_id: eligibilityID },
    })
  );
  expect(prismaMock.eligibilityFormPage.findFirst).toHaveBeenCalledWith({
    where: {
      eligibility_form_id: eligibilityID,
      form_route: formRoute,
    },
  });
  expect(prismaMock.eligibilityFormPage.update).not.toBeCalled;
  expect(prismaMock.eligibilityFormPage.create).toHaveBeenCalledWith({
    data: {
      eligibility_form_id: eligibilityID,
      form_route: formRoute,
      form_data: mockEligibilityPage,
    },
  });
});

it("creates a form page and updates an existing eligibility page", async () => {
  const mockEligibilityPage = getMockEligibilityData();
  const mockIncomePage = getMockIncomeData();
  const eligibilityID = "test eligibility ID";
  const formRoute = "eligibility";
  prismaMock.eligibilityForm.upsert.mockResolvedValue({
    eligibility_form_id: eligibilityID,
    submitted: false,
    completed: false,
    updated_at: new Date(),
  });
  prismaMock.eligibilityFormPage.findFirst.mockResolvedValue({
    eligibility_form_id: eligibilityID,
    form_route: formRoute,
    form_data: mockIncomePage,
    eligibility_form_page_id: "bogus page ID",
    updated_at: new Date(),
  });
  await upsertEligibilityAndEligibilityPage(
    eligibilityID,
    formRoute,
    mockEligibilityPage
  );
  expect(prismaMock.eligibilityForm.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { eligibility_form_id: eligibilityID },
      create: { eligibility_form_id: eligibilityID },
    })
  );
  expect(prismaMock.eligibilityFormPage.findFirst).toHaveBeenCalledWith({
    where: {
      eligibility_form_id: eligibilityID,
      form_route: formRoute,
    },
  });
  expect(prismaMock.eligibilityFormPage.update).toHaveBeenCalledWith({
    where: { eligibility_form_page_id: "bogus page ID" },
    data: { form_data: mockEligibilityPage },
  });
  expect(prismaMock.eligibilityFormPage.create).not.toBeCalled;
});

it("updates a form if it finds one", async () => {
  const eligibilityID = "test eligibility ID";
  prismaMock.eligibilityForm.findUnique.mockResolvedValue({
    eligibility_form_id: eligibilityID,
    submitted: false,
    completed: false,
    updated_at: new Date(),
  });
  await updateEligibility(eligibilityID, true, true);
  expect(prismaMock.eligibilityForm.findUnique).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        eligibility_form_id: eligibilityID,
      },
    })
  );
  expect(prismaMock.eligibilityForm.update).toHaveBeenCalledWith({
    where: {
      eligibility_form_id: eligibilityID,
    },
    data: {
      completed: true,
      submitted: true,
    },
  });
});

it("does not update a form if it doesn't find one", async () => {
  const eligibilityID = "test eligibility ID";
  await updateEligibility(eligibilityID, true, true);
  expect(prismaMock.eligibilityForm.findUnique).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        eligibility_form_id: eligibilityID,
      },
    })
  );
  expect(prismaMock.eligibilityForm.update).not.toBeCalled;
});
