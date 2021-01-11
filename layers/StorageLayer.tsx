import React from 'react';
import { LocalForage } from 'bloben-package/utils/LocalForage';
import ContextLayer from './ContextLayer';

/**
 * Init indexed database
 * @constructor
 */
const StorageLayer = () => {
    LocalForage.config();

    return (
        <ContextLayer/>
    )
}

export default StorageLayer;
