export default {
  state: {
    currentPassword: '',
    password: '',
    repeatedPassword: '',
    warningPassword: '',
    isLoading: false,
  },
  validateAccountPassword: (
    password: string,
    repeatedPassword: string
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      if (password !== repeatedPassword) {
        resolve('Passwords are not matching');
        // tslint:disable-next-line:no-magic-numbers
      } else if (password.length < 4 || repeatedPassword.length < 4) {
        reject('Password is too short');
      } else {
        resolve('ok');
      }
    }),
};
