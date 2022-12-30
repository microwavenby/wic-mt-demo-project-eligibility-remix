import { Trans, useTranslation } from "react-i18next";

import { Button } from "@trussworks/react-uswds";
import { Link } from "@remix-run/react";

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
      <Link to="how-it-works">
        <Button type="button" className="display-block margin-top-6">
          {t("Index.button")}
        </Button>
      </Link>
    </div>
  );
}
