import React from 'react';
import { Button } from '@chakra-ui/react';

export interface CustomButtonProps {
  action: string
  handleOnClick?: () => void
  textSize?: string
}

const CustomButton = ({ action, handleOnClick, textSize }: CustomButtonProps): JSX.Element => (
  <Button
    onClick={handleOnClick && (() => handleOnClick())}
    colorScheme="teal"
    w="100%"
    size="lg"
    variant="outline"
    fontWeight="bold"
    borderColor="initial"
    border="2px solid"
    margin="0px !important"
    fontSize={textSize !== undefined ? textSize : '18px'}
    style={{
      whiteSpace: 'normal',
      wordWrap: 'break-word',
    }}
  >
    {action}
  </Button>
);

export default CustomButton;
