import LoadablePlugin from "@loadable/webpack-plugin";
import {
  HotModuleReplacementPlugin,
  Configuration,
  optimize,
  WatchIgnorePlugin
} from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { Target, Mode } from "../../types";

export default ({
  target,
  mode
}: {
  target: Target;
  mode: Mode;
}): Configuration["plugins"] => {
  const config: Configuration["plugins"] = [
    // Create HTML files for bundle analyzing.
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: `../../build/analyze/${target}-${mode}.html`,
      openAnalyzer: false,
      logLevel: "silent"
    }),
    // Don't rebuild on changes of the build folder.
    new WatchIgnorePlugin([/build/])
  ];

  // Support HMR in development. Only needed in client.
  if (target !== "node" && mode === "development")
    config.push(new HotModuleReplacementPlugin());

  // Needed for code splitting in client.
  if (target !== "node") config.push(new LoadablePlugin());

  // Avoid code splitting in node.
  if (target === "node")
    config.push(new optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
  return config;
};
