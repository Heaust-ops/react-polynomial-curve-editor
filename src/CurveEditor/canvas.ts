export const drawCaller = (
  Ctx: CanvasRenderingContext2D,
  Width: number,
  Height: number,
  func: (x: number) => number
) => {
  const MaxX = 0.5;
  const MinX = -0.5;
  const MaxY = (MaxX * Height) / Width;
  const MinY = (MinX * Height) / Width;
  const XC = (x: number) => {
    return ((x - MinX) / (MaxX - MinX)) * Width;
  };
  const YC = (y: number) => {
    return Height - ((y - MinY) / (MaxY - MinY)) * Height;
  };

  let XSTEP = (MaxX - MinX) / Width;

  const RenderFunction = (f: (x: number) => number) => {
    let first = true;

    Ctx.beginPath();
    for (let x = MinX; x <= MaxX * 2 + 5 / Width; x += XSTEP) {
      const y = (f(x) * Height) / Width;
      if (first) {
        Ctx.moveTo(XC(x), YC(y));
        first = false;
      } else {
        Ctx.lineTo(XC(x), YC(y));
      }
    }
    Ctx.stroke();
  };

  return () => {
    Ctx.clearRect(0, 0, Width, Height);
    RenderFunction(func);
  };
};
