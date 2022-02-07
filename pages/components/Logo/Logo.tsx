import { useMediaQuery } from '@chakra-ui/react';
import React from 'react';

import classes from './Logo.module.css';

export interface Size {
  fontSize: string
}

const Logo = ({ fontSize }: Size): JSX.Element => {
  const [isSmallScreen] = useMediaQuery('(max-width: 768px)');
  return (
    <div
      className={classes['logo']}
      style={{
        fontSize: fontSize,
      }}
    >
      <p className={`${classes['logo-type']}`}>
        {isSmallScreen ? 'p.$' : 'Prag.Money$'}
      </p>
      <span className={`${classes['typing-cursor']} ${classes['cursor']}`}>
        _
      </span>
    </div>
  );
}

export default Logo;