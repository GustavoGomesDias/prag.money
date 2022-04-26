import { Button } from '@chakra-ui/react';
import React from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';

export interface ActionButtonProps {
  action: string
  handleOnClick: () => void
}

const ActionButton = ({ action, handleOnClick }: ActionButtonProps): JSX.Element => (
  <Button leftIcon={action === 'Excluir' ? <FaTrashAlt /> : <FaRegEdit />} variant="solid" onClick={() => handleOnClick()}>
    {action}
  </Button>
);

export default ActionButton;
