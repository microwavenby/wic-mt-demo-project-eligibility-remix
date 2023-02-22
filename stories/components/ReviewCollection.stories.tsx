import ReviewCollection from "app/components/ReviewCollection";
import type { ReviewCollectionProps } from "app/components/ReviewCollection";

export default {
  component: ReviewCollection,
  title: "Components/ReviewCollection",
};

const reviewElements = [
  { labelKey: "test:reviewcollection.label1", children: "child a" },
  { labelKey: "test:reviewcollection.label2", children: "child b" },
];

const defaultReviewCollectionProps: ReviewCollectionProps = {
  headerKey: "test:reviewcollection.header",
  reviewElements: reviewElements,
  editable: false,
  editHref: "#edit",
  firstElement: false,
};

const ReviewCollectionTemplate = {
  render: (props: ReviewCollectionProps) => {
    return <ReviewCollection {...props} />;
  },
};

export const Default = {
  ...ReviewCollectionTemplate,
  args: {
    ...defaultReviewCollectionProps,
  },
};

export const Editable = {
  ...ReviewCollectionTemplate,
  args: {
    ...defaultReviewCollectionProps,
    editable: true,
  },
};

export const FirstElement = {
  ...ReviewCollectionTemplate,
  args: {
    ...defaultReviewCollectionProps,
    firstElement: true,
  },
};
