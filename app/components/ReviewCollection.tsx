import { useTranslation } from "react-i18next";
import { ReactElement } from "react";
import { UrlObject } from "url";

import ButtonLink from "app/components/ButtonLink";
import ReviewElement, {
  ReviewElementProps,
} from "app/components/ReviewElement";

import { i18nKey } from "app/types";

export type ReviewCollectionProps = {
  headerKey: i18nKey;
  reviewElements: ReviewElementProps[];
  editable: boolean;
  editHref: string;
  firstElement?: boolean;
};

const ReviewCollection = (props: ReviewCollectionProps): ReactElement => {
  const {
    headerKey,
    reviewElements,
    editable = false,
    editHref = "",
    firstElement = false,
  } = props;
  let { t } = useTranslation();
  const marginTop = firstElement ? "margin-top-3" : "margin-top-6";

  return (
    <div className={`review-collection ${marginTop} border-bottom-1px`}>
      <h2>
        {t(headerKey)}
        {editable && (
          <div className="float-right">
            <ButtonLink labelKey="edit" href={editHref} style="unstyled" />
          </div>
        )}
      </h2>
      <dl className="margin-bottom-2">
        {reviewElements.map((element: ReviewElementProps, index: number) => (
          <ReviewElement key={index} {...element} />
        ))}
      </dl>
    </div>
  );
};

export default ReviewCollection;
