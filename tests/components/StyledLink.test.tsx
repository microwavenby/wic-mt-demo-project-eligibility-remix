import { renderWithRouter } from "tests/helpers/setup";
import StyledLink from "app/components/StyledLink";

const testProps = {
  href: "/somewhere",
  textKey: "link text",
  external: false,
};

it("should match snapshot for internal link", () => {
  const { container } = renderWithRouter(<StyledLink {...testProps} />);
  expect(container).toMatchSnapshot();
});

it("should match snapshot for external link", () => {
  const { container } = renderWithRouter(
    <StyledLink {...testProps} external={true} />
  );
  expect(container).toMatchSnapshot();
});
