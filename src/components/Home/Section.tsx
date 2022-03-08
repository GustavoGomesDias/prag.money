import React from 'react';
import Link from 'next/link';
import {
  Flex, Box, chakra, useMediaQuery, Image, Button,
} from '@chakra-ui/react';
import {
  FaMoneyBillWaveAlt, FaCreditCard, FaTshirt, FaHamburger, FaMobile,
} from 'react-icons/fa';
import classes from './Home.module.css';

const Section = (): JSX.Element => {
  const [isSmallScreen] = useMediaQuery('(max-width: 768px)');

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      padding="2em"
      w="full"
      flexDir="row"
    >
      <Flex flexDir="column">
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
          <chakra.h3 fontSize="36px" textAlign="center">Cadastre várias formas de pagamento</chakra.h3>
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
          <chakra.h3 fontSize="36px" textAlign="center">Use-as para trackear suas compras</chakra.h3>
        </Flex>
        {!isSmallScreen && (
          <Link href="/register" passHref>
            <Button colorScheme="teal" width="100%" bg="#fff" size="lg" variant="outline" fontWeight="bold">
              Cadastre-se
            </Button>
          </Link>
        )}
      </Flex>
      {!isSmallScreen && <Image src="/wallet.svg" alt="Wallet image" w="40%" />}
    </Flex>
  );
};

export default Section;
