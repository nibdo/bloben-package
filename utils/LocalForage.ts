import localForage from "localforage";
import { logger } from "bloben-common/utils/common";

export const LocalForage = localForage.createInstance({
  name: "database",
  version: 1,
  storeName: "storage",
});

LocalForage.setDriver(localForage.INDEXEDDB)
  .then(() => {
    logger("LocalForage Success");
  })
  .catch((error) => {
    logger(error);
  });

export default {
  localForage,
  LocalForage,
};
