/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Flex, Modal, ModalOverlay } from '@chakra-ui/react';

export interface PragModalProps {
  children: JSX.Element | JSX.Element[]
  isOpen: boolean
  onClose?: () => void
}

const PragModal = ({ isOpen, onClose, children }: PragModalProps): JSX.Element => (
  <Modal
    isOpen={isOpen}
    onClose={onClose || (() => {})}
  >
    <ModalOverlay>
      <Flex
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        {children}
      </Flex>
    </ModalOverlay>
  </Modal>
);

export default PragModal;
