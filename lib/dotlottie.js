const fs = require("fs-extra");
const path = require("path");
const { createZip } = require("./zip");

async function createDotLottie(lottieFile, outputFileName = null) {
  // Define the temporary directory
  const tempDir = path.join("/tmp", `delottie-${Date.now()}`);
  baseName = path.basename(lottieFile);
  outputFileName = outputFileName || lottieFile.replace("-clean", "").replace(".json", ".lottie");

  try {
    // Create the temporary directory
    await fs.ensureDir(tempDir);

    // Create the manifest.json file
    const manifest = {
      generator: "delottie 1.0",
      version: 1.0,
      revision: 1,
      author: "~",
      animations: [
        {
          id: baseName.replace(".json", ""),
          speed: 1.0,
          themeColor: "#ffcc00",
          loop: true,
        },
      ],
    };

    await fs.writeJson(path.join(tempDir, "manifest.json"), manifest, { spaces: 2 });
    const animationsDir = path.join(tempDir, "animations");
    await fs.ensureDir(animationsDir);
    await fs.copy(lottieFile, path.join(animationsDir, baseName));

    console.log(`dotLottie structure created at: ${tempDir}`);

    // Create the .lottie file
    await createZip(tempDir, outputFileName);
    return outputFileName;
  } catch (error) {
    console.error("Error creating dotLottie structure:", error);
  }
}

module.exports = {
  createDotLottie,
};
