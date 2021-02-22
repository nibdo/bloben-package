const AT_SYMBOL: string = '@';
const EMAIL_MIN_LEN: number = 5;

const Validator: any = {
    isEmail: (value: string): boolean => {
        const indexOfAt: number = value.indexOf(AT_SYMBOL);

        if (indexOfAt === -1 || value.length < EMAIL_MIN_LEN || indexOfAt === 0) {
            return false;
        }

        const emailStringArray: string[] = value.split(AT_SYMBOL);

        if (emailStringArray[1].indexOf('.') === -1) {
            return false;
        }

        return true;
    }
}


export default Validator;
