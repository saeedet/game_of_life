import classes from "./GameRules.module.css";

const GameRules = () => {
  return (
    <header className={classes.header}>
      <div className={classes.ruleBox}>
        <h3>Game Rules</h3>
        <ul>
          <li>
            Any live cell with fewer than two live neighbours dies, as if by
            underpopulation.
          </li>
          <li>
            Any live cell with two or three live neighbours lives on to the next
            generation.
          </li>
          <li>
            Any live cell with more than three live neighbours dies, as if by
            overpopulation.
          </li>
          <li>
            Any dead cell with exactly three live neighbours becomes a live
            cell, as if by reproduction.
          </li>
        </ul>
      </div>
    </header>
  );
};

export default GameRules;
