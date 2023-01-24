import { ReactElement } from "react";

import { Link, LinkProps } from "@remix-run/react";
import { Button } from "@trussworks/react-uswds";

export interface ButtonLinkProps extends LinkProps {
  buttonClassName?: string;
}

export const ButtonLink = (props: ButtonLinkProps): ReactElement => {
  const { to, children, className, buttonClassName, ...rest } = props;
  return (
    <Link className={`text-unstyled ${className || ""}`} to={to}>
      <Button type="button" className={buttonClassName}>
        {children}
      </Button>
    </Link>
  );
};
