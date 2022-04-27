import { ButtonGroup } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import CustomButton from '../../UI/Buttons/CustomButton';

// export interface SideContentProps {
//   onClose: () => void
// }

const SideContent = (): JSX.Element => {
  const { push } = useRouter();
  const handleRedirectToAddPurchase = () => push('/purchase/create');
  const handleRedirectToAddPayment = () => push('/payment/create');

  return (
    <ButtonGroup
      display="flex"
      flexDir="column"
      width="100%"
      justifyContent="center"
      gap={4}
      mt="3em"
    >
      <CustomButton handleOnClick={handleRedirectToAddPurchase} action="Adicionar compra" textSize="16px" />
      <CustomButton handleOnClick={handleRedirectToAddPayment} action="Adicionar conta" textSize="16px" />
    </ButtonGroup>
  );
};

export default SideContent;
