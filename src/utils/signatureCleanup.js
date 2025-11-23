
export async function postProcessSignature(pngBlob, alphaThreshold = 180) {
  const img = await blobToImage(pngBlob);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) d[i + 3] = d[i + 3] < alphaThreshold ? 0 : 255;
  ctx.putImageData(imageData, 0, 0);

  const trimmed = trimTransparent(canvas, 5);
  const blob = await new Promise((resolve) => {
    trimmed.toBlob((b) => resolve(b || dataURLToBlob(trimmed.toDataURL('image/png'))), 'image/png');
  });
  return blob;
}

export async function cleanSignature(file, { model = 'small', alphaThreshold = 180 } = {}) {
  const { removeBackground } = await import('@imgly/background-removal');
  const cut = await removeBackground(file, { model, debug: false });
  const cleaned = await postProcessSignature(cut, alphaThreshold);
  const outFile = new File([cleaned], 'firma.png', { type: 'image/png' });
  const previewUrl = URL.createObjectURL(cleaned);
  return { file: outFile, previewUrl };
}

function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = url;
  });
}
function trimTransparent(srcCanvas, tol = 5) {
  const w = srcCanvas.width, h = srcCanvas.height;
  const ctx = srcCanvas.getContext('2d');
  const { data } = ctx.getImageData(0, 0, w, h);
  let top = 0, bottom = h - 1, left = 0, right = w - 1;
  const row = (y) => { for (let x = 0; x < w; x++) if (data[(y*w+x)*4+3] > tol) return true; return false; };
  const col = (x) => { for (let y = 0; y < h; y++) if (data[(y*w+x)*4+3] > tol) return true; return false; };
  while (top < h && !row(top)) top++; while (bottom >= 0 && !row(bottom)) bottom--;
  while (left < w && !col(left)) left++; while (right >= 0 && !col(right)) right--;
  const nw = Math.max(1, right - left + 1), nh = Math.max(1, bottom - top + 1);
  const out = document.createElement('canvas'); out.width = nw; out.height = nh;
  out.getContext('2d').drawImage(srcCanvas, left, top, nw, nh, 0, 0, nw, nh);
  return out;
}
function dataURLToBlob(dataURL) {
  const arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]); let n = bstr.length; const u8 = new Uint8Array(n);
  while (n--) u8[n] = bstr.charCodeAt(n);
  return new Blob([u8], { type: mime });
}
