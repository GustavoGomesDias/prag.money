import {
  Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr,
} from '@chakra-ui/react';
import React from 'react';
import PurchaseModel from '../../../serverless/data/models/PurchaseModel';
import formatDate from '../../../utils/formatDate';
import ActionButton from '../PurchaseDescription/ActionButton';

export interface PurchaseTableProps {
  purchases: PurchaseModel[]
}

const PurchaseTable = ({ purchases }: PurchaseTableProps): JSX.Element => {
  const handleLongerDescription = (description: string): string => {
    if (description.length > 50) {
      return `${description.slice(0, 50)}...`;
    }

    return description;
  };

  return (
    <TableContainer
      w="100%"
      display={{ base: 'none', md: 'block' }}
      fontWeight="bold"
    >
      <Table>
        <Thead>
          <Tr>
            <Th color="#00735C" fontSize="14px">Descrição</Th>
            <Th color="#00735C" fontSize="14px">Valor (R$)</Th>
            <Th color="#00735C" fontSize="14px">Data de compra</Th>
            <Th color="#00735C" fontSize="14px">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {purchases.length > 0 && purchases.map((purchase) => (
            <Tr
              key={purchase.description + purchase.id}
            >
              <Td wordBreak="keep-all" width="1em !important">
                <Tooltip
                  hasArrow
                  label={purchase.description}
                  placement="right-start"
                >
                  {handleLongerDescription(purchase.description)}
                </Tooltip>
              </Td>
              <Td>
                {purchase.value}
              </Td>
              <Td>{formatDate(new Date(purchase.purchase_date))}</Td>
              <Td
                display="flex"
                flexDir="column"
                gap={4}
              >
                <ActionButton action="Editar" handleOnClick={(): void => { console.log('t'); }} />
                <ActionButton action="Excluir" handleOnClick={(): void => { console.log('t'); }} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default PurchaseTable;
