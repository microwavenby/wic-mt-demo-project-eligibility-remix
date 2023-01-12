import {
  findClinicByName,
  findClinics,
  ZipClinicDistanceWithClinic,
} from "app/utils/db.server";
import { prismaMock } from "tests/helpers/prismaMock";
import { getMockChooseClinicData } from "tests/helpers/mockData";
import { Clinic, ZipClinicDistance } from "@prisma/client";

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
