import formatDate from '../../../utils/formatDate';

afterAll(() => jest.resetAllMocks());

describe('Format Date code util tests', () => {
  test('Should return date in format DD/MM/YYYY', () => {
    const date = new Date('2022-03-28T03:00:00Z');
    const formatedDate = formatDate(date);

    expect(formatedDate).toEqual('28/03/2022');
  });

  test('Should return date in format DD/MM/YYYY', () => {
    const date = new Date('2022-12-08T03:00:00Z');
    const formatedDate = formatDate(date);

    expect(formatedDate).toEqual('08/12/2022');
  });
});
