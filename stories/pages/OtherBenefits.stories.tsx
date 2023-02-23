import OtherBenefits from "~/routes/other-benefits";
import Layout from "~/components/Layout";
export default {
  title: "Pages/Other Benefits",
  parameters: {},
};

export const PageWithoutLayout = OtherBenefits;
export const FullPage = () => {
  return <Layout>{OtherBenefits()}</Layout>;
};
