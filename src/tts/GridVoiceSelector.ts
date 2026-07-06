import { getResourceUrl } from "../ResourceModule";
import getMessage from "../i18n";
import { openSettings } from "../popup/popupopener";
import { SpeechSynthesisVoiceRemote } from "./SpeechModel";
import { curateShortlist, getVoiceTier } from "./VoiceCuration";
import { VoiceSelector, isBuiltInVoiceProvider } from "./VoiceMenu";
import {
  classifyControl,
  markAdopted,
  HOST_VOICE_ATTR,
} from "./VoiceMenuControls";

/** Pi ships 8 native voices; below this we top up with account-gated extras. */
const HOST_NATIVE_VOICE_COUNT = 8;

/**
 * Button-grid voice surfaces (Pi's in-chat menu and Pi's settings grid): the
 * host owns the container (and re-creates it at will — Pi rebuilds its menu on
 * every expand), SayPi owns its rows within it. renderMenu is a
 * RECONCILIATION against that host-owned container, not a wipe-and-rebuild:
 * SayPi rows are inserted/moved/removed by id, host rows are adopted (marked +
 * wired) exactly once, and unknown elements are never touched (#485).
 *
 * A row is currently rendered as a single <button> (the row root IS the
 * select target). When a row grows a trailing affordance (#483's ▶), ONLY
 * createVoiceRow/createRestoredRow and selectTargetOf change — every other
 * consumer addresses rows via [data-voice-id] roots and the taxonomy.
 */
export abstract class GridVoiceSelector extends VoiceSelector {
  /**
   * Max SayPi (custom) voice rows this surface shows before tucking the rest
   * behind the "More voices" door. null = uncapped (Pi's settings grid);
   * in-host menus override (doc/plans/2026-07-02-voice-selection-ux.md §3).
   */
  protected getCustomVoiceCap(): number | null {
    return null;
  }

  /**
   * Whether this surface renders the "More voices" door. Capped surfaces
   * always do (it is the navigation path to the catalog, not an overflow
   * marker — #472); uncapped surfaces opt in (PiVoiceSettings).
   */
  protected showsMoreVoicesDoor(): boolean {
    return this.getCustomVoiceCap() !== null;
  }

  protected renderMenu(
    voices: SpeechSynthesisVoiceRemote[],
    storedVoice: SpeechSynthesisVoiceRemote | null,
    pinnedIds?: ReadonlySet<string> | null
  ): void {
    const container = this.element;
    const defaults = voices.filter((voice) => voice.default);
    const customs = voices.filter((voice) => !voice.default);

    // 1. Adopt host-native rows (positive mark + unset handler, exactly once).
    this.adoptHostRows(container);

    // 2. SayPi catalog rows. The stored voice id goes straight into
    //    curateShortlist, whose first rule is current-voice-first — the
    //    "stored voice never vanishes" invariant, synchronously.
    const cap = this.getCustomVoiceCap();
    const curated =
      cap === null
        ? { voices: customs, hiddenCount: 0, tiersCoexist: false }
        : curateShortlist(customs, storedVoice?.id ?? null, cap, pinnedIds);
    this.reconcileCustomRows(
      container,
      curated.voices,
      new Set(customs.map((voice) => voice.id)),
      curated.tiersCoexist
    );

    // 3. Default-flagged catalog voices render as restored rows at the end.
    this.renderRestoredRows(container, defaults);

    // 4. Pi's account-gated extras: top up when the host shows fewer native
    //    rows than its full set. Their ids are not in the SayPi catalog id
    //    set, so reconciliation never removes them (Pi 7/8 must survive
    //    every re-render — the Patch A regression).
    if (
      isBuiltInVoiceProvider(this.chatbot) &&
      this.countHostRows(container) < HOST_NATIVE_VOICE_COUNT
    ) {
      this.ensureExtraRows(
        container,
        this.chatbot.getExtraVoices(),
        curated.tiersCoexist
      );
    }

    // 5. The door.
    if (this.showsMoreVoicesDoor()) {
      this.ensureDoor(container);
    }

    // 6. Selection is a pure render of the stored preference.
    this.renderSelection(storedVoice);
  }

  /**
   * External voice change (settings page, another surface): re-mark rows from
   * the new value. If the voice's row is not visible (shortlist-hidden), no
   * row is marked — a deliberate improvement over the old stale highlight —
   * and the next renderMenu shows it via curateShortlist's current-first rule.
   */
  protected applySelectedVoice(
    voice: SpeechSynthesisVoiceRemote | null
  ): void {
    this.renderSelection(voice);
  }

  // ---- rows ---------------------------------------------------------------

  private rowFor(container: HTMLElement, voiceId: string): HTMLElement | null {
    return container.querySelector<HTMLElement>(`[data-voice-id="${voiceId}"]`);
  }

  private allRows(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll<HTMLElement>(
        `.saypi-custom-voice, .saypi-restored-voice, [${HOST_VOICE_ATTR}]`
      )
    );
  }

  /**
   * The one seam that knows a row root is (today) the select button itself.
   * A wrapper-row future changes this to a query for the row's select button.
   */
  private selectTargetOf(row: HTMLElement): HTMLButtonElement {
    return row as HTMLButtonElement;
  }

  /** SayPi catalog voice row: button > name span [+ tier badge] + flair. */
  protected createVoiceRow(
    voice: SpeechSynthesisVoiceRemote,
    showTier: boolean
  ): HTMLElement {
    const row = document.createElement("button");
    row.type = "button";
    row.classList.add(
      ...this.getButtonClasses(),
      "saypi-voice-button",
      "saypi-custom-voice",
      voice.name.toLowerCase().replace(" ", "-")
    );
    const name = document.createElement("span");
    name.classList.add("voice-name");
    name.innerText = voice.name;
    row.appendChild(name);
    this.syncTierBadge(row, voice, showTier);
    const flair = document.createElement("img");
    flair.classList.add("flair");
    flair.src = getResourceUrl("icons/logos/saypi.png");
    flair.alt = "Say, Pi logo";
    flair.title = getMessage("enhancedVoice", ["Say, Pi"]);
    row.appendChild(flair);
    row.dataset.voiceId = voice.id;
    row.addEventListener("click", () => {
      this.userPreferences.setVoice(voice, this.chatbot).then(() => {
        console.log(`Selected voice: ${voice.name}`);
        this.renderSelection(voice);
        this.introduceVoice(voice);
      });
    });
    return row;
  }

  /** Default-flagged catalog voice re-added by SayPi (plain label, no flair). */
  protected createRestoredRow(voice: SpeechSynthesisVoiceRemote): HTMLElement {
    const row = document.createElement("button");
    row.type = "button";
    row.classList.add(
      ...this.getButtonClasses(),
      "saypi-voice-button",
      "saypi-restored-voice",
      voice.name.toLowerCase().replace(" ", "-")
    );
    row.innerText = voice.name;
    row.dataset.voiceId = voice.id;
    row.addEventListener("click", () => {
      this.userPreferences.setVoice(voice, this.chatbot).then(() => {
        console.log(`Selected voice: ${voice.name}`);
        this.renderSelection(voice);
        this.introduceVoice(voice);
      });
    });
    return row;
  }

  /** Quiet HD suffix, added or removed so re-renders converge (idempotence). */
  private syncTierBadge(
    row: HTMLElement,
    voice: SpeechSynthesisVoiceRemote,
    showTier: boolean
  ): void {
    const existing = row.querySelector(".voice-tier");
    const wanted = showTier && getVoiceTier(voice) === "hd";
    if (wanted && !existing) {
      const tier = document.createElement("span");
      tier.classList.add("voice-tier");
      tier.textContent = "HD";
      tier.title = getMessage("hdVoicesAllowanceNote");
      const name = row.querySelector(".voice-name");
      if (name) {
        name.insertAdjacentElement("afterend", tier);
      } else {
        row.appendChild(tier);
      }
    } else if (!wanted && existing) {
      existing.remove();
    }
  }

  // ---- reconciliation -------------------------------------------------------

  /**
   * Make the SayPi catalog block match the plan: remove catalog rows that
   * fell out of it (scoped to this catalog's ids so extras and other
   * sources' rows survive), then walk the plan bottom-up inserting each row
   * at the top — existing rows are MOVED, not recreated, so DOM identity and
   * listeners survive; the result is plan order at the top of the container.
   */
  private reconcileCustomRows(
    container: HTMLElement,
    plan: SpeechSynthesisVoiceRemote[],
    catalogIds: Set<string>,
    showTier: boolean
  ): void {
    const planIds = new Set(plan.map((voice) => voice.id));
    Array.from(
      container.querySelectorAll<HTMLElement>(".saypi-custom-voice")
    ).forEach((row) => {
      const id = row.dataset.voiceId;
      if (id && catalogIds.has(id) && !planIds.has(id)) {
        row.remove();
      }
    });
    for (let i = plan.length - 1; i >= 0; i--) {
      const voice = plan[i];
      let row = this.rowFor(container, voice.id);
      if (row) {
        this.syncTierBadge(row, voice, showTier);
      } else {
        row = this.createVoiceRow(voice, showTier);
      }
      container.insertBefore(row, container.firstChild);
    }
  }

  private renderRestoredRows(
    container: HTMLElement,
    defaults: SpeechSynthesisVoiceRemote[]
  ): void {
    defaults.forEach((voice) => {
      const existing = this.rowFor(container, voice.id);
      if (existing) {
        container.appendChild(existing); // keep the block at the end (move-to-end)
        return;
      }
      container.appendChild(this.createRestoredRow(voice));
    });
  }

  /**
   * Account-gated extras render exactly like catalog rows (today's shipped
   * appearance: custom class + flair, inserted at the top) but are ensured
   * present rather than reconciled — the cap never applies to them.
   */
  private ensureExtraRows(
    container: HTMLElement,
    extras: SpeechSynthesisVoiceRemote[],
    showTier: boolean
  ): void {
    extras
      .slice()
      .reverse()
      .forEach((voice) => {
        if (!this.rowFor(container, voice.id)) {
          container.insertBefore(
            this.createVoiceRow(voice, showTier),
            container.firstChild
          );
        }
      });
  }

  /** Exactly one door, parked after the last SayPi row. Idempotent. */
  private ensureDoor(container: HTMLElement): void {
    let door = container.querySelector<HTMLButtonElement>(
      "button.saypi-more-voices"
    );
    if (!door) {
      door = document.createElement("button");
      door.type = "button";
      // saypi-voice-button keeps it under the menu's expand/collapse
      // visibility rules (voices.scss); saypi-more-voices classifies it as
      // the door (never a voice row).
      door.classList.add(
        ...this.getButtonClasses(),
        "saypi-voice-button",
        "saypi-more-voices"
      );
      door.textContent = getMessage("moreVoices");
      door.addEventListener("click", () => {
        // Host-scoped: the studio opens on the host the user came from.
        openSettings(`voices/${this.chatbot.getID()}`);
      });
    }
    const customRows = container.querySelectorAll(".saypi-custom-voice");
    const lastCustom = customRows[customRows.length - 1];
    if (lastCustom) {
      lastCustom.insertAdjacentElement("afterend", door);
    } else {
      container.appendChild(door);
    }
  }

  // ---- selection ------------------------------------------------------------

  /**
   * Pure render of "which voice is selected" across every known row kind.
   * null (voice off / host default): SayPi rows are cleared; host rows keep
   * whatever state the host renders natively.
   */
  protected renderSelection(voice: SpeechSynthesisVoiceRemote | null): void {
    const rows = this.allRows();
    if (!voice) {
      rows
        .filter((row) => classifyControl(row) !== "host-voice")
        .forEach((row) => this.unmarkRowSelected(row));
      return;
    }
    rows.forEach((row) => this.unmarkRowSelected(row));
    const target = this.rowFor(this.element, voice.id);
    if (target) {
      this.markRowSelected(target);
    }
  }

  protected markRowSelected(row: HTMLElement): void {
    const button = this.selectTargetOf(row);
    button.disabled = true;
    button.classList.add("selected", "bg-neutral-300", "text-primary-700");
    button.classList.remove("hover:bg-neutral-300");
  }

  protected unmarkRowSelected(row: HTMLElement): void {
    const button = this.selectTargetOf(row);
    button.disabled = false;
    button.classList.remove("selected", "bg-neutral-300", "text-primary-700");
    button.classList.add("hover:bg-neutral-300", "border-neutral-500");
    button.setAttribute("style", ""); // strip inline styles from host/builtin buttons on the settings page
  }

  // ---- host adoption ----------------------------------------------------------

  /**
   * THE single site that may act on unmarked elements: a direct-child
   * <button> classifying as "unknown" is a host-native voice row — stamp it
   * (positively classified from here on) and wire unset-voice. The stamp
   * doubles as the wired-once guard, so repeated renders (Pi re-expands)
   * never double-bind.
   */
  private adoptHostRows(container: HTMLElement): void {
    Array.from(container.children).forEach((child) => {
      if (
        child instanceof HTMLButtonElement &&
        classifyControl(child) === "unknown"
      ) {
        this.adoptHostRow(child);
      }
    });
  }

  private adoptHostRow(button: HTMLButtonElement): void {
    markAdopted(button);
    button.addEventListener("click", () => {
      this.userPreferences.unsetVoice(this.chatbot).then(() => {
        this.allRows().forEach((row) => this.unmarkRowSelected(row));
        this.markRowSelected(button);
      });
    });
  }

  private countHostRows(container: HTMLElement): number {
    return container.querySelectorAll(`[${HOST_VOICE_ATTR}]`).length;
  }

  // ---- late host mutations ------------------------------------------------------

  /**
   * Pi inserts its native voice buttons asynchronously; adopt them as they
   * arrive and re-render selection so a host row never shows selected while
   * a SayPi voice is stored. Additions of SayPi's own rows re-run the same
   * idempotent selection render (harmless).
   */
  addVoiceButtonAdditionListener(voiceMenu: HTMLElement): void {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") continue;
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLButtonElement) {
            this.handleRowAddition(node);
          }
        }
      }
    });
    observer.observe(voiceMenu, { childList: true });
  }

  protected handleRowAddition(button: HTMLButtonElement): void {
    if (
      button.parentElement === this.element &&
      classifyControl(button) === "unknown"
    ) {
      this.adoptHostRow(button);
    }
    this.userPreferences.getVoice(this.chatbot).then((voice) => {
      if (voice) {
        this.renderSelection(voice);
      }
    });
  }
}
