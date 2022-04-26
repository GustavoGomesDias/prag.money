import { ButtonGroup, Flex } from '@chakra-ui/react';
import React from 'react';
import CustomButton from '../../UI/Buttons/CustomButton';

const Actions = (): JSX.Element => (
  <Flex
    bg="#00735C"
    flexDir="column"
    alignItems="center"
    w="100%"
    height="100vh"
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
      <CustomButton action="Adicionar compra" textSize="14px" />
      <CustomButton action="Adicionar conta" textSize="14px" />
      <CustomButton action="Ver relatório" textSize="14px" />
    </ButtonGroup>
  </Flex>
);

export default Actions;
