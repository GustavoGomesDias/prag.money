import React from 'react';
import { Button } from '@chakra-ui/react';

export interface CustomButtonProps {
  action: string
  handleOnClick?: () => void
}

const CustomButton = ({ action, handleOnClick }: CustomButtonProps): JSX.Element => (
  <Button
    onClick={handleOnClick && (() => handleOnClick())}
    colorScheme="teal"
    size="lg"
    variant="outline"
    fontWeight="bold"
    borderColor="initial"
    border="2px solid"
  >
    {action}
  </Button>
);

export default CustomButton;
