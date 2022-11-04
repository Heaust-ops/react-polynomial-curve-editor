import { useEffect, useRef, useState } from "react";
import "./App.css";
import PolyCurveEditor from "./CurveEditor/PolyCurveEditor";
import { gsap } from "gsap";

let polynomial = (x: number) => 0.5;
const clamp = (x: number, limits: [number, number]) =>
  Math.max(limits[0], Math.min(x, limits[1]));

function App() {
  const [x, setx] = useState(0);
  const tl = useRef(gsap.timeline());
  const xPos = useRef({ x: 0 });

  useEffect(() => {
    tl.current.to(xPos.current, { x: 100 });
    tl.current.pause();
    tl.current.timeScale(0.01);
    let t = 0;
    const inter = setInterval(() => {
      t++;
      const factor = clamp(polynomial(xPos.current.x / 100), [0.01, 1]);
      if (t%3===0) tl.current.timeScale(factor/2);
      setx(xPos.current.x);
    }, 16);

    return () => clearInterval(inter);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="button"
            onClick={() => {
              tl.current.play();
            }}
          >
            Play
          </button>
          <button
            className="button"
            onClick={() => {
              tl.current.restart();
              tl.current.pause();
            }}
          >
            Reset
          </button>
        </div>
        <br />
        <PolyCurveEditor
          wrapperStyle={{ resize: "both", overflow: "hidden" }}
          setPolynomial={(poly) => {
            polynomial = poly;
          }}
        />
        <br />

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
              boxShadow: "0 0 10px 2px white",
            }}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
