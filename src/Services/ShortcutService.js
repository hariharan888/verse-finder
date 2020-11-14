import MouseTrap from "mousetrap";
import _ from "lodash";
import Emitter from "Helpers/Emitter";

const subject$ = new Emitter();

const performAction = (e, { name, action }) => {
  subject$.emit(name);
  action();
};

const keyBoardMaps = [
  {
    name: "SEARCH_INPUT_FOCUS",
    keys: ["mod+f", "mod+space"],
    action: _.noop
  }
];

const registerShortcutListener = () => {
  _.each(keyBoardMaps, config =>
    MouseTrap.bind(config.keys, e => performAction(e, config))
  );
};

// var input = document.querySelector("input");
// var mt = new Mousetrap(input);

export default {
  Shortcut: subject$,
  registerShortcutListener
};
