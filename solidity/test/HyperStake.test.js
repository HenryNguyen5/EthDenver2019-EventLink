"use strict";

const abi = require("ethereumjs-abi");
const util = require("ethereumjs-util");
const BN = require("bn.js");

const Oracle = artifacts.require("Oracle.sol");
const LinkToken = artifacts.require("LinkToken.sol");
const HyperStake = artifacts.require("HyperStake.sol");

contract("HyperStake", accounts => {
    const owner = accounts[0];
    const oracleNode = accounts[1];
    const user1 = accounts[2];
    let oracleContract, linkTokenContract, hyperStakeContract;

    const bigNum = number => web3.utils.toBN(number);

    const toHexWithoutPrefix = arg => {
        if (arg instanceof Buffer || arg instanceof BN) {
            return arg.toString("hex");
        } else if (arg instanceof Uint8Array) {
            return Array.prototype.reduce.call(
                arg,
                (a, v) => a + v.toString("16").padStart(2, "0"),
                ""
            );
        } else {
            return Buffer.from(arg, "ascii").toString("hex");
        }
    };

    const toHex = value => {
        return Ox(toHexWithoutPrefix(value));
    };

    const Ox = value => ("0x" !== value.slice(0, 2) ? `0x${value}` : value);

    const hexToAddress = hex => Ox(bigNum(hex).toString("hex"));

    const startMapBuffer = Buffer.from([0xbf]);
    const endMapBuffer = Buffer.from([0xff]);

    const autoAddMapDelimiters = data => {
        let buffer = data;

        if (buffer[0] >> 5 !== 5) {
            buffer = Buffer.concat(
                [startMapBuffer, buffer, endMapBuffer],
                buffer.length + 2
            );
        }

        return buffer;
    };

    const decodeRunRequest = log => {
        const runABI = util.toBuffer(log.data);
        const types = [
            "address",
            "bytes32",
            "uint256",
            "address",
            "bytes4",
            "uint256",
            "uint256",
            "bytes"
        ];
        const [
            requester,
            requestId,
            payment,
            callbackAddress,
            callbackFunc,
            expiration,
            version,
            data
        ] = abi.rawDecode(types, runABI);

        return {
            topic: log.topics[0],
            jobId: log.topics[1],
            requester: Ox(requester),
            id: toHex(requestId),
            payment: toHex(payment),
            callbackAddr: Ox(callbackAddress),
            callbackFunc: toHex(callbackFunc),
            expiration: toHex(expiration),
            dataVersion: version,
            data: autoAddMapDelimiters(data)
        };
    };

    const fulfillOracleRequest = async (oracle, request, response, options) => {
        if (!options) options = {};

        return oracle.fulfillOracleRequest(
            request.id,
            request.payment,
            request.callbackAddr,
            request.callbackFunc,
            request.expiration,
            response,
            options
        );
    };

    beforeEach(async () => {
        linkTokenContract = await LinkToken.new();
        oracleContract = await Oracle.new(linkTokenContract.address, {
            from: owner
        });

        const params = [1, "henrynguyen5"];
        hyperStakeContract = await HyperStake.new(
            linkTokenContract.address,
            oracleContract.address,
            ...params
        );
        await oracleContract.setFulfillmentPermission(oracleNode, true, {
            from: owner
        });
        await linkTokenContract.transfer(
            hyperStakeContract.address,
            web3.utils.toWei("1", "ether")
        );
    });

    context("invariant tests", () => {
        it("should return the correct receiver", async () => {
            const result = await hyperStakeContract.getReceiver();
            assert.equal(result, "henrynguyen5");
        });
        it("should return the correct max stake of 1 ether", async () => {
            const result = await hyperStakeContract.getMaxStake();
            assert.equal(result, web3.utils.toWei("1", "ether"));
        });
        it("should return a balance of 0", async () => {
            const result = await hyperStakeContract.getBalance();
            assert.equal(result, web3.utils.toWei("0", "ether"));
        });
        it("should properly concatenate two strings", async () => {
            const result = await hyperStakeContract.concat(
                "http://",
                "24b8945ea",
                ".ngrok.io/verifyReceiver?username=",
                "henrynguyen5"
            );
            assert.equal(
                result,
                "http://24b8945ea.ngrok.io/verifyReceiver?username=henrynguyen5"
            );
        });
    });

    context("staking", () => {
        it("should let the user stake under the max stake amount", async () => {
            let res = await hyperStakeContract.stake({
                value: web3.utils.toWei("0.5", "ether")
            });
            res = await hyperStakeContract.getBalance();
            assert.equal(res, web3.utils.toWei("0.5", "ether"));
            res = await hyperStakeContract.getBalanceOfStaker(owner);
            assert.equal(res, web3.utils.toWei("0.5", "ether"));
        });

        it("should refund back any access ether", async () => {
            let res = await hyperStakeContract.stake({
                value: web3.utils.toWei("1.1", "ether")
            });
            res = await hyperStakeContract.getBalance();
            assert.equal(res, web3.utils.toWei("1", "ether"));
            res = await hyperStakeContract.getBalanceOfStaker(owner);
            assert.equal(res, web3.utils.toWei("1", "ether"));
        });

        it("should pool together multiple stakers", async () => {
            let res = await hyperStakeContract.stake({
                value: web3.utils.toWei("1", "ether")
            });
            res = await hyperStakeContract.stake({
                value: web3.utils.toWei("1", "ether"),
                from: user1
            });

            res = await hyperStakeContract.getBalance();
            assert.equal(res, web3.utils.toWei("2", "ether"));
            res = await hyperStakeContract.getBalanceOfStaker(owner);
            assert.equal(res, web3.utils.toWei("1", "ether"));
            res = await hyperStakeContract.getBalanceOfStaker(user1);
            assert.equal(res, web3.utils.toWei("1", "ether"));
        });
    });

    context("requesting payouts", () => {
        it("makes a log on the oracle contract", async () => {
            const tx = await hyperStakeContract.requestPayout("mySubdomain", {
                from: user1
            });
            const request = decodeRunRequest(tx.receipt.rawLogs[3]);
            assert.equal(
                hyperStakeContract.address.toLowerCase(),
                request.requester.toLowerCase()
            );
        });
    });

    context("upon fufillment", () => {
        let request;

        beforeEach(async () => {
            let res = await hyperStakeContract.stake({
                value: web3.utils.toWei("1", "ether")
            });
            res = await hyperStakeContract.stake({
                value: web3.utils.toWei("1", "ether"),
                from: user1
            });

            res = await hyperStakeContract.getBalance();
            assert.equal(res, web3.utils.toWei("2", "ether"));
            res = await hyperStakeContract.getBalanceOfStaker(owner);
            assert.equal(res, web3.utils.toWei("1", "ether"));
            res = await hyperStakeContract.getBalanceOfStaker(user1);
            assert.equal(res, web3.utils.toWei("1", "ether"));

            const tx = await hyperStakeContract.requestPayout("mySubdomain", {
                from: user1
            });
            request = decodeRunRequest(tx.receipt.rawLogs[3]);
            assert.equal(
                hyperStakeContract.address.toLowerCase(),
                request.requester.toLowerCase()
            );
        });

        it("pays out on successful fulfillment", async () => {
            const prevBalance = await web3.eth.getBalance(user1);
            const validResponse = web3.utils.toHex(1);

            await fulfillOracleRequest(oracleContract, request, validResponse, {
                from: oracleNode
            });

            const afterBalance = await web3.eth.getBalance(user1);
            assert.equal(
                afterBalance,
                // why
                new BN(prevBalance).add(new BN(web3.utils.toWei("2", "ether")))
            );
        });

        it("does not pay out on failed fulfillment", async () => {
            const prevBalance = await web3.eth.getBalance(user1);
            const validResponse = web3.utils.toHex(0);

            await fulfillOracleRequest(oracleContract, request, validResponse, {
                from: oracleNode
            });

            const afterBalance = await web3.eth.getBalance(user1);
            assert.equal(afterBalance, prevBalance);
        });
    });
});
