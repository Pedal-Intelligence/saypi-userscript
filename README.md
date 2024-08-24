# Say, Pi Browser Extension

<img src="public/logos/marquee.png" alt="SayPi Logo" width="600">

Enhance your voice interactions with Inflection AI's Pi chatbot with the _Say, Pi_ extension for accurate voice dictation and immersive spoken dialogues.

## Description

`saypi-userscript` is a powerful content script that enhances the voice dictation capabilities of Inflection AI's conversational AI chatbot, Pi. By installing and enabling this script in your web browser, you can have an immersive and interactive spoken dialogue with Pi, on the web at https://pi.ai.

## Assembly

The content script is assembled using Webpack with `npm run build` from the command line in the project directory. This will generate a `saypi.user.js` file in the `/public` directory, bundling together all necessary JavaScript modules and assets.
This `user.js` file is what get packaged as a userscript (with `metadata.txt`) and Chrome extension (with `manifest.json`).

## Demo

[Watch the demo video on YouTube](https://youtu.be/siJAj879ii4)

## Features

- **Accurate Voice Dictation:** _Say, Pi_ leverages advanced speech-to-text technology from OpenAI to provide accurate voice transcription as you speak.
- **Hands-Free Operation:** Once enabled, a "call" button appears on the pi.ai web interface, allowing you to initiate a back-and-forth spoken conversation with Pi effortlessly.
- **Real-time Transcription:** As you speak, your speech is transcribed in real-time and sent to Pi, who responds with both text and audio.
- **Seamless Integration:** The userscript seamlessly integrates with Pi's web platform, ensuring a smooth and natural conversational experience.

## Installation

_Say, Pi_ is a browser extension. Install it from the [Chrome Web Store](https://chromewebstore.google.com/detail/say-pi/glhhgglpalmjjkoiigojligncepccdei?hl=en) or unpacked from this repo.

## Compatibility

The _Say, Pi_ works best on Chromium browsers such as Google Chrome, Microsoft Edge, Arc, and Kiwi Browser.
It also works on Safari on iOS.

## Contribution

We are not currently seeking code contributions to the repo. However, if you have ideas for improvements or bug fixes, feel free to discuss them with us on any of our social or support channels. Let's work together to enhance the voice interaction experience with Pi!

## Testing

This project uses both Jest and Vitest for testing.

Jest is a JavaScript Testing Framework with a focus on simplicity.
Vitest is a test runner designed for Vite. It's used for all ESM and TypeScript modules in this project. You can run Vitest in watch mode with the following command:

```bash
npm run test:vitest:watch
```

## License

This project is licensed under a proprietary commerical license. Some source code is made available in this repo for public review, but it may not be copied, modified, forked or redistributed - see the [LICENSE](LICENSE) file for details.

## Disclaimer

The "_Say, Pi_ is an unofficial enhancement for Pi.ai. Use it responsibly and respect the terms of service of Pi as provided by Inflection AI. We cannot guarantee its compatibility with future updates or changes to Pi platform.

## Contact Us

If you have any questions or comments, we'd love to hear from you! Drop us a message any of the channels below, or find us on the [Pi Party](https://pi.ai/discord) Discord server. 🥧

- Email: info@saypi.ai
- Twitter/X: @saypi_ai
- Facebook: [Say, Pi](https://www.facebook.com/profile.php?id=61554182755176)
