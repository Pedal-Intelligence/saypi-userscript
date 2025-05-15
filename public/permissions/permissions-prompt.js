// ==UserScript==
// @name         Say, Pi
// @name:zh-CN   说，Pi 
// @namespace    http://www.saypi.ai/
// @version      1.7.0
// @description  Seamless speech-to-text enhancement for Pi, the conversational AI. Enjoy hands-free, high-accuracy conversations in any language.
// @description:zh-CN  为Pi聊天机器人提供无手操作的高精度语音转文字功能，支持多种语言。
// @author       Ross Cadogan
// @match        https://pi.ai/talk
// @inject-into  page
// @updateURL    https://app.saypi.ai/saypi.user.js
// @downloadURL  https://app.saypi.ai/saypi.user.js
// @license      MIT
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/permissions/permissions-prompt.ts":
/*!***********************************************!*\
  !*** ./src/permissions/permissions-prompt.ts ***!
  \***********************************************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/permissions/permissions-prompt.ts
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const statusElement = document.getElementById('status');
    if (!statusElement) {
        console.error("[PermissionsPrompt] Status element not found in the DOM.");
        chrome.runtime.sendMessage({
            type: 'PERMISSION_PROMPT_RESULT',
            granted: false,
            error: "Permissions prompt page DOM failed to load correctly."
        }, () => { chrome.runtime.lastError && console.error("[PermissionsPrompt] Error sending critical DOM failure message:", chrome.runtime.lastError.message); });
        return;
    }
    console.log("[PermissionsPrompt] Requesting microphone permission...");
    statusElement.textContent = "Requesting microphone permission...";
    try {
        const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("[PermissionsPrompt] Microphone permission GRANTED.");
        statusElement.textContent = "Permission granted. Closing soon...";
        stream.getTracks().forEach(track => track.stop());
        chrome.runtime.sendMessage({
            type: 'PERMISSION_PROMPT_RESULT',
            granted: true
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("[PermissionsPrompt] Error sending GRANT message:", chrome.runtime.lastError.message);
            }
            setTimeout(() => window.close(), 1500);
        });
    }
    catch (err) {
        console.error("[PermissionsPrompt] Microphone permission DENIED or error:", err.name, err.message);
        statusElement.textContent = `Permission denied or error: ${err.name || 'Unknown Error'}. Closing soon...`;
        chrome.runtime.sendMessage({
            type: 'PERMISSION_PROMPT_RESULT',
            granted: false,
            error: err.message || err.name || "Unknown error during permission request"
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("[PermissionsPrompt] Error sending DENY/ERROR message:", chrome.runtime.lastError.message);
            }
            setTimeout(() => window.close(), 2500);
        });
    }
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/permissions/permissions-prompt.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxFQUFDLENBQUM7Ozs7Ozs7O1VFaERIO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3Blcm1pc3Npb25zL3Blcm1pc3Npb25zLXByb21wdC50cyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL3Blcm1pc3Npb25zL3Blcm1pc3Npb25zLXByb21wdC50c1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGFzeW5jICgpID0+IHtcbiAgY29uc3Qgc3RhdHVzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKTtcbiAgaWYgKCFzdGF0dXNFbGVtZW50KSB7XG4gICAgY29uc29sZS5lcnJvcihcIltQZXJtaXNzaW9uc1Byb21wdF0gU3RhdHVzIGVsZW1lbnQgbm90IGZvdW5kIGluIHRoZSBET00uXCIpO1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgIHR5cGU6ICdQRVJNSVNTSU9OX1BST01QVF9SRVNVTFQnLFxuICAgICAgZ3JhbnRlZDogZmFsc2UsXG4gICAgICBlcnJvcjogXCJQZXJtaXNzaW9ucyBwcm9tcHQgcGFnZSBET00gZmFpbGVkIHRvIGxvYWQgY29ycmVjdGx5LlwiXG4gICAgfSwgKCkgPT4geyBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IgJiYgY29uc29sZS5lcnJvcihcIltQZXJtaXNzaW9uc1Byb21wdF0gRXJyb3Igc2VuZGluZyBjcml0aWNhbCBET00gZmFpbHVyZSBtZXNzYWdlOlwiLCBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7IH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiW1Blcm1pc3Npb25zUHJvbXB0XSBSZXF1ZXN0aW5nIG1pY3JvcGhvbmUgcGVybWlzc2lvbi4uLlwiKTtcbiAgc3RhdHVzRWxlbWVudC50ZXh0Q29udGVudCA9IFwiUmVxdWVzdGluZyBtaWNyb3Bob25lIHBlcm1pc3Npb24uLi5cIjtcblxuICB0cnkge1xuICAgIGNvbnN0IHN0cmVhbSA9IGF3YWl0IG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSk7XG4gICAgY29uc29sZS5sb2coXCJbUGVybWlzc2lvbnNQcm9tcHRdIE1pY3JvcGhvbmUgcGVybWlzc2lvbiBHUkFOVEVELlwiKTtcbiAgICBzdGF0dXNFbGVtZW50LnRleHRDb250ZW50ID0gXCJQZXJtaXNzaW9uIGdyYW50ZWQuIENsb3Npbmcgc29vbi4uLlwiO1xuXG4gICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdHJhY2suc3RvcCgpKTtcblxuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgIHR5cGU6ICdQRVJNSVNTSU9OX1BST01QVF9SRVNVTFQnLFxuICAgICAgZ3JhbnRlZDogdHJ1ZVxuICAgIH0sICgpID0+IHtcbiAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltQZXJtaXNzaW9uc1Byb21wdF0gRXJyb3Igc2VuZGluZyBHUkFOVCBtZXNzYWdlOlwiLCBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5jbG9zZSgpLCAxNTAwKTtcbiAgICB9KTtcblxuICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJbUGVybWlzc2lvbnNQcm9tcHRdIE1pY3JvcGhvbmUgcGVybWlzc2lvbiBERU5JRUQgb3IgZXJyb3I6XCIsIGVyci5uYW1lLCBlcnIubWVzc2FnZSk7XG4gICAgc3RhdHVzRWxlbWVudC50ZXh0Q29udGVudCA9IGBQZXJtaXNzaW9uIGRlbmllZCBvciBlcnJvcjogJHtlcnIubmFtZSB8fCAnVW5rbm93biBFcnJvcid9LiBDbG9zaW5nIHNvb24uLi5gO1xuICAgIFxuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgIHR5cGU6ICdQRVJNSVNTSU9OX1BST01QVF9SRVNVTFQnLFxuICAgICAgZ3JhbnRlZDogZmFsc2UsXG4gICAgICBlcnJvcjogZXJyLm1lc3NhZ2UgfHwgZXJyLm5hbWUgfHwgXCJVbmtub3duIGVycm9yIGR1cmluZyBwZXJtaXNzaW9uIHJlcXVlc3RcIlxuICAgIH0sICgpID0+IHtcbiAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltQZXJtaXNzaW9uc1Byb21wdF0gRXJyb3Igc2VuZGluZyBERU5ZL0VSUk9SIG1lc3NhZ2U6XCIsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LmNsb3NlKCksIDI1MDApO1xuICAgIH0pO1xuICB9XG59KTsgIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9wZXJtaXNzaW9ucy9wZXJtaXNzaW9ucy1wcm9tcHQudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==