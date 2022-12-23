import { useTranslation } from "react-i18next";
import { ReactElement } from "react";

import ClinicInfo from "app/components/ClinicInfo";
import List from "app/components/List";
import ReviewCollection from "app/components/ReviewCollection";
import { ReviewElementProps } from "app/components/ReviewElement";

import type {
  ChooseClinicData,
  ContactData,
  EligibilityData,
  IncomeData,
  EligibilityPagesType,
} from "app/types";
import { formatPhone } from "app/utils/dataFormatting";

export type ReviewSectionProps = {
  editable: boolean;
  session: EligibilityPagesType;
};

const ReviewSection = (props: ReviewSectionProps): ReactElement => {
  const { editable, session } = props;
  let { t } = useTranslation();

  const showHouseholdSize =
    session.income && session?.eligibility?.adjunctive?.includes("none");

  const formatEligibilityResponses = (
    eligibility?: EligibilityData
  ): ReviewElementProps[] => {
    if (!eligibility) {
      return [];
    }

    const categoricalKeys = eligibility.categorical.map((key: string) => {
      return `Eligibility.${key}`;
    });
    const adjunctiveKeys = eligibility.adjunctive.map((key: string) => {
      return `Eligibility.${key}`;
    });

    return [
      {
        labelKey: "Eligibility.residential",
        children: t(`Eligibility.${eligibility.residential}`),
      },
      {
        labelKey: "Eligibility.categorical",
        children: <List i18nKeys={categoricalKeys} />,
      },
      {
        labelKey: "Eligibility.previouslyEnrolled",
        children: t(`Eligibility.${eligibility.previouslyEnrolled}`),
      },
      {
        labelKey: "Eligibility.adjunctive",
        children: <List i18nKeys={adjunctiveKeys} />,
      },
    ];
  };

  const formatIncomeResponses = (income?: IncomeData) => {
    if (!income) {
      return [];
    }
    return [
      {
        labelKey: "Income.householdSize",
        children: <div>{income.householdSize}</div>,
      },
    ];
  };

  const formatClinicResponses = (
    chooseClinic?: ChooseClinicData
  ): ReviewElementProps[] => {
    if (!chooseClinic) {
      return [];
    }
    const zipCodeElement = {
      labelKey: "Review.zipCode",
      children: <div>{chooseClinic.zipCode}</div>,
    };

    let clinic = <></>;
    if (chooseClinic.clinic !== undefined) {
      clinic = (
        <ClinicInfo
          name={chooseClinic.clinic}
          streetAddress={chooseClinic.clinicAddress}
          phone={chooseClinic.clinicTelephone}
          isFormElement={false}
        />
      );
    }
    const clinicElement = {
      labelKey: "Review.clinicSelected",
      children: clinic,
    };

    return [zipCodeElement, clinicElement];
  };

  const formatContactResponses = (
    contact?: ContactData
  ): ReviewElementProps[] => {
    if (!contact) {
      return [];
    }
    const contactResponses: ReviewElementProps[] = [];
    for (const key in contact) {
      const castKey = key as keyof typeof contact;
      contactResponses.push({
        labelKey: `Contact.${key}`,
        children:
          castKey === "phone"
            ? formatPhone(contact[castKey])
            : contact[castKey],
      });
    }
    return contactResponses;
  };

  return (
    <>
      <ReviewCollection
        headerKey="Review.eligibilityTitle"
        editable={editable}
        editHref="/eligibility?mode=review"
        reviewElements={formatEligibilityResponses(session.eligibility)}
      />
      {showHouseholdSize && (
        <ReviewCollection
          headerKey="Income.householdSize"
          editable={editable}
          editHref="/income?mode=review"
          reviewElements={formatIncomeResponses(session.income)}
        />
      )}
      <ReviewCollection
        headerKey="ChooseClinic.title"
        editable={editable}
        editHref={`/choose-clinic?mode=review&zip=${session.clinic?.zipCode}`}
        reviewElements={formatClinicResponses(session.clinic)}
      />
      <ReviewCollection
        headerKey="Contact.title"
        editable={editable}
        editHref="/contact?mode=review"
        reviewElements={formatContactResponses(session.contact)}
      />
    </>
  );
};

export default ReviewSection;
