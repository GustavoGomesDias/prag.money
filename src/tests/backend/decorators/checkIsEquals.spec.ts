import CheckIsEquals from '../../../serverless/decorators/CheckIsEquals';

class CheckIsEqualsDecoratorTest {
  @CheckIsEquals({ firstFieldName: 'field1', secondFieldName: 'field2', messageError: 'Error' })
  async mockedFunction1(field1: string, field2: string) {
    const result = await Promise.resolve(`${field1} - ${field2}`);
    return result;
  }
}

describe('CheckIsEqual Decorator test', () => {
  test('Should return BadRequestError if paramName is undefined and firstField is different secondField', async () => {
    try {
      const mockedClass = new CheckIsEqualsDecoratorTest();

      // const spy = jest.spyOn(CheckIsEqualsDecoratorTest.prototype, 'mockedFunction1');

      await mockedClass.mockedFunction1(':V', ':O');
    } catch (err) {
      expect((err as Error).message).toEqual('Error');
    }
  });
});
