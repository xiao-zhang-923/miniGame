import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import devConfig from "./dev";
import prodConfig from "./prod";

export default defineConfig<"webpack5">(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<"webpack5"> = {
    projectName: "b",
    date: "2026-6-5",
    designWidth(input: any) {
      if (input?.file?.replace(/\\+/g, "/").indexOf("@nutui") > -1) {
        return 375;
      }
      return 750;
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: ["@tarojs/plugin-html"],
    defineConstants: {},
    copy: { patterns: [], options: {} },
    framework: "vue3",
    compiler: "webpack5",
    cache: { enable: false },

    mini: {
      miniCssExtractPluginOption: {
        ignoreOrder: true,
      },
      postcss: {
        pxtransform: { enable: true, config: {} },
        cssModules: {
          enable: false,
          config: {
            namingPattern: "module",
            generateScopedName: "[name]__[local]___[hash:base64:5]"
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);

        // 只修复 NutUI，其他全部不动！
        chain.module
          .rule("nutui-taro-fix")
          .test(/\.js$/)
          .include.add(/node_modules\/@nutui\/nutui-taro/)
          .end()
          .resolve.set("fullySpecified", false);
      },
    },

    h5: {
      publicPath: "/",
      staticDirectory: "static",
      output: {
        filename: "js/[name].[hash:8].js",
        chunkFilename: "js/[name].[chunkhash:8].js"
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css"
      },
      postcss: {
        autoprefixer: { enable: true, config: {} },
        cssModules: {
          enable: false,
          config: {
            namingPattern: "module",
            generateScopedName: "[name]__[local]___[hash:base64:5]"
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
        chain.module
          .rule("nutui-taro-fix")
          .test(/\.js$/)
          .include.add(/node_modules\/@nutui\/nutui-taro/)
          .end()
          .resolve.set("fullySpecified", false);
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: { cssModules: { enable: false } }
    },
  };

  if (process.env.NODE_ENV === "development") {
    return merge({}, baseConfig, devConfig);
  }
  return merge({}, baseConfig, prodConfig);
});