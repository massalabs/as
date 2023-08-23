import config from './as-pect.config.js';
config.entries = ['packages/as-types/assembly/**/*.spec.ts'];
config.include = ['packages/as-types/assembly/**/*.include.ts'];
config.disclude = [/node_modules/];
export default config;