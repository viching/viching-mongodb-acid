import * as mongoose from "mongoose";

const uris = [
    "172.19.70.103:27017",
    "172.19.70.103:27018",
    "172.19.70.103:27019"
];
const opts = {
    db: {native_parser: true},
    dbName: 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    mongos: true,
    server: {
        poolSize: 5,
        auto_reconnect: true,
        readPreference: "secondaryPreferred",   // 读偏好设置
        socketOptions: {keepAlive: 1}
    },
    replset: {
        rs_name: "repset01",
        readPreference: "secondaryPreferred"
    }    // 读偏好设置
};

/* 连接副本集
 * 使用同样的方法，而不是通过一个单一的URI连接到一个副本集，但我们通过逗号分隔URI。
 * mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);
 */
mongoose.connect("mongodb://" + uris.join(","), opts, err => {
    if (err) {
        console.error('Connection Error:' + err)
    } else {
        console.info('Connection success!')
    }
});