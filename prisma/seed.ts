import { PrismaClient } from "@prisma/client";
import clinicData from "public/data/clinics-with-ids.json";
import zipDistance from "public/data/all.json";

const prisma = new PrismaClient();
async function main() {
  const alignedClinicData = clinicData.map(({ id, ...rest }) => ({
    ["clinicID"]: id,
    ...rest,
  }));
  const result = await prisma.clinic.createMany({
    data: alignedClinicData,
  });
  console.log(`Imported ${result.count} clinic records`);
  let zipDistanceRecords = 0;
  for (const [zip, distances] of Object.entries(zipDistance)) {
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
main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
