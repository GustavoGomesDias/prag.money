import React, { useState } from 'react';
import { ButtonGroup, Flex } from '@chakra-ui/react';
import { FaShoppingBag, FaHome } from 'react-icons/fa';
import { GiWallet } from 'react-icons/gi';
import CustomButton from '../../UI/Buttons/CustomButton';

export interface ActionsProps {
  setAction: React.Dispatch<React.SetStateAction<number>>
}

const Actions = ({ setAction }: ActionsProps): JSX.Element => {
  const [isActive, setIsActive] = useState<number>(0);
  const handleShowHome = () => {
    setAction(0);
    setIsActive(0);
  };
  const handleAddPayment = () => {
    setAction(1);
    setIsActive(1);
  };
  const handleAddPurchase = () => {
    setAction(2);
    setIsActive(2);
  };

  return (
    <Flex
      bg="#0e2e50"
      flexDir="column"
      alignItems="center"
      w="100%"
      transition="0.8s ease"
      height="100vh"
      display={{ base: 'none', xl: 'flex' }}
    >
      <ButtonGroup
        display="flex"
        flexDir="column"
        width="100%"
        justifyContent="center"
        alignItems="center"
        gap={4}
        marginBottom="15px"
        py="1em"
      >
        <CustomButton
          Icon={FaHome}
          handleOnClick={handleShowHome}
          action="Inicio"
          textSize="20px"
          isActive={isActive === 0}
        />
        <CustomButton
          Icon={GiWallet}
          handleOnClick={handleAddPayment}
          action="Adicionar conta"
          textSize="20px"
          isActive={isActive === 1}
        />
        <CustomButton
          Icon={FaShoppingBag}
          handleOnClick={handleAddPurchase}
          action="Novo gasto"
          textSize="20px"
          isActive={isActive === 2}
        />
        {/* <CustomButton action="Ver relatório" textSize="14px" /> */}
      </ButtonGroup>
    </Flex>
  );
};

export default Actions;
