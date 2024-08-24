const archiver = require("archiver");
const fs = require("fs-extra");

async function createZip(sourceDir, outputZipFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipFile);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Set the compression level
    });

    output.on("close", () => {
      console.log(`Zip file created: ${outputZipFile} (${archive.pointer()} total bytes)`);
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    // Pipe the archive data to the output file
    archive.pipe(output);

    // Append files from the source directory
    archive.directory(sourceDir, false); // 'false' means no prefix, so './' will be the top-level directory

    // Finalize the archive (this is important)
    archive.finalize();
  });
}

module.exports = {
  createZip,
};
