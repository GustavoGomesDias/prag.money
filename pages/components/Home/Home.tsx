import React from 'react';
import { Box, Button, chakra, Flex, useMediaQuery } from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';
import classes from './Home.module.css';

import Section from './Section';


const styles = {
  color: '#00E091',
  textDecoration: 'underline wavy #00735C'
}

const Home = (): JSX.Element => {
  const [isMdScreen] = useMediaQuery('(max-width: 1000px)');
  return (
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
          textAlign="center"
        >
          Controle seu <span style={styles}>dinheiro</span> de forma <span style={styles}>pragmatica</span>
        </chakra.h1>
        <Section />
        <Button className={classes['button-animation']} width="30%" fontSize="2xl" color="#00735C" display="flex"  flexDir="row" alignItems="center">Cadastre-se</Button>
      </Flex>
    </Box>
  );
};

export default Home;
