import { ButtonGroup } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { GiWallet } from 'react-icons/gi';
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
      <CustomButton
        Icon={FaShoppingBag}
        handleOnClick={handleRedirectToAddPurchase}
        action="Adicionar compra"
        textSize="18px"
      />
      <CustomButton
        Icon={GiWallet}
        handleOnClick={handleRedirectToAddPayment}
        action="Adicionar conta"
        textSize="18px"
      />
    </ButtonGroup>
  );
};

export default SideContent;
