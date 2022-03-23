import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import {
  Flex, Grid,
} from '@chakra-ui/react';

import Header from '../components/UI/Header/Header';
import SEO from '../components/SEO';
import Actions from '../components/Dashboard/Actions';
import PaymentsMethods from '../components/Dashboard/PaymentsMethods';
import PurchaseDescription from '../components/Dashboard/PurchaseDescription/PurchaseDescription';
// import { AuthContext } from '../context/AuthContext';

// const { user } = useContext(AuthContext);
const Dashboard = (): JSX.Element => (
  <>
    <SEO title="p.$ | Dashboard" description="Dashboard page" />
    <Header logo="Dash" />
    <Flex
      w="100%"
      h="100%"
      justifyContent="flex-end"
      flexDir="column"
    >
      <PaymentsMethods />
      <Flex
        width="100%"
        mb="15px"
        alignItems="center"
        justifyContent="center"
        overflowX="hidden"
      >
        <Grid
          templateRows="repeat(1, 1fr)"
          templateColumns="10% 85%"
          w="100%"
          h="100%"
          gap={4}
          justifyContent="center"

        >
          <Actions />
          <Grid templateRows="repeat(1, 1fr)" gap={4}>
            <Grid
              bg="#fff"
              border="2px solid #00735C"
              borderRadius="5px"
              padding="1em"
              templateColumns="repeat(5, 1fr)"
              gap={2}
            >
              <PurchaseDescription />
            </Grid>
          </Grid>
        </Grid>
      </Flex>
    </Flex>
  </>
);
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
