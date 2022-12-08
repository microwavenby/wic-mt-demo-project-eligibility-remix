import { Link } from "@remix-run/react";
import { MouseEvent, ReactElement } from "react";
import { UrlObject } from "url";

import Button from "app/components/Button";

import { i18nKey } from "app/types";

export type ButtonLinkProps = {
  disabled?: boolean;
  labelKey: i18nKey;
  href: string;
  style?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
};

const ButtonLink = (props: ButtonLinkProps): ReactElement => {
  const { disabled, href, labelKey, style, onClick } = props;
  console.log(`Link to {href}`);
  return (
    <Link to={href}>
      <Button
        disabled={disabled}
        labelKey={labelKey}
        style={style}
        onClick={onClick}
      />
    </Link>
  );
};

export default ButtonLink;
