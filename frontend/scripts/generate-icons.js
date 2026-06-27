import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgBuffer = readFileSync(join(__dirname, '../public/favicon.svg'));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

await Promise.all(
  sizes.map(async (size) => {
    const output = join(__dirname, `../public/icon-${size}.png`);
    await sharp(svgBuffer, { density: 300 })
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(output);
    console.log(`Generated ${output}`);
  })
);
