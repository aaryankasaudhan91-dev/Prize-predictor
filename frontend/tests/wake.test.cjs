const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = process.argv[2] || path.resolve(__dirname, "..");
const ts = require(path.join(root, 'node_modules/typescript'));
const source = ts.transpileModule(fs.readFileSync(path.join(root, 'lib/backend.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
function load(get) {
 let now = 0;
 const context = { exports: {}, require: () => ({ get }), process: { env: {} }, Date: { now: () => now }, Error, Promise, AbortController,
  setTimeout: (fn, delay) => { now += delay; queueMicrotask(fn); return 1; }, clearTimeout: () => {} };
 vm.runInNewContext(source, context);
 return context.exports.waitForLocations;
}
test('ready response stops polling', async () => {
 let count = 0; const wait = load(async () => { count++; return { data: { locations: ['Vashi'] } }; });
 assert.equal((await wait(new AbortController().signal))[0], 'Vashi'); assert.equal(count, 1);
});
test('cold-start failures and HTML responses retry until real readiness', async () => {
 let count = 0; const wait = load(async () => { count++; if (count === 1) throw Error('timeout'); return { data: count === 2 ? '<html>Starting</html>' : { locations: ['Vashi'] } }; });
 assert.equal((await wait(new AbortController().signal))[0], 'Vashi'); assert.equal(count, 3);
});
test('unavailable backend reaches bounded deadline', async () => {
 let count = 0; const wait = load(async () => { count++; throw Error('offline'); });
 await assert.rejects(wait(new AbortController().signal), /unavailable/); assert.ok(count <= 60);
});
test('cancelled page does not issue a request', async () => {
 let count = 0; const wait = load(async () => { count++; }); const controller = new AbortController(); controller.abort();
 await assert.rejects(wait(controller.signal)); assert.equal(count, 0);
});
