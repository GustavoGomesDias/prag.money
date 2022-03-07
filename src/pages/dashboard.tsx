import React, { useContext } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { Flex, Grid } from '@chakra-ui/react';

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
