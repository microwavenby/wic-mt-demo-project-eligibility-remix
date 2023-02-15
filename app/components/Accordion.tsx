import { Trans } from "react-i18next";
import { ReactElement } from "react";
import { Accordion as USWDS_Accordion } from "@trussworks/react-uswds";
import { i18nKey } from "app/types";

export type AccordionProps = {
  bodyKey: i18nKey;
  headerKey: i18nKey;
  id: string;
};

const Accordion = (props: AccordionProps): ReactElement => {
  const { bodyKey, headerKey, id } = props;

  return (
    <USWDS_Accordion
      bordered={true}
      items={[
        {
          title: <Trans i18nKey={headerKey} />,
          content: <Trans i18nKey={bodyKey} />,
          id: id,
          expanded: false,
          headingLevel: "h3",
        },
      ]}
    />
  );
};

export default Accordion;
