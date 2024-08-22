export class Config  {
    #nodeEnv: string =  process.env.NODE_ENV ? String(process.env.NODE_ENV) : "dev"; 
    #accountID: string = String(process.env.ACCOUNTID);
    #userName: string = String(process.env.USERNAME);
    #password: string = String(process.env.PASSWORD);
    #url: string = process.env.URL ? String(process.env.URL) : "https://skyvegas.com.nxt.ppbdev.com";

    public getNodeEnv(): string {
        return this.#nodeEnv;
    }

    public getAccountID(): string {
        return this.#accountID;
    }

    public getUserName(): string {
        return this.#userName;
    }

    public getPassword(): string {
        return this.#password;
    }

    public getURL(): string {
        return this.#url;
    }
}

export const config = new Config();



