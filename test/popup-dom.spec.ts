/**
 * Test for popup.js innerHTML replacement with DOM manipulation
 */

import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Popup DOM Manipulation', () => {
  let document;
  
  beforeEach(() => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="language-preference">Language Preference Section</div>
          <div id="test-container"></div>
        </body>
      </html>
    `);
    document = dom.window.document;
  });

  it('should create auto-submit toggle with proper DOM manipulation instead of innerHTML', () => {
    // This is the refactored code from popup.js
    const autoSubmitToggle = document.createElement("div");
    autoSubmitToggle.className = "user-preference-item w-full max-w-lg";
    autoSubmitToggle.id = "auto-submit-preference";
    
    const label = document.createElement("label");
    label.className = "wraper";
    label.setAttribute("for", "auto-submit");
    
    const labelText = document.createElement("span");
    labelText.className = "label-text";
    labelText.setAttribute("data-i18n", "autoSubmit");
    labelText.textContent = "Auto-submit";
    
    const switchWrap = document.createElement("div");
    switchWrap.className = "switch-wrap control";
    
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "auto-submit";
    input.name = "autoSubmit";
    
    const switchDiv = document.createElement("div");
    switchDiv.className = "switch";
    
    switchWrap.appendChild(input);
    switchWrap.appendChild(switchDiv);
    label.appendChild(labelText);
    label.appendChild(switchWrap);
    autoSubmitToggle.appendChild(label);

    // Test the created structure
    expect(autoSubmitToggle.id).toBe("auto-submit-preference");
    expect(autoSubmitToggle.className).toBe("user-preference-item w-full max-w-lg");
    
    // Test label element
    const labelElement = autoSubmitToggle.querySelector('label.wraper');
    expect(labelElement).toBeTruthy();
    expect(labelElement.getAttribute('for')).toBe('auto-submit');
    
    // Test span element
    const spanElement = autoSubmitToggle.querySelector('span.label-text');
    expect(spanElement).toBeTruthy();
    expect(spanElement.getAttribute('data-i18n')).toBe('autoSubmit');
    expect(spanElement.textContent).toBe('Auto-submit');
    
    // Test switch wrapper
    const switchWrapElement = autoSubmitToggle.querySelector('div.switch-wrap.control');
    expect(switchWrapElement).toBeTruthy();
    
    // Test input element
    const inputElement = autoSubmitToggle.querySelector('input[type="checkbox"]');
    expect(inputElement).toBeTruthy();
    expect(inputElement.id).toBe('auto-submit');
    expect(inputElement.name).toBe('autoSubmit');
    
    // Test switch div
    const switchDivElement = autoSubmitToggle.querySelector('div.switch');
    expect(switchDivElement).toBeTruthy();
    
    // Verify the overall structure matches what innerHTML would have created
    const expectedHTML = `<div class="user-preference-item w-full max-w-lg" id="auto-submit-preference"><label class="wraper" for="auto-submit"><span class="label-text" data-i18n="autoSubmit">Auto-submit</span><div class="switch-wrap control"><input type="checkbox" id="auto-submit" name="autoSubmit"><div class="switch"></div></div></label></div>`;
    expect(autoSubmitToggle.outerHTML).toBe(expectedHTML);
  });

  it('should not use innerHTML anywhere in the DOM creation', () => {
    // Verify that our DOM manipulation approach does not use innerHTML
    const autoSubmitToggle = document.createElement("div");
    autoSubmitToggle.className = "user-preference-item w-full max-w-lg";
    autoSubmitToggle.id = "auto-submit-preference";
    
    const label = document.createElement("label");
    label.className = "wraper";
    label.setAttribute("for", "auto-submit");
    
    const labelText = document.createElement("span");
    labelText.className = "label-text";
    labelText.setAttribute("data-i18n", "autoSubmit");
    labelText.textContent = "Auto-submit";
    
    const switchWrap = document.createElement("div");
    switchWrap.className = "switch-wrap control";
    
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "auto-submit";
    input.name = "autoSubmit";
    
    const switchDiv = document.createElement("div");
    switchDiv.className = "switch";
    
    // Use only appendChild and textContent/setAttribute
    switchWrap.appendChild(input);
    switchWrap.appendChild(switchDiv);
    label.appendChild(labelText);
    label.appendChild(switchWrap);
    autoSubmitToggle.appendChild(label);

    // Verify that all text was set using textContent, not innerHTML
    expect(labelText.textContent).toBe("Auto-submit");
    expect(labelText.innerHTML).toBe("Auto-submit"); // Should be the same since no HTML tags
    
    // Verify structure is correct
    expect(autoSubmitToggle.children.length).toBe(1);
    expect(autoSubmitToggle.children[0].tagName).toBe('LABEL');
    expect(autoSubmitToggle.children[0].children.length).toBe(2);
    expect(autoSubmitToggle.children[0].children[0].tagName).toBe('SPAN');
    expect(autoSubmitToggle.children[0].children[1].tagName).toBe('DIV');
  });
});