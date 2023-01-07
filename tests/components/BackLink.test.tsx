import { renderWithRouter } from "tests/helpers/setup";
import BackLink from "app/components/BackLink";

it("should match snapshot", () => {
  const { container } = renderWithRouter(<BackLink href="/" />);
  expect(container).toMatchSnapshot();
});
