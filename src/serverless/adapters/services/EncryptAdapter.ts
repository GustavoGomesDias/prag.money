export default interface EncryptAdapter {
  encrypt(password: string): Promise<string>
}