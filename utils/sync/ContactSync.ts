import { AxiosResponse } from 'axios';

import { reduxStore } from '../../layers/ReduxProvider';
import ContactApi from '../../api/contact.api';
import { addContact, setContacts } from '../../../redux/actions';
import OpenPgp from '../../../bloben-utils/utils/OpenPgp';
import { findInArrayByKeyValue } from '../../../utils/common';
import { Contact, createContact } from '../../../bloben-utils/models/Contact';
import { ReduxState } from '../../../types/types';
import {
  ContactEncrypted,
  encryptContact,
} from '../../../bloben-utils/models/ContactEncrypted';

const SyncContact: any = {
  createNewFromSearch: async (
    item: any,
    searchResult: Contact[]
  ): Promise<void> => {
    const store: ReduxState = reduxStore.getState();
    const { user, contacts } = store;

    const contactInState: Contact | undefined = await findInArrayByKeyValue(
      contacts,
      'email',
      item
    );

    if (contactInState) {
      return;
    }

    if (searchResult.length > 0) {
      for (const oneSearchResult of searchResult) {
        if (oneSearchResult.email !== item) {
          const newContact = createContact({ email: item });
          const contactBodyToSend: ContactEncrypted = await encryptContact(
            user.publicKey,
            newContact
          );
          await ContactApi.createContact(contactBodyToSend);
          reduxStore.dispatch(addContact(newContact));
        }
      }
    } else {
      const newContact = createContact({ email: item });
      const contactBodyToSend: ContactEncrypted = await encryptContact(
        user.publicKey,
        newContact
      );
      await ContactApi.createContact(contactBodyToSend);
      reduxStore.dispatch(addContact(newContact));
    }
  },

  getAndDecryptFromServer: async (): Promise<void> => {
    const store: ReduxState = reduxStore.getState();
    const { user, password } = store;

    const response: AxiosResponse = await ContactApi.getContacts();

    const result: any = [];

    for (const item of response.data) {
      if (!item.deletedAt) {
        try {
          let decryptedData: any = await OpenPgp.decrypt(
            user.publicKey,
            user.privateKey,
            password,
            item.data
          );
          decryptedData = JSON.parse(decryptedData);

          // Merge
          const itemMerged: Contact = { ...item, ...decryptedData };

          result.push(itemMerged);
        } catch (error) {
          console.log(error);
        }
      }
    }

    reduxStore.dispatch(setContacts(result));
  },
};

export default SyncContact;
