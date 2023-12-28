/**
 * This script checks the messages.json files for each locale to ensure that
 * the application's translated name and description fields are not too long.
 *
 * These requirements are necessary for the extension to be accepted by the
 * Safari Extension Gallery.
 */
const fs = require("fs");
const path = require("path");

// Get the list of locale directories
const localeDirs = fs.readdirSync("./_locales");

localeDirs.forEach((dir) => {
  // Read the messages.json file for each locale
  const messages = require(path.join(
    __dirname,
    "_locales",
    dir,
    "messages.json"
  ));

  // Check each message
  for (const [key, value] of Object.entries(messages)) {
    if (key === "appName" && value.message.length > 40) {
      console.log(
        `Locale: ${dir}, Message: ${key}, app name is too long (${value.message.length}): ${value.message}`
      );
    } else if (key === "appDescription" && value.message.length > 112) {
      console.log(
        `Locale: ${dir}, Message: ${key}, app description is too long (${value.message.length}): ${value.message}`
      );
    }
  }
});
