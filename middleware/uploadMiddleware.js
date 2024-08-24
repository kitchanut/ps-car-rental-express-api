const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Set up Multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ensure the uploads directory exists
const ensureUploadsDir = (uploadsDir) => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const uploadMiddleware = (options) => {
  const { resize, quality, filesFieldName } = options;
  return async (req, res, next) => {
    upload.array(filesFieldName || "files")(req, res, async (err) => {
      if (err) {
        return res.status(400).send("Error uploading files.");
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).send("No files uploaded.");
      }

      const destination = path.join(`uploads/${req.body.location}`);
      ensureUploadsDir(destination);

      try {
        // Process each file
        const processedFiles = await Promise.all(
          req.files.map(async (file) => {
            const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
            const supportedMimeTypes = [
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/tiff",
              "image/gif",
              "image/avif",
            ];

            let outputPath;
            if (supportedMimeTypes.includes(file.mimetype)) {
              const filenameWithoutExtension = path.basename(originalName, path.extname(file.originalname));
              const compressedFilename = `${Date.now()}-${filenameWithoutExtension}.webp`;
              outputPath = path.join(destination, compressedFilename);

              const image = await sharp(file.buffer);

              const metadata = await image.metadata();
              const maxWidth = 1024;
              const maxHeight = 1024;
              if (metadata.width > maxWidth || metadata.height > maxHeight) {
                image.resize(resize || 1024);
              }
              image.webp({ quality: quality || 90 });
              await image.toFile(outputPath);
            } else {
              outputPath = path.join(destination, `${Date.now()}-${originalName}`);
              fs.writeFileSync(outputPath, file.buffer);
            }
            return { ...file, path: outputPath };
          })
        );

        // Attach the processed file paths to the request object
        req.files = processedFiles;

        // Proceed to the next middleware or route handler
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).send("Error processing the images.");
      }
    });
  };
};

module.exports = uploadMiddleware;
