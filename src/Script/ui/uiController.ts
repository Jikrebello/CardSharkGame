import { IRunState, IUIBindings } from "../domain/data/data.interfaces";
import { Side } from "../domain/data/data.types";
import { createAnimations } from "../ui/uiAnimations";
import { initializeUIBindings } from "../ui/uiBindings";
import { createRenderer } from "../ui/uiRenderer";

export function createUI(
  _getState: () => IRunState,
  onRestart: () => void,
  onFlip: (side: Side) => void,
  onBank: () => void,
): IUIBindings {
  const bindings = initializeUIBindings({
    onRestart,
    onFlip,
    onBank,
  });

  const renderer = createRenderer(bindings.dom);
  const animations = createAnimations(bindings.dom, bindings.setInputLocked);

  function init() {
    bindings.bind();
  }

  function render(state: IRunState) {
    renderer.render(state, { inputLocked: bindings.isInputLocked() });
  }

  return {
    init,
    render,
    setMessage: renderer.setMessage,
    lockInput: animations.lockInput,
    revealBoth: animations.revealBoth,
    resetCards: animations.resetCards,
    showGameOver: renderer.showGameOver,
    hideGameOver: renderer.hideGameOver,
  };
}
