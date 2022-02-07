import React from 'react';
import { Flex, Box, chakra, useMediaQuery, Image } from '@chakra-ui/react';
import { FaMoneyBillWaveAlt, FaCreditCard, FaTshirt, FaHamburger, FaMobile } from 'react-icons/fa';
import classes from './Home.module.css';

const Section = (): JSX.Element => {
  const [isSmallScreen] = useMediaQuery('(max-width: 768px)');
  // const [isMdScreen] = useMediaQuery('(max-width: 1000px)');
  // const [isLargeScreen] = useMediaQuery('(min-width: 1200px)');
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="2em"
      w="full"
      flexDir={isSmallScreen ? 'column' : 'row'}
    >
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        className={classes['p1-animation']}
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
      {!isSmallScreen && <Image src="/wallet.svg" alt="Wallet image" w="40%" />}
      {isSmallScreen && <Box bgImage="/vault.svg" bgRepeat="repeat-x" bgSize="20%" w="100%" h="100px" p="1em" />}
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        className={classes['p2-animation']}
      >
        <Flex justifyContent="center">
          <Box
            borderRight="2px #00735C solid"
            marginRight="15px"
            w="full"
          >
            <FaTshirt size="60px" style={{ marginRight: "15px" }} />
          </Box>
          <Box
            borderRight="2px #00735C solid"
            marginRight="15px"
            w="full"
          >
            <FaHamburger size="60px" style={{ marginRight: "15px" }} />
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
    </Flex>
  );
}

export default Section;
