import {Document, model, Model, Schema} from "mongoose";

const OperatLogSchema = new Schema({
    createUser: String, // 创建人
    createTime: {type: Number, default: Date.now()}, // 创建日期
    updateTime: {type: Number, default: Date.now()}, // 更新日期
})


export interface IOperatLog extends Document {
    id?: string,
    createUser?: string, // 创建人
    createTime?: number, // 更新日期
    updateTime?: number, // 更新日期
}

export interface IOperatLogModel extends Model<IOperatLog> {

}

export const OperatLogs = model<IOperatLog>("operat_logs", OperatLogSchema) as IOperatLogModel;