/**
 * TextInsertionManager handles text insertion across different types of editors.
 * It selects the appropriate strategy based on the target element type and provides
 * a consistent interface for both dictation and conversation modes.
 */

import {
  TextInsertionStrategy,
  InputTextareaStrategy,
  LexicalEditorStrategy,
  SlateEditorStrategy,
  QuillEditorStrategy,
  ProseMirrorEditorStrategy,
  ContentEditableStrategy
} from './TextInsertionStrategy';

export class TextInsertionManager {
  private strategies: TextInsertionStrategy[];

  constructor() {
    // Order matters! More specific strategies should come first
    this.strategies = [
      new InputTextareaStrategy(),      // Input and textarea elements
      new LexicalEditorStrategy(),      // Facebook's Lexical editor
      new SlateEditorStrategy(),        // Slate.js editors
      new QuillEditorStrategy(),        // Quill.js editors (LinkedIn, etc.)
      new ProseMirrorEditorStrategy(),  // ProseMirror editors (ChatGPT, etc.)
      new ContentEditableStrategy(),    // Generic contenteditable fallback
    ];
  }

  /**
   * Insert text into the target element using the appropriate strategy
   * @param target The HTML element to insert text into
   * @param text The text to insert
   * @param replaceAll Whether to replace all existing text or append
   * @returns true if insertion was successful, false otherwise
   */
  insertText(target: HTMLElement, text: string, replaceAll: boolean = false): boolean {
    try {
      const strategy = this.getStrategyForTarget(target);
      if (strategy) {
        strategy.insertText(target, text, replaceAll);
        return true;
      } else {
        console.warn('No text insertion strategy found for target:', target);
        return false;
      }
    } catch (error) {
      console.error('Text insertion failed:', error);
      return false;
    }
  }

  /**
   * Get the appropriate strategy for a given target element
   * @param target The HTML element to find a strategy for
   * @returns The matching strategy or null if none found
   */
  getStrategyForTarget(target: HTMLElement): TextInsertionStrategy | null {
    return this.strategies.find(strategy => strategy.canHandle(target)) || null;
  }

  /**
   * Check if a target element can be handled by any strategy
   * @param target The HTML element to check
   * @returns true if a strategy can handle this element
   */
  canHandleTarget(target: HTMLElement): boolean {
    return this.getStrategyForTarget(target) !== null;
  }

  /**
   * Get the name of the strategy that would handle the given target
   * Useful for debugging and logging
   * @param target The HTML element to check
   * @returns The strategy class name or 'Unknown' if no strategy found
   */
  getStrategyNameForTarget(target: HTMLElement): string {
    const strategy = this.getStrategyForTarget(target);
    return strategy ? strategy.constructor.name : 'Unknown';
  }

  /**
   * Create a singleton instance for global use
   */
  private static instance: TextInsertionManager | null = null;

  static getInstance(): TextInsertionManager {
    if (!TextInsertionManager.instance) {
      TextInsertionManager.instance = new TextInsertionManager();
    }
    return TextInsertionManager.instance;
  }
}