import Accordion from "app/components/Accordion";
import { ReactElement } from "react";

export default {
  component: Accordion,
  title: "Components/Accordion",
  argTypes: {
    bodyKey: {
      description: "Key to the i18n translation for the Body Text",
      type: {
        required: true,
      },
      table: {
        type: {
          summary: "i18key",
          detail: "Must map to a key in the localization data",
        },
      },
      defaultValue: "test:accordion.sampleBody",
    },

    headerKey: {
      description: "Key to the i18n translation for the Header Text",
      type: {
        required: true,
      },
      table: {
        type: {
          summary: "i18key",
          detail: "Must map to a key in the localization data",
        },
      },
      defaultValue: "test:accordion.sampleHeader",
    },
    id: {
      description: "Unique ID for the element",
      type: { required: true },
      defaultValue: "help-accordion",
    },
  },
};

const AccordionTemplate = {
  render: ({
    bodyKey,
    headerKey,
    id,
    ...args
  }: {
    bodyKey: string;
    headerKey: string;
    id: string;
  }) => {
    return <Accordion bodyKey={bodyKey} headerKey={headerKey} id={id} />;
  },
};

export const Default = {
  ...AccordionTemplate,
};
