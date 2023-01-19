import { PrismaClient } from "@prisma/client";
import clinicData from "public/data/clinics-with-ids.json";
import rawZipDistanceData from "public/data/all.json";
import { ZipDistance } from "app/types";

const prisma = new PrismaClient();
async function main() {
  const alignedClinicData = clinicData.map(({ id, ...rest }) => ({
    ["clinicID"]: id,
    ...rest,
  }));
  const typedZipDistance = rawZipDistanceData as unknown as ZipDistance;
  const existingClinicRecords = await prisma.clinic.count();
  if (existingClinicRecords == Object.keys(alignedClinicData).length) {
    console.log(
      `Skipping clinic seed; found ${existingClinicRecords} in database`
    );
  } else {
    const result = await prisma.clinic.createMany({
      data: alignedClinicData,
    });
    console.log(`Imported ${result.count} clinic records`);
  }
  const existingZipDistanceRecords = await prisma.zipClinicDistance.count();
  const zipDistanceLength = Object.keys(typedZipDistance).reduce(
    (total, key) =>
      typedZipDistance[key as keyof typeof typedZipDistance].length + total,
    0
  );
  if (existingZipDistanceRecords == zipDistanceLength) {
    console.log(
      `Skipping zipDistance seed; found ${existingZipDistanceRecords} in database`
    );
  } else {
    console.log(
      `Records to import; there are ${existingZipDistanceRecords} here and ${zipDistanceLength}`
    );
    let zipDistanceRecords = 0;
    for (const [zip, distances] of Object.entries(typedZipDistance)) {
      const zipDistanceMap = distances.map(({ id, distance, ...rest }) => ({
        ["clinicID"]: id,
        ["zip"]: zip,
        ["distance"]: distance,
        ["distanceTenthMiles"]: Number(distance.replace(" mi", "")) * 10,
        ...rest,
      }));
      const result = await prisma.zipClinicDistance.createMany({
        data: zipDistanceMap,
      });
      zipDistanceRecords = zipDistanceRecords + result.count;
    }
    console.log(`Imported ${zipDistanceRecords} clinic distance records`);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
