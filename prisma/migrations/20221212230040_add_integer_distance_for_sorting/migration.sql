/*
  Warnings:

  - Added the required column `distanceTenthMiles` to the `ZipClinicDistance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZipClinicDistance" ADD COLUMN     "distanceTenthMiles" INTEGER NOT NULL;
