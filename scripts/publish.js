import { exec } from "node:child_process";
import { parseArgs } from "node:util";

const args = parseArgs({
  options: {
    message: { type: "string", default: "publish", short: "m" },
    force: { type: "boolean", default: false, short: "f" },
  },
});

const command = `
  pnpm exec qiita publish --all ${args.values.force ? "--force" : ""}
  git add zeta/*.md articles/*.md public/*.md images/*

  if ! git diff --staged --exit-code --quiet; then
    git commit -m ${args.values.message}
    git push ${args.values.force ? "--force-with-lease" : ""}
  fi
`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.error(stderr);
  }
});
