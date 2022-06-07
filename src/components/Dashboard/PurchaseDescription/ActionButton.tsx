import { Button } from '@chakra-ui/react';
import React from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';

export interface ActionButtonProps {
  action: string
  handleOnClick: () => void
}

const ActionButton = ({ action, handleOnClick }: ActionButtonProps): JSX.Element => (
  <Button
    bg="#0e2e50"
    leftIcon={action === 'Excluir' ? <FaTrashAlt /> : <FaRegEdit />}
    _hover={{
      color: action === 'Excluir' ? '#e85f7a' : '#dce66e',
    }}
    variant="solid"
    onClick={() => handleOnClick()}
  >
    {action}
  </Button>
);

export default ActionButton;
