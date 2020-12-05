var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var tempCanvas = document.createElement("canvas");
tempCanvas.width = 800;
tempCanvas.height = 800;
var tempCtx = tempCanvas.getContext("2d");

var canvas1, ctx1;

var points = [createPoint(50, 50), createPoint(500, 50), createPoint(500, 500)];

// ctx.beginPath();
// ctx.moveTo(50, 50);
// ctx.lineTo(500, 50);
// ctx.lineTo(500, 500);
// ctx.lineTo(50, 500);
// ctx.closePath();
// ctx.fillStyle = "red";
// ctx.fill();

var options = {
  color: "#03a4fe",
  lineWidth: 26,
  borderWidth: 8,
  shadowBlur: 20,
  innerWidth: 10,
  innerColor: "#bbb",
  reflectOffset: 15,
};

paint(ctx, points, options);

function paint(ctx, points, options) {
  paintHollow(tempCtx, points, options);
  ctx.drawImage(tempCanvas, 0, 0);
  paintInner(ctx, points, options);
}

function createPoint(x, y) {
  return { x, y };
}

function paintHollow(
  ctx,
  points,
  { color, lineWidth, borderWidth, shadowBlur, reflectOffset },
  isReflect = false
) {
  if (!isReflect) {
    ctx.globalAlpha = 0.5;
    paintHollow(
      ctx,
      points.map(({ x, y }) => {
        return { x, y: y + reflectOffset };
      }),
      { color, lineWidth, borderWidth, shadowBlur: 0 },
      true
    );
    ctx.globalAlpha = 1;
  }

  paintLine(ctx, points);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = color;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = shadowBlur;
  ctx.stroke();
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth -= borderWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}

/**
 * 绘制轨道中间部分
 * @param {*} ctx 
 * @param {*} points 
 * @param {*} param2 
 */
function paintInner(
  ctx,
  points,
  { color, innerWidth, borderWidth, innerColor, shadowBlur }
) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  paintLine(ctx, points);
  ctx.lineWidth = innerWidth;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = shadowBlur;
  ctx.strokeStyle = innerColor;
  ctx.shadowColor = color;
  //  先根据中间部分的颜色绘制一条线出来
  ctx.stroke();

  ctx.lineCap = "butt";
  ctx.setLineDash([5, 15]);
  ctx.lineDashOffset = 0;
  const { r, g: green, b } = getRgba(color);
  //  再根据轨道的主色调绘制一条透明度较低的虚线
  ctx.strokeStyle = `rgba(${r},${green},${b},0.4)`;
  ctx.stroke();
}

/**
 * 获取一个颜色值的r,g,b,a
 * @param {*} color 
 */
function getRgba(color) {
  if (!canvas1 || !ctx1) {
    canvas1 = document.createElement("canvas");
    canvas1.width = 1;
    canvas1.height = 1;
    ctx1 = canvas1.getContext("2d");
  }
  canvas1.width = 1;
  ctx1.fillStyle = color;
  ctx1.fillRect(0, 0, 1, 1);
  const colorData = ctx1.getImageData(0, 0, 1, 1).data;
  return {
    r: colorData[0],
    g: colorData[1],
    b: colorData[2],
    a: colorData[3],
  };
}

function paintLine(ctx, points) {
  var pointIndex = 0,
    p0,
    value,
    pointCount = points.length;
  p0 = points[0];
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  for (pointIndex = 1; pointIndex < pointCount; pointIndex++) {
    value = points[pointIndex];
    ctx.lineTo(value.x, value.y);
  }
}
