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
      "remix-validated-form": require.resolve(
        "./mockModules/remix-validated-form.tsx"
      ),
    };
    config.resolve.alias["./app/utils/db.connection"] = require.resolve(
      "./mockModules/utils/db.connection.ts"
    );
    config.resolve.alias["db.server$"] = require.resolve(
      "./mockModules/utils/db.server.ts"
    );
    config.resolve.alias["@prisma/client"] = require.resolve(
      "./mockModules/utils/prisma-client.ts"
    );
    config.resolve.alias["@remix-run/react"] = require.resolve(
      "./mockModules/remix-react.tsx"
    );

    // );
    // config.resolve.alias["/utils/db.server"] = require.resolve(
    //   "./mockModules/db.server.ts"
    // );
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      assert: false,
      buffer: false,
      console: false,
      constants: false,
      crypto: false,
      domain: false,
      events: false,
      http: false,
      https: false,
      os: false,
      path: false,
      punycode: false,
      process: false,
      querystring: false,
      stream: false,
      string_decoder: false,
      sys: false,
      timers: false,
      tty: false,
      url: false,
      util: false,
      vm: false,
      zlib: false,
    };
    return config;
  },
};
