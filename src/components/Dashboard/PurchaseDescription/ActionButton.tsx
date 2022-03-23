import { Button } from '@chakra-ui/react';
import React from 'react';

export interface ActionButtonProps {
  action: string
  handleOnClick: () => void
}

const ActionButton = ({ action, handleOnClick }: ActionButtonProps): JSX.Element => (
  <Button
    onClick={(() => handleOnClick())}
    colorScheme="teal"
    w="100%"
    size="lg"
    variant="unstyled"
    fontWeight="bold"
    borderColor="initial"
    margin="0px !important"
    color="#fff"
    bg={action === 'Editar' ? '#00735C' : '#FF0000'}
    _hover={{
      opacity: '0.8',
    }}
  >
    {action}
  </Button>
);

export default ActionButton;
