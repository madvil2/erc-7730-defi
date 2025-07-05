const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const https = require("https");

function fetchSchema() {
  return new Promise((resolve, reject) => {
    const url =
      "https://eips.ethereum.org/assets/eip-7730/erc7730-v1.schema.json";
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const schema = JSON.parse(data);
            resolve(schema);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function findJsonFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findJsonFiles(fullPath));
    } else if (path.extname(item) === ".json") {
      files.push(fullPath);
    }
  }

  return files;
}

function validateFile(filePath, schema, ajv) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    const validate = ajv.compile(schema);
    const valid = validate(data);

    return {
      file: filePath,
      valid,
      errors: validate.errors || [],
    };
  } catch (error) {
    return {
      file: filePath,
      valid: false,
      errors: [{ message: `Parse error: ${error.message}` }],
    };
  }
}

async function validateAll() {
  console.log("🔍 Starting ERC-7730 validation...");

  try {
    console.log("📥 Fetching ERC-7730 schema...");
    const schema = await fetchSchema();
    console.log("✅ Schema fetched successfully");

    const ajv = new Ajv({
      allErrors: true,
      strict: false,
      validateSchema: false,
      addUsedSchema: false,
    });

    const protocolsDir = path.join(__dirname, "..", "protocols");
    const jsonFiles = findJsonFiles(protocolsDir);

    console.log(`📁 Found ${jsonFiles.length} JSON files to validate`);

    let validCount = 0;
    let invalidCount = 0;

    for (const file of jsonFiles) {
      const result = validateFile(file, schema, ajv);
      const relativePath = path.relative(process.cwd(), result.file);

      if (result.valid) {
        console.log(`✅ ${relativePath}`);
        validCount++;
      } else {
        console.log(`❌ ${relativePath}`);
        result.errors.forEach((error) => {
          console.log(`   - ${error.instancePath || "root"}: ${error.message}`);
        });
        invalidCount++;
      }
    }

    console.log("\n📊 Validation Summary:");
    console.log(`✅ Valid files: ${validCount}`);
    console.log(`❌ Invalid files: ${invalidCount}`);
    console.log(`📁 Total files: ${jsonFiles.length}`);

    if (invalidCount > 0) {
      console.log("\n❌ Validation failed. Please fix the errors above.");
      process.exit(1);
    } else {
      console.log("\n🎉 All files are valid!");
    }
  } catch (error) {
    console.error("💥 Validation failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  validateAll();
}

module.exports = { validateAll, validateFile, findJsonFiles };
