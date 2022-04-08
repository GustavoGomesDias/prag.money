import { ButtonGroup } from '@chakra-ui/react';
import React from 'react';
import CustomButton from '../../UI/CustomButton';

export interface SideContentProps {
  onClose: () => void
}

const SideContent = ({ onClose }: SideContentProps): JSX.Element => {
  const handleScroll = () => {
    onClose();
    // setTimeout(() => handleScrollToContent(), 300);
    // clearTimeout();
  };

  return (
    <ButtonGroup
      display="flex"
      flexDir="column"
      width="100%"
      justifyContent="center"
      gap={4}
      mt="3em"
    >
      <CustomButton action="Add Compra" textSize="16px" handleOnClick={handleScroll} />
      <CustomButton action="Add forma de pagamento" textSize="16px" handleOnClick={handleScroll} />
      <CustomButton action="Ver formas de pagamentos" textSize="16px" handleOnClick={handleScroll} />
      <CustomButton action="Ver relatório do mês" textSize="16px" handleOnClick={handleScroll} />
    </ButtonGroup>
  );
};

export default SideContent;
