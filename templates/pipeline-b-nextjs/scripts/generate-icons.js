const fs = require('fs')
const path = require('path')

const ACCENT = '#3B82F6'
const SIZES = [192, 512]

function createPNG(size, hex) {
  // Minimal valid PNG: 8-bit RGBA, solid color
  const width = size, height = size
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  const a = 255

  // IDAT: uncompressed raw pixel data (filter byte + RGB for each row)
  const rawRow = Buffer.alloc(1 + width * 4)
  rawRow[0] = 0 // no filter
  for (let x = 0; x < width; x++) {
    rawRow[1 + x*4] = r
    rawRow[2 + x*4] = g
    rawRow[3 + x*4] = b
    rawRow[4 + x*4] = a
  }
  const rawData = Buffer.concat(Array(height).fill(rawRow))

  // zlib compress (Node 18+ has built-in zlib)
  const zlib = require('zlib')
  const compressed = zlib.deflateSync(rawData)

  // Build PNG chunks
  function crc32(buf) {
    let crc = 0xFFFFFFFF
    const table = new Int32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
      table[i] = c
    }
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
    return (crc ^ 0xFFFFFFFF) >>> 0
  }
  function chunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const typeB = Buffer.from(type)
    const crcData = Buffer.concat([typeB, data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(crcData))
    return Buffer.concat([len, typeB, data, crc])
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // color type RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  // IEND
  const iend = Buffer.alloc(0)

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', iend),
  ])
}

const outDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(outDir, { recursive: true })
SIZES.forEach(size => {
  fs.writeFileSync(path.join(outDir, `icon-${size}x${size}.png`), createPNG(size, ACCENT))
})
console.log('Icons generated')
