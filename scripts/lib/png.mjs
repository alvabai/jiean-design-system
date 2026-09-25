/**
 * A minimal PNG reader, just enough to read pixel values out of a screenshot.
 *
 * The visual comparison has to check a few things that no computed style can
 * prove — whether a 1px rule is actually painted, and at which row or column —
 * so it reads the pixels. A full image library would be a heavy dependency for
 * that, and this covers the shapes Chrome writes: 8-bit truecolour, with or
 * without alpha.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';

const CHANNELS = { 0: 1, 2: 3, 4: 2, 6: 4 };

function paeth(a, b, c) {
  const pa = Math.abs(b - c);
  const pb = Math.abs(a - c);
  const pc = Math.abs(a + b - 2 * c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/**
 * @param {string} file absolute path to a PNG
 * @returns {{width:number, height:number, pixel:(x:number,y:number)=>string}}
 *   `pixel` returns a lowercase `#rrggbb` string.
 */
export function readPng(file) {
  return decodePng(readFileSync(file), file);
}

/**
 * The same reader over bytes already in memory.
 * @param {Buffer} data
 * @param {string} [label] used in error messages only
 */
export function decodePng(data, label = '<buffer>') {
  return decode(data, label);
}

function decode(data, file) {
  if (data.subarray(0, 8).toString('latin1') !== '\x89PNG\r\n\x1a\n') {
    throw new Error(`${file} is not a PNG`);
  }

  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (pos + 12 <= data.length) {
    const length = data.readUInt32BE(pos);
    const type = data.subarray(pos + 4, pos + 8).toString('latin1');
    const body = data.subarray(pos + 8, pos + 8 + length);
    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      bitDepth = body.readUInt8(8);
      colorType = body.readUInt8(9);
      if (bitDepth !== 8) throw new Error(`${file}: only 8-bit PNGs are supported`);
      if (!(colorType in CHANNELS)) throw new Error(`${file}: unsupported colour type ${colorType}`);
    } else if (type === 'IDAT') {
      idat.push(body);
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + length;
  }

  const channels = CHANNELS[colorType];
  const stride = width * channels;
  const raw = inflateSync(Buffer.concat(idat));
  const rows = [];
  let prev = Buffer.alloc(stride);
  let p = 0;

  for (let y = 0; y < height; y++) {
    const filter = raw[p++];
    const line = Buffer.from(raw.subarray(p, p + stride));
    p += stride;
    if (filter === 1) {
      for (let i = channels; i < stride; i++) line[i] = (line[i] + line[i - channels]) & 255;
    } else if (filter === 2) {
      for (let i = 0; i < stride; i++) line[i] = (line[i] + prev[i]) & 255;
    } else if (filter === 3) {
      for (let i = 0; i < stride; i++) {
        const a = i >= channels ? line[i - channels] : 0;
        line[i] = (line[i] + ((a + prev[i]) >> 1)) & 255;
      }
    } else if (filter === 4) {
      for (let i = 0; i < stride; i++) {
        const a = i >= channels ? line[i - channels] : 0;
        line[i] = (line[i] + paeth(a, prev[i], i >= channels ? prev[i - channels] : 0)) & 255;
      }
    } else if (filter !== 0) {
      throw new Error(`${file}: unknown PNG filter ${filter} on row ${y}`);
    }
    rows.push(line);
    prev = line;
  }

  return {
    width,
    height,
    rows,
    channels,
    pixel(x, y) {
      if (x < 0 || y < 0 || x >= width || y >= height) {
        throw new Error(`pixel ${x},${y} is outside ${width}x${height}`);
      }
      const row = rows[y];
      const o = x * channels;
      const hex = (n) => n.toString(16).padStart(2, '0');
      return `#${hex(row[o])}${hex(row[o + 1])}${hex(row[o + 2])}`;
    },
  };
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, body) {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(body.length, 0);
  const typed = Buffer.concat([Buffer.from(type, 'latin1'), body]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed), 0);
  return Buffer.concat([head, typed, crc]);
}

/**
 * Writes 8-bit truecolour PNG bytes.
 *
 * Chrome's `--screenshot` writes an image as tall as the *window*, which on
 * macOS is the requested window height and therefore includes the window frame
 * that the page never sees: a 1270x848 viewport arrives as a 1270x935 picture
 * whose top 848 rows are the viewport. Cropping through this writer keeps the
 * stored screenshot the size the page actually rendered at, so it can be
 * compared with a reference screenshot pixel for pixel.
 *
 * @param {{width:number, height:number, rows:Buffer[]}} image 8-bit RGB rows
 * @returns {Buffer}
 */
export function encodePng({ width, height, rows }) {
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const source = rows[y];
    if (!source || source.length < stride) {
      throw new Error(`encodePng: row ${y} is shorter than the declared width`);
    }
    raw[y * (stride + 1)] = 0; // filter type 0: none
    source.copy(raw, y * (stride + 1) + 1, 0, stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from('\x89PNG\r\n\x1a\n', 'latin1'),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Crops to the top `height` rows and writes the result.
 * @returns {{width:number, height:number, rows:number}}
 */
export function cropPngToHeight(source, height, target) {
  const image = typeof source === 'string' ? readPng(source) : source;
  if (height > image.height) throw new Error(`cannot grow an image from ${image.height} to ${height}`);
  if (image.channels !== 3) {
    throw new Error(`cropPngToHeight expects truecolour input, got ${image.channels} channels`);
  }
  const rows = image.rows.slice(0, height);
  writeFileSync(target, encodePng({ width: image.width, height, rows }));
  return { width: image.width, height, rows: rows.length };
}
