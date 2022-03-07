import React from 'react';
import {
  Box, chakra, Flex, useMediaQuery,
} from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';

import Section from './Section';

const styles = {
  color: '#00E091',
  textDecoration: 'underline wavy #00735C',
};

const Home = (): JSX.Element => {
  const [isSmallScreen] = useMediaQuery('(max-width: 768px)');
  // const [isMdScreen] = useMediaQuery('(max-width: 1000px)');
  return (
    <Box marginTop="15px">
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        <FaWallet size="80px" />
        <chakra.h1
          fontSize={isSmallScreen ? '40px' : '48px'}
          fontWeight="bold"
          textAlign="center"
        >
          Controle seu
          {' '}
          <span style={styles}>dinheiro</span>
          {' '}
          de forma
          {' '}
          <span style={styles}>pragmática</span>
        </chakra.h1>
        <Section />
      </Flex>
    </Box>
  );
};

export default Home;
