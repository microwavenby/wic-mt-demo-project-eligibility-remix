import { useTranslation } from "react-i18next";
import { Link } from "@remix-run/react";
import { ReactElement } from "react";

import { i18nKey } from "app/types";

export type StyledLinkProps = {
  href: string;
  textKey: i18nKey;
  external?: boolean;
};

export const StyledLink = (props: StyledLinkProps): ReactElement => {
  const { href, textKey, external = false } = props;
  let { t } = useTranslation();
  if (external) {
    return (
      <a
        className="usa-link usa-link--external"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t(textKey)}
      </a>
    );
  } else {
    // Only use the remix/link component for internal routing.
    return (
      <Link to={href} className="usa-link">
        {t(textKey)}
      </Link>
    );
  }
};

export default StyledLink;
