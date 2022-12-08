-- CreateTable
CREATE TABLE "EligibilityForm" (
    "eligibility_form_id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "submitted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EligibilityForm_pkey" PRIMARY KEY ("eligibility_form_id")
);

-- CreateTable
CREATE TABLE "EligibilityFormPage" (
    "eligibility_form_page_id" UUID NOT NULL,
    "eligibility_form_id" UUID NOT NULL,
    "form_route" TEXT NOT NULL,
    "form_data" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "EligibilityFormPage_pkey" PRIMARY KEY ("eligibility_form_page_id")
);

-- AddForeignKey
ALTER TABLE "EligibilityFormPage" ADD CONSTRAINT "EligibilityFormPage_eligibility_form_id_fkey" FOREIGN KEY ("eligibility_form_id") REFERENCES "EligibilityForm"("eligibility_form_id") ON DELETE RESTRICT ON UPDATE CASCADE;

