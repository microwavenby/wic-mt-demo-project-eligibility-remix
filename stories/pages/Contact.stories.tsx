import Contact from "~/routes/contact";
import Layout from "~/components/Layout";
export default {
  title: "Pages/Contact",
  parameters: {},
};

export const PageWithoutLayout = Contact;
export const FullPage = () => {
  return <Layout>{Contact()}</Layout>;
};
