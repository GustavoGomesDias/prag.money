/* eslint-disable no-return-await */
import React, {
  useContext, useEffect, useState, MouseEvent,
} from 'react';
import {
  Button,
  ButtonGroup,
  Flex,
  Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import Link from 'next/link';
import Image from 'next/image';
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
  const [actualPage, setActualPage] = useState<number>(0);
  const [nextPage, setNextPage] = useState<number>(page + 1);
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
    const searchPage = page + 1;
    setPage(searchPage);
    setIsLoading(true);
    const response = await api.getWithBody('/acquisition', {
      page: searchPage,
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

    setActualPage(page);
    setNextPage(searchPage);
    setPurchseList([...(response.data.content as { [key: string]: PurchaseModel[] }).purchases]);
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

      setPurchseList([...(response.data.content as { [key: string]: PurchaseModel[] }).purchases]);
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
      display={{ base: 'none', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
    >
      {isLoading && <ModalLoader isOpen={isLoading} />}
      <Flex w="100%" justifyContent="flex-end" px="1em" borderBottom="3px solid #00735C">
        <ButtonGroup bg="#00735C" p="0.1em">
          <Button
            display="flex"
            flexDir="column"
            variant="unstyled"
            h="60px"
            fontSize="18px"
            color="#fff"
            borderRight="1px solid #fff"
            borderRadius="0 !important"
            p="0.5em"
            bg="#0e2e50"
            transition="300ms"
            _hover={{
              opacity: 0.5,
            }}
            onClick={async (e) => await handleGetPrevPurchases(e)}
          >
            {actualPage}
            <AiOutlineArrowLeft />
          </Button>
          <Button
            display="flex"
            flexDir="column"
            h="60px"
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

            {nextPage}
            <AiOutlineArrowRight />
          </Button>
        </ButtonGroup>
      </Flex>
      {purchaseList.length < 1 && (
        <>
          <Text
            fontWeight="bold"
            fontSize="1.2rem"
            my="1rem"
          >
            Por favor, selecione uma conta financeira
          </Text>
          <Image src="/gifs/select-account.gif" alt="Image Loading" width="500px" height="150px" />
          <Text
            fontWeight="bold"
            fontSize="1.2rem"
            my="1rem"
          >
            Caso não tenha, considere
            {' '}
            <Link href="/payment/create" passHref><span style={{ color: '#9fdbcf', cursor: 'pointer' }}>criar uma</span></Link>
            .
          </Text>

          <Image src="/gifs/create-account.gif" alt="Image Loading" width="800px" height="500px" />
        </>
      )}
      {purchaseList.length > 0 && (
        <Table
          w="80%"
          my="2em"
        >
          <Thead>
            <Tr borderTopRadius="5px">
              <Th color="#00E091" fontSize="14px" textAlign="center">Descrição</Th>
              <Th color="#00E091" fontSize="14px" textAlign="center">Valor (R$)</Th>
              <Th color="#00E091" fontSize="14px" textAlign="center">Data de compra</Th>
              <Th color="#00E091" fontSize="14px" textAlign="center" borderColor="#0E2E50">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {purchaseList.length > 0 && purchaseList.map((purchase) => (
              <Tr
                key={purchase.description + purchase.id}
              >
                <Td
                  width="25% !important"
                  cursor="pointer"
                  onClick={() => copyText(purchase.description)}
                  borderWidth="2px"
                  borderColor="#0E2E50"
                >
                  <Tooltip
                    hasArrow
                    label={`${purchase.description} (Clique para copiar a descrição)`}
                    placement="right-start"
                  >
                    {handleLongerDescription(purchase.description)}
                  </Tooltip>
                </Td>
                <Td
                  width="25% !important"
                  textAlign="center"
                  borderWidth="2px"
                  borderColor="#0E2E50"
                >
                  {(purchase.value.toFixed(2)).replace('.', ',')}
                </Td>
                <Td
                  width="25% !important"
                  textAlign="center"
                  borderWidth="2px"
                  borderColor="#0E2E50"
                >
                  {formatDate(new Date((purchase.purchase_date)))}

                </Td>
                <Td
                  width="25% !important"
                  textAlign="center"
                  letterSpacing={3}
                  borderWidth="2px"
                  borderColor="#0E2E50"
                  _first={{
                  }}
                >
                  <ActionButton action="Editar" handleOnClick={(): void => handleEdit(purchase.id as number)} />
                  {' '}
                  <ActionButton action="Excluir" handleOnClick={async (): Promise<void> => await handleDeletePurchase(purchase.id as number)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </TableContainer>
  );
};

export default PurchaseTable;
