import React, {
  useContext, useEffect, useState,
} from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import {
  Flex, Grid, useToast,
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import Header from '../components/UI/Header/Header';
import SEO from '../components/SEO';
import Actions from '../components/Dashboard/Actions/Actions';
import PaymentsMethods from '../components/Dashboard/PaymentMethods/PaymentsMethods';
import api from '../services/fetchAPI/init';
import PaymentModel from '../serverless/data/models/PaymentModel';
import toastConfig from '../utils/config/tostConfig';
import PurchaseContext from '../context/purchases/PurchaseContext';
import PaymentContext from '../context/payment/PaymentContext';
import SideActions from '../components/Dashboard/Actions/SideActions';
import PurchaseTable from '../components/Dashboard/Table/PurchaseTable';
import MobileDisplayTable from '../components/Dashboard/Table/MobileDispalyTable';
import CreateForm from '../components/Dashboard/Form/Payments/CreateForm';
import CreatePurchase from '../components/Dashboard/Form/Purchase/PurchaseForm';
import PragModal from '../components/Layout/PragModal';
import InfoContainer from '../components/Layout/InfoContainer';

export interface DashboardProps {
  payments: PaymentModel[]
  error?: {
    statusCode: number
    error: string
  }
}

const Dashboard = ({ payments, error }: DashboardProps): JSX.Element => {
  const [actualAction, setActualAction] = useState<number>(0);
  const [notHavePayment, setNotHavePayment] = useState<boolean>(false);

  const { push } = useRouter();
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
        if (error.statusCode === 404) {
          setNotHavePayment(true);
          return;
        }

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
      <PragModal isOpen={notHavePayment}>
        <InfoContainer
          action="Cadastrar pagamento"
          message="Você ainda não tem uma conta cadastrada e para usar será necessário ter uma. Vamos lá?"
          handleAction={() => push('/payment/create', '/payment/create')}
        />
      </PragModal>
      <Grid
        templateRows="repeat(1, 1fr)"
        templateColumns={{ base: 'repeat(1, 1fr)', xl: '15% 85%' }}
        w="100%"
        justifyContent="center"
        alignItems="center"
        flexDir={{ base: 'column', md: 'row' }}
        display={{ base: 'flex', md: 'grid' }}
        overflowX="hidden"
      >
        <Flex
          w="full"
          mb={{ base: '1em', md: '0' }}
        >
          <Actions setAction={setActualAction} />
          <SideActions />
        </Flex>
        <Flex
          w={{ base: '90%', md: '100%', xl: '95%' }}
          bg="linear(to-br, #031426, #081828, #031426, #0b243f, #081828, #081828)"
          h="100vh"
          flexDir="column"
          alignItems="center"
          justifyContent={actualAction === 1 || actualAction === 2 ? 'center' : 'flex-start'}
        >

          {actualAction === 0 && (
            <>
              <PaymentsMethods refresh={refresh} />
              <PurchaseTable purchases={purchaseCtx.purchases} paymentId={purchaseCtx.paymentId} />
              <MobileDisplayTable purchases={purchaseCtx.purchases} paymentId={purchaseCtx.paymentId} />
            </>
          )}
          {actualAction === 1 && <CreateForm />}
          {actualAction === 2 && <CreatePurchase data={{ payments }} />}
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
