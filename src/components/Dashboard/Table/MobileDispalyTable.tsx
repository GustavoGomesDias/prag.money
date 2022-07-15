/* eslint-disable no-return-await */
import React, {
  useContext, useState, MouseEvent, useEffect,
} from 'react';
import {
  Box, Button, ButtonGroup, Flex, Text, Tooltip, useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { PurchaseTableProps } from './PurchaseTable';
import formatDate from '../../../utils/formatDate';
import toastConfig from '../../../utils/config/tostConfig';
import ActionButton from '../PurchaseDescription/ActionButton';
import PurchaseContext from '../../../context/purchases/PurchaseContext';
import ModalLoader from '../../UI/Loader/ModalLoader';
import api from '../../../services/fetchAPI/init';
import PurchaseModel from '../../../serverless/data/models/PurchaseModel';

const MobileDisplayTable = ({ purchases, paymentId }: PurchaseTableProps): JSX.Element => {
  const purchaseCtx = useContext(PurchaseContext);
  const [purchaseList, setPurchseList] = useState<PurchaseModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [actualPage, setActualPage] = useState<number>(0);
  const [nextPage, setNextPage] = useState<number>(page + 1);
  const toast = useToast();
  const { push } = useRouter();

  useEffect(() => {
    setPurchseList(purchases);
  }, [purchases]);

  const handleLongerDescription = (description: string): string => {
    if (description.length > 50) {
      return `${description.slice(0, 50)}...`;
    }

    return description;
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

  const copyText = (entryText: string): void => {
    navigator.clipboard.writeText(entryText);

    toast({
      title: '📣 Texto Copiado!',
      description: 'A descrição foi copiada com sucesso!',
      status: 'info',
      ...toastConfig,
    });
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
      setNextPage(page);
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

      setActualPage(prevPage);
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
    <Box
      w="100%"
      h="100%"
      p="1em"
      display={{ base: 'block', md: 'none' }}
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
        <Text
          fontWeight="bold"
          textAlign="center"
        >
          Por favor, selecione uma conta financeira. Caso não tenha, considere
          {' '}
          <Link href="/payment/create" passHref><span style={{ color: '#9fdbcf', cursor: 'pointer' }}>criar uma</span></Link>
          .
        </Text>
      )}
      {purchaseList.length > 0 && purchaseList.map((purchase) => (
        <Box
          key={purchase.description + purchase.id}
          w="full"
          p="1em"
          borderBottom="1px solid #00735C"
          borderRadius="5px"
          fontWeight="bold"
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
          <Text>{(purchase.value.toFixed(2)).replace('.', ',')}</Text>
          <Text>{formatDate(new Date(purchase.purchase_date))}</Text>
          <Flex pt="1em" gap={4}>
            <ActionButton action="Editar" handleOnClick={(): void => handleEdit(purchase.id as number)} />
            <ActionButton action="Excluir" handleOnClick={async (): Promise<void> => await handleDeletePurchase(purchase.id as number)} />
          </Flex>
        </Box>
      ))}
    </Box>
  );
};
export default MobileDisplayTable;
