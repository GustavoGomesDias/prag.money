import React, { HTMLInputTypeAttribute } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

export interface InputControlProps {
  id: string
  label: string
  placeholder: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangehandle: React.SetStateAction<any>
  type?: HTMLInputTypeAttribute
  step?: string | number
  min?: string
  max?: string | number
}

const BasicInput = ({
  id, label, placeholder, onChangehandle, type, step, min, max,
}: InputControlProps): JSX.Element => (
  <FormControl
    id={id}
    isRequired
    w="100%"
  >
    <FormLabel fontSize="26px">{label}</FormLabel>
    <Input
      placeholder={placeholder}
      bg="#fff"
      borderColor="#00735C"
      borderWidth="2px"
      borderRadius="5px"
      h="60px"
      w="full"
      fontSize="18px"
      type={type || ''}
      step={step || ''}
      min={min || ''}
      max={max || ''}
      onChange={((e) => onChangehandle(e.target.value))}
      _hover={{
        borderColor: '#00735C',
        borderWidth: '2px',
        borderRadius: '5px',
      }}
    />
  </FormControl>
);

export default BasicInput;
