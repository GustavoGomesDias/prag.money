import { extendTheme } from '@chakra-ui/react';

// eslint-disable-next-line import/prefer-default-export
export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bgGradient: 'linear(to-br, #031426, #081828, #031426, #0b243f, #081828, #081828)',
        color: '#00E091',
        height: '100vh',
        padding: '0px !important',
        margin: '0px !important',
      },
    },
  },
});
