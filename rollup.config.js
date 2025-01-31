import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import url from "postcss-url";
import postcss from "rollup-plugin-postcss";
import packageJson from "./package.json";

export default [
  {
    input: "src/index.tsx",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
      },
      {
        file: packageJson.module,
        format: "esm",
      },
    ],
    plugins: [
      PeerDepsExternalPlugin(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      postcss({
        plugins: [
          url({
            url: "inline",
            maxSize: 10,
            fallback: "copy",
          }),
        ],
      }),
    ],
    external: ["react", "react-dom", "react/jsx-runtime"],
  },
  {
    input: "src/index.tsx",
    output: [
      {
        file: packageJson.types,
      },
    ],
    plugins: [dts.default()],
    external: [/\.css/],
  },
];
