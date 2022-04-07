import { ButtonGroup, chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import CustomButton from '../../UI/CustomButton';

const Actions = (): JSX.Element => (
  <Flex
    bg="#fff"
    border="2px solid #00735C"
    borderRadius="5px"
    flexDir="column"
    alignItems="center"
    height="100%"
    display={{ base: 'none', xl: 'flex' }}
    px="1em"
  >
    <chakra.h1
      width="100%"
      textAlign="center"
      fontSize="38px"
      fontWeight="bold"
      mb="15px"
    >
      Opções
    </chakra.h1>
    <ButtonGroup
      display="flex"
      flexDir="column"
      width="90%"
      justifyContent="center"
      gap={4}
      marginBottom="15px"
    >
      <CustomButton action="Add Compra" textSize="16px" />
      <CustomButton action="Add conta" textSize="16px" />
      <CustomButton action="Ver relatório" textSize="16px" />
    </ButtonGroup>
  </Flex>
);

export default Actions;
