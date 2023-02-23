import Eligibility from "~/routes/eligibility";
import Layout from "~/components/Layout";
export default {
  title: "Pages/Eligibility",
  parameters: {},
};

export const PageWithoutLayout = Eligibility;
export const FullPage = () => {
  return <Layout>{Eligibility()}</Layout>;
};
