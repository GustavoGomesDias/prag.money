import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import '../styles/globals.css';
import { theme } from '../styles/theme';
import AuthProvider from '../context/AuthContext';
import HistoryProvider from '../context/history/HistoryProvider';
import PurchaseProvider from '../context/purchases/PurchaseProvider';
import PaymentProvider from '../context/payment/PaymentProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <HistoryProvider>
        <AuthProvider>
          <PaymentProvider>
            <PurchaseProvider>
              <Component {...pageProps} />
            </PurchaseProvider>
          </PaymentProvider>
        </AuthProvider>
      </HistoryProvider>
    </ChakraProvider>
  );
}

export default MyApp;
