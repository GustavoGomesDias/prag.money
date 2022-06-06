import React from 'react';
import { Button } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export interface CustomButtonProps {
  action: string
  handleOnClick: () => void
  hoverColor?: string
  textSize?: string
  Icon?: IconType
}

const CustomButton = ({
  action, handleOnClick, hoverColor, textSize, Icon,
}: CustomButtonProps): JSX.Element => (
  <Button
    display="flex"
    alignItems="center"
    onClick={() => handleOnClick()}
    color="#00E091"
    zIndex={2}
    w="100%"
    size="lg"
    variant="unstyled"
    fontWeight="bold"
    margin="0px !important"
    outline="none"
    fontSize={textSize || { base: '16px', md: '18px' }}
    transition="0.8s"
    gap={2}
    _active={{
      transform: 'scale(.9)',
      border: 'none',
    }}
    _hover={{
      pl: '0.5em',
      bg: hoverColor || '#049679',
    }}
  >
    {Icon !== undefined && <Icon />}
    {action}
  </Button>
);

export default CustomButton;
