const HTMLDecoderEncoder = require("html-encoder-decoder");
const d = '<p>hello wiorkd</p>';
const a = HTMLDecoderEncoder.encode(d);
console.log(a);
const c = HTMLDecoderEncoder.decode(a);
console.log(c);