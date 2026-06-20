/**
 * About-tab panel — the first settings tab rendered with Preact.
 *
 * A faithful render of the former about.html?raw template: same element IDs,
 * classes, `data-i18n` keys, and `data-lucide` icons, so the existing passes
 * that run after render are untouched — StatusService polls `#application-status`
 * / `#application-status-detail`, the i18n pass swaps `data-i18n` text, and
 * lucide replaces the `<i data-lucide>` placeholders. This component only owns
 * the static structure; live status stays in StatusService.
 */
export function AboutPanel() {
  return (
    <>
      <h2 class="panel-heading" data-i18n="sectionHeadingAbout">
        About
      </h2>

      <section id="application-status">
        <div class="status-container">
          <div class="status">
            <p class="message unknown" data-i18n="checkingApplicationStatus">
              Checking on our servers...
            </p>
          </div>
        </div>
      </section>
      <section id="application-status-detail" class="hidden issue"></section>

      <section id="about-saypi" class="about-saypi">
        <div>
          <p data-i18n="aboutSayPiDescription">
            Say, Pi brings rich, voice-first conversational experiences to
            popular AI chatbots, with real-time dictation, transcription, and
            agent tools for power users.
          </p>
          <div class="about-links">
            <a
              href="https://www.saypi.ai"
              data-i18n="aboutSayPiWebsite"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit saypi.ai
            </a>
            <a
              href="https://www.saypi.ai/blog"
              data-i18n="aboutSayPiBlog"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the blog
            </a>
            <a
              href="https://www.saypi.ai/support"
              data-i18n="aboutSayPiSupport"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get support
            </a>
          </div>

          <div class="social-links">
            <a
              href="mailto:info@saypi.ai"
              target="_blank"
              rel="noopener noreferrer"
              title="Email us"
            >
              <i data-lucide="mail"></i>
            </a>
            <a
              href="https://x.com/saypi_ai"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on X/Twitter"
            >
              <i data-lucide="twitter"></i>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61554182755176"
              target="_blank"
              rel="noopener noreferrer"
              title="Like us on Facebook"
            >
              <i data-lucide="facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/saypi_ai"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Instagram"
            >
              <i data-lucide="instagram"></i>
            </a>
            <a
              href="https://www.youtube.com/@saypi_ai"
              target="_blank"
              rel="noopener noreferrer"
              title="Subscribe on YouTube"
            >
              <i data-lucide="youtube"></i>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
