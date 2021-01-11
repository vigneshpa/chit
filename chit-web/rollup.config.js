import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import cjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const plugins = (tsconfig) => {
  return [
    typescript({ tsconfig }),
    nodeResolve(),
    cjs(),
    json(),
    process.env.NODE_ENV !== "developement" ? terser() : null,
  ];
};

const external = ["ChitORM"];

export default [
  {
    input: "browserSupport/src/browserSupport.ts",
    output: {
      dir: "src/public/app/resources/",
      format: "iife",
    },
    external,
    plugins: plugins("browserSupport/tsconfig.json"),
  },
  {
    input: "browserSupport/src/browser.worker.ts",
    output: {
      dir: "src/public/app/resources/",
      format: "iife",
    },
    external,
    plugins: plugins("browserSupport/tsconfig.worker.json"),
  },
];
