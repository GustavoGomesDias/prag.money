import IsDayOfTheMonth from '../../../serverless/decorators/IsDayOfTheMonth';

class IsDayOfMonthTest {
  @IsDayOfTheMonth({ fieldName: 'field1' })
  async mockedFunction1(field1: number) {
    const result = await Promise.resolve(`${field1}`);
    return result;
  }
}

describe('IsDayOfMonth Decorator test', () => {
  test('Should return BadRequestError if paramName is undefined and first field is not valid month day', async () => {
    try {
      const mockedClass = new IsDayOfMonthTest();
      await mockedClass.mockedFunction1(32);
    } catch (err) {
      expect((err as Error).message).toEqual('Por favor, forneça um dia que seja valido.');
    }
  });
});
