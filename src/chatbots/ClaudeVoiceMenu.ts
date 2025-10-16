import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { SpeechSynthesisVoiceRemote } from "../tts/SpeechModel";
import { VoiceSelector, addSvgToButton } from "../tts/VoiceMenu";
import { Chatbot } from "./Chatbot";
import chevronSvgContent from "../icons/claude-chevron.svg";
import volumeSvgContent from "../icons/volume-mid.svg";
import volumeMutedSvgContent from "../icons/volume-muted.svg";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import getMessage from "../i18n";
import { openSettings } from "../popup/popupopener";
import { getJwtManagerSync } from "../JwtManager";
import { getResourceUrl } from "../ResourceModule";
import globeSvgContent from "../icons/lucide-globe.svg";
import marsSvgContent from "../icons/lucide-mars.svg";
import venusSvgContent from "../icons/lucide-venus.svg";
import { logger } from "../LoggingModule";

export class ClaudeVoiceMenu extends VoiceSelector {
  private menuButton: HTMLButtonElement;
  private menuContent: HTMLDivElement;
  // Heuristics to avoid clutter – computed per dataset in populateVoices
  private showAccent: boolean = false;
  private showGender: boolean = false;
  private showPrice: boolean = false;

  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);

    // Initialize properties with placeholder elements - to satisfy TypeScript compiler
    this.menuButton = document.createElement("button");
    this.menuContent = document.createElement("div");

    // for claude, the containing element might be a brand new element, so we will id it ourselves 
    if (!this.element.id) {
      this.element.id = this.getId();
    }

    // Clean up any existing voice selector elements before initializing
    this.cleanupExistingElements(this.element);

    this.initializeVoiceSelector(chatbot);
  }

  getId(): string {
    return "claude-voice-selector";
  }

  getButtonClasses(): string[] {
    return [
      "inline-flex",
      "items-center",
      "justify-center",
      "relative",
      "shrink-0",
      "can-focus",
      "select-none",
      "disabled:pointer-events-none", 
      "disabled:opacity-50",
      "disabled:shadow-none",
      "disabled:drop-shadow-none",
      "h-7",
      "border-0.5",
      "text-text-100",
      "ml-1.5",
      "inline-flex",
      "items-start",
      "gap-[0.175em]",
      "rounded-md",
      "border-transparent",
      "text-sm",
      "opacity-80",
      "transition",
      "hover:opacity-100",
      "disabled:!opacity-80", 
      "sm:ml-0",
      "sm:pb-1",
      "sm:pl-1.5",
      "sm:pr-1",
      "sm:pt-1",
      "hover:bg-bg-100",
      "hover:border-border-400"
    ];
  }

  protected createVoiceButton(
    voice: SpeechSynthesisVoiceRemote | null
  ): HTMLButtonElement {
    const expandButton = document.createElement("button");
    expandButton.classList.add(...this.getButtonClasses());
    expandButton.setAttribute("aria-haspopup", "true");
    expandButton.setAttribute("aria-expanded", "false");
    expandButton.setAttribute("type", "button");
    
    // Add data attribute to indicate if voice is active
    expandButton.setAttribute("data-voice-active", voice ? "true" : "false");

    // Create a div to match Claude's model selector structure
    const contentDiv = document.createElement("div");
    contentDiv.classList.add(
      "font-tiempos",
      "inline-flex",
      "items-center",
      "gap-[3px]",
      "text-[14px]",
      "h-[14px]",
      "leading-none",
    );

    // Use the appropriate volume icon based on voice state
    addSvgToButton(
      contentDiv,
      voice ? volumeSvgContent : volumeMutedSvgContent,
      "voiced-by",
      "block",
      "fill-current",
      "w-4",
      "h-4",
      "mr-1"
    );

    // Add the voice name in a container div
    const nameContainer = document.createElement("div");
    nameContainer.classList.add(
      "flex", 
      "items-center", 
      "gap-[4px]"
    );
    
    const voiceName = document.createElement("span");
    voiceName.classList.add(
      "voice-name",
      "whitespace-nowrap",
      "tracking-tight",
      "select-none"
    );
    voiceName.innerText = voice ? voice.name : getMessage("voiceOff");
    nameContainer.appendChild(voiceName);
    contentDiv.appendChild(nameContainer);
    
    expandButton.appendChild(contentDiv);

    // Add the chevron icon as a separate SVG
    addSvgToButton(
      expandButton,
      chevronSvgContent,
      "chevron",
      "text-text-500",
      "shrink-0",
      "w-3",
      "h-3",
      "ml-1.5"
    );

    expandButton.addEventListener("click", () => {
      this.toggleMenu();
    });
    return expandButton;
  }

  protected createVoiceMenu(): HTMLDivElement {
    const menu = document.createElement("div");
    menu.classList.add(
      "z-50",
      "bg-bg-000",
      "border-0.5",
      "border-border-300",
      "backdrop-blur-xl",
      "rounded-lg",
      "shadow-element",
      "min-w-[160px]",
      "max-h-[280px]",
      "overflow-y-auto",
      "overflow-x-hidden",
      "p-1",
      "voice-menu-content"
    );
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-orientation", "vertical");
    menu.style.display = "none";
    return menu;
  }

  /**
   * Create a menu item for the voice selector
   * @param voice - The voice to create a menu item for
   * @param noVoicesAvailable - Whether any voices are available
   * @returns A menu item element
   */
  protected createMenuItem(
    voice: SpeechSynthesisVoiceRemote | null,
    noVoicesAvailable: boolean = false
  ): HTMLDivElement {
    const item = document.createElement("div");
    item.classList.add(
      "py-1",
      "px-2",
      "rounded-md",
      "cursor-pointer",
      "whitespace-nowrap",
      "overflow-hidden",
      "text-ellipsis",
      "grid",
      "grid-cols-[minmax(0,_1fr)_auto]",
      "gap-2",
      "items-center",
      "outline-none",
      "select-none",
      "[&[data-highlighted]]:bg-bg-400",
      "[&[data-highlighted]]:text-text-000",
      "group",
      "pr-1",
      "hover:bg-bg-300"
    );
    item.setAttribute("role", "menuitem");
    item.setAttribute("tabindex", "-1");

    // Store voice data on the element for reliable identification
    if (voice) {
      item.dataset.voiceName = voice.name;
    } else {
      item.dataset.voiceName = "voice-off";
    }

    // Check if this is a sign-in prompt item
    const jwtManager = getJwtManagerSync();
    const isAuthenticated = jwtManager.isAuthenticated();
    const isSignInPrompt = !voice && noVoicesAvailable && !isAuthenticated;
    const claims = jwtManager.getClaims();
    const hasTTSQuota = claims?.ttsQuotaRemaining && claims.ttsQuotaRemaining > 0;
    const isUpgradePrompt = !voice && isAuthenticated && !hasTTSQuota;
    
    if (isSignInPrompt) {
      // Mark this as a sign-in item for handling in click events
      item.dataset.action = "sign-in";
    } else if (isUpgradePrompt) {
      item.dataset.action = "upgrade";
    }

    const content = document.createElement("div");
    const nameContainer = document.createElement("div");
    nameContainer.classList.add("flex", "items-center");
    
    const name = document.createElement("div");
    name.classList.add("flex-1", "text-sm", "font-normal", "text-text-300");
    name.innerText = voice ? voice.name : getMessage("voiceOff");
    nameContainer.appendChild(name);

    // Chips inline to the right of the name to save vertical space
    const chips = document.createElement("div");
    chips.classList.add("flex", "items-center", "gap-2", "text-text-500", "text-xs", "pr-4");
    if (voice) {
      // Accent chip: show only the flag (no BCP tag text). If missing/invalid, omit entirely.
      const accentLocale = this.getVoiceLocale(voice);
      if (this.showAccent && accentLocale) {
        const accentChip = document.createElement("span");
        accentChip.classList.add("inline-flex", "items-center", "gap-1");
        const flagImg = document.createElement("img");
        flagImg.classList.add("w-3", "h-3", "rounded-sm");
        flagImg.alt = accentLocale;
        flagImg.src = this.getFlagUrlForLocale(accentLocale);
        accentChip.appendChild(flagImg);
        chips.appendChild(accentChip);
      }
      // Gender short tag
      if (this.showGender && voice.gender) {
        const gender = String(voice.gender).trim().toUpperCase();
        const genderChip = document.createElement("span");
        genderChip.classList.add("inline-flex", "items-center");
        const icon = gender.startsWith("M") ? marsSvgContent : gender.startsWith("F") ? venusSvgContent : "";
        if (icon) {
          addSvgToButton(genderChip, icon, "w-3", "h-3");
          chips.appendChild(genderChip);
        }
      }
      // Price, if there are variations
      if (this.showPrice) {
        const priceChip = document.createElement("span");
        priceChip.classList.add("inline-flex", "items-center", "opacity-80");
        priceChip.textContent = this.formatPrice(voice);
        chips.appendChild(priceChip);
      }
    }
    if (chips.childElementCount > 0) {
      nameContainer.appendChild(chips);
    }

    content.appendChild(nameContainer);

    const description = document.createElement("div");
    description.classList.add("text-text-500", "pr-4", "text-xs", "overflow-hidden", "text-ellipsis", "max-w-[340px]");
    // Determine the appropriate description text
    if (voice) {
      const desc = voice.description || "";
      description.innerText = desc || getMessage("ttsVoice");
    } else {
      if (isSignInPrompt) {
        description.innerText = getMessage("signInForTTS");
        // Add sign-in indicator class
        description.classList.add("text-accent-secondary-100");
      } else if (isUpgradePrompt) {
        description.innerText = getMessage("upgradeForTTS");
        // Add upgrade indicator class
        description.classList.add("text-accent-secondary-100");
      } else {
        description.innerText = getMessage("disableTTS");
      }
    }
    content.appendChild(description);

    item.appendChild(content);

    // Add checkmark container - positioned as second column in grid
    const checkmarkContainer = document.createElement("div");
    checkmarkContainer.classList.add("checkmark-container");
    item.appendChild(checkmarkContainer);

    item.addEventListener("click", () => this.handleVoiceSelection(voice, item));
    
    // Subtle divider under each item (removed for the last item later)
    const divider = document.createElement('div');
    divider.classList.add('saypi-voice-divider');
    item.appendChild(divider);

    return item;
  }

  // Short dollar display; fall back to credits if USD missing
  private formatPrice(voice: SpeechSynthesisVoiceRemote): string {
    const usd = voice.price_per_thousand_chars_in_usd ?? voice.price;
    if (typeof usd === "number" && !isNaN(usd) && usd > 0) {
      // Keep it compact: $0.3/1k
      const rounded = Math.round(usd * 100) / 100;
      return `$${rounded}/1k`;
    }
    const credits = voice.price_per_thousand_chars_in_credits;
    if (typeof credits === "number" && credits > 0) {
      return `${Math.round(credits)}/1k cr`;
    }
    return getMessage("free") || "Free";
  }

  // If accent looks like a BCP‑47 tag (e.g., en-US), treat it as the accent locale
  private getVoiceLocale(voice: SpeechSynthesisVoiceRemote): string | undefined {
    const tag = voice.accent;
    if (!tag) return undefined;
    const trimmed = String(tag).trim();
    const bcp47 = /^[a-zA-Z]{2,3}(-[A-Za-z0-9]{2,8})+$/; // require at least one hyphen
    return bcp47.test(trimmed) ? trimmed : undefined;
  }

  // Map BCP‑47 region subtag to a flag asset path. Fallback to global flag.
  private getFlagUrlForLocale(locale: string): string {
    try {
      const parts = locale.split('-');
      const region = parts.find(p => /^[A-Z]{2}$/.test(p));
      const code = region ? region.toLowerCase() : 'global';

      // Prefer extension-packaged flags under icons/ (MV3). These are exposed via web_accessible_resources.
      const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
      if (isExtension) {
        return chrome.runtime.getURL(`icons/flags/${code}.svg`);
      }
      // Non-extension environments (tests) fall back to a generic resolver
      return getResourceUrl(`icons/flags/${code}.svg`);
    } catch (_) {
      return getResourceUrl('icons/flags/global.svg');
    }
  }

  /**
   * Positions and displays the voice menu.
   * Strategy: Always append menu to document.body to escape parent container constraints,
   * then position based on device type (mobile modal vs desktop dropdown).
   */
  private positionMenuAboveButton(): void {
    // Move menu to body FIRST to escape parent constraints (both mobile and desktop)
    if (this.menuContent.parentElement !== document.body) {
      document.body.appendChild(this.menuContent);
    }

    // Make menu visible with correct dimensions
    this.menuContent.style.display = "block";

    // Wait for the browser to calculate dimensions
    setTimeout(() => {
      // Use CSS class to determine mobile vs desktop
      const isMobile = document.documentElement.classList.contains('mobile-device');

      if (isMobile) {
        // Mobile: Use full-screen modal approach
        this.positionMenuAsMobileModal();
      } else {
        // Desktop: Smart positioning with space calculation
        this.positionMenuForDesktop();
      }
    }, 0);
  }

  /**
   * Positions the voice menu as a centered mobile modal.
   * CSS handles positioning via .voice-menu-mobile-modal class.
   */
  private positionMenuAsMobileModal(): void {
    // Add mobile modal class - CSS handles all positioning
    this.menuContent.classList.add("voice-menu-mobile-modal");

    // Show backdrop for mobile modal
    this.showBackdrop();
  }

  /**
   * Creates and displays the backdrop overlay for mobile modal.
   */
  private showBackdrop(): void {
    let backdrop = document.getElementById("saypi-voice-menu-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "saypi-voice-menu-backdrop";
      backdrop.classList.add("voice-menu-backdrop");
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          this.toggleMenu();
        }
      }, true);
      document.body.appendChild(backdrop);
    }
    backdrop.style.display = "block";
  }

  /**
   * Hides the backdrop overlay.
   */
  private hideBackdrop(): void {
    const backdrop = document.getElementById("saypi-voice-menu-backdrop");
    if (backdrop) {
      backdrop.style.display = "none";
    }
  }

  /**
   * Positions the voice menu as a smart dropdown on desktop.
   * Calculates optimal position (above/below button) based on available viewport space.
   * Ensures menu is always fully visible and scrollable within viewport bounds.
   */
  private positionMenuForDesktop(): void {
    // Remove mobile-specific classes if present
    this.menuContent.classList.remove("voice-menu-mobile-modal");

    // Use fixed positioning
    this.menuContent.style.position = "fixed";

    // Get button position (menu is already in body, so this is current)
    const buttonRect = this.menuButton.getBoundingClientRect();

    // Calculate menu dimensions
    const menuWidth = this.menuContent.offsetWidth || 200;
    const menuHeight = this.menuContent.offsetHeight || 280;

    // Calculate available space above and below the button
    const spaceAbove = buttonRect.top;
    const spaceBelow = window.innerHeight - buttonRect.bottom;

    // Determine optimal position based on available space
    const padding = 8;
    const minSpace = 50; // Minimum space needed to show menu

    let topPosition: number;
    let maxHeight: number;

    // Prefer positioning below if there's more space there, or if space above is insufficient
    if (spaceBelow > spaceAbove || spaceAbove < minSpace) {
      // Position below the button
      topPosition = buttonRect.bottom + padding;
      // Use generous space - allow up to 600px or available space, whichever is smaller
      maxHeight = Math.min(600, spaceBelow - padding * 2);
    } else {
      // Position above the button
      // Use generous space - allow up to 600px or available space, whichever is smaller
      maxHeight = Math.min(600, spaceAbove - padding * 2);
      topPosition = buttonRect.top - padding - Math.min(menuHeight, maxHeight);
    }

    // Ensure we don't go off the top of the screen
    if (topPosition < padding) {
      topPosition = padding;
      maxHeight = Math.min(600, window.innerHeight - padding * 2);
    }

    // Ensure we don't go off the bottom of the screen
    if (topPosition + maxHeight > window.innerHeight - padding) {
      maxHeight = window.innerHeight - topPosition - padding;
    }

    // Calculate the X position (left edge of button)
    let leftPosition = buttonRect.left;

    // Ensure the menu doesn't go off-screen to the right
    const windowWidth = window.innerWidth;
    if (leftPosition + menuWidth > windowWidth - padding) {
      leftPosition = Math.max(padding, windowWidth - menuWidth - padding);
    }

    // Apply positioning using left/top (not transform for fixed position)
    this.menuContent.style.left = `${leftPosition}px`;
    this.menuContent.style.top = `${topPosition}px`;
    this.menuContent.style.transform = "none";
    this.menuContent.style.maxHeight = `${maxHeight}px`;
    this.menuContent.style.overflowY = "auto";
    this.menuContent.style.zIndex = "1000";
  }

  private toggleMenu(): void {
    const isExpanded = this.menuButton.getAttribute("aria-expanded") === "true";
    this.menuButton.setAttribute("aria-expanded", (!isExpanded).toString());

    if (!isExpanded) {
      // refresh menu
      this.refreshMenu().then(() => {
        // Show and position the menu
        this.positionMenuAboveButton();
        // set aria-expanded to true
        this.menuButton.setAttribute("aria-expanded", "true");
      });
    } else {
      // Close the menu
      this.menuContent.style.display = "none";

      // Remove mobile modal class if present
      this.menuContent.classList.remove("voice-menu-mobile-modal");

      // Move menu back to original parent (both desktop and mobile append to body when open)
      if (this.menuContent.parentElement === document.body && this.element) {
        this.element.appendChild(this.menuContent);
      }

      // Hide backdrop (used by mobile)
      this.hideBackdrop();
    }
  }

  private handleVoiceSelection(
    voice: SpeechSynthesisVoiceRemote | null,
    menuItem?: HTMLElement
  ): void {
    // Check if this is a sign-in prompt
    if (menuItem?.dataset?.action === "sign-in") {
      this.toggleMenu(); // Close the menu
      // Open the extension popup which has the sign-in button (gives users context about the extension before signing in)
      openSettings();
      return;
    }
    
    if (voice) {
      this.userPreferences.setVoice(voice, this.chatbot).then(() => {
        console.log(`Selected voice: ${voice.name}`);
        this.updateSelectedVoice(voice);
        // only introduce the voice if there are other voices available (one of which is "Voice off")
        if (this.menuContent.querySelectorAll("[role='menuitem']").length > 2) {
          this.introduceVoice(voice);
        }
      });
    } else {
      this.userPreferences.unsetVoice(this.chatbot).then(() => {
        console.log("Voice disabled");
        this.updateSelectedVoice(null);
      });
    }
    this.toggleMenu();
  }

  private cleanupExistingElements(voiceSelector: HTMLElement): void {
    // Remove any existing buttons and menus to prevent duplicates

    // 1. Clean up our tracked elements if they exist
    if (this.menuButton) {
      if (this.menuButton.parentElement) {
        this.menuButton.parentElement.removeChild(this.menuButton);
      }
      this.menuButton = document.createElement("button"); // Reset to placeholder
    }

    if (this.menuContent) {
      // Menu could be in voiceSelector OR document.body (if currently open)
      // Check both locations to prevent orphaned elements
      if (this.menuContent.parentElement) {
        this.menuContent.parentElement.removeChild(this.menuContent);
      }

      // Also check for menu in document.body in case it wasn't tracked
      const menuInBody = document.body.querySelector('.voice-menu-content');
      if (menuInBody && menuInBody !== this.menuContent) {
        menuInBody.parentElement?.removeChild(menuInBody);
      }

      this.menuContent = document.createElement("div"); // Reset to placeholder
    }

    // Clean up backdrop if present (mobile modal)
    const backdrop = document.getElementById("saypi-voice-menu-backdrop");
    if (backdrop) {
      backdrop.parentElement?.removeChild(backdrop);
    }
    
    // 2. Find and remove any orphaned voice selector buttons/menus by class/attribute
    const existingButtons = voiceSelector.querySelectorAll('button[data-voice-active]');
    existingButtons.forEach(button => {
      if (button.parentElement) {
        button.parentElement.removeChild(button);
      }
    });
    
    const existingMenus = voiceSelector.querySelectorAll('.voice-menu-content');
    existingMenus.forEach(menu => {
      if (menu.parentElement) {
        menu.parentElement.removeChild(menu);
      }
    });
    
    // 3. Additional safety check - remove any elements that look like voice selector components
    const possibleDuplicateButtons = voiceSelector.querySelectorAll('button[aria-haspopup="true"]');
    possibleDuplicateButtons.forEach(button => {
      // Check if this looks like our voice button by checking for voice-related content
      const hasVoiceIcon = button.querySelector('.voiced-by');
      const hasVoiceName = button.querySelector('.voice-name');
      if (hasVoiceIcon || hasVoiceName) {
        if (button.parentElement) {
          button.parentElement.removeChild(button);
        }
      }
    });
    
    // 4. Reset initialization flags to allow fresh initialization
    delete voiceSelector.dataset.voiceSelectorInitialized;
    delete voiceSelector.dataset.clickListenerAdded;
  }

  private updateSelectedVoice(
    selectedVoice: SpeechSynthesisVoiceRemote | null
  ): void {
    const voiceName = this.menuButton.querySelector(".voice-name");
    if (voiceName) {
      voiceName.textContent = selectedVoice ? selectedVoice.name : getMessage("voiceOff");
    }
    
    // Update the data-voice-active attribute
    this.menuButton.setAttribute("data-voice-active", selectedVoice ? "true" : "false");
    
    // Update the icon based on the voice state
    const iconContainer = this.menuButton.querySelector(".voiced-by");
    if (iconContainer) {
      // Replace the icon with the appropriate one based on voice state
      iconContainer.innerHTML = selectedVoice ? volumeSvgContent : volumeMutedSvgContent;
    }

    const selectedVoiceName = selectedVoice ? selectedVoice.name : "voice-off";
    const menuItems = this.menuContent.querySelectorAll("[role='menuitem']");
    
    menuItems.forEach((item) => {
      if (item instanceof HTMLElement) {
        const itemVoiceName = item.dataset.voiceName;
        const isSelected = itemVoiceName === selectedVoiceName;
        
        // Update checkmark with exact Claude native styling
        const checkmarkContainer = item.querySelector(".checkmark-container");
        if (checkmarkContainer) {
          checkmarkContainer.innerHTML = isSelected ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="text-accent-secondary-100 mb-1 mr-1.5"><path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path></svg>' : 
            '';
        }
      }
    });
  }

  override populateVoices(voices: SpeechSynthesisVoiceRemote[], voiceSelector: HTMLElement): boolean {
    // Compute heuristics to decide what to show across this dataset
    try {
      const accents = new Set(
        voices
          .map(v => this.getVoiceLocale(v) || v.accent)
          .filter(Boolean)
      );
      const genders = new Set(voices.map(v => (v.gender || '').toString().toUpperCase()).filter(Boolean));
      const prices = new Set(voices.map(v => v.price_per_thousand_chars_in_usd ?? v.price).filter((p): p is number => typeof p === 'number'));
      this.showAccent = accents.size > 1; // only show if helpful to differentiate
      this.showGender = genders.size > 1; // only show if varies
      this.showPrice = prices.size > 1;   // show only when price differs
    } catch (_) {
      // Fail safe: don't show extra metadata if anything goes wrong
      this.showAccent = this.showGender = this.showPrice = false;
    }

    // Get the currently selected voice before recreating the menu
    let currentSelectedVoice: SpeechSynthesisVoiceRemote | null = null;
    
    // Try to get from the current button if it exists
    if (this.menuButton && this.menuButton.parentElement === voiceSelector) {
      const voiceNameElement = this.menuButton.querySelector(".voice-name");
      if (voiceNameElement) {
        const currentVoiceName = voiceNameElement.textContent;
        if (currentVoiceName && currentVoiceName !== getMessage("voiceOff")) {
          // Find the voice object that matches the current selection
          currentSelectedVoice = voices.find(voice => voice.name === currentVoiceName) || null;
        }
      }
    }
    
    // If we couldn't get it from the button, try to get it from user preferences
    if (!currentSelectedVoice) {
      // This will be handled asynchronously below
    }

    // Comprehensive cleanup to prevent duplicates
    this.cleanupExistingElements(voiceSelector);

    // Recreate the menu button and content from scratch
    this.menuButton = this.createVoiceButton(currentSelectedVoice);
    voiceSelector.appendChild(this.menuButton);

    this.menuContent = this.createVoiceMenu();
    voiceSelector.appendChild(this.menuContent);

    // Check if we have any voices available besides "Voice off"
    const noVoicesAvailable = voices.length === 0;

    // Add "Voice off" option with appropriate messaging
    const voiceOffItem = this.createMenuItem(null, noVoicesAvailable);
    this.menuContent.appendChild(voiceOffItem);

    // Add available voices
    voices.forEach((voice) => {
      const menuItem = this.createMenuItem(voice);
      this.menuContent.appendChild(menuItem);
    });

    // Add subtle separators for easier scanning
    this.applyItemSeparators();

    // If we found a selected voice from the button, update the menu items to show selection
    if (currentSelectedVoice) {
      this.updateSelectedVoice(currentSelectedVoice);
    } else {
      // Fall back to getting the voice from preferences asynchronously
      this.userPreferences.getVoice(this.chatbot).then((voice) => {
        this.updateSelectedVoice(voice);
      });
    }

    return !noVoicesAvailable;
  }

  // Add a faint bottom divider to each menu item except the last one
  private applyItemSeparators(): void {
    const items = Array.from(this.menuContent.querySelectorAll('[role="menuitem"]')) as HTMLElement[];
    const lastIndex = items.length - 1;
    items.forEach((el, idx) => {
      const divider = el.querySelector('.saypi-voice-divider') as HTMLElement | null;
      if (!divider) return;
      if (idx === lastIndex) {
        divider.remove();
      }
    });
  }

  private initializeVoiceSelector(chatbot: Chatbot): void {
    // Prevent double initialization
    if (this.element.dataset.voiceSelectorInitialized === "true") {
      logger.debug("[status] Voice selector already initialized, skipping");
      return;
    }

    const speechSynthesis = SpeechSynthesisModule.getInstance();
    logger.debug("[status] Initializing voice selector");
    speechSynthesis.getVoices(chatbot).then((voices) => {
      this.populateVoices(voices, this.element);

      // Note: populateVoices() now handles restoring the selected voice,
      // so we don't need to call updateSelectedVoice() here anymore

      // Close menu when clicking outside - only add if not already added
      if (!this.element.dataset.clickListenerAdded) {
        document.addEventListener("click", (event) => {
          if (!this.element.contains(event.target as Node)) {
            this.menuContent.style.display = "none";
            this.menuButton.setAttribute("aria-expanded", "false");
          }
        });
        this.element.dataset.clickListenerAdded = "true";
      }

      // Mark as initialized
      this.element.dataset.voiceSelectorInitialized = "true";
    });
    logger.debug("[status] Voice selector initialized");

  }

  getPositionFromEnd(): number {
    return 2; // Position right after the model selector and before the call button
  }
}
