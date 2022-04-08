import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import '../styles/globals.css';
import { theme } from '../styles/theme';
import AuthProvider from '../context/AuthContext';
import HistoryProvider from '../context/history/HistoryProvider';
import PurchaseProvider from '../context/purchases/PurchaseProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <HistoryProvider>
        <AuthProvider>
          <PurchaseProvider>
            <Component {...pageProps} />
          </PurchaseProvider>
        </AuthProvider>
      </HistoryProvider>
    </ChakraProvider>
  );
}

export default MyApp;
