import { Trans, useTranslation } from "react-i18next";
import { ButtonLink } from "~/components/ButtonLink";

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
      <ButtonLink
        buttonClassName="display-block margin-top-6"
        to="how-it-works"
      >
        {t("Index.button")}
      </ButtonLink>
    </div>
  );
}
