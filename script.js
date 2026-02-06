const canvas = new fabric.Canvas('canvas', {
  width: 500,
  height: 500,
  backgroundColor: '#333'
});

// Upload Image
document.getElementById('upload').addEventListener('change', function(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    fabric.Image.fromURL(event.target.result, function(img) {
      img.scaleToWidth(500);
      canvas.clear();
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Add Text
function addText() {
  const text = new fabric.IText('Edit Me', {
    left: 100,
    top: 100,
    fill: 'white',
    fontSize: 30
  });
  canvas.add(text);
}

// Download Image
function downloadImage() {
  const link = document.createElement('a');
  link.download = 'edited.png';
  link.href = canvas.toDataURL();
  link.click();
}
function enableDraw() {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.width = 3;
  canvas.freeDrawingBrush.color = "red";
}

function disableDraw() {
  canvas.isDrawingMode = false;
}
function deleteObject() {
  const active = canvas.getActiveObject();
  if (active) {
    canvas.remove(active);
  }
}
let history = [];

canvas.on('object:added', function() {
  history.push(JSON.stringify(canvas));
});

function undo() {
  if (history.length > 1) {
    history.pop();
    canvas.loadFromJSON(history[history.length - 1], function() {
      canvas.renderAll();
    });
  }
}function resizeCanvas() {
  const width = prompt("Enter new width (example 400)");
  const height = prompt("Enter new height (example 400)");

  if (width && height) {
    canvas.setWidth(parseInt(width));
    canvas.setHeight(parseInt(height));
    canvas.renderAll();
  }
}
function addStickerImage() {
  const input = document.getElementById('stickerUpload');
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    fabric.Image.fromURL(e.target.result, function(img) {
      img.scaleToWidth(100);
      img.left = 100;
      img.top = 100;
      canvas.add(img);
    });
  };
  reader.readAsDataURL(file);
}
function blurImage() {
  const bg = canvas.backgroundImage;
  if (!bg) return;

  bg.filters = [ new fabric.Image.filters.Blur({ blur: 0.5 }) ];
  bg.applyFilters();
  canvas.renderAll();
}
function enhanceImage() {
  const bg = canvas.backgroundImage;
  if (!bg) return;

  bg.filters = [
    new fabric.Image.filters.Brightness({ brightness: 0.1 }),
    new fabric.Image.filters.Contrast({ contrast: 0.15 }),
    new fabric.Image.filters.Saturation({ saturation: 0.2 })
  ];

  bg.applyFilters();
  canvas.renderAll();
}
function bringForward() {
  const obj = canvas.getActiveObject();
  if (obj) canvas.bringForward(obj);
}

function sendBackward() {
  const obj = canvas.getActiveObject();
  if (obj) canvas.sendBackwards(obj);
}
function eraserMode() {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = "rgba(0,0,0,1)";
  canvas.freeDrawingBrush.width = 20;
  canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
}

function normalDraw() {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = "red";
  canvas.freeDrawingBrush.width = 3;
  canvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
}
let cropRect;

function cropMode() {
  cropRect = new fabric.Rect({
    left: 50,
    top: 50,
    width: 200,
    height: 200,
    fill: 'rgba(0,0,0,0.3)',
    selectable: true
  });
  canvas.add(cropRect);
}

function applyCrop() {
  if (!cropRect) return;

  canvas.setWidth(cropRect.width);
  canvas.setHeight(cropRect.height);

  canvas.getObjects().forEach(obj => {
    obj.left -= cropRect.left;
    obj.top -= cropRect.top;
  });

  canvas.remove(cropRect);
  canvas.renderAll();
}
function applyPreset(type) {
  const bg = canvas.backgroundImage;
  if (!bg) return;

  if (type === "vintage") {
    bg.filters = [
      new fabric.Image.filters.Sepia(),
      new fabric.Image.filters.Brightness({ brightness: 0.05 })
    ];
  }

  if (type === "bw") {
    bg.filters = [ new fabric.Image.filters.Grayscale() ];
  }

  if (type === "bright") {
    bg.filters = [
      new fabric.Image.filters.Brightness({ brightness: 0.15 }),
      new fabric.Image.filters.Contrast({ contrast: 0.2 })
    ];
  }

  bg.applyFilters();
  canvas.renderAll();
}

