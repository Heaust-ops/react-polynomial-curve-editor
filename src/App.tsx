import { useEffect, useRef, useState } from "react";
import "./App.css";
import PolyCurveEditor, { SocketStrategy } from "./CurveEditor/PolyCurveEditor";
import { gsap } from "gsap";

let polynomial = (x: number) => 0.5;
const clamp = (x: number, limits: [number, number]) =>
  Math.max(limits[0], Math.min(x, limits[1]));

function App() {
  const [x, setx] = useState(0);
  const tl = useRef(gsap.timeline());
  const [resizable, setresizable] = useState(false);
  const [backgroundColor, setbackgroundColor] = useState("#cccccc");
  const [strokeColor, setstrokeColor] = useState("#000");
  const [socketSize, setsocketSize] = useState(8);
  const [strokeSize, setstrokeSize] = useState(6);
  const [isPlaying, setisPlaying] = useState(false);
  const [socketStrategy, setsocketStrategy] = useState(
    SocketStrategy.pointToCurve
  );
  const xPos = useRef({ x: 0 });

  const restart = () => {
    setx(0);
    tl.current.restart();
  };

  useEffect(() => {
    tl.current.to(xPos.current, { x: 100 });
    tl.current.pause();
    let inter: NodeJS.Timer;
    tl.current.timeScale(0.01);

    if (isPlaying) {
      if (xPos.current.x >= 100) restart();
      tl.current.play();
      inter = setInterval(() => {
        if (xPos.current.x >= 100) {
          setisPlaying(false);
          return;
        }
        const factor = clamp(polynomial(xPos.current.x / 100), [0.001, 1]);
        tl.current.timeScale(factor / 2);
        setx(xPos.current.x);
      }, 5);
    } else tl.current.pause();

    /** Cleanup */
    return () => {
      if (inter) clearInterval(inter);
    };
  }, [isPlaying]);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="button"
            onClick={() => {
              setisPlaying(!isPlaying);
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="button"
            onClick={() => {
              setisPlaying(false);
              restart();
            }}
          >
            Reset
          </button>
        </div>
        <br />
        <PolyCurveEditor
          socketSize={socketSize}
          stroke={{ color: strokeColor, size: strokeSize }}
          wrapperStyle={{
            ...(resizable ? { resize: "both", overflow: "hidden" } : {}),
            ...{ backgroundColor },
          }}
          socketStrategy={socketStrategy}
          setPolynomial={(poly) => {
            polynomial = poly;
          }}
        />
        <br />
        {/* ROW 1 */}
        <div style={{ display: "flex" }}>
          <div className="property">
            <span className="unselectable" style={{ fontFamily: "sans-serif" }}>
              Background Color
            </span>
            <br />
            <input
              className="color-input"
              onChange={(e) => setbackgroundColor(e.target.value)}
              value={backgroundColor}
              type="color"
            />
          </div>
          <div className="property">
            <span className="unselectable" style={{ fontFamily: "sans-serif" }}>
              Stroke Color
            </span>
            <br />
            <input
              className="color-input"
              onChange={(e) => setstrokeColor(e.target.value)}
              value={strokeColor}
              type="color"
            />
          </div>
        </div>
        {/* ROW 2 */}
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex" }} className="property">
            <span className="unselectable" style={{ fontFamily: "sans-serif" }}>
              Resizable
            </span>
            <input
              className="check-input"
              onChange={(e) => setresizable(e.target.checked)}
              checked={resizable}
              type="checkbox"
            />
          </div>
          <div style={{ display: "flex" }} className="property">
            <span className="unselectable" style={{ fontFamily: "sans-serif" }}>
              Curve to Point
            </span>
            <input
              className="check-input"
              onChange={(e) =>
                setsocketStrategy(
                  e.target.checked
                    ? SocketStrategy.curveToPoint
                    : SocketStrategy.pointToCurve
                )
              }
              checked={socketStrategy === SocketStrategy.curveToPoint}
              type="checkbox"
            />
          </div>
        </div>
        {/* ROW 3 */}
        <div style={{ display: "flex" }}>
          <div className="property">
            <span className="unselectable" style={{ fontFamily: "sans-serif" }}>
              Stroke Size
            </span>
            <br />
            <input
              className="color-input"
              onChange={(e) => setstrokeSize(+e.target.value)}
              value={strokeSize}
              type="range"
            />
          </div>
          <div className="property">
            <span className="unselectable" style={{ fontFamily: "sans-serif" }}>
              Socket Size
            </span>
            <br />
            <input
              className="color-input"
              onChange={(e) => setsocketSize(+e.target.value)}
              value={socketSize}
              type="range"
            />
          </div>
        </div>
        <br />
        <div style={{ width: "auto" }}>
          <div
            style={{
              position: "absolute",
              left: `min(${x}vw, calc(100vw - 10rem))`,
              width: "5rem",
              height: "5rem",
              margin: "2rem",
              borderRadius: "50%",
              background: `radial-gradient(#00fbff, #0015ff)`,
              filter: "brightness(0.8)",
              boxShadow: "0 0 5px 2px #9cd4c4",
            }}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
