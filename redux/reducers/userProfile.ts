import { UserProfile } from '../../types/common.types';

const initUserProfile: UserProfile = {
  appEmail: '',
  publicName: '',
  email: null,
  emailIsVerified: false,
  emailPublicKey: null,
};

const userProfile = (state: UserProfile = initUserProfile, action: any) => {
  switch (action.type) {
    case 'SET_USER_PROFILE':
      return action.payload;
    default:
      return state;
  }
};

export default userProfile;
