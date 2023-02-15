import { ButtonLink } from "app/components/ButtonLink";
import { ReactElement } from "react";

export default {
  component: ButtonLink,
  title: "Components/ButtonLink",
  argTypes: {
    buttonClassName: {
      description: "CSS classes to pass to the Button component",
      table: {
        type: {
          summary: "display-block",
          detail: "something really really long",
        },
        defaultValue: {
          summary: "display-block",
          detail:
            "This class has display-block hard-coded in for its appearance",
        },
      },
      defaultValue: "display-block",
    },
    to: {
      description: "Target for the Link component",
      type: {
        required: true,
        name: "href",
      },
      table: {
        type: {
          summary: "URL or path",
          detail:
            "Internal Path to another page within the site, or external URL",
        },
      },
    },
    children: {
      description: "Text or other React / HTML element within ButtonLink",
    },
  },
};

const ButtonLinkTemplate = {
  render: ({
    children,
    to,
    buttonClassName,
    ...args
  }: {
    children: ReactElement;
    to: string;
    buttonClassName: string;
  }) => {
    return (
      <ButtonLink to={to} buttonClassName={buttonClassName}>
        {children}
      </ButtonLink>
    );
  },
};

export const Default = {
  ...ButtonLinkTemplate,
  args: {
    buttonClassName: "",
    to: "#nowhere",
    children: "Button Link",
  },
};
