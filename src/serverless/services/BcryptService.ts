import EncryptAdapter from '../adapters/services/EncryptAdapter';
import bcrypt from 'bcrypt';

export default class BcryptService implements EncryptAdapter {
  async encrypt(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  }
}