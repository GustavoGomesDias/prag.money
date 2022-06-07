import { validationField } from '../../../utils/validations';

describe('Handle Validate Field', () => {
  test('Should return true if field equal undefined', () => {
    const field = undefined;
    const testField = validationField(field as unknown as string);
    expect(testField).toBeTruthy();
  });

  test('Should return true if field equal null', () => {
    const field = null;
    const testField = validationField(field as unknown as string);
    expect(testField).toBeTruthy();
  });

  test('Should return true if field equal empty string', () => {
    const field = '';
    const testField = validationField(field as unknown as string);
    expect(testField).toBeTruthy();
  });

  test('Should return true if field equal string with space', () => {
    const field = ' ';
    const testField = validationField(field as unknown as string);
    expect(testField).toBeTruthy();
  });

  test('Should return false if field equal a valid string', () => {
    const field = 'valid string';
    const testField = validationField(field as unknown as string);
    expect(testField).toBeFalsy();
  });
});
