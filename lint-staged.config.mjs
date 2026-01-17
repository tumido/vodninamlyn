import path from "path";

const buildEslintCommand = (filenames) =>
  `npm run lint -- --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(" ")}`;

const lintStagedConfig = {
  "*": [buildEslintCommand, "prettier --ignore-unknown --write"],
};

export default lintStagedConfig;
