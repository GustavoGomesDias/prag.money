import { UseToastOptions } from '@chakra-ui/react';

const toastConfig: Partial<UseToastOptions> = {
  duration: 2000,
  isClosable: true,
  variant: 'top-accent',
  position: 'top',
  containerStyle: {
    fontSize: '20px',
  },
};

export default toastConfig;
