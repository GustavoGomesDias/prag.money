import React, { useState } from 'react';
import {
  Box, Text,
} from '@chakra-ui/react';
import { PurchaseTableProps } from './PurchaseTable';
import formatDate from '../../../utils/formatDate';
import MoreActions from './MoreActions';

const MobileDisplayTable = ({ purchases }: PurchaseTableProps): JSX.Element => {
  const [purchaseId, setPurchaseId] = useState<number>(0);
  const [renderMoreActions, setRenderMoreActions] = useState<boolean>(false);

  const handleDispatchAction = (id: number): void => {
    setPurchaseId(id);
    setRenderMoreActions(true);
  };

  const handleOnCloseActions = () => setRenderMoreActions(false);

  return (
    <>
      {renderMoreActions && <MoreActions onClose={handleOnCloseActions} isOpen={renderMoreActions} purchaseId={purchaseId} />}
      <Box
        w="100%"
        h="100%"
        p="1em"
        display={{ base: 'block', md: 'none' }}
      >
        {purchases.length > 0 && purchases.map((purchase, index) => (
          <Box
            key={purchase.description + purchase.id}
            w="full"
            p="1em"
            borderBottom={(purchases.length - 1 > index) ? '1px solid #00735C' : 'none'}
            borderRadius="5px"
            fontWeight="bold"
            cursor="pointer"
            _hover={{
              bg: '#C1D9B7',
            }}
            onClick={() => handleDispatchAction(purchase.id as number)}
          >
            <Text>{purchase.description}</Text>
            <Text>{purchase.value}</Text>
            <Text>{formatDate(new Date(purchase.purchase_date))}</Text>
          </Box>
        ))}
      </Box>
    </>
  );
};
export default MobileDisplayTable;
