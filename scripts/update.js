const path = require("path");

async function runUpdateCommands() {
  const updateCommands = require(path.resolve(__dirname, "update/commands.js"));
  await updateCommands();
}

async function runUpdateShop() {
  const updateShop = require(path.resolve(__dirname, "update/shop.js"));
  await updateShop();
}

async function main() {
  const [, , subCommand] = process.argv;

  if (!subCommand) {
    console.error("Usage: npm run update -- <commands|c|shop|s>");
    process.exit(1);
  }

  switch (subCommand.toLowerCase()) {
    case "commands":
    case "c":
      await runUpdateCommands();
      break;

    case "shop":
    case "s":
      await runUpdateShop();
      break;

    default:
      console.error(`Unknown update target: '${subCommand}'`);
      process.exit(1);
  }

  console.log("✅ Update complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Update failed:", err);
  process.exit(1);
});
