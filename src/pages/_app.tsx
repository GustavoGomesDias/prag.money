import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '../styles/theme';
import AuthProvider from '../context/AuthContext';
import HistoryProvider from '../context/history/HistoryProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <HistoryProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </HistoryProvider>
    </ChakraProvider>
  );
}

export default MyApp;
