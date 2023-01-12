import fs from "fs-extra";

export const formatProjectName = (projectName: string) => {
  return projectName.trim();
};

export const isEmpty = (path: string) => {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
};
