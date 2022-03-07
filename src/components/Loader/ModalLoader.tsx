import React from 'react';
import { Flex, Modal, ModalOverlay } from '@chakra-ui/react';
import Loader from './Loader';

export interface ModalLoaderProps {
  isOpen: boolean
  onClose: () => void | undefined
}

const ModalLoader = ({ isOpen, onClose }: ModalLoaderProps): JSX.Element => (
  <Modal
    isOpen={isOpen}
    onClose={onClose || undefined}
  >
    <ModalOverlay>
      <Flex
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Loader />
      </Flex>
    </ModalOverlay>
  </Modal>
);

export default ModalLoader;
