import ReviewElementComponent from "app/components/ReviewElement";
import type { ReviewElementProps } from "app/components/ReviewElement";
export default {
  component: ReviewElementComponent,
  title: "Components/ReviewElement",
};

const ReviewElementTemplate = {
  render: ({ labelKey, children }: ReviewElementProps) => {
    return (
      <ReviewElementComponent labelKey={labelKey}>
        {children}
      </ReviewElementComponent>
    );
  },
};

export const ReviewElement = {
  ...ReviewElementTemplate,
  args: {
    labelKey: "test:reviewelement.labelKey",
    children: <div>child a</div>,
  },
};
