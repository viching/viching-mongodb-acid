## viching-mongodb-acid

这个项目基于mongoose，主要实现mongodb事务的简便化处理。

当然，mongodb的事务，必须基于4.0版本及其以上版本，并且在单机上无法实现事务，必须在分片或者副本集的环境下才能实现事务，
所以若该项目无法在你的开发或者生产环境上生效，请确认当前的开发环境。

使用很简单(完整测试代码见test.ts)：
```text
import "reflect-metadata";
import {ClientSession} from "mongoose";
import {SessionHandler, Transaction} from "viching-mongodb-acid";

class Test {

    @Transaction()
    async run(userId: string, @SessionHandler session: ClientSession): Promise<any> {
        let data: any = {
            ip: 'xxx1',
            createUser: userId,
        };
        await OperatLogs.saveStart(data, session);
        // throw new Error("---------");
    }
}
```


