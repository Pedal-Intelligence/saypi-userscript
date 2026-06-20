/**
 * Chat-tab panel (Preact).
 *
 * Faithful render of the former chat.html?raw: same element IDs, classes,
 * `data-i18n` / `data-i18n-attr` / `data-i18n-skip` keys, and `data-lucide`
 * placeholders, so the imperative wiring that runs after mount is untouched —
 * the ChatTab controller binds `#assistant-nickname` / `#allow-interruptions` /
 * `#chatgpt-auto-read-aloud` and `SubmitModeController` drives
 * `#submit-mode-selector` (`#submitModeRange`, `#submitModeValue`, the
 * `#auto/#agent/#off` icons, and the `.description` nodes), while the
 * orchestrator's i18n + lucide passes run post-mount.
 *
 * `slider-value` is a non-standard attribute (not typed by Preact JSX); it is
 * applied via a ref to keep the markup byte-faithful.
 */
function setSliderValue(value: string) {
  return (el: HTMLSpanElement | null) => {
    if (el) el.setAttribute("slider-value", value);
  };
}

export function ChatPanel() {
  return (
    <>
      <h2 class="panel-heading" data-i18n="sectionHeadingChat">
        AI Chat
      </h2>

      <div
        id="submit-mode-selector"
        class="w-full max-w-lg user-preference-item mode-selector"
      >
        <div>
          <div class="flex justify-between mb-2">
            <span
              class="icon"
              data-i18n-attr="aria-label:ariaLabelRocket"
              aria-label="Rocket"
              id="auto"
              ref={setSliderValue("0")}
            >
              <span class="icon-circle">
                <i data-lucide="zap"></i>
              </span>
            </span>
            <span
              class="icon"
              data-i18n-attr="aria-label:ariaLabelRobot"
              aria-label="Robot"
              id="agent"
              ref={setSliderValue("1")}
            >
              <span class="icon-circle">
                <i data-lucide="bot"></i>
              </span>
            </span>
            <span
              class="icon"
              data-i18n-attr="aria-label:ariaLabelHand"
              aria-label="Hand"
              id="off"
              ref={setSliderValue("2")}
            >
              <span class="icon-circle">
                <i data-lucide="hand"></i>
              </span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            value="0"
            class="slider w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            id="submitModeRange"
            data-i18n-attr="title:submitModeControl"
            title="Select when to submit your messages"
          />
        </div>
        <div
          id="submitModeValue"
          class="mt-2 text-lg font-semibold text-gray-700"
          data-i18n="submit_mode_auto"
        >
          auto
        </div>
        <div class="description" data-i18n="submit_mode_auto_description">
          Automatically submit when you stop speaking
        </div>
        <div
          class="description"
          data-i18n="submit_mode_agent_description"
          data-i18n-skip="true"
        >
          Assistant decides when to respond based on context
        </div>
        <div class="description" data-i18n="submit_mode_off_description">
          Only submit when you press the button
        </div>
      </div>

      <div class="user-preference-item w-full max-w-lg" id="nickname-preference">
        <label class="wraper" for="assistant-nickname">
          <span class="label-text" data-i18n="nicknameLabel">
            Nickname
          </span>
          <div class="control">
            <input
              type="text"
              id="assistant-nickname"
              name="assistantNickname"
              class="px-2 py-1 border rounded w-20 text-sm text-right"
              data-i18n-attr="placeholder:nicknamePlaceholder"
              placeholder="Pi"
            />
          </div>
        </label>
      </div>

      <div
        class="user-preference-item w-full max-w-lg"
        id="allow-interruptions-preference"
      >
        <label class="wraper" for="allow-interruptions">
          <span class="label-text" data-i18n="allowInterruptions">
            Interruptible
          </span>
          <div class="switch-wrap control">
            <input
              type="checkbox"
              id="allow-interruptions"
              name="allowInterruptions"
            />
            <div class="switch"></div>
          </div>
        </label>
      </div>

      <div
        class="user-preference-item w-full max-w-lg"
        id="chatgpt-auto-read-aloud-preference"
      >
        <label class="wraper" for="chatgpt-auto-read-aloud">
          <span class="label-text" data-i18n="chatgptAutoReadAloud">
            Auto Read Aloud (ChatGPT)
          </span>
          <div class="switch-wrap control">
            <input
              type="checkbox"
              id="chatgpt-auto-read-aloud"
              name="chatgptAutoReadAloud"
            />
            <div class="switch"></div>
          </div>
        </label>
        <div class="description">
          Autoplay during voice calls. No effect when typing.
        </div>
      </div>
    </>
  );
}
