/* eslint-disable no-return-await */
import React, {
  useContext, useEffect, useState, MouseEvent,
} from 'react';
import {
  Button,
  ButtonGroup,
  Flex,
  Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr, useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import PurchaseContext from '../../../context/purchases/PurchaseContext';
import PurchaseModel from '../../../serverless/data/models/PurchaseModel';
import api from '../../../services/fetchAPI/init';
import toastConfig from '../../../utils/config/tostConfig';
import formatDate from '../../../utils/formatDate';
import ModalLoader from '../../UI/Loader/ModalLoader';
import ActionButton from '../PurchaseDescription/ActionButton';

export interface PurchaseTableProps {
  purchases: PurchaseModel[]
  paymentId: number
}

const PurchaseTable = ({ purchases, paymentId }: PurchaseTableProps): JSX.Element => {
  const [purchaseList, setPurchseList] = useState<PurchaseModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const purchaseCtx = useContext(PurchaseContext);

  const { push } = useRouter();

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

  const handleEdit = (id: number): void => {
    push('/purchase/[id]', `/purchase/${id}`);
  };

  const handleGetNextPurchases = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nextPage = page + 1;
    setPage(nextPage);
    setIsLoading(true);
    const response = await api.getWithBody('/acquisition', {
      page: nextPage,
      id: paymentId,
    });

    setTimeout(() => setIsLoading(false), 500);

    if (response.data.error) {
      if (response.statusCode === 404) {
        if (response.data.error) {
          toast({
            title: '📣',
            description: response.data.error,
            status: 'info',
            ...toastConfig,
          });
          return;
        }
      }

      toast({
        title: '📣',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
      return;
    }

    setPurchseList([...(response.data.content as {[key: string]: PurchaseModel[] }).purchases]);
  };

  const handleGetPrevPurchases = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page > 0) {
      setIsLoading(true);
      const prevPage = page - 1;
      setPage(prevPage);
      const response = await api.getWithBody('/acquisition', {
        page: prevPage,
        id: paymentId,
      });

      setTimeout(() => setIsLoading(false), 500);

      if (response.data.error) {
        toast({
          title: '📣',
          description: response.data.error,
          status: 'error',
          ...toastConfig,
        });
        return;
      }

      setPurchseList([...(response.data.content as {[key: string]: PurchaseModel[] }).purchases]);
    } else {
      toast({
        title: '📣',
        description: 'Estamos na primeira página!',
        status: 'info',
        ...toastConfig,
      });
    }
  };

  return (
    <TableContainer
      w="100%"
      display={{ base: 'none', md: 'block' }}
      fontWeight="bold"
    >
      {isLoading && <ModalLoader isOpen={isLoading} />}
      <Flex w="100%" justifyContent="flex-end" px="1em" borderBottom="3px solid #00735C">
        <ButtonGroup bg="#00735C" p="0.1em">
          <Button
            variant="unstyled"
            fontSize="18px"
            color="#fff"
            borderRight="1px solid #fff"
            borderRadius="0 !important"
            p="0.5em"
            transition="300ms"
            _hover={{
              opacity: 0.5,
            }}
            onClick={async (e) => await handleGetPrevPurchases(e)}
          >
            prev

          </Button>
          <Button
            variant="unstyled"
            fontSize="18px"
            color="#fff"
            margin="0 !important"
            p="0.5em"
            transition="300ms"
            _hover={{
              opacity: 0.5,
            }}
            onClick={async (e) => await handleGetNextPurchases(e)}
          >
            next

          </Button>
        </ButtonGroup>
      </Flex>
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
              <Td width="25% !important" textAlign="center">{formatDate(new Date((purchase.purchase_date)))}</Td>
              <Td
                display="flex"
                gap={4}
                justifyContent="center"
              >
                <ActionButton action="Editar" handleOnClick={(): void => handleEdit(purchase.id as number)} />
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
