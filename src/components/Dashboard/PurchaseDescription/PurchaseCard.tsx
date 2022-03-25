import React from 'react';
import { ButtonGroup, Flex } from '@chakra-ui/react';
import classes from './PurchaseDescription.module.css';
import ActionButton from './ActionButton';

export interface PurchaseDescriptionProps {
  id: number
  description: string
  value: number
  purchaseDate: string
}

const PurchaseCard = ({
  description, value, purchaseDate, id,
}: PurchaseDescriptionProps): JSX.Element => (
  <Flex
    key={id}
    flexDir="column"
    bg="#00E091"
    height="300px"
    width="100%"
    border="none"
    p="1em 1em 0 1em"
    borderRadius="5px"
    boxShadow="0 0 1em rgba(0, 0, 0, 0.2)"
  >
    <Flex
      flexDir="column"
    >
      <span className={classes.property}>
        Descrição:
        {' '}
        {description}
      </span>
      <span className={classes.property}>
        Preço: R$
        {' '}
        {value}
      </span>
      <span className={classes.property}>
        Data:
        {' '}
        {purchaseDate}
      </span>
    </Flex>

    <ButtonGroup
      mt="15px"
      w="100%"
      display="flex"
      justifyContent="center"
      gap={2}
      py={2}
    >
      <ActionButton action="Editar" handleOnClick={(): void => { console.log('t'); }} />
      <ActionButton action="Excluir" handleOnClick={(): void => { console.log('t'); }} />
    </ButtonGroup>
  </Flex>
);

export default PurchaseCard;
