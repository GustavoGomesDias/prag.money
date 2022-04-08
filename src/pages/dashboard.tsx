import React, { useContext, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import {
  Flex, Grid, useToast,
} from '@chakra-ui/react';

import Header from '../components/UI/Header/Header';
import SEO from '../components/SEO';
import Actions from '../components/Dashboard/Actions/Actions';
import PaymentsMethods from '../components/Dashboard/PaymentsMethods';
// import PurchaseCard from '../components/Dashboard/PurchaseDescription/PurchaseCard';
import api from '../services/fetchAPI/init';
import PaymentModel from '../serverless/data/models/PaymentModel';
import toastConfig from '../utils/config/tostConfig';
import PurchaseContext from '../context/purchases/PurchaseContext';
import SideActions from '../components/Dashboard/Actions/SideActions';
import PurchaseTable from '../components/Dashboard/Table/PurchaseTable';
import MobileDisplayTable from '../components/Dashboard/Table/MobileDispalyTable';

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
            templateColumns={{ base: '90%', xl: '10% 85%' }}
            w="100%"
            h="100%"
            gap={4}
            justifyContent="center"
            alignItems="center"
            flexDir={{ base: 'column', md: 'row' }}
            display={{ base: 'flex', md: 'grid' }}
          >
            <Flex
              w="full"
            >
              <Actions />
              <SideActions />
            </Flex>
            <Flex
              w={{ base: '90%', md: 'full', xl: 'full' }}
              bg="#fff"
              border="2px solid #00735C"
              borderRadius="5px"
            >
              <PurchaseTable purchases={purchaseCtx.purchases} />
              <MobileDisplayTable purchases={purchaseCtx.purchases} />
            </Flex>
            {/* <Grid templateRows="repeat(1, 1fr)" gap={4}>
              <Grid
                bg="#fff"
                border="2px solid #00735C"
                borderRadius="5px"
                padding="1em"
                templateColumns="repeat(5, 1fr)"
                gap={2}
              >
                {purchaseCtx.purchases.length > 0 && purchaseCtx.purchases.map((purchase) => (
                  <PurchaseCard
                    key={purchase.id}
                    id={Number(purchase.id)}
                    description={purchase.description}
                    value={purchase.value}
                    purchaseDate={formatDate(new Date(purchase.purchase_date))}
                  />
                ))}
              </Grid>
            </Grid> */}
          </Grid>
        </Flex>
      </Flex>
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
