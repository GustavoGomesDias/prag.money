import React, { HTMLInputTypeAttribute, ChangeEvent } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

export interface InputControlProps {
  id: string
  label: string
  placeholder: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSetHandle?: React.SetStateAction<any>
  onChangeHandle?: (e: ChangeEvent<HTMLInputElement>) => void
  type?: HTMLInputTypeAttribute
  step?: string | number
  min?: string
  max?: string | number
}

const BasicInput = React.forwardRef<HTMLInputElement, InputControlProps>(({
  id, label, placeholder, onSetHandle, onChangeHandle, type, step, min, max,
}: InputControlProps, ref): JSX.Element => (
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
      ref={ref}
      onChange={onSetHandle !== undefined ? ((e) => onSetHandle(e.target.value)) : onChangeHandle}
      _hover={{
        borderColor: '#00735C',
        borderWidth: '2px',
        borderRadius: '5px',
      }}
    />
  </FormControl>
));

export default BasicInput;
