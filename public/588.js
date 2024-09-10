"use strict";
(self["webpackChunksaypi_userscript"] = self["webpackChunksaypi_userscript"] || []).push([[588],{

/***/ 7588:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"appName":{"message":"Say, Pi","description":"Назва програми."},"appDescription":{"message":"Ваш голосовий супутник для Pi AI","description":"Опис програми."},"callInProgress":{"message":"Закінчити розмову без використання рук","description":"Підказка, що відображається на кнопці виклику під час виконання виклику."},"callStarting":{"message":"Підключення...","description":"Підказка, що відображається на кнопці виклику, коли виклик починається."},"callNotStarted":{"message":"Розпочніть розмову без використання рук з $chatbot$","description":"Підказка, що відображається на кнопці виклику, перш ніж виклик розпочато.","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"callError":{"message":"Сталася некритична помилка. Не панікуйте, ми все ще слухаємо.","description":"Підказка, що відображається на кнопці виклику, коли виникає некритична помилка."},"mode_speed":{"message":"швидкість","description":"Найшвидший режим транскрибування."},"mode_balanced":{"message":"збалансований","description":"Стандартний режим транскрибування."},"mode_accuracy":{"message":"точність","description":"Режим транскрибування з найвищою точністю."},"preferedModeControl":{"message":"Виберіть бажаний режим транскрибування","description":"Назва (підказка) елемента керування для вибору бажаного режиму транскрибування."},"autoSubmit":{"description":"Мітка для прапорця, що вмикає/вимикає автоматичне надсилання запиту.","message":"Автоматичне надсилання"},"continueUnlocking":{"description":"Інструкції, які повідомляють користувачеві, що робити далі, коли вони почали натискати кнопку розблокування.","message":"Продовжуйте утримувати, щоб розблокувати..."},"lockButton":{"description":"Назва (підказка) кнопки для блокування екрану від випадкових дотиків.","message":"Натисніть, щоб заблокувати екран"},"lockedScreen":{"description":"Повідомлення, яке відображається на видному місці, коли екран заблоковано.","message":"Екран заблоковано."},"soundEffects":{"description":"Мітка для прапорця, що вмикає/вимикає звукові ефекти.","message":"Звукові ефекти"},"unlockButton":{"description":"Назва (підказка) кнопки для розблокування екрану.","message":"Натисніть, щоб розблокувати екран"},"unlockInstruction":{"description":"Інструкції, які повідомляють користувачеві, як розблокувати екран, коли він заблокований.","message":"Тримайте, щоб розблокувати."},"preferedLanguage":{"message":"Мова","description":"Мітка для елемента керування, що вибирає бажану мову транскрипції."},"audioConnected":{"description":"Повідомлення, що відображається, коли мікрофон підключено","message":"$microphone$ підключено","placeholders":{"microphone":{"content":"$1","example":"Default - MacBook Pro Microphone"}}},"audioInputError":{"description":"Повідомлення, що відображається, коли аудіо дає порожню транскрипцію - зазвичай це результат фільтрації.","message":"Ой, $chatbot$ цього не зрозумів. Можете повторити?","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"audioReconnecting":{"description":"Повідомлення, що відображається при підключенні нового мікрофону","message":"Перехід на $microphone$...","placeholders":{"microphone":{"content":"$1","example":"Default - AirPods Pro"}}},"assistantIsListening":{"description":"Повідомлення, що відображається, коли помічник слухає мовлення.","message":"$chatbot$ слухає...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"toggleThemeToDarkMode":{"description":"Напис для кнопки переключення в темний режим.","message":"Перейти в темний режим"},"toggleThemeToLightMode":{"description":"Мітка для кнопки переключення на світлий режим.","message":"Перейти в світлий режим"},"consentAskParticipate":{"message":"Чи хотіли б ви взяти участь?"},"consentBetterTogether":{"message":"Давайте разом покращимо Say, Pi"},"consentDataDeidentified":{"message":"Аналітика не пов\'язана з окремими особами. Використовувані дані є анонімними."},"consentNoPii":{"message":"Ми не збиратимемо або бачити персональні дані, такі як повідомлення або імена."},"consentNoSale":{"message":"Ми не будемо продавати ваші дані третім особам або використовувати їх для реклами."},"consentOptIn":{"message":"Я в грі!"},"consentOptOut":{"message":"Ні, дякую"},"consentPrivacyParamount":{"message":"Ваша приватність є найважливішою. Все, що ви говорите, залишається між вами та Pi."},"consentRightToRevoke":{"message":"Ви можете змінити свою думку в будь-який час."},"consentSharingPurpose":{"message":"Поділитися даними про ваше використання допоможе нам зрозуміти, як люди користуються Say, Pi, щоб ми могли поліпшити його для всіх."},"consetPrivacyPolicy":{"message":"Читайте нашу Політику конфіденційності"},"shareAnalytics":{"description":"Мітка для прапорця, що вмикає/вимикає обмін аналітикою.","message":"Поділитися аналітикою"},"enterImmersiveModeShort":{"message":"Занурювальний","description":"Текст кнопки для входу в іммерсивний режим на комп\'ютері."},"exitImmersiveModeLong":{"message":"Вийти з іммерсивного режиму","description":"Арія-мітка та назва кнопки для виходу з іммерсивного режиму на мобільних пристроях, повернення до текстового режиму робочого столу."},"enterImmersiveModeLong":{"message":"Увійти в режим занурення","description":"aria-label та назва кнопки для входу в іммерсивний режим на мобільних пристроях."},"applicationStatusIssue":{"description":"Повідомлення для відображення, коли додаток зазнає проблем.","message":"Сповіщення про проблему в системі"},"applicationStatusUnknown":{"description":"Повідомлення для відображення, коли статус програми не може бути визначений. Наприклад, коли клієнт є офлайн.","message":"Статус додатку невідомий"},"checkingApplicationStatus":{"description":"Повідомлення для відображення поки визначається статус системи, наприклад, під час завантаження.","message":"Перевірка статусу додатку..."},"dismissAlert":{"description":"Мітка для кнопки, щоб відхилити сповіщення про проблему системи.","message":"Звільнити"},"recommendedActions":{"description":"Повідомлення, що передує списку рекомендованих дій, які користувач може виконати для усунення відомої проблеми.","message":"У міжчасі, ми рекомендуємо:"},"extensionPopupTitle":{"description":"Назва спливаючого діалогового вікна розширення.","message":"Say, Pi"},"activityCheckButton":{"message":"Так, я все ще тут!","description":"Текст кнопки, що вказує на те, що користувач все ще присутній."},"activityCheckMessage":{"description":"Повідомлення для відображення, коли розмова триває надзвичайно довго.","message":"Вау, це довга розмова. Ти ще тут, чи ми говоримо самі з собою?"},"assistantIsThinking":{"message":"$chatbot$ думає...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}},"description":"Повідомлення, що відображається, коли помічник готує свою відповідь."},"assistantIsSpeaking":{"message":"$chatbot$ говорить...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}},"description":"Повідомлення, що відображається, коли асистент говорить свою відповідь."},"userStartedInterrupting":{"message":"Давайте, $chatbot$ слухає...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}},"description":"Повідомлення, що відображається, коли користувач починає говорити, поки асистент говорить."},"allowInterruptions":{"message":"Переривний","description":"Мітка для прапорця, що дозволяє/забороняє користувачеві переривати відповідь Pi, говорячи."},"currencyUSDAbbreviation":{"description":"Абревіатура для Долара Сполучених Штатів.","message":"USD"},"currentCharges":{"description":"Термін, що використовується для опису поточних зборів (поточна сума), накопичених користувачем.","message":"Поточні збори"},"enableTTS":{"description":"Мітка для прапорця, що вмикає/вимикає текст до мовлення.","message":"Багатомовні голоси"},"enhancedVoice":{"description":"Назва (підказка) для голосів Say, Pi покращені.","message":"Голос покращений $product$","placeholders":{"product":{"content":"$1","example":"Say, Pi"}}},"previewProgress":{"description":"Повідомлення для відображення, коли користувач переглядає функцію, яка має обмеження за кількістю символів.","message":"$count$ символів використано з $limit$","placeholders":{"count":{"content":"$1","example":"123"},"limit":{"content":"$2","example":"500"}}},"previewStatusActive":{"message":"Бета Активна"},"previewStatusCompleted":{"message":"Бета Завершено"},"previewStatusPaused":{"description":"Повідомлення для відображення, коли користувач переглядає функцію, яка була призупинена.","message":"Бета призупинена до $resetDate$","placeholders":{"resetDate":{"content":"$1","example":"2021-12-31"}}},"previewStatusUnknown":{"message":"Не вдається підключитися..."},"readAloudButtonTitle":{"description":"Назва кнопки для читання тексту повідомлення вголос.","message":"Читати вголос"},"ttsCostExplanation":{"description":"Підказка для відображення, коли двигун тексту-до-мови використовується для гучного читання повідомлення, з урахуванням вартості повідомлення.","message":"$product$ стягуватиме $cost$ $currency$ за прослуховування цього повідомлення","placeholders":{"cost":{"content":"$1","example":"0.01"},"currency":{"content":"$2","example":"credits"},"product":{"content":"$3","example":"Say, Pi"}}},"ttsCostExplanationFree":{"description":"Підказка для відображення, коли двигун тексту-до-мови використовується для голосового проголошення повідомлення, і повідомлення є безкоштовним. Може містити назву провайдера.","message":"Це аудіо створено безкоштовно за допомогою Inflection AI","placeholders":{"provider":{"content":"$1","example":"Inflection AI"}}},"ttsPoweredBy":{"description":"Повідомлення для відображення, коли двигун тексту до мови використовується для голосового проголошення повідомлення.","message":"Текст до мови підтримується $ttsEngine$","placeholders":{"ttsEngine":{"content":"$1","example":"ElevenLabs"}}},"copiedButtonTitle":{"message":"Скопійовано!","description":"Назва кнопки, що вказує на те, що текст повідомлення було скопійовано до буфера обміну."},"copyButtonTitle":{"message":"Копіювати","description":"Назва кнопки для копіювання тексту повідомлення в буфер обміну."},"voiceIntroduction_joey":{"message":"Холо! \\nПривет! \\n你好! \\nЯ Пі, ваш помічник ШІ-поліглот. \\nЗавдяки 32 мовам у моєму розпорядженні ми можемо досліджувати ідеї та культури з усього світу. \\nЩо ви думаєте про цей голос?","description":"Вступ для голосу Джої."},"voiceIntroduction_paola":{"message":"Чао! \\nБонжур! \\nПривіт! \\nЯ Пі, і я вільно розмовляю 32 мовами. \\nВід арабської до української, я тут, щоб подолати мовні бар’єри. \\nЯк вам звучить цей голос?","description":"Вступ для голосу Паоли."},"regenerateButtonTitle":{"message":"Генерувати аудіо за $cost$ $currency$","description":"Назва кнопки для регенерації аудіо повідомлення. Може виникнути орієнтовна вартість.","placeholders":{"cost":{"content":"$1","example":"0.01"},"currency":{"content":"$2","example":"credits"}}},"regenerateButtonTitleFree":{"message":"Генерувати аудіо","description":"Назва кнопки для регенерації аудіо повідомлення. Може викликати невизначений витрати."},"assistantIsWriting":{"description":"Повідомлення, яке відображається, коли помічник вводить відповідь.","message":"$chatbot$ пише...","placeholders":{"chatbot":{"content":"$1","example":"Pi"}}},"ttsCostExplanationSayPi":{"description":"Підказка, яка відображається, коли користувач наводить курсор на посилання пояснення вартості.","placeholders":{"product":{"content":"$1","example":"Say, Pi"}},"message":"Дізнайтеся, як $product$ стягує плату за аудіо"}}');

/***/ })

}]);