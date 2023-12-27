/**
 * This script checks the messages.json files for each locale to ensure that
 * each message has a description and that the description is not too long.
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
    if (value.description && value.description.length > 112) {
      console.log(
        `Locale: ${dir}, Message: ${key}, Description is too long: ${value.description.length}`
      );
    } else if (!value.description) {
      console.log(
        `Locale: ${dir}, Message: ${key} does not have a description.`
      );
    }
  }
});
