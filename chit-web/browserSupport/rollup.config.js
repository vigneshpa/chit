import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: 'src/browserSupport.ts',
  output: {
    dir: 'dist',
    format: 'iife'
  },
  plugins: [typescript({tsconfig:"tsconfig.json"}), nodeResolve()]
};