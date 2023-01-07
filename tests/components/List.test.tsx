import { renderWithRouter } from "tests/helpers/setup";
import List from "app/components/List";

const testProps = {
  i18nKeys: ["list item a", "list item b", "list item c"],
};

it("should match snapshot", () => {
  const { container } = renderWithRouter(<List {...testProps} />);
  expect(container).toMatchSnapshot();
});
