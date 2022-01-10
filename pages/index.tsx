import type { NextPage } from 'next'
import { Flex, Box, chakra } from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';

import Header from './components/Header/Header'
import SEO from './components/SEO'
import Section from './components/Home/Section';

const styles = {
  color: '#00E091',
  textDecoration: 'underline wavy #00735C'
}

const Home: NextPage = () => {

  return (
    <>
      <SEO title="p.$_ | Home" description="Home Page" />
      <Header />
      <Box marginTop="15px">
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
        >
          <FaWallet size="80px" />
          <chakra.h1
            fontSize="48px"
            fontWeight="bold"
          >
            Controle seu <span style={styles}>dinheiro</span> de forma <span style={styles}>pragmatica</span>
          </chakra.h1>
          <Section />
        </Flex>
      </Box>
    </>
  );
}

export default Home;
