"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.split = split;
const gpt_3_encoder_1 = require("gpt-3-encoder");
function split(transcript, chunkSize = 2000) {
    const encoded = (0, gpt_3_encoder_1.encode)(transcript);
    const tokens = encoded.length;
    if (tokens <= chunkSize)
        return [(0, gpt_3_encoder_1.decode)(encoded)];
    const chunkLength = Math.ceil(tokens / chunkSize);
    const chunks = [];
    for (let i = 0; i < chunkLength; i++) {
        const start = i * chunkSize;
        const end = i + 1 < chunkLength ? (i + 1) * chunkSize : undefined;
        chunks.push((0, gpt_3_encoder_1.decode)(encoded.slice(start, end)));
    }
    return chunks;
}
