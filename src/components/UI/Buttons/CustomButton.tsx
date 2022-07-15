import React from 'react';
import { Button } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export interface CustomButtonProps {
  action: string
  handleOnClick: () => void
  hoverColor?: string
  textSize?: string
  Icon?: IconType
  isActive?: boolean
}

const CustomButton = ({
  action, handleOnClick, hoverColor, textSize, Icon, isActive,
}: CustomButtonProps): JSX.Element => (
  <Button
    bg={isActive ? (hoverColor || '#049679') : 'transparent'}
    display="flex"
    alignItems="center"
    justifyContent="flex-start"
    padding="1.5rem"
    onClick={() => handleOnClick()}
    color={isActive ? '#fff' : '#00E091'}
    w="100%"
    size="lg"
    variant="unstyled"
    margin="0px !important"
    outline="none !important"
    fontSize={textSize || { base: '16px', md: '18px' }}
    transition="0.8s"
    gap={2}
    _active={{
      transform: 'scale(.9)',
      border: 'none',
    }}
    _hover={{
      pl: '1.7rem',
      bg: hoverColor || '#049679',
      color: '#fff',
    }}
  >
    {Icon !== undefined && <Icon />}
    {action}
  </Button>
);

export default CustomButton;
