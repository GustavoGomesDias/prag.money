import { useMediaQuery } from '@chakra-ui/react';
import React, { FormEvent } from 'react';
import classes from './Form.module.css';

export interface FormProps {
  handleSubmit: (e: FormEvent) => Promise<void>
  children: React.ReactNode
}

const Form = ({ handleSubmit, children }: FormProps): JSX.Element => {
  const [isSmallScreen] = useMediaQuery('(max-width: 768px)');
  return (
    <form className={classes.form} style={{ width: isSmallScreen ? '90%' : '50%' }} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

export default Form;
