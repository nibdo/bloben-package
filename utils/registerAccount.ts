import register from './register-account';
import {
  setIsAppStarting,
  setIsLogged,
  setPassword,
  setPgpKeys,
  setUsername,
} from '../../redux/actions';
import { reduxStore } from '../layers/ReduxLayer';
import { logger } from 'bloben-common/utils/common';
import Axios from '../../bloben-common/utils/axios';
import { generateRandomDemoString } from './common';

// RFC 5054 2048bit constants
const rfc5054: any = {
  N_base10:
    '21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819',
  g_base10: '2',
  k_base16: '5b9e8ef059c6b32ea59fc1d322d37f04aa30bae5aa9003b8321e21ddb04e300',
};
// tslint:disable-next-line:no-require-imports no-var-requires max-line-length
const srpClient: any = require('thinbus-srp/client.js')(
  rfc5054.N_base10,
  rfc5054.g_base10,
  rfc5054.k_base16
);

/**
 * Create verifier and salt from new SRP client
 */
const createVerifier = (username: string, password: string) => {
  const client: any = new srpClient();

  const salt: any = client.generateRandomSalt();

  const verifier: any = client.generateVerifier(salt, username, password);

  return {
    salt,
    verifier,
  };
};

export const createDemoAccount = async (): Promise<void> => {
  const demoUsername: string = `BLOBEN${generateRandomDemoString()}`;
  const demoPassword: string = generateRandomDemoString();

  await registerAccountDemo(demoUsername, demoPassword, true);
};

const registerAccountDemo = async (
  username: string,
  password: string,
  isDemo: boolean = false
): Promise<void> => {
  try {
    reduxStore.dispatch(setIsAppStarting(true));
    const srpData = createVerifier(username, password);
    const { salt, verifier } = srpData;

    const result: any = await register(
      username,
      password,
      salt,
      verifier,
      true,
      true,
      true
    );

    // Save PGP keys
    reduxStore.dispatch(setPgpKeys(result.pgpKeys));
    // Send data and register
    const response = await Axios.post('/user/register', result.data);

    if (response.status === 200) {
      reduxStore.dispatch(setPassword(password));

      // Handle local data
      reduxStore.dispatch(setUsername(username));
      // await saveCryptoPasswordLocal(cryptoPasswordReal, false);
      reduxStore.dispatch(setIsLogged(true));

      // Handle settings
      // await initUser(dispatch);
    }
  } catch (error) {
    reduxStore.dispatch(setIsAppStarting(false))
    logger(error);
  }

  // Save user's data to store for next step
  // setContext('tempAuthData', tempAuthData);
};
