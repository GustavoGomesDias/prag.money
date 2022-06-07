import React from 'react';
import Link from 'next/link';
import {
  Flex, Box, chakra, Button,
} from '@chakra-ui/react';
import {
  FaMoneyBillWaveAlt, FaCreditCard, FaTshirt, FaHamburger, FaMobile,
} from 'react-icons/fa';
import MoneyBeat from '../Layout/MoneyBeat/MoneyBeat';

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
        <chakra.h3 fontSize={{ base: '30px', md: '36px' }} textAlign="center">Cadastre suas contas de forma prática</chakra.h3>
      </Flex>
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
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
        <chakra.h3 fontSize={{ base: '30px', md: '36px' }} textAlign="center">E tenha controle sobre sua vida financeira</chakra.h3>
      </Flex>
      <Link href="/register" passHref>
        <Button
          colorScheme="teal"
          w="100%"
          size="lg"
          variant="outline"
          fontWeight="bold"
          borderColor="initial"
          border="2px solid"
          margin="0px !important"
          fontSize="18px"
          style={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        >
          Cadastre-se
        </Button>
      </Link>
    </Flex>
    <MoneyBeat />
  </Flex>
);

export default Section;
