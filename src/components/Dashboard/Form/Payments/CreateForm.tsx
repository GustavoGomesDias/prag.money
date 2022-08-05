import {
  Button, ButtonGroup, chakra, Checkbox, Flex, Grid, useToast,
} from '@chakra-ui/react';
import React, { FormEvent, useContext, useState } from 'react';
import ModalLoader from '../../../UI/Loader/ModalLoader';
import BasicInput from '../../../Login/BasicInput';
import Form from '../../../Form/Form';
import { AuthContext } from '../../../../context/AuthContext';
import PaymentModel from '../../../../serverless/data/models/PaymentModel';
import api from '../../../../services/fetchAPI/init';
import toastConfig from '../../../../utils/config/tostConfig';
import { validationDay, validationField } from '../../../../utils/validations';

export interface CreateFormProps {
  setAccountCreated: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateForm = ({ setAccountCreated }: CreateFormProps): JSX.Element => {
  const [nickname, setNickName] = useState<string>('');
  const [defaultValue, setDefaultValue] = useState<number>(-1);
  const [resetDay, setResetDay] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpecialAccount, setIsSpecialAccount] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    if (validationField(nickname)) {
      toast({
        title: '🤨',
        description: 'Todos os campos devem ser preenchidos.',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    if (isSpecialAccount) {
      if (defaultValue === -1) {
        toast({
          title: '🤨',
          description: 'Todos os campos devem ser preenchidos.',
          status: 'error',
          ...toastConfig,
        });
        setIsLoading(false);
        return;
      }
    }

    if (isSpecialAccount) {
      if (!validationDay(Number(resetDay))) {
        toast({
          title: '🤨',
          description: 'Por favor, forneça uma data que seja valida.',
          status: 'error',
          ...toastConfig,
        });
        setIsLoading(false);
        return;
      }
    }

    if (user === undefined) {
      toast({
        title: '🤨',
        description: 'Necessário login!',
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    const data: Omit<PaymentModel, 'current_month'> = {
      nickname, default_value: isSpecialAccount ? Number(defaultValue) : 0, reset_day: isSpecialAccount ? Number(resetDay) : 1, user_id: (user?.userInfo.id as number),
    };
    const response = await api.post('/payment', data);
    if (response.data.message) {
      setAccountCreated(true);
      toast({
        title: 'Sucesso! 😎',
        description: response.data.message,
        status: 'success',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }

    if (response.data.error) {
      toast({
        title: '😔',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <ModalLoader isOpen={isLoading} />}
      <Flex
        flexDir="column"
        alignItems="center"
        padding="1em"
        w="100%"
      >
        <Form fullWidth handleSubmit={handleSubmit}>
          <chakra.h1 w="full" textAlign="center" fontWeight="bold" fontSize={{ base: '28px', md: '48px' }}>Adicionar Forma de Pagamento</chakra.h1>
          <Grid w="80%" templateRows="repeat(3, 1fr)" alignItems="center" gap={2}>
            <BasicInput
              id="nickname"
              label="Apelido"
              placeholder="bitcoin wallet"
              onSetHandle={setNickName}
            />
            <Checkbox onChange={() => setIsSpecialAccount(!isSpecialAccount)} fontWeight="bold" fontSize="1.5rem">Está conta recebe um valor todo mês (exemplo: conta salário)</Checkbox>
            {isSpecialAccount && (
              <>
                <BasicInput
                  id="defaultValue"
                  label="Valor padrão (R$)"
                  type="number"
                  step="any"
                  placeholder="800,00"
                  onSetHandle={setDefaultValue}
                />
                <BasicInput
                  id="resetDate"
                  label="Data de reset"
                  type="number"
                  min="1"
                  max="31"
                  onSetHandle={setResetDay}
                  placeholder=""
                />
              </>
            )}
            <ButtonGroup
              flexDir="column"
              py="1em"
            >
              <Button
                bg="#00735C"
                fontSize={{ base: '20px', md: '24px' }}
                color="#fff"
                w="100%"
                h="60px"
                mx="0px !important"
                mt="15px"
                _hover={{
                  bg: '#00E091',
                }}
                type="submit"
              >
                Salvar
              </Button>
            </ButtonGroup>
          </Grid>
        </Form>
      </Flex>
    </>
  );
};

export default CreateForm;
