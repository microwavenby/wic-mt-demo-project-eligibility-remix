import ListComponent from "app/components/List";
import type { ListProps } from "app/components/List";

export default {
  component: ListComponent,
  title: "Components/List",
  argTypes: {
    i18nKeys: {
      description: "List of i18n keys",
    },
  },
};

const ListTemplate = {
  render: (props: ListProps) => {
    return <ListComponent {...props} />;
  },
};

export const List = {
  ...ListTemplate,
  args: {
    i18nKeys: ["test:list.item1", "test:list.item2", "test:list.item3"],
  },
};
