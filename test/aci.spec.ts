import "reflect-metadata";
import {Service} from "./db/service";
import {Types} from "mongoose";
import {IOperatLog} from "./db/operat-log";
import {expect, should} from 'chai';
import {describe, beforeEach} from 'mocha';

describe("Transaction", function () {

    beforeEach(async () => {
        //
    });

    describe("saveNormal", async function () {
        const service = new Service();
        const now = Date.now();
        let data: any = {
            _id: Types.ObjectId(),
            createUser: "zhangsan",
            createTime: now,
            updateTime: now
        };
        let result: IOperatLog = await service.saveNormal(data);
        it("saveNormal save data success", () => {
            expect(result).to.equal(null);
            expect(result.id).to.equal(data._id.toString());
        });
        result = await service.getById(data._id);
        it("saveNormal check data in db", () => {
            expect(result).to.equal(null);
            expect(result.id).to.equal(data._id.toString());
        });
    });

    describe("saveError", async function () {
        const service = new Service();
        const now = Date.now();
        let data: any = {
            _id: Types.ObjectId(),
            createUser: "lisi",
            createTime: now,
            updateTime: now
        };
        try {
            let result: IOperatLog = await service.saveError(data);
            it("saveError save data success", () => {
                expect(result).to.equal(null);
                expect(result.id).to.equal(data._id.toString());
            });
        } catch (e) {
            it("saveError check data in db", () => {
                expect(e).to.not.equal(null);
            });
        } finally {
            let result: IOperatLog = await service.getById(data._id);
            it("saveError check data in db", () => {
                expect(result).to.equal(null);
                expect(result.id).to.equal(data._id.toString());
            });
        }
    });

});
