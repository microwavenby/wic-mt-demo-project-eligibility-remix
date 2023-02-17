import Dropdown from "app/components/Dropdown";
import type { DropdownProps } from "app/components/Dropdown";

export default {
  component: Dropdown,
  title: "Components/Dropdown",
  argTypes: {
    id: {
      description: "Unique ID for the element",
    },
    labelKey: {
      description: "i18n key for the label",
    },
    options: {
      description: "List of options",
    },
    required: {
      description: "Displays a required element if true",
      defaultValue: false,
      table: {
        defaultValue: {
          summary: false,
        },
      },
    },
    selectedOption: {
      description: "Sets the currently selected option",
      table: {
        defaultValue: {
          summary: "",
        },
      },
    },
    handleChange: {
      description: "JavaScript function to call onChange",
    },
  },
};

const DropdownTemplate = {
  render: (props: DropdownProps) => {
    return <Dropdown {...props} />;
  },
};

const defaultDropdownProps: DropdownProps = {
  id: "dropdown-id",
  labelKey: "test:dropdown.label",
  options: ["option1", "option2", "option3"],
  handleChange: (e) => {},
};

export const Default = {
  ...DropdownTemplate,
  args: {
    ...defaultDropdownProps,
  },
};

export const Required = {
  ...DropdownTemplate,
  args: {
    ...defaultDropdownProps,
    required: true,
  },
};

export const SelectedOption = {
  ...DropdownTemplate,
  args: {
    ...defaultDropdownProps,
    selectedOption: "option3",
  },
};
