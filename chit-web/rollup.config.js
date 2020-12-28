import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "browserSupport/src/browserSupport.ts",
    output: {
      dir: "src/public/app/resources/",
      format: "iife",
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: "browserSupport/tsconfig.json" }),
    ],
  },
  {
    input: "browserSupport/src/browser.worker.ts",
    output: {
      dir: "src/public/app/resources/",
      format: "iife",
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: "browserSupport/tsconfig.worker.json" }),
    ],
  },
];
