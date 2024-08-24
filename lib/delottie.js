const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

const tagHash = "ba5735bee474b88519e6ce912576e5d5a253e745ff642afd20b01a73932e8298";
const tagLength = 44523;

async function delottie(lottiePath, newPath) {
  try {
    const filePath = path.resolve(lottiePath);
    const data = await fs.readJson(filePath);

    if (!data.layers || !Array.isArray(data.layers)) {
      console.error("No layers found in the JSON file.");
      return;
    }

    // Find and remove the top-most layer with a certain hash and approx length
    const layerToRemove = data.layers.reduce((prev, current) => {
      return prev.ind > current.ind ? prev : current;
    });
    const hash = calcHash(layerToRemove);
    const length = calcLength(layerToRemove);
    const lengthDiff = Math.abs((length - tagLength) / tagLength) * 100;

    if (hash !== tagHash || lengthDiff > 10) {
      console.error("No layer found with the specified hash and approx length.");
      return;
    }
    data.layers = data.layers.filter((layer) => layer.ind !== layerToRemove.ind);

    // Write the updated JSON back to the file
    await fs.writeJson(newPath, data);
    console.log(`Optimized lottie file: ${newPath}`);
    return newPath;
  } catch (error) {
    console.error("Error processing the file:", error);
  }
}

function calcHash(obj) {
  const jsonString = JSON.stringify(obj);
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

function calcLength(obj) {
  return JSON.stringify(obj).length;
}

module.exports = {
  delottie,
};
