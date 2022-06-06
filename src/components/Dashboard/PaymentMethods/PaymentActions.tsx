import { IconButton, keyframes, Tooltip } from '@chakra-ui/react';
import React, { MouseEvent } from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { ImLoop2 } from 'react-icons/im';
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

export interface PaymentActionsProps {
  handleEdit: (e: MouseEvent<HTMLButtonElement>) => void
  handleDelete: (e: MouseEvent<HTMLButtonElement>) => void
  refreshAccount: (e: MouseEvent<HTMLButtonElement>) => Promise<void>
}

const PaymentActions = ({ handleDelete, handleEdit, refreshAccount }: PaymentActionsProps): JSX.Element => (
  <PaymentMethodCard
    title="Ações da conta"
  >
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
        aria-label="Search database"
        icon={<ImLoop2 />}
        _hover={{
          color: '#049579',
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
  </PaymentMethodCard>
);

export default PaymentActions;
