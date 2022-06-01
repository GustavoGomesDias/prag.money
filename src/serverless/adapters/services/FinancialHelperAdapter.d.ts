import GetAcquisitions from '../../data/usecases/GetAcquisitions';

export interface GetDate {
  day: number
  month: number
}

/* eslint-disable semi */
export default interface FinancialHelperAdapter {
  getDayAndMonth(date: string): GetDate
  updateCurrentValue(acquisition: GetAcquisitions): void
}
