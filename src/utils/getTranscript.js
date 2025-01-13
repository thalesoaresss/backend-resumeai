"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranscript = getTranscript;
const youtube_transcript_1 = require("youtube-transcript");
async function getTranscript(videoId) {
    var _a;
    const transcript = await youtube_transcript_1.YoutubeTranscript.fetchTranscript(videoId);
    return (_a = transcript.map((item) => item.text)) === null || _a === void 0 ? void 0 : _a.join(" ");
}
