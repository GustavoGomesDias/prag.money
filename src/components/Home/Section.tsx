import React from 'react';
import Link from 'next/link';
import {
  Flex, Box, chakra, Image, Button,
} from '@chakra-ui/react';
import {
  FaMoneyBillWaveAlt, FaCreditCard, FaTshirt, FaHamburger, FaMobile,
} from 'react-icons/fa';
import classes from './Home.module.css';

const Section = (): JSX.Element => (
  <Flex
    justifyContent="center"
    alignItems="center"
    padding="2em"
    w="full"
    flexDir="row"
  >
    <Flex flexDir="column" alignItems="center">
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        className={classes['p1-animation']}
        mb="15px"
      >
        <Flex justifyContent="center">
          <Box
            borderRight="2px #00735C solid"
            marginRight="15px"
            w="full"
          >
            <FaMoneyBillWaveAlt size="60px" style={{ marginRight: '15px' }} />
          </Box>
          <Box
            marginRight="15px"
            w="full"
          >
            <FaCreditCard size="60px" />
          </Box>
        </Flex>
        <chakra.h3 fontSize={{ base: '30px', md: '36px' }} textAlign="center">Cadastre várias formas de pagamento</chakra.h3>
      </Flex>
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        className={classes['p2-animation']}
        mb="15px"
      >
        <Flex justifyContent="center">
          <Box
            borderRight="2px #00735C solid"
            marginRight="15px"
            w="full"
          >
            <FaTshirt size="60px" style={{ marginRight: '15px' }} />
          </Box>
          <Box
            borderRight="2px #00735C solid"
            marginRight="15px"
            w="full"
          >
            <FaHamburger size="60px" style={{ marginRight: '15px' }} />
          </Box>
          <Box
            marginRight="15px"
            w="full"
          >
            <FaMobile size="60px" />
          </Box>
        </Flex>
        <chakra.h3 fontSize={{ base: '30px', md: '36px' }} textAlign="center">Use-as para trackear suas compras</chakra.h3>
      </Flex>
      <Link href="/register" passHref>
        <Button colorScheme="teal" width={{ base: '80%', md: '100%' }} bg="#fff" size="lg" variant="outline" fontWeight="bold">
          Cadastre-se
        </Button>
      </Link>
    </Flex>
    <Image display={{ base: 'none', md: 'block' }} src="/wallet.svg" alt="Wallet image" w="40%" />
  </Flex>
);

export default Section;
