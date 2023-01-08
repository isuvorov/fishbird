"use strict";
/*
Based on When.js tests

Open Source Initiative OSI - The MIT License

http://www.opensource.org/licenses/mit-license.php

Copyright (c) 2011 Brian Cavalier

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe('map – test', () => {
    const mapper = (val) => __awaiter(void 0, void 0, void 0, function* () { return (yield val) * 2; });
    const deferredMapper = (val) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, src_1.delay)(1);
        return (yield val) * 2;
    });
    test('hello', () => {
        expect(1).toBe(1);
    });
    test('should map input values array', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, 2, 3];
        const results = yield (0, src_1.map)(input, mapper);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should map input promises array', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        const results = yield (0, src_1.map)(input, mapper);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should map mixed input array', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, Promise.resolve(2), 3];
        const results = yield (0, src_1.map)(input, mapper);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should map input when mapper returns a promise', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, 2, 3];
        const results = yield (0, src_1.map)(input, deferredMapper);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should map input promises when mapper returns a promise', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        const results = yield (0, src_1.map)(input, deferredMapper);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should accept a promise for an array', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, Promise.resolve(2), 3];
        const results = yield (0, src_1.map)(input, deferredMapper);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should throw a TypeError when input promise does not resolve to an array', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = Promise.resolve(123);
        const run = () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error
            const results = yield (0, src_1.map)(input, mapper);
            return results;
        });
        yield expect(run).rejects.toThrow(TypeError);
    }));
    test('should reject when input contains rejection', () => __awaiter(void 0, void 0, void 0, function* () {
        // eslint-disable-next-line prefer-promise-reject-errors
        const input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
        const run = () => __awaiter(void 0, void 0, void 0, function* () {
            const results = yield (0, src_1.map)(input, mapper);
            return results;
        });
        yield expect(run).rejects.toEqual(2);
    }));
    test('should call mapper asynchronously on values array', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, 2, 3];
        let calls = 0;
        const counterMapper = () => calls++;
        expect(calls).toEqual(0);
        yield (0, src_1.map)(input, counterMapper);
        expect(calls).toEqual(3);
    }));
    test('should call mapper asynchronously on mixed array', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, Promise.resolve(2), 3];
        let calls = 0;
        const counterMapper = () => calls++;
        expect(calls).toEqual(0);
        yield (0, src_1.map)(input, counterMapper);
        expect(calls).toEqual(3);
    }));
});
describe('map – test with concurrency', () => {
    const concurrency = { concurrency: 2 };
    const mapper = (val) => __awaiter(void 0, void 0, void 0, function* () { return (yield val) * 2; });
    const deferredMapper = (val) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, src_1.delay)(1);
        return (yield val) * 2;
    });
    test('should map input values array with concurrency', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, 2, 3];
        const results = yield (0, src_1.map)(input, mapper, concurrency);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should map input promises array with concurrency', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        const results = yield (0, src_1.map)(input, mapper, concurrency);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should map mixed input array with concurrency', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, Promise.resolve(2), 3];
        const results = yield (0, src_1.map)(input, mapper, concurrency);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should map input when mapper returns a promise with concurrency', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, 2, 3];
        const results = yield (0, src_1.map)(input, deferredMapper, concurrency);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should map input promises when mapper returns a promise with concurrency', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        const results = yield (0, src_1.map)(input, deferredMapper, concurrency);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should accept a promise for an array with concurrency', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [1, Promise.resolve(2), 3];
        const results = yield (0, src_1.map)(input, deferredMapper, concurrency);
        expect(results).toEqual([2, 4, 6]);
    }));
    test('should resolve to empty array when input promise does not resolve to an array with concurrency', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = Promise.resolve(123);
        const run = () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error
            const results = yield (0, src_1.map)(input, mapper, concurrency);
            return results;
        });
        yield expect(run).rejects.toThrow(TypeError);
    }));
    test('should reject when input contains rejection with concurrency', () => __awaiter(void 0, void 0, void 0, function* () {
        // eslint-disable-next-line prefer-promise-reject-errors
        const input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
        const run = () => __awaiter(void 0, void 0, void 0, function* () {
            const results = yield (0, src_1.map)(input, mapper, concurrency);
            return results;
        });
        yield expect(run).rejects.toEqual(2);
    }));
    test('should not have more than {concurrency} promises in flight', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const immediates = [];
        function immediate(index) {
            let topResolve;
            const ret = new Promise((localResolve) => {
                topResolve = localResolve;
            });
            immediates.push([ret, topResolve, index]);
            return ret;
        }
        const lates = [];
        function late(index) {
            let topResolve;
            const ret = new Promise((localResolve) => {
                topResolve = localResolve;
            });
            lates.push([ret, topResolve, index]);
            return ret;
        }
        function promiseByIndex(index) {
            return index < 5 ? immediate(index) : late(index);
        }
        function resolve(item) {
            item[1](item[2]);
        }
        const tempResults = [];
        const ret1 = (0, src_1.map)(input, (value, index) => promiseByIndex(index).then(() => {
            // @ts-ignore
            tempResults.push(value);
        }), { concurrency: 5 });
        const ret2 = (0, src_1.delay)(100)
            .then(() => {
            expect(tempResults.length).toEqual(0);
            immediates.forEach(resolve);
            return immediates.map((item) => item[0]);
        })
            .then(() => (0, src_1.delay)(100))
            .then(() => {
            expect(tempResults).toEqual([0, 1, 2, 3, 4]);
            lates.forEach(resolve);
        })
            .then(() => (0, src_1.delay)(100))
            .then(() => {
            expect(tempResults).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            lates.forEach(resolve);
        })
            .then(() => ret1)
            .then(() => {
            expect(tempResults).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
        return Promise.all([ret1, ret2]);
    }));
});
