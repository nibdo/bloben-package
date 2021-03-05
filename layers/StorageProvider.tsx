import React from 'react';

import { LocalForage } from 'bloben-package/utils/LocalForage';

/**
 * Init indexed database
 */

interface StorageProviderProps {
  children: any;
}

const StorageProvider = (props: StorageProviderProps) => {
  LocalForage.config();

  return props.children;
};

export default StorageProvider;
