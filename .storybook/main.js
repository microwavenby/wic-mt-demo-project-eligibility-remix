const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    name: "@storybook/react-webpack5",
    builder: "webpack5",
    disableTelemetry: true,
  },
  staticDirs: ["../public"],
  webpackFinal: async (config, { configType }) => {
    config.resolve.plugins = [new TsconfigPathsPlugin()];
    config.resolve.alias = {
      ...config.resolve.alias,
      "/uswds": path.resolve(__dirname, "../public/uswds"),
    };
    config.resolve.alias["remix-validated-form"] = require.resolve(
      "./mockModules/remix-validated-form.tsx"
    );
    return config;
  },
};
