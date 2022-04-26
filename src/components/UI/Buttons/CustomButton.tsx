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
    color="#fff"
    w="100%"
    size="lg"
    variant="unstyled"
    fontWeight="bold"
    margin="0px !important"
    outline="none"
    fontSize={textSize !== undefined ? textSize : '18px'}
    transition="0.5s"
    _active={{
      transform: 'scale(.9)',
      border: 'none',
    }}
    _hover={{
      pl: '0.5em',
      bg: '#049679',
    }}
  >
    {action}
  </Button>
);

export default CustomButton;
