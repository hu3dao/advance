// src/common/constant.ts
import { fileURLToPath } from "url";
import { resolve } from "path";
var CWD = process.cwd();
var __dirname = fileURLToPath(import.meta.url);
var TEMPLATES = resolve(__dirname, "../../templates");
var DEFAULT_PROJECT_NAME = "ad-app";

export {
  CWD,
  __dirname,
  TEMPLATES,
  DEFAULT_PROJECT_NAME
};
