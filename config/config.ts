import { Account } from '../types/userAccount';

export class Config {
    #nodeEnv: string = process.env.NODE_ENV
        ? String(process.env.NODE_ENV)
        : 'nxt';
    #workers: number = process.env.WORKERS ? Number(process.env.WORKERS) : 1;
    #accounts: Account[] = this.createAccountsList();
    #realityCheckUserName = String(process.env.REALITY_CHECK_USERNAME);
    #realityCheckPassword = String(process.env.REALITY_CHECK_PASSWORD);
    #url: string = process.env.URL
        ? String(process.env.URL)
        : 'https://skyvegas.com.nxt.ppbdev.com';
    #userCreationToolURL: string = process.env.USER_CREATION_TOOL_URL
        ? String(process.env.USER_CREATION_TOOL_URL)
        : 'https://uct.dev.betfair';

    private createAccountsList(): Account[] {
        const accounts: Account[] = [];
        const usernames = String(process.env.USERNAMES).split(',');
        const passwords = String(process.env.PASSWORDS).split(',');
        const accountIds = String(process.env.ACCOUNT_IDS).split(',');

        for (let i = 0; i < this.#workers; i++) {
            accounts.push({
                username: usernames[i],
                password: passwords[i],
                accountId: accountIds[i],
            });
        }

        return accounts;
    }

    public getAccounts(): Account[] {
        return this.#accounts;
    }

    public getNodeEnv(): string {
        return this.#nodeEnv;
    }

    public getUserCreationToolURL(): string {
        return this.#userCreationToolURL;
    }

    public getURL(): string {
        return this.#url;
    }

    public getRealityCheckUserName(): string {
        return this.#realityCheckUserName;
    }

    public getRealityCheckPassword(): string {
        return this.#realityCheckPassword;
    }
}
export const config = new Config();
