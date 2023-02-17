import BackLinkComponent from "app/components/BackLink";

export default {
  component: BackLinkComponent,
  title: "Components/BackLink",
  argTypes: {
    href: {
      description: "Target navigation URL",
      type: {
        required: true,
        name: "route",
      },
      table: {
        type: {
          summary: "route",
          detail: "Path to another page within the site",
        },
      },
      defaultValue: "#back",
    },
  },
};

const BackLinkTemplate = {
  render: ({ href }: { href: string }) => {
    return <BackLinkComponent href={href} />;
  },
};

export const BackLink = {
  ...BackLinkTemplate,
};
