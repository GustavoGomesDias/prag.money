import { ButtonGroup, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { GiWallet } from 'react-icons/gi';
import CustomButton from '../../UI/Buttons/CustomButton';

const Actions = (): JSX.Element => {
  const [onHover, setOnHover] = useState<boolean>(false);
  const { push } = useRouter();
  const handleRedirectToAddPurchase = () => push('/purchase/create');
  const handleRedirectToAddPayment = () => push('/payment/create');

  return (
    <Flex
      bg="#0e2e50"
      flexDir="column"
      alignItems="center"
      w="40%"
      transition="0.8s ease"
      _hover={{
        width: '100%',
      }}
      height="100vh"
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      display={{ base: 'none', xl: 'flex' }}
    >
      <ButtonGroup
        display="flex"
        flexDir="column"
        width="100%"
        justifyContent="center"
        gap={4}
        marginBottom="15px"
        py="1em"
      >
        <CustomButton
          Icon={FaShoppingBag}
          handleOnClick={handleRedirectToAddPurchase}
          action={onHover ? 'Adicionar gasto' : ''}
          textSize={onHover ? '14px' : '30px'}
        />
        <CustomButton
          Icon={GiWallet}
          handleOnClick={handleRedirectToAddPayment}
          action={onHover ? 'Adicionar conta' : ''}
          textSize={onHover ? '14px' : '30px'}
        />
        {/* <CustomButton action="Ver relatório" textSize="14px" /> */}
      </ButtonGroup>
    </Flex>
  );
};

export default Actions;
