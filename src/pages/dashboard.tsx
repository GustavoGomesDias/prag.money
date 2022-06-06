import React, {
  useContext, useEffect,
} from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import {
  Flex, Grid, useToast,
} from '@chakra-ui/react';

import Header from '../components/UI/Header/Header';
import SEO from '../components/SEO';
import Actions from '../components/Dashboard/Actions/Actions';
import PaymentsMethods from '../components/Dashboard/PaymentsMethods';
import api from '../services/fetchAPI/init';
import PaymentModel from '../serverless/data/models/PaymentModel';
import toastConfig from '../utils/config/tostConfig';
import PurchaseContext from '../context/purchases/PurchaseContext';
import PaymentContext from '../context/payment/PaymentContext';
import SideActions from '../components/Dashboard/Actions/SideActions';
import PurchaseTable from '../components/Dashboard/Table/PurchaseTable';
import MobileDisplayTable from '../components/Dashboard/Table/MobileDispalyTable';

export interface DashboardProps {
  payments: PaymentModel[]
  error?: {
    statusCode: number
    error: string
  }
}

const Dashboard = ({ payments, error }: DashboardProps): JSX.Element => {
  const toast = useToast();
  const purchaseCtx = useContext(PurchaseContext);
  const { handleSetPayments } = useContext(PaymentContext);

  const refresh = async () => {
    const { authToken, userId } = parseCookies();
    api.setAuthHeader(`Bearer ${authToken}`);
    const response = await api.get(`/user/payment/${userId}`);

    handleSetPayments(response.data.content !== undefined ? (response.data.content as ({ [key: string]: PaymentModel[] })).payments : []);
  };

  useEffect(() => {
    const handlePayment = () => {
      if (error) {
        if (error.statusCode === 400) {
          toast({
            title: '📣',
            description: error.error,
            status: 'info',
            ...toastConfig,
          });
        } else {
          toast({
            title: '😔',
            description: error.error,
            status: 'error',
            ...toastConfig,
          });
        }
      }
    };

    handlePayment();
    handleSetPayments(payments);
  }, []);

  return (
    <>
      <SEO title="p.$ | Dashboard" description="Dashboard page" />
      <Header logo="Dash" />
      <Grid
        templateRows="repeat(1, 1fr)"
        templateColumns={{ base: 'repeat(1, 1fr)', xl: '10% 90%' }}
        w="100%"
        justifyContent="center"
        alignItems="center"
        flexDir={{ base: 'column', md: 'row' }}
        display={{ base: 'flex', md: 'grid' }}
        overflowX="hidden"
      >
        <Flex
          w="full"
        >
          <Actions />
          <SideActions />
        </Flex>
        <Flex
          w={{ base: '90%', md: 'full', xl: 'full' }}
          bg="linear(to-br, #031426, #081828, #031426, #0b243f, #081828, #081828)"
          h="100vh"
          flexDir="column"
        >
          <PaymentsMethods refresh={refresh} />
          <PurchaseTable purchases={purchaseCtx.purchases} paymentId={purchaseCtx.paymentId} />
          <MobileDisplayTable purchases={purchaseCtx.purchases} paymentId={purchaseCtx.paymentId} />
        </Flex>
      </Grid>
    </>
  );
};
export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken, userId } = parseCookies(ctx);

  if (!authToken || authToken === undefined || authToken === null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  api.setAuthHeader(`Bearer ${authToken}`);
  const response = await api.get(`/user/payment/${userId}`);

  if (response.statusCode !== 200) {
    return {
      props: {
        error: {
          statusCode: response.statusCode,
          error: response.data.error,
        },
      },
    };
  }

  return {
    props: {
      payments: response.data.content !== undefined ? (response.data.content as ({ [key: string]: PaymentModel[] })).payments : [],
    },
  };
};
