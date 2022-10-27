import { IMpaConfig } from '../types/index.js';
declare const isExist: (path: string) => boolean;
declare const resolveConfig: (command: 'dev' | 'build', mode: 'development' | 'production' | string) => Promise<IMpaConfig>;
declare const ckeckNodeVersion: (targetNodeVersion: string) => boolean;
export { isExist, resolveConfig, ckeckNodeVersion };
