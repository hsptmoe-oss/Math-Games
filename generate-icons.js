const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createSimplePNG(width, height) {
    // Generates a valid uncompressed PNG with Indigo background
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    function createChunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length, 0);

        const typeBuf = Buffer.from(type, 'ascii');
        const toCrc = Buffer.concat([typeBuf, data]);

        // CRC32 calculation
        let crc = 0 ^ (-1);
        for (let i = 0; i < toCrc.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ toCrc[i]) & 0xFF];
        }
        crc = (crc ^ (-1)) >>> 0;

        const crcBuf = Buffer.alloc(4);
        crcBuf.writeUInt32BE(crc, 0);

        return Buffer.concat([len, typeBuf, data, crcBuf]);
    }

    const crcTable = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            if (c & 1) c = 0xEDB88320 ^ (c >>> 1);
            else c = c >>> 1;
        }
        crcTable[n] = c;
    }

    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // color type RGB
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    const ihdrChunk = createChunk('IHDR', ihdr);

    // IDAT
    const rawData = [];
    for (let y = 0; y < height; y++) {
        rawData.push(0); // filter byte none
        for (let x = 0; x < width; x++) {
            // Indigo gradient color
            const r = Math.floor(99 + (140 * (x / width)));
            const g = Math.floor(102 - (50 * (y / height)));
            const b = 241;
            rawData.push(r, g, b);
        }
    }
    const deflated = zlib.deflateSync(Buffer.from(rawData));
    const idatChunk = createChunk('IDAT', deflated);

    // IEND
    const iendChunk = createChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createSimplePNG(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createSimplePNG(512, 512));

console.log('Generated icon-192.png and icon-512.png successfully!');
