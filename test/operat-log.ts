import {ClientSession, Document, Model, Schema, Types} from "mongoose";
import {database} from "./database";


// 操作日志
const OperatLogSchema = new Schema({
    clientID: String, // 系统调用时才有
    origin: String, // 站点来源
    referer: String, // 网页来源
    path: String, // 路径
    method: String, // 方法
    content: String, // 内容
    ip: String, // ip地址
    agent: String, // 终端
    flag: {type: Number, default: 0}, // 0 操作未完成 1 操作完成
    remark: String, // 备注
    error: Object,
    createUser: String, // 创建人
    createTime: {type: Number, default: Date.now()}, // 创建日期
    updateTime: {type: Number, default: Date.now()}, // 更新日期
})


export interface IOperatLog extends Document {
    id?: string,
    clientID?: string, // 系统调用时才有
    origin?: String, // 站点来源
    referer?: String, // 网页来源
    path?: string, // 路径
    method?: string, // 方法
    content?: string, // 内容
    ip?: string, // ip地址
    agent?: string, // 终端
    flag?: number, // 0 操作未完成 1 操作完成
    remark?: string, // 备注
    createUser?: string, // 创建人
    createTime?: number, // 更新日期
    updateTime?: number, // 更新日期
}

export interface IOperatLogModel extends Model<IOperatLog> {
    // 记录操作开始
    saveStart(data: any, session?:ClientSession): Promise<any>

    // 确认操作完成
    saveOver(id: string, session?:ClientSession): Promise<void>;

    // 记录错误信息
    recordError(id: string, error: any, session?:ClientSession): Promise<void>;
}

OperatLogSchema.static("saveStart", (data: IOperatLog, session?:ClientSession) => {
    data.createTime = Date.now();
    data.flag = 0;
    data._id = Types.ObjectId();
    return OperatLogs.create([data], {session});
});

OperatLogSchema.static("saveOver", (id: string, session?:ClientSession) => {
    const data: any = {
        flag: 1
    };
    const sid = Types.ObjectId(id);
    data.updateTime = Date.now();
    return OperatLogs.updateOne({'_id': sid}, data, {session});
});

OperatLogSchema.static("recordError", (id: string, error: any, session?:ClientSession) => {
    const data: any = {
        error
    };
    const sid = Types.ObjectId(id);
    data.updateTime = Date.now();
    return OperatLogs.updateOne({'_id': sid}, data, {session});
});

export const OperatLogs = database.model<IOperatLog>("operat_logs", OperatLogSchema) as IOperatLogModel;