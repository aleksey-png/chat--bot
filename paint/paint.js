
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tools = document.querySelectorAll('.tool');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const sizeValue = document.getElementById('sizeValue');
const clearBtn = document.getElementById('clear');
const coords = document.getElementById('coords');

let isDrawing = false;
let currentTool = 'pencil';
let lastX = 0;
let lastY = 0;

function initCanvas() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getCoords(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.type.includes('touch')) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  } else {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
}

tools.forEach(tool => {
  tool.addEventListener('click', () => {
    tools.forEach(t => t.classList.remove('active'));
    tool.classList.add('active');
    currentTool = tool.id;
  });
});

brushSize.addEventListener('input', () => {
  sizeValue.textContent = `${brushSize.value}px`;
});

canvas.addEventListener('mousedown', (e) => {
  if (currentTool === 'fill') return;
  isDrawing = true;
  const { x, y } = getCoords(e);
  lastX = x;
  lastY = y;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) {
    const { x, y } = getCoords(e);
    coords.textContent = `${Math.round(x)}, ${Math.round(y)}`;
    return;
  }

  const { x, y } = getCoords(e);

  ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : colorPicker.value;
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
  isDrawing = false;
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (currentTool === 'fill') {
    handleFillTouch(e);
    return;
  }
  isDrawing = true;
  const { x, y } = getCoords(e);
  lastX = x;
  lastY = y;
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isDrawing) return;

  const { x, y } = getCoords(e);

  ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : colorPicker.value;
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
});

canvas.addEventListener('touchend', () => {
  isDrawing = false;
});

function handleFillTouch(e) {
  const { x, y } = getCoords(e);
  const imageData = ctx.getImageData(x, y, 1, 1);
  const targetColor = imageData.data;
  const replacementColor = hexToRgb(colorPicker.value);

  if (replacementColor) {
    floodFill(x, y, targetColor, replacementColor);
  }
}

function floodFill(startX, startY, targetColor, replacementColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  function getPixelColor(x, y) {
    const index = (y * canvas.width + x) * 4;
    return [
      data[index],
      data[index + 1],
      data[index + 2],
      data[index + 3]
    ];
  }

  function setPixelColor(x, y, color) {
    const index = (y * canvas.width + x) * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = color[3];
  }

  const startColor = getPixelColor(startX, startY);
  if (!colorsMatch(startColor, targetColor)) return;

  const queue = [[startX, startY]];

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

    const pixelColor = getPixelColor(x, y);
    if (!colorsMatch(pixelColor, targetColor)) continue;

    setPixelColor(x, y, replacementColor);

    queue.push([x + 1, y]);
    queue.push([x - 1, y]);
    queue.push([x, y + 1]);
    queue.push([x, y - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

function colorsMatch(color1, color2, tolerance = 32) {
  const rDiff = Math.abs(color1[0] - color2[0]);
  const gDiff = Math.abs(color1[1] - color2[1]);
  const bDiff = Math.abs(color1[2] - color2[2]);
  return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        255
      ]
    : null;
}

canvas.addEventListener('click', (e) => {
  if (currentTool !== 'fill') return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);

  const imageData = ctx.getImageData(x, y, 1, 1);
  const targetColor = imageData.data;

  const replacementColor = hexToRgb(colorPicker.value);

  if (replacementColor) {
    floodFill(x, y, targetColor, replacementColor);
  }
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initCanvas();
});

window.addEventListener('load', initCanvas);