/* eslint-disable no-param-reassign */
import FinancialHelperAdapter, { GetDate } from '../adapters/services/FinancialHelperAdapter';
import GetAcquisitions from '../data/usecases/GetAcquisitions';

export default class FinancialHelper implements FinancialHelperAdapter {
  getDayAndMonth(date: string): GetDate {
    const createdAt = new Date(date);
    const day = createdAt.getDate();
    const month = createdAt.getMonth() + 1;

    return {
      day, month,
    };
  }

  updateCurrentValue(acquisition: GetAcquisitions): void {
    let currentValue = 0;
    const currentDate = new Date();
    if (Array.isArray(acquisition.PayWith)) {
      for (const paids of acquisition.PayWith) {
        const { day, month } = this.getDayAndMonth(paids.purchase.created_at);
        if (day >= acquisition.reset_day && (currentDate.getMonth() + 1) === month) {
          currentValue += paids.value;
        }
      }

      acquisition.default_value -= currentValue;
    } else {
      const { day, month } = this.getDayAndMonth(acquisition.PayWith.purchase.created_at);

      if (day >= acquisition.reset_day && (currentDate.getMonth() + 1) === month) {
        acquisition.default_value -= acquisition.PayWith.value;
      }
    }
  }
}
