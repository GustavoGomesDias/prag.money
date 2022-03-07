import React, { useMemo, useReducer } from 'react';
import HistoryContext, { HistoryContextType } from './HistoryContext';
import historyReducer from './historyReducer';

export interface HistoryProviderProps {
  children: JSX.Element | JSX.Element[]
}

export default function HistoryProvider({ children }: HistoryProviderProps): JSX.Element {
  const [historyState, dispatchHistoryActions] = useReducer(historyReducer, {
    prevPath: '/',
    nextPath: '/',
  });

  const handleUpdatePrevPath = (prevPath: string): void => {
    dispatchHistoryActions({
      type: 'UPDATE_PREV',
      prevPath,
    });
  };

  const handleUpdateNextPath = (nextPath: string): void => {
    dispatchHistoryActions({
      type: 'UPDATE_NEXT',
      nextPath,
    });
  };

  const context: HistoryContextType = useMemo(() => ({
    prevPath: historyState.prevPath as string,
    nextPath: historyState.nextPath as string,
    handleUpdatePrevPath,
    handleUpdateNextPath,
  }), [historyState]);

  return (
    <HistoryContext.Provider value={context}>
      {children}
    </HistoryContext.Provider>
  );
}
