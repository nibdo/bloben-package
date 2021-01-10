export default {
  state: {
    username: '',
    password: '',
    repeatedPassword: '',
    warningUsername: '',
    warningPassword: '',
    isLoading: false,
  },
  validateAccountPassword: (
    password: string,
    repeatedPassword: string
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      if (password !== repeatedPassword) {
        reject('Passwords are not matching');
        // tslint:disable-next-line:no-magic-numbers
      } else if (password.length < 4 || repeatedPassword.length < 4) {
        reject('Password is too short');
      } else {
        resolve('ok');
      }
    }),
};
