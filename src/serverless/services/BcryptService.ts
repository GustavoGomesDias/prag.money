import EncryptAdapter from '../adapters/services/EncryptAdapter';
import bcrypt from 'bcrypt';

export default class BcryptService implements EncryptAdapter {
  async compare(password: string, passHashed: string): Promise<boolean> {
    return await bcrypt.compare(password, passHashed);
  }
  async encrypt(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  }
}