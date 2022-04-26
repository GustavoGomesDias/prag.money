import React from 'react';
import {
  Box, Flex, Text, Tooltip, useToast,
} from '@chakra-ui/react';
import { PurchaseTableProps } from './PurchaseTable';
import formatDate from '../../../utils/formatDate';
import toastConfig from '../../../utils/config/tostConfig';
import ActionButton from '../PurchaseDescription/ActionButton';

const MobileDisplayTable = ({ purchases }: PurchaseTableProps): JSX.Element => {
  const toast = useToast();
  const handleLongerDescription = (description: string): string => {
    if (description.length > 50) {
      return `${description.slice(0, 50)}...`;
    }

    return description;
  };

  const copyText = (entryText: string): void => {
    navigator.clipboard.writeText(entryText);

    toast({
      title: '📣 Texto Copiado!',
      description: 'A descrição foi copiada com sucesso!',
      status: 'info',
      ...toastConfig,
    });
  };

  return (
    <Box
      w="100%"
      h="100%"
      p="1em"
      display={{ base: 'block', md: 'none' }}
    >
      {purchases.length > 0 && purchases.map((purchase) => (
        <Box
          key={purchase.description + purchase.id}
          w="full"
          p="1em"
          borderBottom="1px solid #00735C"
          borderRadius="5px"
          fontWeight="bold"
          _hover={{
            bg: '#C1D9B7',
          }}
        >
          <Text onClick={() => copyText(purchase.description)} cursor="pointer">
            <Tooltip
              hasArrow
              label={`${purchase.description} (Clique para copiar a descrição)`}
              placement="bottom-start"
            >
              {handleLongerDescription(purchase.description)}
            </Tooltip>

          </Text>
          <Text>{purchase.value}</Text>
          <Text>{formatDate(new Date(purchase.purchase_date))}</Text>
          <Flex pt="1em" gap={4}>
            <ActionButton action="Editar" handleOnClick={(): void => { console.log('t'); }} />
            <ActionButton action="Excluir" handleOnClick={(): void => { console.log('t'); }} />
          </Flex>
        </Box>
      ))}
    </Box>
  );
};
export default MobileDisplayTable;
