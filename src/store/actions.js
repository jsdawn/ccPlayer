import * as types from "./mutation-types.js";

const actions = {
  selectPlay({ commit, state }, { list, index }) {
    commit(types.SET_PLAY_LIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_CURRENT_MUSIC, index);
    // commit(types.SET_FULL_SCREEN, true);
  }
};
export default actions;
