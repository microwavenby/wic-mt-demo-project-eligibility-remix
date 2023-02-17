import AccordionComponent from "app/components/Accordion";

export default {
  component: AccordionComponent,
  title: "Components/Accordion",
  argTypes: {
    bodyKey: {
      description: "Key to the i18n translation for the Body Text",
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
      defaultValue: "help-accordion",
    },
  },
};

const AccordionTemplate = {
  render: ({
    bodyKey,
    headerKey,
    id,
  }: {
    bodyKey: string;
    headerKey: string;
    id: string;
  }) => {
    return (
      <AccordionComponent bodyKey={bodyKey} headerKey={headerKey} id={id} />
    );
  },
};

export const Accordion = {
  ...AccordionTemplate,
};
