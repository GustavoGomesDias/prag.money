import {
  Table, TableContainer, Tbody, Td, Th, Thead, Tr,
} from '@chakra-ui/react';
import React from 'react';
import PurchaseModel from '../../../serverless/data/models/PurchaseModel';
import formatDate from '../../../utils/formatDate';
import ActionButton from '../PurchaseDescription/ActionButton';

export interface PurchaseTableProps {
  purchases: PurchaseModel[]
}

const PurchaseTable = ({ purchases }: PurchaseTableProps): JSX.Element => (
  <TableContainer
    w="100%"
    display={{ base: 'none', md: 'block' }}
    fontWeight="bold"
  >
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>Descrição</Th>
          <Th>Valor (R$)</Th>
          <Th>Data de compra</Th>
          <Th>Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {purchases.length > 0 && purchases.map((purchase) => (
          <Tr
            key={purchase.description + purchase.id}
          >
            <Td>{purchase.description}</Td>
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

export default PurchaseTable;
