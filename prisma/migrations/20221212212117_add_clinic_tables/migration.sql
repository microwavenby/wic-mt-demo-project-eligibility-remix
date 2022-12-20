-- CreateTable
CREATE TABLE "Clinic" (
    "clinic_id" INTEGER NOT NULL,
    "agency" TEXT NOT NULL,
    "agencyAddress" TEXT NOT NULL,
    "agencyTelephone" TEXT NOT NULL,
    "clinic" TEXT NOT NULL,
    "clinicAddress" TEXT NOT NULL,
    "clinicTelephone" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("clinic_id")
);

-- CreateTable
CREATE TABLE "ZipClinicDistance" (
    "zip" TEXT NOT NULL,
    "clinic_id" INTEGER NOT NULL,
    "distance" TEXT NOT NULL,

    CONSTRAINT "ZipClinicDistance_pkey" PRIMARY KEY ("zip","clinic_id")
);

-- AddForeignKey
ALTER TABLE "ZipClinicDistance" ADD CONSTRAINT "ZipClinicDistance_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("clinic_id") ON DELETE RESTRICT ON UPDATE CASCADE;
