import "reflect-metadata";

import {SessionHandler, Transaction} from "../lib";
import {OperatLogs} from "./operat-log";
import {ClientSession} from "mongoose";


class Test {

    private tag: string;

    constructor(tag: string) {
        this.tag = tag;
    }

    @Transaction()
    async run(userId: string, @SessionHandler session: ClientSession): Promise<any> {
        let data: any = {
            clientID: 'xxx1',
            origin: 'xxx1',
            referer: 'xxx1',
            path: 'xxx1',
            method: 'xxx1',
            content: 'xxx1',
            ip: 'xxx1',
            agent: 'xxx1',
            remark: 'xxx1',
            createUser: userId,
        };
        console.log("data: ", JSON.stringify(data));
        await OperatLogs.saveStart(data, session);
        // throw new Error("---------");
    }
}

const test = new Test("this is Test.class instance test");
test.run('zhangsan', null).then(() => {
    console.info("Operate success!");
}).catch((err: any) => {
    console.error(err)
});
// process.exit(0);