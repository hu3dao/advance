// src/common/utils.ts
import fs from "fs-extra";
var formatProjectName = (projectName) => {
  return projectName.trim();
};
var isEmpty = (path) => {
  const files = fs.readdirSync(path);
  return files.length === 0 || files.length === 1 && files[0] === ".git";
};

export {
  formatProjectName,
  isEmpty
};
