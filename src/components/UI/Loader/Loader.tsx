import React from 'react';
import Image from 'next/image';
import { Flex } from '@chakra-ui/react';
import classes from './Loader.module.css';
import Logo from '../Logo/Logo';

const Loader = (): JSX.Element => (
  <Flex>
    <Image src="/dollar.svg" alt="Image Loading" width="60px" height="60px" className={classes.loader} />
    <Logo fontSize="36px" logo="Money" />
  </Flex>
);

export default Loader;
