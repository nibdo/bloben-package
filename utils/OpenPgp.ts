// tslint:disable-next-line:no-require-imports no-var-requires
const openpgp = require('openpgp');

export type PgpKeys = {
    publicKey: string;
    privateKey: string;
}

/**
 * openpgpjs library
 * examples from https://github.com/openpgpjs/openpgpjs
 */
const OpenPgp = {
    /**
     * Generate public and private key
     * @param username
     * @param password
     */
    generateKeys: async (username: string, password: string): Promise<PgpKeys> => {

            const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
                userIds: [{ name: username }],
                curve: 'p256',
                passphrase: password
            });

            return {
            publicKey: publicKeyArmored,
            privateKey: privateKeyArmored
        }
    },

    /**
     * Encrypt JSON obj
     * @param publicKeyArmored
     * @param data
     */
    encrypt: async (publicKeyArmored: string, data: any): Promise<any> => {
        const options: any = {
            message: openpgp.message.fromText(JSON.stringify(data)),
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys
        }

        const result: any = await openpgp.encrypt(options);

        return result.data;
    },

    /**
     * Decrypt data
     * @param publicKeyArmored
     * @param privateKeyArmored
     * @param password
     * @param encrypted
     */
    decrypt: async (publicKeyArmored: string, privateKeyArmored: string, password: string, encrypted: string): Promise<any> => {
        const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
        await privateKey.decrypt(password);

        const result: any = await openpgp.decrypt({
            message: await openpgp.message.readArmored(encrypted),
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys,
            privateKeys: [privateKey]
        });

        return result.data;
    }
}

export default OpenPgp;
