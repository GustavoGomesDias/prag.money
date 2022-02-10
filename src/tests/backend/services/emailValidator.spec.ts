import { EmailValidatorAdapter } from '../../../serverless/adapters/services/EmailValidatorAdapter';
import EmailValidator from '../../../serverless/services/EmailValidator';

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidator()
}

describe('Email validator', () => {
  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(sut, 'isEmail')
    sut.isEmail('any_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
});