import React, { MouseEvent } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import BasicInput from '../../Login/BasicInput';

export interface AddAdditonalValueProps {
  setAdditionalValue: React.Dispatch<React.SetStateAction<number>>
  handleAddAdditionalMoney(e: MouseEvent<HTMLButtonElement>): Promise<void>
  setRenderAdditionalValueForm: React.Dispatch<React.SetStateAction<boolean>>
  renderAdditionalValueForm: boolean
}

const AddAdditonalValue = ({
  setAdditionalValue, handleAddAdditionalMoney, setRenderAdditionalValueForm, renderAdditionalValueForm,
}: AddAdditonalValueProps): JSX.Element => (
  <Flex
    zIndex={2}
    position="fixed"
    w="100%"
    top={0}
    right={0}
    p="2em"
    alignItems="center"
    justifyContent="center"
    bg="#031426"
    borderRadius="5px"
    borderBottom="5px solid #00735C"
    boxShadow="0 0 1em rgba(0, 0, 0, 0.6)"
    transition="0.8s ease-out"
    mt={renderAdditionalValueForm ? '0px' : '-3000px'}
  >
    <Box
      w={{ base: '100%', md: '30%' }}
    >
      <BasicInput
        id="additonalValue"
        label="Valor adicional (R$): "
        type="number"
        step="any"
        placeholder="800,00"
        onSetHandle={setAdditionalValue}
      />
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
        onClick={(e) => handleAddAdditionalMoney(e)}
      >
        Salvar
      </Button>
      <Button
        bg="#e92950"
        fontSize={{ base: '20px', md: '24px' }}
        color="#fff"
        w="100%"
        h="60px"
        mx="0px !important"
        mt="15px"
        _hover={{
          bg: '#e85f7a',
        }}
        onClick={() => setRenderAdditionalValueForm(false)}
      >
        Cancelar
      </Button>
    </Box>
  </Flex>
);

export default AddAdditonalValue;
