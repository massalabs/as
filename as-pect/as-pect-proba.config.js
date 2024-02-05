import config from '../as-pect.config.js';
config.entries = ['packages/as-proba/assembly/**/*.spec.ts'];
config.include = ['packages/as-proba/assembly/**/*.include.ts'];
config.disclude = [/node_modules/];
export default config;
