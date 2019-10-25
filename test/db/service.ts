import "reflect-metadata";

import {SessionHandler, Transaction} from "../../src";
import {OperatLogs} from "./operat-log";
import {ClientSession} from "mongoose";


export class Service {

    @Transaction()
    async saveNormal(data: any, @SessionHandler session?: ClientSession): Promise<any> {
        console.log("session: ", session != null)
        let result: any = await OperatLogs.create([data], {session});
        return result && result[0];
        return null;
    }

    @Transaction()
    async saveError(data: any, @SessionHandler session?: ClientSession): Promise<any> {
        let result: any = await OperatLogs.create([data], {session});
        throw new Error("---------");
        return result && result[0];
    }

    async getById(id: string): Promise<any> {
        let result: any = await OperatLogs.findById(id);
        return result && result[0];
    }
}