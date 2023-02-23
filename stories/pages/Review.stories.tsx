import Review from "~/routes/review";
import Layout from "~/components/Layout";
export default {
  title: "Pages/Review",
  parameters: {},
};

export const PageWithoutLayout = Review;
export const FullPage = () => {
  return <Layout>{Review()}</Layout>;
};
