declare const CWD: string;
declare const PAGES_PATH: string;
declare const INJECTSCRIPT = "\n                      <script >if (globalThis === undefined) { var globalThis = window; }</script>\n                      ";
export { CWD, PAGES_PATH, INJECTSCRIPT };
