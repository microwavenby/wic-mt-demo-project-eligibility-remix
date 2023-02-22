import StyleLink, { StyledLinkProps } from "app/components/StyledLink";

export default {
  component: StyleLink,
  title: "Components/StyleLink",
};

const defaultProps = {
  href: "/somewhere",
  textKey: "test:styledlink.textKey",
  external: false,
};

const StyleLinkTemplate = {
  render: (props: StyledLinkProps) => {
    return <StyleLink {...props} />;
  },
};

export const Default = {
  ...StyleLinkTemplate,
  args: {
    ...defaultProps,
  },
};

export const External = {
  ...StyleLinkTemplate,
  args: {
    ...defaultProps,
    external: true,
  },
};
