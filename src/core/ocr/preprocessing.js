/**
 * Preprocesses an image by applying a series of image processing functions.
 * This includes blurring, dilation, color inversion, and thresholding.
 * @param {HTMLCanvasElement} canvas The canvas element containing the image to preprocess.
 * @returns {ImageData} The processed image data.
 */
function preprocessImage(canvas) {
  const ctx = canvas.getContext("2d");
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Apply a Gaussian blur to the image data.
  blurARGB(image.data, canvas, 1);
  // Apply dilation to make features more prominent.
  dilate(image.data, canvas);
  // Invert the colors of the image.
  invertColors(image.data);
  // Apply a threshold filter to convert the image into black and white based on a cutoff value.
  thresholdFilter(image.data, 0.4);
  return image;
}
export async function preprocessImageFromURL(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Needed for external images
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Scale image
      canvas.width = 1191;
      canvas.height = 1500;

      // Draw and scale the image
      ctx.drawImage(img, 0, 0, 1191, 1500);

      // Convert to grayscale
      const imageData = ctx.getImageData(0, 0, 1191, 1500);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg =
          (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) /
          3;
        imageData.data[i] = avg; // Red
        imageData.data[i + 1] = avg; // Green
        imageData.data[i + 2] = avg; // Blue
      }
      ctx.putImageData(imageData, 0, 0);

      thresholdFilter(imageData, 0.5);

      // Apply an approximation of unsharp mask
      // Note: This step is quite complex to implement accurately in pure JavaScript without libraries.
      // The following line is a placeholder for where you would apply such a filter.
      // Consider using a library like glfx.js for more advanced image processing effects.
      // Convert canvas to Blob, then to ObjectURL
      canvas.toBlob((blob) => {
        if (blob) {
          const processedImageURL = URL.createObjectURL(blob);
          resolve(processedImageURL);
        } else {
          reject("Blob conversion failed");
        }
      }, "image/jpeg");
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}

// from https://github.com/processing/p5.js/blob/main/src/image/filters.js
// This function applies a threshold filter to an array of pixel data.
// It converts each pixel to grayscale based on a specified level,
// then sets the pixel to either black or white depending on whether its grayscale value is above or below a threshold.
// The level parameter determines the sensitivity of the threshold, with a default value of 0.5.
function thresholdFilter(pixels, level) {
  if (level === undefined) {
    level = 0.5;
  }
  const thresh = Math.floor(level * 255);
  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    let value;
    if (gray >= thresh) {
      value = 255;
    } else {
      value = 0;
    }
    pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
  }
}

export default preprocessImage;

// The getARGB function extracts and constructs the ARGB (Alpha, Red, Green, Blue) color value
// from a specific index within a pixel data array.
// This is achieved through bitwise shifting and masking operations that properly align the alpha, red, green,
//and blue components into a single 32-bit integer, which represents the color and transparency of a pixel.
function getARGB(data, i) {
  const offset = i * 4;
  return (
    ((data[offset + 3] << 24) & 0xff000000) |
    ((data[offset] << 16) & 0x00ff0000) |
    ((data[offset + 1] << 8) & 0x0000ff00) |
    (data[offset + 2] & 0x000000ff)
  );
}

// The setPixels function is responsible for taking an array of ARGB values (data) and
// an array meant to store RGBA pixel data (pixels).
// It decomposes each ARGB value into separate R, G, B, and A components and assigns these components
// into the pixels array in RGBA format. This conversion is essential for preparing the pixel data
// in a format that is suitable for many image processing or display operations which require data in RGBA order.
function setPixels(pixels, data) {
  let offset = 0;
  for (let i = 0, al = pixels.length; i < al; i++) {
    offset = i * 4;
    pixels[offset + 0] = (data[i] & 0x00ff0000) >>> 16;
    pixels[offset + 1] = (data[i] & 0x0000ff00) >>> 8;
    pixels[offset + 2] = data[i] & 0x000000ff;
    pixels[offset + 3] = (data[i] & 0xff000000) >>> 24;
  }
}

// internal kernel stuff for the gaussian blur filter
let blurRadius;
let blurKernelSize;
let blurKernel;
let blurMult;

// from https://github.com/processing/p5.js/blob/main/src/image/filters.js
// This function, buildBlurKernel, is designed to initialize and calculate the values
// for a blur kernel and its corresponding multiplier arrays, which are essential for applying a blur effect to an image.
// The kernel effectively determines the strength of the blur at different distances from the central pixel,
// based on the specified blur radius (r)
function buildBlurKernel(r) {
  let radius = (r * 3.5) | 0;
  radius = radius < 1 ? 1 : radius < 248 ? radius : 248;

  if (blurRadius !== radius) {
    blurRadius = radius;
    blurKernelSize = (1 + blurRadius) << 1;
    blurKernel = new Int32Array(blurKernelSize);
    blurMult = new Array(blurKernelSize);
    for (let l = 0; l < blurKernelSize; l++) {
      blurMult[l] = new Int32Array(256);
    }

    let bk, bki;
    let bm, bmi;

    for (let i = 1, radiusi = radius - 1; i < radius; i++) {
      blurKernel[radius + i] = blurKernel[radiusi] = bki = radiusi * radiusi;
      bm = blurMult[radius + i];
      bmi = blurMult[radiusi--];
      for (let j = 0; j < 256; j++) {
        bm[j] = bmi[j] = bki * j;
      }
    }
    bk = blurKernel[radius] = radius * radius;
    bm = blurMult[radius];

    for (let k = 0; k < 256; k++) {
      bm[k] = bk * k;
    }
  }
}

function invertColors(pixels) {
  for (var i = 0; i < pixels.length; i += 4) {
    pixels[i] = pixels[i] ^ 255; // Invert Red
    pixels[i + 1] = pixels[i + 1] ^ 255; // Invert Green
    pixels[i + 2] = pixels[i + 2] ^ 255; // Invert Blue
  }
}

// from https://github.com/processing/p5.js/blob/main/src/image/filters.js
// This blurARGB function applies a blur effect to an image represented by pixel data,
// utilizing a specific blur radius. It works on ARGB (Alpha, Red, Green, Blue) formatted images.
// The algorithm involves two main phases: horizontal and vertical blurring,
// which together ensure a uniform blur effect across the image.
// It does so by averaging the color values of pixels within the radius of each target pixel,
// thereby creating the blur effect. This function also demonstrates the importance of handling image edges
// and corners to avoid accessing out-of-bounds pixels, ensuring the blurring effect is applied
// uniformly across the entire image. Additionally, it highlights the efficiency of pre-calculating and
// reusing values such as the blur kernel and multiplier arrays to minimize computational overhead during the blurring process.
function blurARGB(pixels, canvas, radius) {
  const width = canvas.width;
  const height = canvas.height;
  const numPackedPixels = width * height;
  const argb = new Int32Array(numPackedPixels);
  for (let j = 0; j < numPackedPixels; j++) {
    argb[j] = getARGB(pixels, j);
  }
  let sum, cr, cg, cb, ca;
  let read, ri, ym, ymi, bk0;
  const a2 = new Int32Array(numPackedPixels);
  const r2 = new Int32Array(numPackedPixels);
  const g2 = new Int32Array(numPackedPixels);
  const b2 = new Int32Array(numPackedPixels);
  let yi = 0;
  buildBlurKernel(radius);
  let x, y, i;
  let bm;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      cb = cg = cr = ca = sum = 0;
      read = x - blurRadius;
      if (read < 0) {
        bk0 = -read;
        read = 0;
      } else {
        if (read >= width) {
          break;
        }
        bk0 = 0;
      }
      for (i = bk0; i < blurKernelSize; i++) {
        if (read >= width) {
          break;
        }
        const c = argb[read + yi];
        bm = blurMult[i];
        ca += bm[(c & -16777216) >>> 24];
        cr += bm[(c & 16711680) >> 16];
        cg += bm[(c & 65280) >> 8];
        cb += bm[c & 255];
        sum += blurKernel[i];
        read++;
      }
      ri = yi + x;
      a2[ri] = ca / sum;
      r2[ri] = cr / sum;
      g2[ri] = cg / sum;
      b2[ri] = cb / sum;
    }
    yi += width;
  }
  yi = 0;
  ym = -blurRadius;
  ymi = ym * width;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      cb = cg = cr = ca = sum = 0;
      if (ym < 0) {
        bk0 = ri = -ym;
        read = x;
      } else {
        if (ym >= height) {
          break;
        }
        bk0 = 0;
        ri = ym;
        read = x + ymi;
      }
      for (i = bk0; i < blurKernelSize; i++) {
        if (ri >= height) {
          break;
        }
        bm = blurMult[i];
        ca += bm[a2[read]];
        cr += bm[r2[read]];
        cg += bm[g2[read]];
        cb += bm[b2[read]];
        sum += blurKernel[i];
        ri++;
        read += width;
      }
      argb[x + yi] =
        ((ca / sum) << 24) |
        ((cr / sum) << 16) |
        ((cg / sum) << 8) |
        (cb / sum);
    }
    yi += width;
    ymi += width;
    ym++;
  }
  setPixels(pixels, argb);
}

// The dilate function performs a dilation effect on an image represented by pixel data.
// This operation enhances the brightness of pixels based on the luminance of their neighbors,
// effectively spreading bright areas and thinning dark areas. The function takes an array of pixel data (pixels)
// and a canvas object to understand the dimensions of the image.
// from https://github.com/processing/p5.js/blob/main/src/image/filters.js
function dilate(pixels, canvas) {
  let currIdx = 0;
  const maxIdx = pixels.length ? pixels.length / 4 : 0;
  const out = new Int32Array(maxIdx);
  let currRowIdx, maxRowIdx, colOrig, colOut, currLum;

  let idxRight, idxLeft, idxUp, idxDown;
  let colRight, colLeft, colUp, colDown;
  let lumRight, lumLeft, lumUp, lumDown;

  while (currIdx < maxIdx) {
    currRowIdx = currIdx;
    maxRowIdx = currIdx + canvas.width;
    while (currIdx < maxRowIdx) {
      colOrig = colOut = getARGB(pixels, currIdx);
      idxLeft = currIdx - 1;
      idxRight = currIdx + 1;
      idxUp = currIdx - canvas.width;
      idxDown = currIdx + canvas.width;

      if (idxLeft < currRowIdx) {
        idxLeft = currIdx;
      }
      if (idxRight >= maxRowIdx) {
        idxRight = currIdx;
      }
      if (idxUp < 0) {
        idxUp = 0;
      }
      if (idxDown >= maxIdx) {
        idxDown = currIdx;
      }
      colUp = getARGB(pixels, idxUp);
      colLeft = getARGB(pixels, idxLeft);
      colDown = getARGB(pixels, idxDown);
      colRight = getARGB(pixels, idxRight);

      //compute luminance
      currLum =
        77 * ((colOrig >> 16) & 0xff) +
        151 * ((colOrig >> 8) & 0xff) +
        28 * (colOrig & 0xff);
      lumLeft =
        77 * ((colLeft >> 16) & 0xff) +
        151 * ((colLeft >> 8) & 0xff) +
        28 * (colLeft & 0xff);
      lumRight =
        77 * ((colRight >> 16) & 0xff) +
        151 * ((colRight >> 8) & 0xff) +
        28 * (colRight & 0xff);
      lumUp =
        77 * ((colUp >> 16) & 0xff) +
        151 * ((colUp >> 8) & 0xff) +
        28 * (colUp & 0xff);
      lumDown =
        77 * ((colDown >> 16) & 0xff) +
        151 * ((colDown >> 8) & 0xff) +
        28 * (colDown & 0xff);

      if (lumLeft > currLum) {
        colOut = colLeft;
        currLum = lumLeft;
      }
      if (lumRight > currLum) {
        colOut = colRight;
        currLum = lumRight;
      }
      if (lumUp > currLum) {
        colOut = colUp;
        currLum = lumUp;
      }
      if (lumDown > currLum) {
        colOut = colDown;
        currLum = lumDown;
      }
      out[currIdx++] = colOut;
    }
  }
  setPixels(pixels, out);
}
