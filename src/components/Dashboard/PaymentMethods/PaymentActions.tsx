import { IconButton, keyframes, Tooltip } from '@chakra-ui/react';
import React, { MouseEvent } from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { ImLoop2, ImDownload3 } from 'react-icons/im';
import { RiCoinFill } from 'react-icons/ri';
import PaymentMethodCard from './PaymentMethodCard';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

const animationSpin = `${spin} 1.5s ease-in-out`;

const flip = keyframes`
  to {
    transform: rotateX(0deg);
  }

  from {
    transform: rotateX(-360deg);
  }
`;

const animationFlip = `${flip} 1.5s ease-in-out infinite alternate-reverse both`;

export interface PaymentActionsProps {
  handleEdit: (e: MouseEvent<HTMLButtonElement>) => void
  handleDelete: (e: MouseEvent<HTMLButtonElement>) => void
  setRenderAdditionalValueForm: React.Dispatch<React.SetStateAction<boolean>>
  refreshAccount: (e: MouseEvent<HTMLButtonElement>) => Promise<void>
  handleMakePDFReport: (e: MouseEvent<HTMLButtonElement>) => Promise<void>
  handleMakeJSONReport: (e: MouseEvent<HTMLButtonElement>) => Promise<void>
}

const PaymentActions = ({
  handleDelete, handleEdit, refreshAccount, setRenderAdditionalValueForm, handleMakePDFReport: handleMakeReport, handleMakeJSONReport,
}: PaymentActionsProps): JSX.Element => (
  <PaymentMethodCard
    title="Ações da conta"
  >
    <Tooltip
      hasArrow
      label="Adicionar dinheiro a conta"
      placement="left-start"
    >

      <IconButton
        bg="none"
        aria-label="Add more"
        icon={<RiCoinFill />}
        transition="0.5ms"
        animation={animationFlip}
        _hover={{
          animation: 'none',
        }}
        w="60px"
        h="60px"
        size="lg"
        onClick={() => setRenderAdditionalValueForm(true)}
        color="#dce66e"
      />
    </Tooltip>
    <Tooltip
      hasArrow
      label="Editar conta"
      placement="left-start"
    >

      <IconButton
        bg="none"
        aria-label="Edit account"
        icon={<FaRegEdit />}
        transition="0.5ms"
        _hover={{
          color: '#dce66e',
        }}
        w="50px"
        h="50px"
        size="lg"
        onClick={(e) => handleEdit(e)}
        color="#00E091"
      />
    </Tooltip>
    <Tooltip
      hasArrow
      label="Excluir conta"
      placement="right-start"
    >
      <IconButton
        bg="none"
        aria-label="Delete account"
        icon={<FaTrashAlt />}
        transition="0.5ms"
        _hover={{
          color: '#e85f7a',
        }}
        w="50px"
        h="50px"
        size="lg"
        onClick={(e) => handleDelete(e)}
        color="#00E091"
      />
    </Tooltip>

    <Tooltip
      hasArrow
      label="Refrash"
      placement="right-start"
    >
      <IconButton
        bg="none"
        aria-label="Refresh Account"
        icon={<ImLoop2 />}
        _hover={{
          color: '#53fabf',
          animation: animationSpin,
        }}
        w="50px"
        h="50px"
        size="lg"
        onClick={async (e) => {
          await refreshAccount(e);
        }}
        color="#00E091"
      />
    </Tooltip>

    <Tooltip
      hasArrow
      label="Gerar relatório da conta"
      placement="bottom-end"
    >
      <IconButton
        bg="none"
        aria-label="Make account report"
        color="#00E091"
        icon={<BsFileEarmarkPdfFill />}
        _hover={{
          color: '#53fabf',
        }}
        w="60px"
        h="60px"
        size="lg"
        onClick={async (e) => {
          await handleMakeReport(e);
        }}
      />
    </Tooltip>
    <Tooltip
      hasArrow
      label="Gerar JSON com dados da conta"
      placement="top-start"
    >
      <IconButton
        bg="none"
        aria-label="Make account report"
        color="#00E091"
        icon={<ImDownload3 />}
        _hover={{
          color: '#53fabf',
        }}
        w="60px"
        h="60px"
        size="lg"
        onClick={async (e) => {
          await handleMakeJSONReport(e);
        }}
      />
    </Tooltip>
  </PaymentMethodCard>
);

export default PaymentActions;
