import config from '../as-pect.config.js';
// coverage option makes the compilation fail :(
// Should be fixed in: https://github.com/as-pect/visitor-as/pull/44 and https://github.com/as-pect/as-covers/pull/13
// the issue seems fixed when using latest as-pect version (and latest assemblyscript version)
config.coverage = ['packages/**/assembly/**/*.ts'];
export default config;
