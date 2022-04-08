import {
  Modal, ModalOverlay, ButtonGroup, Flex, IconButton,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import CustomButton from '../../UI/CustomButton';
import { ModalLoaderProps } from '../../UI/Loader/ModalLoader';

export interface MoreInfosProps extends ModalLoaderProps {
  purchaseId: number
}

const MoreActions = ({ isOpen, onClose, purchaseId }: MoreInfosProps): JSX.Element => {
  console.log(purchaseId);
  return (
    <Modal
      isOpen={isOpen}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClose={onClose || (() => {})}
    >
      <ModalOverlay>
        <Flex
          w="full"
          h="100vh"
          justifyContent="center"
          alignItems="center"
        >

          <Flex
            bg="#fff"
            w="80%"
            h="50vh"
            // justifyContent="center"
            border="2px solid #00735C"
            borderRadius="5px"
            flexDir="column"
          >
            <Flex
              w="100%"
              justifyContent="flex-end"
            >
              <IconButton
                display={{ base: 'flex', xl: 'none' }}
                aria-label="Open menu"
                fontSize="20px"
                color="red"
                variant="unstyled"
                opacity="0.5"
                icon={<AiOutlineClose />}
                onClick={onClose}
                _hover={{
                  opacity: 1,
                }}
                cursor="pointer"
              />
            </Flex>
            <Flex
              w="full"
              justifyContent="center"
            >

              <ButtonGroup
                display="flex"
                flexDir="column"
                width="80%"
                justifyContent="center"
                alignItems="center"
                gap={4}
                marginBottom="15px"
                mt="15px"
              >
                <CustomButton action="Add Compra" textSize="16px" />
                <CustomButton action="Add conta" textSize="16px" />
                <CustomButton action="Ver relatório" textSize="16px" />
              </ButtonGroup>
            </Flex>
          </Flex>
        </Flex>
      </ModalOverlay>
    </Modal>
  );
};

export default MoreActions;
