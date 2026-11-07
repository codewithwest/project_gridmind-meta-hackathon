import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTypeScript from "eslint-config-next/typescript.js";

const asConfigArray = (config) => Array.isArray(config) ? config : [config];

export default defineConfig([
  ...asConfigArray(nextVitals),
  ...asConfigArray(nextTypeScript),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
