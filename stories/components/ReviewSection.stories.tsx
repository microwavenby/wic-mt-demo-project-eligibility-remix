import ReviewSection from "app/components/ReviewSection";
import type { ReviewSectionProps } from "app/components/ReviewSection";
import { getMockSession } from "tests/helpers/mockData";

export default {
  component: ReviewSection,
  title: "Components/ReviewSection",
};

const ReviewSectionTemplate = {
  render: (props: ReviewSectionProps) => {
    return <ReviewSection {...props} />;
  },
};

export const Default = {
  ...ReviewSectionTemplate,
  args: {
    editable: false,
    session: getMockSession(),
  },
};

export const Editable = {
  ...ReviewSectionTemplate,
  args: {
    editable: true,
    session: getMockSession(),
  },
};
