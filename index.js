"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
// Path to the input markdown file
const inputFilePath = '../ptc.md';
// Path to the output shell script file
const outputFilePath = `'./output_${inputFilePath}.sh`;
// Create a write stream for the output file
const outputStream = fs_1.default.createWriteStream(outputFilePath, { flags: 'w' });
const processFile = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const fileStream = fs_1.default.createReadStream(inputFilePath);
    const rl = readline_1.default.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let lineNumber = 0; // Keep track of the current line number
    try {
        for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), _a = rl_1_1.done, !_a; _d = true) {
            _c = rl_1_1.value;
            _d = false;
            const line = _c;
            lineNumber++; // Increment the line number with each iteration
            // Skip the first two lines
            if (lineNumber === 1 || lineNumber === 2)
                continue;
            if (line.startsWith('**')) {
                // Treat line as a comment and write to the output file
                // outputStream.write(`# ${line.substring(2)}\n`);
                // Remove "**" from the beginning and end of the line and treat it as a comment
                const cleanedLine = line.replace(/^\*\*|\*\*$/g, '').trim();
                const cleanedLineAtTheEnd = cleanedLine.replace(/\*\*$/, '').trim();
                console.log(cleanedLineAtTheEnd);
                outputStream.write(`# ${cleanedLineAtTheEnd}\n`);
                continue; // Skip further processing for comment lines
            }
            else {
                // Split the line by "|", filter out empty strings if any
                const parts = line.split('|').filter(Boolean);
                if (parts.length > 1) {
                    const firstValue = parts[0].trim();
                    const theLastOneValue = parts[parts.length - 1].trim();
                    // Example of how to use the extracted values
                    outputStream.write(`${firstValue}=${theLastOneValue}\n`);
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = rl_1.return)) yield _b.call(rl_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    outputStream.close();
});
processFile().catch(err => {
    console.error('An error occurred:', err);
    process.exit(1);
});
