import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const plugins = (tsconfig) => {
  return [
    nodeResolve(),
    typescript({ tsconfig }),
    (process.env.NODE_ENV !== 'developement')?terser():null
  ];
};

export default [
  {
    input: "browserSupport/src/browserSupport.ts",
    output: {
      dir: "src/public/app/resources/",
      format: "iife",
    },
    plugins: plugins("browserSupport/tsconfig.json"),
  },
  {
    input: "browserSupport/src/browser.worker.ts",
    output: {
      dir: "src/public/app/resources/",
      format: "iife",
    },
    plugins: plugins("browserSupport/tsconfig.worker.json"),
  }
];
