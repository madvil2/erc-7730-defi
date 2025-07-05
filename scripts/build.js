const fs = require("fs");
const path = require("path");
const { findJsonFiles } = require("./validate");

function extractMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    return {
      id: data.context.$id,
      file: path.relative(process.cwd(), filePath),
      owner: data.metadata?.owner || "Unknown",
      url: data.metadata?.info?.url || "",
      deploymentDate: data.metadata?.info?.deploymentDate || "",
      chains: data.context.contract.deployments?.map((d) => d.chainId) || [],
      functions: Object.keys(data.display?.formats || {}),
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

function generateRegistry() {
  console.log("🏗️  Building ERC-7730 registry...");

  const protocolsDir = path.join(__dirname, "..", "protocols");
  const jsonFiles = findJsonFiles(protocolsDir);

  console.log(`📁 Processing ${jsonFiles.length} files...`);

  const registry = {
    version: "1.0.0",
    generated: new Date().toISOString(),
    count: 0,
    protocols: [],
  };

  for (const file of jsonFiles) {
    const metadata = extractMetadata(file);
    if (metadata) {
      registry.protocols.push(metadata);
      registry.count++;
    }
  }

  registry.protocols.sort((a, b) => a.id.localeCompare(b.id));

  const registryPath = path.join(__dirname, "..", "registry.json");
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));

  console.log(`✅ Registry generated: ${registryPath}`);
  console.log(`📊 Total protocols: ${registry.count}`);

  return registry;
}

function generateSummary(registry) {
  console.log("📝 Generating summary...");

  const chainNames = {
    1: "Ethereum",
    10: "Optimism",
    56: "BSC",
    137: "Polygon",
    42161: "Arbitrum",
  };

  let markdown = `# ERC-7730 DeFi Protocol Registry\n\n`;
  markdown += `Generated on: ${new Date(
    registry.generated
  ).toLocaleString()}\n\n`;
  markdown += `Total protocols: **${registry.count}**\n\n`;

  const chainCounts = {};
  registry.protocols.forEach((protocol) => {
    protocol.chains.forEach((chainId) => {
      chainCounts[chainId] = (chainCounts[chainId] || 0) + 1;
    });
  });

  markdown += `## Chain Distribution\n\n`;
  Object.entries(chainCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([chainId, count]) => {
      const chainName = chainNames[chainId] || `Chain ${chainId}`;
      markdown += `- **${chainName}**: ${count} protocols\n`;
    });

  markdown += `\n## Protocols\n\n`;

  registry.protocols.forEach((protocol) => {
    markdown += `### ${protocol.id}\n\n`;
    markdown += `- **Owner**: ${protocol.owner}\n`;
    if (protocol.url) {
      markdown += `- **Website**: [${protocol.url}](${protocol.url})\n`;
    }
    if (protocol.deploymentDate) {
      markdown += `- **Deployment**: ${new Date(
        protocol.deploymentDate
      ).toLocaleDateString()}\n`;
    }
    markdown += `- **File**: \`${protocol.file}\`\n`;
    markdown += `- **Chains**: ${protocol.chains
      .map((id) => chainNames[id] || `Chain ${id}`)
      .join(", ")}\n`;
    markdown += `- **Functions**: ${protocol.functions.length}\n`;

    if (protocol.functions.length > 0) {
      markdown += `\n**Supported Functions:**\n`;
      protocol.functions.forEach((func) => {
        markdown += `- \`${func}\`\n`;
      });
    }

    markdown += `\n`;
  });

  const summaryPath = path.join(__dirname, "..", "PROTOCOLS.md");
  fs.writeFileSync(summaryPath, markdown);

  console.log(`✅ Summary generated: ${summaryPath}`);
}

function build() {
  try {
    const registry = generateRegistry();
    generateSummary(registry);
    console.log("🎉 Build completed successfully!");
  } catch (error) {
    console.error("💥 Build failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  build();
}

module.exports = { build, generateRegistry, generateSummary };
