import Income from "~/routes/income";
import Layout from "~/components/Layout";
export default {
  title: "Pages/Income",
  parameters: {},
};

export const PageWithoutLayout = Income;
export const FullPage = () => {
  return <Layout>{Income()}</Layout>;
};
