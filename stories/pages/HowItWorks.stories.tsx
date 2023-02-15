import HowItWorks from "~/routes/how-it-works";
import Layout from "~/components/Layout";
export default {
  title: "Pages/How It Works",
  parameters: {},
};

export const PageWithoutLayout = HowItWorks;
export const FullPage = () => {
  return <Layout>{HowItWorks()}</Layout>;
};
