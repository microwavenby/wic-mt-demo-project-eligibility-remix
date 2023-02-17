import ClinicInfo from "app/components/ClinicInfo";
import type { ClinicInfoProps } from "app/components/ClinicInfo";
import { ReactElement } from "react";

export default {
  component: ClinicInfo,
  title: "Components/ClinicInfo",
  argTypes: {
    name: {
      description: "Name of the clinic location",
    },
    streetAddress: {
      description: "Clinic address",
    },
    phone: {
      description: "Clinic phone number",
    },
    isFormElement: {
      description:
        "Adds the class `usa-checkbox__label-description` if set to true",
      table: {
        defaultValue: {
          summary: false,
        },
      },
      defaultValue: false,
    },
  },
};

const ClinicInfoTemplate = {
  render: (props: ClinicInfoProps) => {
    return <ClinicInfo {...props} />;
  },
};

const defaultClinicProps: ClinicInfoProps = {
  name: "WIC Bozeman",
  streetAddress: "215 W Mendenhall St, Bozeman, MT 59715",
  phone: "406-582-3115",
};

export const Default = {
  ...ClinicInfoTemplate,
  args: {
    ...defaultClinicProps,
  },
};

export const FormElement = {
  ...ClinicInfoTemplate,
  args: {
    ...defaultClinicProps,
    isFormElement: true,
  },
};
