import "reflect-metadata";
import {ClientSession, startSession} from 'mongoose';

const sessionMetadataKey = Symbol("SessionHandler");


export function SessionHandler(target: any, propertyKey: string | symbol, parameterIndex: any) {
    Reflect.defineMetadata(sessionMetadataKey, parameterIndex, target, propertyKey);
}

/**
 * 事务装饰器: 这里默认处理未事务的传播特性，即若一个事务调用了另一个具有实务的方法，后者不用新开事务。
 * @param target
 * @param {string} propertyName
 * @param {TypedPropertyDescriptor<Function>} descriptor
 * @constructor
 */
export function Transaction() {
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value;
        descriptor.value = function () {
            let _this = this;
            let _args: any = arguments;
            const parameterIndex: any = Reflect.getOwnMetadata(sessionMetadataKey, target, propertyKey);
            if (parameterIndex != null) {
                if (_args[parameterIndex] != null) {
                    // 若事务已经存在则不用新开启事务
                    return method.apply(_this, _args);
                } else {
                    return acid((session: ClientSession) => {
                        // 传入session
                        let args: any = [];
                        Object.assign(args, _args)
                        args[parameterIndex] = session;
                        return method.apply(_this, args);
                    });
                }
            }
            // 不需要开启session
            return method.apply(_this, _args);
        }
    }
}

/**
 * The core of mongodb transaction: from start to close
 *
 * @param callback A callback which does DB writes and reads using the session.
 */
async function acid(callback: (session: ClientSession) => Promise<any>): Promise<any> {
    const session = await startSession();
    try {
        session.startTransaction();
        const value = await callback(session);
        // Since the mutations ran without an error, commit the transaction.
        await session.commitTransaction();

        // Return any value returned by `mutations` to make this function as transparent as possible.
        return value;
    } catch (error) {
        // Abort the transaction as an error has occurred in the mutations above.
        await session.abortTransaction();
        console.error(error);
        // Rethrow the error to be caught by the caller.
        throw error;
    } finally {
        // End the previous session.
        session.endSession();
    }
}


