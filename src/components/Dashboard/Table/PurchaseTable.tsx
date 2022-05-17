/* eslint-disable no-return-await */
import {
  Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr, useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import PurchaseContext from '../../../context/purchases/PurchaseContext';
import PurchaseModel from '../../../serverless/data/models/PurchaseModel';
import api from '../../../services/fetchAPI/init';
import toastConfig from '../../../utils/config/tostConfig';
import formatDate from '../../../utils/formatDate';
import ModalLoader from '../../UI/Loader/ModalLoader';
import ActionButton from '../PurchaseDescription/ActionButton';

export interface PurchaseTableProps {
  purchases: PurchaseModel[]
}

const PurchaseTable = ({ purchases }: PurchaseTableProps): JSX.Element => {
  const [purchaseList, setPurchseList] = useState<PurchaseModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const purchaseCtx = useContext(PurchaseContext);
  const toast = useToast();
  const handleLongerDescription = (description: string): string => {
    if (description.length > 50) {
      return `${description.slice(0, 50)}...`;
    }

    return description;
  };

  useEffect(() => {
    setPurchseList(purchases);
  }, [purchases]);

  const copyText = (entryText: string): void => {
    navigator.clipboard.writeText(entryText);

    toast({
      title: '📣 Texto Copiado!',
      description: 'A descrição foi copiada com sucesso!',
      status: 'info',
      ...toastConfig,
    });
  };

  const handleDeletePurchase = async (id: number): Promise<void> => {
    setIsLoading(true);
    if (id < 0) {
      toast({
        title: '😒',
        description: 'Id inválido.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    const response = await api.delete(`purchase/${id}`);
    purchaseCtx.handleDeletePurchaseById(id);

    if (response.data.message) {
      toast({
        title: '📣',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
    } else {
      toast({
        title: '📣',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
    }
    setIsLoading(false);
  };

  return (
    <TableContainer
      w="100%"
      display={{ base: 'none', md: 'block' }}
      fontWeight="bold"
    >
      {isLoading && <ModalLoader isOpen={isLoading} />}
      <Table>
        <Thead>
          <Tr>
            <Th color="#00735C" fontSize="14px" textAlign="center">Descrição</Th>
            <Th color="#00735C" fontSize="14px" textAlign="center">Valor (R$)</Th>
            <Th color="#00735C" fontSize="14px" textAlign="center">Data de compra</Th>
            <Th color="#00735C" fontSize="14px" textAlign="center">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {purchaseList.length > 0 && purchaseList.map((purchase) => (
            <Tr
              key={purchase.description + purchase.id}
            >
              <Td width="25% !important" cursor="pointer" onClick={() => copyText(purchase.description)}>
                <Tooltip
                  hasArrow
                  label={`${purchase.description} (Clique para copiar a descrição)`}
                  placement="right-start"
                >
                  {handleLongerDescription(purchase.description)}
                </Tooltip>
              </Td>
              <Td width="25% !important" textAlign="center">
                {(purchase.value.toFixed(2)).replace('.', ',')}
              </Td>
              <Td width="25% !important" textAlign="center">{formatDate(new Date(purchase.purchase_date))}</Td>
              <Td
                display="flex"
                gap={4}
                justifyContent="center"
              >
                <ActionButton action="Editar" handleOnClick={(): void => { console.log('t'); }} />
                <ActionButton action="Excluir" handleOnClick={async (): Promise<void> => await handleDeletePurchase(purchase.id as number)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default PurchaseTable;
