import React from 'react';
import Image from 'next/image';
import classes from './Loader.module.css';
import { Flex } from '@chakra-ui/react';
import Logo from '../Logo/Logo';

const Loader = (): JSX.Element => {
  return (
    <Flex>

      <Image src="/dollar.svg" alt="Image Loading" width="60px" height="60px" className={classes.loader} />
      <Logo fontSize={'36px'} />
    </Flex>
  );
};

export default Loader;