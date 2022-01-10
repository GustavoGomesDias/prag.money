import React from 'react';

import classes from './Logo.module.css';

export interface Size {
  fontSize: string
}

const Logo = ({ fontSize }: Size): JSX.Element => {
  return (
    <div
      className={classes['logo']}
      style={{
        fontSize: fontSize,
      }}
    >
      <p className={`${classes['logo-type']}`}>
        Prag.Money$
      </p>
      <span className={`${classes['typing-cursor']} ${classes['cursor']}`}>
        _
      </span>
    </div>
  );
}

export default Logo;