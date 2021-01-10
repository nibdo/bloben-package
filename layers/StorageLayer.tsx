import React from 'react';
import EncryptionLayer from './EncryptionLayer';
import { LocalForage } from 'bloben-package/utils/LocalForage';

const StorageLayer = () => {
    LocalForage.config();

    return (
        <EncryptionLayer/>
    )
}

export default StorageLayer;
