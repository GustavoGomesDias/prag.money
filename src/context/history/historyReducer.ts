export interface HistoryState {
  prevPath?: string
  nextPath?: string
}

export interface HistoryActions {
  type: 'UPDATE_PREV' | 'UPDATE_NEXT'
  prevPath?: string
  nextPath?: string
}

const historyReducer = (state: HistoryState, actions: HistoryActions): HistoryState => {
  if (actions.type === 'UPDATE_PREV') {
    return {
      prevPath: actions.prevPath,
      nextPath: state.nextPath,
    };
  }

  if (actions.type === 'UPDATE_NEXT') {
    return {
      prevPath: state.prevPath,
      nextPath: actions.nextPath,
    };
  }
  return {
    nextPath: '/',
    prevPath: '/',
  };
};

export default historyReducer;
