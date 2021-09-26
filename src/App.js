import { useCallback, useState, useRef } from "react";
import "./App.css";
import produce from "immer";
import GameRules from "./components/GameRules";

// Number of rows and columns
const numRows = 30;
const numCols = 30;

// neighbors locations
const operations = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, 0],
  [1, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

// generating an array of arrays of zeros / zeros and ones
const generateEmptyGrid = (random) => {
  const rows = [];
  let chance = 2;
  if (random) {
    chance = 0.7;
  }
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => (Math.random() > chance ? 1 : 0))
    );
  }
  return rows;
};

function App() {
  // setting the initial state of grids
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  // accessing the current running state from inside useCallback hook
  const runningRef = useRef(running);
  runningRef.current = running;

  // game simulation
  const runSimulation = useCallback(() => {
    // kill condition of the recurrent function
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = j + y;
              //check for the grid-box limits
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbours += g[newI][newK];
              }
            });
            // applying game logic
            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbours === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div className="app">
      <GameRules />
      <div className="gameBox">
        <div style={{ display: "inline-block", marginBottom: "20px" }}>
          <div className="btn">
            <button
              onClick={() => {
                setRunning(!running);
                runningRef.current = true;
                runSimulation();
              }}
            >
              {running ? "Stop" : "Start"}
            </button>
            <button
              onClick={() => {
                setGrid(generateEmptyGrid());
              }}
            >
              Clear
            </button>
            <button onClick={() => setGrid(generateEmptyGrid(true))}>
              Random
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numCols}, 20px)`,
            }}
          >
            {grid.map((row, i) =>
              row.map((col, j) => (
                <div
                  key={`${i}-${j}`}
                  onClick={() => {
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                    });
                    setGrid(newGrid);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    boxShadow: grid[i][j]
                      ? "0px 0px 15px black inset"
                      : "0px 0px 15px black inset",
                    border: "1px solid black",
                    backgroundColor: grid[i][j] ? "purple" : "white",
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
