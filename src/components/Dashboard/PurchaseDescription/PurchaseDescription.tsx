import React from 'react';
import { ButtonGroup, Flex } from '@chakra-ui/react';
import classes from './PurchaseDescription.module.css';
import ActionButton from './ActionButton';

const PurchaseDescription = (): JSX.Element => (
  <Flex
    flexDir="column"
    bg="#00E091"
    height="300px"
    width="100%"
    border="none"
    p="1em"
    borderRadius="5px"
    boxShadow="0 0 1em rgba(0, 0, 0, 0.2)"
  >
    <Flex
      flexDir="column"
    >
      <span className={classes.property}>Descrição: Almoço nas bahama com sei lá quem e mais texto</span>
      <span className={classes.property}>Preço: R$ 00,00</span>
      <span className={classes.property}>Data: 23/03/2022</span>
    </Flex>

    <ButtonGroup
      mt="15px"
      w="100%"
      display="flex"
      justifyContent="center"
      gap={2}
    >
      <ActionButton action="Editar" handleOnClick={(): void => { console.log('t'); }} />
      <ActionButton action="Excluir" handleOnClick={(): void => { console.log('t'); }} />
    </ButtonGroup>
  </Flex>
);

export default PurchaseDescription;
