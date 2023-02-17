import { ButtonLink as ButtonLinkComponent } from "app/components/ButtonLink";
import { ReactElement } from "react";

export default {
  component: ButtonLinkComponent,
  title: "Components/ButtonLink",
  argTypes: {
    buttonClassName: {
      description: "CSS classes to pass to the Button component",
      table: {
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
      <ButtonLinkComponent to={to} buttonClassName={buttonClassName}>
        {children}
      </ButtonLinkComponent>
    );
  },
};

export const ButtonLink = {
  ...ButtonLinkTemplate,
  args: {
    buttonClassName: "",
    to: "#nowhere",
    children: "Button Link",
  },
};
