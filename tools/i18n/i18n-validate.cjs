#!/usr/bin/env node
/**
 * This script checks the messages.json files for each locale to ensure that
 * the application's translated name and description fields are not too long.
 *
 * These requirements are necessary for the extension to be accepted by the
 * Safari Extension Gallery.
 */
const fs = require("fs");
const path = require("path");

// Calculate the path to the root-level _locales directory
// Script is in tools/i18n/, so we need to go up two levels
const rootLocalesPath = path.resolve(__dirname, '..', '..', '_locales');

// Recursively read all files in a directory
function readFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let i18nFiles = [];
  files.forEach((file) => {
    if (file.isDirectory()) {
      i18nFiles = i18nFiles.concat(readFiles(path.join(dir, file.name)));
    } else if (file.name === "messages.json") {
      i18nFiles.push(path.join(dir, file.name));
    }
  });
  return i18nFiles;
}

// Validate i18n files
function validateI18nFiles(dir) {
  const i18nFiles = readFiles(dir);
  i18nFiles.forEach((file) => {
    const content = JSON.parse(fs.readFileSync(file));
    Object.keys(content).forEach((key) => {
      const messageObj = content[key];
      const placeholdersInMessage = (
        messageObj.message.match(/\$.*?\$/g) || []
      ).map((p) => p.slice(1, -1));
      placeholdersInMessage.forEach((placeholder) => {
        if (!messageObj.placeholders || !messageObj.placeholders[placeholder]) {
          console.error(
            `Missing placeholder "${placeholder}" in key "${key}" in file ${file}`
          );
          process.exit(1);
        } else if (
          !/^\$\d+$/.test(messageObj.placeholders[placeholder].content)
        ) {
          console.error(
            `Invalid content for placeholder "${placeholder}" in key "${key}" in file ${file}`
          );
          process.exit(1);
        }
      });
    });
  });
}

function validateMessageLengths(dir) {
  // Get the list of locale directories
  const localeDirs = fs.readdirSync(dir);

  localeDirs.forEach((localeDir) => {
    // Read the messages.json file for each locale
    const messages = require(path.join(
      dir,
      localeDir,
      "messages.json"
    ));

    // Check each message
    for (const [key, value] of Object.entries(messages)) {
      if (key === "appName" && value.message.length > 40) {
        console.log(
          `Locale: ${localeDir}, Message: ${key}, app name is too long (${value.message.length}): ${value.message}`
        );
        process.exit(1);
      } else if (key === "appDescription" && value.message.length > 112) {
        console.log(
          `Locale: ${localeDir}, Message: ${key}, app description is too long (${value.message.length}): ${value.message}`
        );
        process.exit(1);
      }
    }
  });
}

// Run validation
validateI18nFiles(rootLocalesPath);
validateMessageLengths(rootLocalesPath);
