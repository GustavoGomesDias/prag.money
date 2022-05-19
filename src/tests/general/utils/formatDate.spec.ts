import formatDate from '../../../utils/formatDate';

describe('Format Date code util tests', () => {
  test('Should return date in format DD/MM/YYYY', () => {
    const date = new Date('2022-03-28T00:00:00Z');

    const day = date.getDate();
    const formatedDate = formatDate(date);

    expect(formatedDate).toEqual(`${day + 1}/3/2022`);
  });
});
