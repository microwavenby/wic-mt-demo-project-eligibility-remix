import { Trans, useTranslation } from "react-i18next";

import ButtonLink from "app/components/ButtonLink";

import type { Page } from "app/types";

export default function Index() {
  const listCopyKeys: string[] = ["benefits", "supplement", "voluntary"];

  let { t } = useTranslation();
  return (
    <div>
      <h1>{t("Index.title")}</h1>
      <Trans i18nKey="Index.header" />

      <ul className="usa-list">
        {listCopyKeys.map((key: string) => (
          <li key={key}>
            <Trans i18nKey={`Index.${key}`} />
          </li>
        ))}
      </ul>
      <Trans i18nKey="Index.time" />
      <ButtonLink href="how-it-works" labelKey="Index.button" />
    </div>
  );
}
