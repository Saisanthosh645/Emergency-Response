import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createSolidPng(width, height, r, g, b, a = 255) {
  // A simple uncompressed/deflated raw PNG writer
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    // CRC calculation
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      let byte = buf[i];
      crc = crc ^ byte;
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    buf.writeInt32BE((crc ^ 0xffffffff) | 0, 8 + len);
    return buf;
  }

  // Raw image scanlines
  const rowLen = 1 + width * 4;
  const raw = Buffer.alloc(height * rowLen);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    raw[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Add a nice dark navy background with red accent square in center
      const inCenter = Math.abs(x - width/2) < width*0.35 && Math.abs(y - height/2) < height*0.35;
      const inCross = (Math.abs(x - width/2) < width*0.08 && Math.abs(y - height/2) < height*0.25) ||
                      (Math.abs(y - height/2) < height*0.08 && Math.abs(x - width/2) < width*0.25);
      if (inCross) {
        raw[pxOffset] = 255;
        raw[pxOffset + 1] = 255;
        raw[pxOffset + 2] = 255;
        raw[pxOffset + 3] = 255;
      } else if (inCenter) {
        raw[pxOffset] = 239; // Red-500
        raw[pxOffset + 1] = 68;
        raw[pxOffset + 2] = 68;
        raw[pxOffset + 3] = 255;
      } else {
        raw[pxOffset] = 11; // Deep Navy #0b0f19
        raw[pxOffset + 1] = 15;
        raw[pxOffset + 2] = 25;
        raw[pxOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pubDir = path.resolve('public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'icon-192.png'), createSolidPng(192, 192, 11, 15, 25));
fs.writeFileSync(path.join(pubDir, 'icon-512.png'), createSolidPng(512, 512, 11, 15, 25));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createSolidPng(180, 180, 11, 15, 25));
fs.writeFileSync(path.join(pubDir, 'favicon.ico'), createSolidPng(32, 32, 239, 68, 68));
console.log('Generated icons successfully');
