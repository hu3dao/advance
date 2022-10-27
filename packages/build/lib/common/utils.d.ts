declare const isExist: (path: string) => boolean;
declare const copy: (srcDir: string, desDir: string) => void;
declare const ckeckNodeVersion: (targetNodeVersion: string) => boolean;
export { isExist, copy, ckeckNodeVersion };
