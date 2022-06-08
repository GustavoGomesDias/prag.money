import React, { useState } from 'react';
import {
  Flex, IconButton, Tooltip,
} from '@chakra-ui/react';
import { BiRightArrow } from 'react-icons/bi';
import SideContent from './SideContent';

const SideMenu = (): JSX.Element => {
  const [showUserActions, setShowUserActions] = useState<boolean>(false);
  return (
    <Flex
      w="full"
      display={{ base: 'flex', xl: 'none' }}
      position="fixed"
      bottom="0"
      zIndex={2}
      transition="0.5s ease"
      transform={`translate(0%, ${showUserActions ? '0%' : '80%'})`}
      flexDir="column"
    >
      <Flex>
        <Flex
          transform={!showUserActions ? 'rotate(-90deg)' : 'rotate(90deg)'}
          transition="0.5s"
          justifyContent="flex-end"
          alignItems="flex-end"
          p="0 !important"
          mx="1em"
        >
          <Tooltip
            hasArrow
            label="Abrir ações de usuários"
            placement="left-start"
          >
            <IconButton
              _focus={{
                outline: 'none',
              }}
              transition="0.5s"
              p="0 !important"
              m="0 !important"
              _hover={{
                bg: 'transparent',
                transform: 'scale(1.2)',
              }}
              bg="transparent"
              borderRadius="0"
              aria-label="show-options"
              icon={<BiRightArrow size={30} />}
              onClick={() => {
                const result = showUserActions;
                setShowUserActions(!result);
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Flex
        w="full"
        justifyContent="flex-start"
        alignItems="flex-start"
        pb="1em"
        bg="#031426"
        borderTop="5px solid #00735C"
        boxShadow="0 0 1em rgba(0, 0, 0, 0.6)"
        transition="0.8s ease-out"
      >
        <SideContent />
      </Flex>
    </Flex>
  );
};

export default SideMenu;
