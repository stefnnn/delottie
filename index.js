#!/usr/bin/env node

const yargs = require("yargs");
const { delottie } = require("./lib/delottie");
const { createDotLottie } = require("./lib/dotlottie");

function parseArgs() {
  const argv = yargs
    .usage("Usage: $0 [options] <filenames..>")
    .option("clean", {
      alias: "c",
      type: "boolean",
      description: "Clean the Lottie file from watermarks",
    })
    .option("overwrite", {
      alias: "o",
      type: "boolean",
      description: "Overwrite the original file after cleaning",
    })
    .option("zip", {
      alias: "z",
      type: "boolean",
      description: "Create a .lottie dotLottie file",
    })
    .demandCommand(1, "You must provide at least one lottie JSON file.")
    .help().argv;

  return {
    clean: argv.clean || false,
    zip: argv.zip || false,
    overwrite: argv.overwrite || false,
    filenames: argv._, // Positional arguments (filenames)
  };
}

async function main() {
  const { clean, overwrite, zip, filenames } = parseArgs();
  for (let filename of filenames) {
    if (clean) {
      filename = await delottie(filename, overwrite ? filename : filename.replace(".json", "-clean.json"));
    }
    if (zip) {
      const result = await createDotLottie(filename);
      console.log(`dotLottie file created: ${result}`);
    }
  }
}

main();
