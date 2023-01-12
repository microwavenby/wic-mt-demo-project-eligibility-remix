import { PrismaClient, EligibilityFormPage, Prisma } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import db from "app/utils/db.connection";

jest.mock("app/utils/db.connection", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;

export function pagifyMock(route: string, mock_obj: any): EligibilityFormPage {
  return {
    form_route: route,
    form_data: mock_obj as Prisma.JsonObject,
    updated_at: new Date(),
    eligibility_form_page_id: "fakepageID",
    eligibility_form_id: "fakeFormID",
  } as EligibilityFormPage;
}
