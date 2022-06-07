import bcrypt from 'bcrypt';
import EncryptAdapter from '../../../serverless/adapters/services/EncryptAdapter';
import BcryptService from '../../../serverless/services/BcryptService';

afterAll(() => jest.resetAllMocks());

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    const result: string = await Promise.resolve('hash');
    return result;
  },
}));

const makeSut = (): EncryptAdapter => new BcryptService();

describe('Bcrypt Service', () => {
  test('Should call with correct password', async () => {
    const sut = makeSut();

    const spy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('password');

    expect(spy).toHaveBeenCalledWith('password', 12);
  });

  test('Should return hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('password');
    expect(hash).toBe('hash');
  });
});
