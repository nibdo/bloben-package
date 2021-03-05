import { User } from '../../../bloben-utils/models/User';

const initUser: User = {
    username: null,
    publicKey: '',
    privateKey: '',
}

const user = (state: User = initUser, action: any) => {
    switch (action.type) {
        case 'SET_USER':
            return action.payload;
        default:
            return state;
    }
}

export default user;
