import React, { useContext } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { Flex, Grid, Select } from '@chakra-ui/react';

import Header from '../components/Header/Header';
import SEO from '../components/SEO';
import { AuthContext } from '../context/AuthContext';

const Dashboard = (): JSX.Element => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <SEO title="p.$ | Dashboard" description="Dashboard page" />
      <Header logo="Dash" />
      <Flex w="100%" h="90%" justifyContent="flex-end" flexDir="column" position="absolute">
        <Flex
          width="100%"
          justifyContent="flex-end"
          padding="1em"
        >
          <Flex
            width="30%"
            padding="0.8em"
            alignItems="center"
            justifyContent="center"
            bg="#fff"
            borderRadius="5px"
            border="2px solid #00735C"
          >
            <Select
              variant="outline"
              placeholder="Select option"
              width="50%"
              height="2.5em"
              mr="15px"
              bg="#fff"
              borderRadius="5px"
              border="2px solid #00735C"
              borderColor="initial"
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
            Saldo: R$ 0000,00
          </Flex>

        </Flex>
        <Grid
          templateRows="repeat(1, 1fr)"
          templateColumns="150px 90%"
          w="100%"
          h="90%"
          gap={4}
          px="1em"
        >
          <Flex bg="tomato">{user?.userInfo.email}</Flex>
          <Grid templateRows="repeat(2, 1fr)" gap={4}>
            <Flex bg="papayawhip" w="full">1</Flex>
            <Flex bg="papayawhip" w="full">1</Flex>
          </Grid>
        </Grid>
      </Flex>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken } = parseCookies(ctx);

  if (!authToken || authToken === undefined || authToken === null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
