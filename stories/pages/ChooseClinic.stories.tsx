import ChooseClinic from "~/routes/choose-clinic";
import Layout from "~/components/Layout";
export default {
  title: "Pages/Choose Clinic",
  parameters: {},
};

export const PageWithoutLayout = ChooseClinic;
export const FullPage = () => {
  return <Layout>{ChooseClinic()}</Layout>;
};
