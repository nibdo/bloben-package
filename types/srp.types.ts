export type TSrpChallengeType = {
    salt: string;
    b: string;
}

export type TSrpCredentialsType = {
    A: string;
    M1: string;
}

export type TSrpCredentialsForAuthType = {
    A: string;
    M1: string;
    username: string;
}

