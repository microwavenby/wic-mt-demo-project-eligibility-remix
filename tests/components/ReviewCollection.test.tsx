import { renderWithRouter } from "tests/helpers/setup";
import ReviewCollection from "app/components/ReviewCollection";

const reviewElements = [
  { labelKey: "element a", children: "child a" },
  { labelKey: "element b", children: "child b" },
];

const testProps = {
  headerKey: "header key",
  reviewElements: reviewElements,
  editable: false,
  editHref: "/edit-link",
  firstElement: false,
};

it("should match snapshot when it is the first element", () => {
  const { container } = renderWithRouter(
    <ReviewCollection {...testProps} firstElement={true} />
  );
  expect(container).toMatchSnapshot();
});

it("should match snapshot when it is not the first element", () => {
  const { container } = renderWithRouter(
    <ReviewCollection {...testProps} firstElement={false} />
  );
  expect(container).toMatchSnapshot();
});
