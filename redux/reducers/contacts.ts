import { Contact } from '../../../bloben-utils/models/Contact';

const contacts = (state: Contact[] = [], action: any) => {
  switch (action.type) {
    case 'SET_CONTACTS':
      return action.payload;
    case 'ADD_CONTACT':
      return [...state, action.payload];
    default:
      return state;
  }
};

export default contacts;
