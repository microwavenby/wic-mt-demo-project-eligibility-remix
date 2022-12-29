import { ReactElement } from "react";

import { Trans, useTranslation } from "react-i18next";

export type TransLinkProps = {
  i18nTextKey: string;
  i18nLinkKey: string;
};

export const TransLinks = (props: TransLinkProps): ReactElement => {
  const { i18nTextKey, i18nLinkKey } = props;
  let { t } = useTranslation();
  const linkArray = t(i18nLinkKey, { returnObjects: true }) as Array<string>;
  const linkAnchors: ReactElement[] = linkArray.map((link: string) => {
    return (
      <a
        href={link}
        className="usa-link usa-link--external"
        target="_blank"
        rel="noopener noreferrer"
        key={linkArray.indexOf(link)}
      ></a>
    );
  });
  return <Trans i18nKey={i18nTextKey} components={linkAnchors} />;
};

export default TransLinks;
