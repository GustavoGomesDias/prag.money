import React from 'react';
import Link from 'next/link';
import { Button, Flex } from '@chakra-ui/react';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import Logo from '../Logo/Logo';

const FormHeader = (): JSX.Element => (
  <Flex
    justifyContent="space-between"
    w="full"
    px="1em"
    py="3em"
  >
    <Link href="/" passHref>
      <Button variant="link" color="#00735C" fontSize="26px">
        {' '}
        <FaLongArrowAltLeft />
        Voltar
      </Button>
    </Link>
    <Logo fontSize="40px" logo="Money" />
  </Flex>
);

export default FormHeader;
