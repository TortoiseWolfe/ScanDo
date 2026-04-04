import { createRequire } from 'module';
import prettierConfig from 'eslint-config-prettier';

const require = createRequire(import.meta.url);
const expoConfig = require('eslint-config-expo/flat.js');

export default [
  ...expoConfig,
  prettierConfig,
  {
    ignores: ['node_modules/', 'ios/', 'android/', 'dist/', '.expo/'],
  },
];
