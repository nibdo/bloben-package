import { reduxStore } from '../../layers/ReduxLayer';
import Contact, { IContact } from '../../../bloben-utils/models/Contact';
import ContactApi from '../../api/contact.api';
import { AxiosResponse } from 'axios';
import { addContact, addNotification, setContacts } from '../../../redux/actions';
import OpenPgp from '../../../bloben-utils/utils/OpenPgp';
import { findInArrayByKeyValue } from '../../../utils/common';

const SyncContact: any = {
    createNewFromSearch: async (item: any, searchResult: IContact[]) => {
        const store: any = reduxStore.getState();
        const { pgpKeys, contacts } = store;

        const contactInState: any = await findInArrayByKeyValue(contacts, 'email', item)

        if (contactInState) {
            return;
        }

        if (searchResult.length > 0) {
            for (const oneSearchResult of searchResult) {
                if (oneSearchResult.email !== item) {
                    const newContact = new Contact({email: item});
                    const contactBodyToSend: any = await newContact.formatBodyToEncrypt(pgpKeys.publicKey);
                    await ContactApi.createContact(contactBodyToSend)
                    reduxStore.dispatch(addContact(newContact.getState()));
                }
            }
        } else {
            const newContact = new Contact({email: item});
            const contactBodyToSend: any = await newContact.formatBodyToEncrypt(pgpKeys.publicKey);
            await ContactApi.createContact(contactBodyToSend)
            console.log(newContact.getState())
            reduxStore.dispatch(addContact(newContact.getState()));
        }
    },

    getAndDecryptFromServer: async () => {
        const store: any = reduxStore.getState();
        const { pgpKeys, password } = store;

        const response: AxiosResponse = await ContactApi.getContacts();

        const result: any = [];

        for (const item of response.data) {
            try {

            let decryptedData: any = await OpenPgp.decrypt(
                pgpKeys.publicKey,
                pgpKeys.privateKey,
                password,
                item.data
            );
            console.log('decryptedData', decryptedData)

            decryptedData = JSON.parse(decryptedData);

            console.log('decryptedData', decryptedData)

            // Merge
            const itemMerged: any = { ...item, ...decryptedData }
            console.log('itemMerged', itemMerged)

            result.push(itemMerged);
            } catch (error) {
                console.log(error)
            }

        }

        console.log('result', result)

        reduxStore.dispatch(setContacts(result));
    }
}

export default SyncContact;
