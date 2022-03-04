import { createContext } from 'react';

export interface HistoryType {
  prevPath: string
  nextPath: string
}

export interface HistoryContextType extends HistoryType {
  handleUpdatePrevPath(prevPath: string): void
  handleUpdateNextPath(nextPath: string): void
}

export default createContext<HistoryContextType>({
  prevPath: '/',
  nextPath: '/',
  handleUpdatePrevPath: (prevPath: string) => console.log(prevPath),
  handleUpdateNextPath: (nextPath: string) => console.log(nextPath),
})
