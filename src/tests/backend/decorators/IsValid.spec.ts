import IsValid from '../../../serverless/decorators/IsValid';
import { BadRequestError } from '../../../serverless/error/HttpError';

export interface IsValidMocked {
  field1: string
  field2: string
  field3: string
}

class IsValidTest {
  @IsValid({
    notEmpty: ['field1'],
  })
  async mockedFunction1(fields: IsValidMocked) {
    const result = await Promise.resolve(`${fields}`);
    return result;
  }
}

describe('IsEmail Decorator test', () => {
  test('Should return BadRequestError if paramName is undefined and firstField is different secondField', async () => {
    const mockedClass = new IsValidTest();
    await expect(mockedClass.mockedFunction1({ field1: '', field2: 'test', field3: 'test' }))
      .rejects.toThrow(new BadRequestError('Todos que tem * é um item obrigatório e deve ser preenchido.'));
  });
});
