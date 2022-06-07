import React from 'react';
import {
  Box, chakra, Flex,
} from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';

import Section from './Section';
// import HealthBeat from '../Layout/HealthBeatMonitor/HealthBeat';

const styles = {
  color: '#6e978f',
};

const Home = (): JSX.Element => (
  <Box marginTop="15px" p="1em">
    <Flex
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <FaWallet size="80px" />
      <chakra.h1
          // fontSize={isSmallScreen ? '40px' : '48px'}
        fontSize={{ base: '36px', md: '48px' }}
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

export default Home;
