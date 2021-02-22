import { IUserProfile } from '../../types/common.types';

const initUserProfile: IUserProfile = {
    appEmail: null,
    publicName: null,
    email: null,
    emailIsVerified: false,
    emailPublicKey: null
}

const userProfile = (state: IUserProfile = initUserProfile, action: any) => {
    switch (action.type) {
        case 'SET_USER_PROFILE':
            return action.payload;
        default:
            return state;
    }
}

export default userProfile;
