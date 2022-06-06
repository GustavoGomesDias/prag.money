import React, { HTMLInputTypeAttribute, ChangeEvent } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

export interface InputControlProps {
  id: string
  label: string
  placeholder: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSetHandle?: React.SetStateAction<any>
  onChangeHandle?: (e: ChangeEvent<HTMLInputElement>) => void
  onChangeHandlePayWith?: (e: ChangeEvent<HTMLInputElement>, info: number) => void
  paymentId?: number
  type?: HTMLInputTypeAttribute
  step?: string | number
  min?: string
  max?: string | number
  inputValue?: string | number | readonly string[] | undefined
  defaultValue?: string | number | readonly string[] | undefined
}

const BasicInput = React.forwardRef<HTMLInputElement, InputControlProps>(({
  id, label, placeholder, onSetHandle, onChangeHandle, type, step, min, max, onChangeHandlePayWith, paymentId, inputValue, defaultValue,
}: InputControlProps, ref): JSX.Element => {
  const handleFunction = (e: ChangeEvent<HTMLInputElement>) => {
    if (onSetHandle !== undefined) onSetHandle(e.target.value);
    if (onChangeHandle !== undefined) onChangeHandle(e);
    if (onChangeHandlePayWith !== undefined) onChangeHandlePayWith(e, paymentId as number);
  };

  return (
    <FormControl
      id={id}
      isRequired
      w="100%"
    >
      <FormLabel fontSize={{ base: '16px', md: '26px' }} fontWeight={{ base: 'bold', md: 'normal' }}>{label}</FormLabel>
      <Input
        isRequired={placeholder !== 'Search'}
        placeholder={placeholder}
        color="#00735C"
        bg="#fff"
        borderColor="#00735C"
        borderWidth="2px"
        borderRadius="5px"
        h="60px"
        w="full"
        fontSize={{ base: '16px', xl: '18px' }}
        type={type || ''}
        step={step || ''}
        min={min || ''}
        max={max || ''}
        ref={ref}
        value={inputValue}
        defaultValue={defaultValue}
        onChange={handleFunction}
        _hover={{
          borderColor: '#00735C',
          borderWidth: '2px',
          borderRadius: '5px',
        }}
      />
    </FormControl>
  );
});

export default BasicInput;
