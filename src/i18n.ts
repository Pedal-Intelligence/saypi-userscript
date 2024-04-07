import { UserPreferenceModule } from "./prefs/PreferenceModule";

// Define a type for our messages
type Messages = { [key: string]: { message: string; description: string } };

// We'll start with an empty messages object
let messages: { [key: string]: Messages } = {};

// This function attempts to load messages for a given locale
async function loadMessages(locale: string) {
  try {
    messages[locale] = await import(`../_locales/${locale}/messages.json`);
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
  }
}

function getLocalMessage(
  locale: string,
  messageName: string,
  substitutions?: string | string[] | undefined
): string {
  // if the locale is not in the messages object, default to English
  if (!messages[locale]) {
    locale = "en";
  }
  // if the message is not in the locale object, default to the message name and log an error
  if (!messages[locale][messageName]) {
    console.error(
      `Message not found for locale: ${locale} and message name: ${messageName}`
    );
    return messageName;
  } else {
    const rawMessage = messages[locale][messageName].message;
    if (substitutions) {
      return rawMessage.replace("$1", substitutions.toString());
    } else {
      return rawMessage;
    }
  }
}

// Call this function to initialize the messages
function convertLanguageToLocale(language: string): string {
  return language.split("_")[0];
}

function getMessage(
  messageName: string,
  substitutions?: string | string[] | undefined
): string {
  // Check if running as a Chrome extension
  if (typeof chrome !== "undefined" && chrome.i18n) {
    return chrome.i18n.getMessage(messageName, substitutions);
  } else {
    // Fallback for userscript
    UserPreferenceModule.getLanguage()
      .then((lang) => {
        let locale = convertLanguageToLocale(lang);
        if (!messages[locale]) {
          loadMessages(locale);
        }
        return getLocalMessage(locale, messageName);
      })
      .catch((error) => {
        console.error(`Failed to get language preference`, error);
        let locale = "en";
        if (!messages[locale]) {
          loadMessages(locale);
        }
        return getLocalMessage(locale, messageName);
      });
  }
  return messageName;
}

export default getMessage;
