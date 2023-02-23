import Confirmation from "~/routes/confirmation";
import Layout from "~/components/Layout";
export default {
  title: "Pages/Confirmation",
  parameters: {},
};

export const PageWithoutLayout = Confirmation;
export const FullPage = () => {
  return <Layout>{Confirmation()}</Layout>;
};
