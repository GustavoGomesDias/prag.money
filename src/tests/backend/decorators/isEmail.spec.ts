import IsEmail from '../../../serverless/decorators/IsEmail';
import { BadRequestError } from '../../../serverless/error/HttpError';

export interface IsEmailTestMocked {
  email: string
}

class IsEmailTest {
  @IsEmail()
  async mockedFunction1(email: string) {
    const result = await Promise.resolve(`${email}`);
    return result;
  }
}

describe('IsEmail Decorator test', () => {
  test('Should return BadRequestError if paramName is undefined and firstField is different secondField', async () => {
    const mockedClass = new IsEmailTest();
    await expect(mockedClass.mockedFunction1('email2emai.com'))
      .rejects.toThrow(new BadRequestError('E-mail inválido.'));
  });
});
