import React, { FormEvent } from 'react';
import classes from './Form.module.css';

export interface FormProps {
  handleSubmit: (e: FormEvent) => Promise<void>
  children: React.ReactNode
  fullWidth?: boolean
}

const Form = ({ handleSubmit, children, fullWidth }: FormProps): JSX.Element => (
  <form className={`${classes.form} ${fullWidth !== undefined && classes['full-width']}`} onSubmit={handleSubmit}>
    {children}
  </form>
);

export default Form;
