import { describe, it, expect, vi } from "vitest";
import { wireEnvironmentQuestion } from "../../src/onboarding/environmentQuestion";

const translate = (k: string) => `t:${k}`;

function buildRoot(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = `
    <input type="radio" name="voice-environment" value="private" id="env-private" />
    <input type="radio" name="voice-environment" value="mixed" id="env-mixed" />
    <input type="radio" name="voice-environment" value="around-others" id="env-around" />
    <p id="onboarding-env-status"></p>
  `;
  return root;
}

function pick(root: ParentNode, id: string): HTMLInputElement {
  const el = root.querySelector<HTMLInputElement>(`#${id}`)!;
  el.checked = true;
  el.dispatchEvent(new Event("change"));
  return el;
}

describe("wireEnvironmentQuestion (#437)", () => {
  it("enables quiet mode and confirms when 'around others' is chosen", async () => {
    const root = buildRoot();
    const setQuietMode = vi.fn().mockResolvedValue(undefined);
    wireEnvironmentQuestion(root, { translate, setQuietMode });

    pick(root, "env-around");
    await Promise.resolve();

    expect(setQuietMode).toHaveBeenCalledWith(true);
    expect(root.querySelector("#onboarding-env-status")!.textContent).toBe("t:onboarding_envQuietOn");
  });

  it("leaves quiet mode off for a private space", async () => {
    const root = buildRoot();
    const setQuietMode = vi.fn().mockResolvedValue(undefined);
    wireEnvironmentQuestion(root, { translate, setQuietMode });

    pick(root, "env-private");
    await Promise.resolve();

    expect(setQuietMode).toHaveBeenCalledWith(false);
    expect(root.querySelector("#onboarding-env-status")!.textContent).toBe("t:onboarding_envQuietOff");
  });

  it("does not throw when the storage write rejects", async () => {
    const root = buildRoot();
    const setQuietMode = vi.fn().mockRejectedValue(new Error("storage fail"));
    wireEnvironmentQuestion(root, { translate, setQuietMode });

    expect(() => pick(root, "env-around")).not.toThrow();
    await Promise.resolve();
    expect(setQuietMode).toHaveBeenCalledWith(true);
  });

  it("the disposer detaches the change handlers", async () => {
    const root = buildRoot();
    const setQuietMode = vi.fn().mockResolvedValue(undefined);
    const dispose = wireEnvironmentQuestion(root, { translate, setQuietMode });

    dispose();
    pick(root, "env-around");
    await Promise.resolve();

    expect(setQuietMode).not.toHaveBeenCalled();
  });
});
