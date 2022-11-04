import { useEffect, useState } from "react";
import "./App.css";
import PolyCurveEditor from "./CurveEditor/PolyCurveEditor";
import { Interpolator } from "./interpolation";

let xPos = new Interpolator(0.01);
let polynomial = (x: number) => 0.5;
const clamp = (x: number, limits: [number, number]) =>
  Math.max(limits[0], Math.min(x, limits[1]));

function App() {
  const [x, setx] = useState(0);
  useEffect(() => {
    const inter = setInterval(() => {
      const factor = polynomial(xPos.current / 100);
      if (factor > 0) xPos.speedFactor = clamp(factor, [0, 100]);
      setx(xPos.current);
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
              xPos.next = 100;
            }}
          >
            Play
          </button>
          <button
            className="button"
            onClick={() => {
              xPos = new Interpolator(0.01);
            }}
          >
            Reset
          </button>
        </div>
        <br />
        <PolyCurveEditor
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
              border: "3px solid black",
              background: "#fff",
            }}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
