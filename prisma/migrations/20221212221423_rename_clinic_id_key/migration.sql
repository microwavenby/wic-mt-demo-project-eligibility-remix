/*
  Warnings:

  - The primary key for the `Clinic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clinic_id` on the `Clinic` table. All the data in the column will be lost.
  - The primary key for the `ZipClinicDistance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clinic_id` on the `ZipClinicDistance` table. All the data in the column will be lost.
  - Added the required column `clinicID` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicID` to the `ZipClinicDistance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ZipClinicDistance" DROP CONSTRAINT "ZipClinicDistance_clinic_id_fkey";

-- AlterTable
ALTER TABLE "Clinic" DROP CONSTRAINT "Clinic_pkey",
DROP COLUMN "clinic_id",
ADD COLUMN     "clinicID" INTEGER NOT NULL,
ADD CONSTRAINT "Clinic_pkey" PRIMARY KEY ("clinicID");

-- AlterTable
ALTER TABLE "ZipClinicDistance" DROP CONSTRAINT "ZipClinicDistance_pkey",
DROP COLUMN "clinic_id",
ADD COLUMN     "clinicID" INTEGER NOT NULL,
ADD CONSTRAINT "ZipClinicDistance_pkey" PRIMARY KEY ("zip", "clinicID");

-- AddForeignKey
ALTER TABLE "ZipClinicDistance" ADD CONSTRAINT "ZipClinicDistance_clinicID_fkey" FOREIGN KEY ("clinicID") REFERENCES "Clinic"("clinicID") ON DELETE RESTRICT ON UPDATE CASCADE;
