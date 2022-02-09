import React, { HTMLInputTypeAttribute } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

export interface InputControlProps {
  id: string
  label: string
  placeholder: string
  onChangehandle: React.SetStateAction<any>
  type?: HTMLInputTypeAttribute
}

const BasicInput = ({ id, label, placeholder, onChangehandle, type }: InputControlProps): JSX.Element => {
  return (
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
        type={type ? type : ''}
        onChange={((e) => onChangehandle(e.target.value))}
        _hover={{
          borderColor: '#00735C',
          borderWidth: '2px',
          borderRadius: '5px',
        }}
      />
    </FormControl>
  );
}

export default BasicInput;
