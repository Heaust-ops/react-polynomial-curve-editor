import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import { drawCaller } from "./canvas";
import { getPolyFunction, polyEq } from "./linearAlgebra";

interface PolyCurveEditorProps {
  wrapperStyle?: CSSProperties;
  canvasStyle?: CSSProperties;
  socketStyle?: CSSProperties;
  socketSize?: number;
  stroke?: { color?: string; size?: number };
  setPolynomial?: (polynomial: (x: number) => number) => void;
  polynomialScale?: number;
}

let prevTouch: Touch;
const clamp = (x: number, limits: [number, number]) =>
  Math.max(limits[0], Math.min(x, limits[1]));

const PolyCurveEditor: FC<PolyCurveEditorProps> = ({
  wrapperStyle = {},
  canvasStyle = {},
  socketStyle = {},
  stroke = {},
  socketSize = 8,
  setPolynomial = () => {},
  polynomialScale = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setpoints] = useState([] as number[][]);
  const [activePoint, setactivePoint] = useState(null as null | number);

  /**
   * Correct curve on canvas resize
   */
  useEffect(() => {
    if (!canvasRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setpoints([...points]);
    });
    resizeObserver.observe(canvasRef.current);

    return () => resizeObserver.disconnect();
  }, [points]);

  /**
   * Attach global listeners for certain events
   */
  useEffect(() => {
    const removeActivePoints = () => {
      setactivePoint(null);
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (activePoint !== null && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();

        const pointsCopy = [...points];
        if (!pointsCopy[activePoint]) return;

        const fx = clamp(
          pointsCopy[activePoint][0] + ev.movementX / rect.width,
          [0, 1]
        );
        const fy = clamp(
          pointsCopy[activePoint][1] - ev.movementY / rect.height,
          [0, 1]
        );
        pointsCopy[activePoint][0] = fx;
        pointsCopy[activePoint][1] = fy;
        setpoints(pointsCopy);
      }
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (!prevTouch) prevTouch = touch;
      const movement = {
        x: touch.pageX - prevTouch.pageX,
        y: touch.pageY - prevTouch.pageY,
      };
      console.log(Object.values(movement));
      if (activePoint !== null && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();

        const pointsCopy = [...points];
        if (!pointsCopy[activePoint]) return;

        const fx = clamp(
          pointsCopy[activePoint][0] + movement.x / rect.width,
          [0, 1]
        );
        const fy = clamp(
          pointsCopy[activePoint][1] - movement.y / rect.height,
          [0, 1]
        );
        pointsCopy[activePoint][0] = fx;
        pointsCopy[activePoint][1] = fy;
        setpoints(pointsCopy);
      }
      prevTouch = touch;
    };

    document.addEventListener("mouseup", removeActivePoints);
    document.addEventListener("touchend", removeActivePoints);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("mouseup", removeActivePoints);
      document.removeEventListener("touchend", removeActivePoints);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [activePoint, points]);

  /**
   * Redraw everytime there's a change
   */
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (!points.length) {
      setpoints([
        [0, 0],
        [1, 1],
      ]);
    }
    const rect = canvasRef.current!.getBoundingClientRect();
    canvasRef.current!.width =
      Math.round(devicePixelRatio * rect.right) -
      Math.round(devicePixelRatio * rect.left);

    canvasRef.current!.height =
      Math.round(devicePixelRatio * rect.bottom) -
      Math.round(devicePixelRatio * rect.top);
    ctx.lineWidth = stroke?.size ?? 6;
    ctx.strokeStyle = stroke?.color ?? "#000";
    const w = canvasRef.current!.width;
    const h = canvasRef.current!.height;
    ctx.translate(-w / 2, h / 2);

    const draw = drawCaller(ctx, w, h, getPolyFunction(polyEq(points) ?? []));
    draw();
    setPolynomial(getPolyFunction(polyEq(points, polynomialScale) ?? []));
  }, [points, polynomialScale, setPolynomial, stroke?.color, stroke?.size]);

  return (
    <div
      style={{
        width: "32rem",
        height: "18rem",
        touchAction: "none",
        background: "#ccc",
        ...wrapperStyle,
        position: "relative",
      }}
    >
      <canvas
        draggable={false}
        onContextMenu={(ev) => {
          ev.preventDefault();
          const rect = (ev.target as HTMLCanvasElement).getBoundingClientRect();
          const x = clamp((ev.pageX - rect.left) / rect.width, [0, 1]);
          const y = clamp(getPolyFunction(polyEq(points) ?? [])(x), [0, 1]);
          setpoints([...points, [x, y]]);
        }}
        ref={canvasRef}
        style={{ width: "100%", height: "100%", ...canvasStyle }}
      />
      {!!canvasRef.current &&
        points.map((point, index) => (
          <div
            draggable={false}
            onTouchStart={() => {
              setactivePoint(index);
            }}
            onMouseDown={() => {
              setactivePoint(index);
            }}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(ev) => {
              ev.preventDefault();
              setpoints(points.filter((_, i) => i !== index));
            }}
            style={{
              width: socketSize,
              height: socketSize,
              borderRadius: "50%",
              border: "3px solid black",
              background: "#fff",
              ...socketStyle,
              position: "absolute",
              left:
                (point[0] * (canvasRef.current!.width ?? 1) -
                  (devicePixelRatio * socketSize) / 2 -
                  3) /
                devicePixelRatio,
              top:
                ((1 - point[1]) * (canvasRef.current!.height ?? 1) -
                  (devicePixelRatio * socketSize) / 2 -
                  3) /
                devicePixelRatio,
            }}
            key={index}
          />
        ))}
    </div>
  );
};

export default PolyCurveEditor;
