import { ButtonLink } from "app/components/ButtonLink";
import { ReactElement } from "react";

export default {
  component: ButtonLink,
  title: "Components/ButtonLink",
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

// export const Primary = {
//   ...ButtonLinkTemplate,
//   args: {
//     buttonClassName: "display-block",
//     to: ".",
//     children: "Button Link",
//   },
// };

export const defaultButtonLink = (): React.ReactElement => (
  <ButtonLink to=".">Click Me</ButtonLink>
);
