import bcrypt from 'bcrypt';
import EncryptAdapter from '../../../serverless/adapters/services/EncryptAdapter';
import BcryptService from '../../../serverless/services/BcryptService';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  }
}));

const makeSut = (): EncryptAdapter => {
  return new BcryptService();
}

describe('Bcrypt Service', () => {
  test('Should call with correct password', async () => {
    const sut = makeSut();

    const spy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('password');

    expect(spy).toHaveBeenCalledWith('password', 12);
  })
});
