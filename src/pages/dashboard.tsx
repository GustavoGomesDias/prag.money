import React, { useContext, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import {
  Flex, Grid, useToast,
} from '@chakra-ui/react';

import Header from '../components/UI/Header/Header';
import SEO from '../components/SEO';
import Actions from '../components/Dashboard/Actions';
import PaymentsMethods from '../components/Dashboard/PaymentsMethods';
import PurchaseDescription from '../components/Dashboard/PurchaseDescription/PurchaseDescription';
import api from '../services/fetchAPI/init';
import PaymentModel from '../serverless/data/models/PaymentModel';
import toastConfig from '../utils/config/tostConfig';
import PurchaseContext from '../context/purchases/PurchaseContext';
import formatDate from '../utils/formatDate';

export interface DashboardProps {
  payments?: PaymentModel[]
  error?: {
    statusCode: number
    error: string
  }
}

const Dashboard = ({ payments, error }: DashboardProps): JSX.Element => {
  const toast = useToast();
  const purchaseCtx = useContext(PurchaseContext);

  useEffect(() => {
    console.log(purchaseCtx.purchases);
  }, [purchaseCtx.purchases]);

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
  });

  return (
    <>
      <SEO title="p.$ | Dashboard" description="Dashboard page" />
      <Header logo="Dash" />
      <Flex
        w="100%"
        h="100%"
        justifyContent="flex-end"
        flexDir="column"
      >
        {payments !== undefined && <PaymentsMethods payments={payments} />}

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
                {purchaseCtx.purchases.length > 0 && purchaseCtx.purchases.map((purchase) => (
                  <PurchaseDescription key={purchase.id} description={purchase.description} value={purchase.value} purchaseDate={formatDate(new Date(purchase.purchase_date))} />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Flex>
      </Flex>
    </>
  );
};
export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { authToken, userId } = parseCookies(ctx);

  const response = await api.get(`/user/payment/${userId}`);

  if (!authToken || authToken === undefined || authToken === null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (response.statusCode !== 400 && response.statusCode !== 200) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (response.statusCode === 400) {
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
      payments: (response.data.content as ({ [key: string]: PaymentModel[] })).payments,
    },
  };
};
