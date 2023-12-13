// Define a type for our messages
type Messages = { [key: string]: { message: string, description: string } };

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

function getLocalMessage(locale: string, messageName: string): string {
  // if the locale is not in the messages object, default to English
  if (!messages[locale]) {
    locale = 'en';
  }
  // if the message is not in the locale object, default to the message name and log an error
  if (!messages[locale][messageName]) {
    console.error(`Message not found for locale: ${locale} and message name: ${messageName}`);
    return messageName;
  } else {
    return messages[locale][messageName].message;
  }
}

// Call this function to initialize the messages
function convertLanguageToLocale(language: string): string {
    return language.split('_')[0];
}

function getMessage(messageName: string): string {
  // Check if running as a Chrome extension
  if (typeof chrome !== "undefined" && chrome.i18n) {
    return chrome.i18n.getMessage(messageName);
  } else {
    // Fallback for userscript
    let locale = convertLanguageToLocale(navigator.language);
    if (!messages[locale]) {
      loadMessages(locale);
    }
    return getLocalMessage(locale, messageName);
  }
}

export default getMessage;
