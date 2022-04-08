import React, { FormEvent } from 'react';
import classes from './Form.module.css';

export interface FormProps {
  handleSubmit: (e: FormEvent) => Promise<void>
  children: React.ReactNode
}

const Form = ({ handleSubmit, children }: FormProps): JSX.Element => (
  <form className={classes.form} onSubmit={handleSubmit}>
    {children}
  </form>
);

export default Form;
