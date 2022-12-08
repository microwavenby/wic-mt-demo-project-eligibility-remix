import { useTranslation } from "react-i18next";
import { ReactElement } from "react";

import { i18nKey } from "app/types";

export type ListProps = {
  i18nKeys: i18nKey[];
};

export const List = (props: ListProps): ReactElement => {
  const { i18nKeys } = props;
  let { t } = useTranslation();
  return (
    <ul>
      {i18nKeys.map((key, index) => (
        <li key={index}>{t(key)}</li>
      ))}
    </ul>
  );
};

export default List;
