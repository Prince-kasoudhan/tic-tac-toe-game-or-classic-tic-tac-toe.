const cells = Array.from(document.querySelectorAll(".cell"));
const statusMessage = document.querySelector("#status-message");
const statusMarker = document.querySelector("#status-marker");
const turnStatus = document.querySelector("#turn-status");
const playerCards = {
  X: document.querySelector("#player-x"),
  O: document.querySelector("#player-o"),
};
const scoreElements = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
};

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let roundOver = false;
let scores = { X: 0, O: 0 };

function playerName(mark) {
  return mark === "X" ? "Player One" : "Player Two";
}

function updateTurn() {
  playerCards.X.classList.toggle("active", !roundOver && currentPlayer === "X");
  playerCards.O.classList.toggle("active", !roundOver && currentPlayer === "O");
  statusMarker.textContent = currentPlayer === "X" ? "×" : "○";
  statusMarker.className = `status-marker symbol-${currentPlayer.toLowerCase()}`;
}

function findWinningLine() {
  return winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function playCell(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);
  if (roundOver || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer === "X" ? "×" : "○";
  cell.classList.add(`mark-${currentPlayer.toLowerCase()}`);
  cell.disabled = true;
  cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, ${playerName(currentPlayer)}`);

  const winningLine = findWinningLine();
  if (winningLine) {
    roundOver = true;
    scores[currentPlayer] += 1;
    scoreElements[currentPlayer].textContent = String(scores[currentPlayer]);
    for (const winningIndex of winningLine) cells[winningIndex].classList.add("winner");
    statusMessage.textContent = `${playerName(currentPlayer)} wins!`;
    turnStatus.querySelector(".turn-hint").textContent = "NICE ONE";
    updateTurn();
    return;
  }

  if (board.every(Boolean)) {
    roundOver = true;
    statusMessage.textContent = "It's a draw! Well played.";
    turnStatus.querySelector(".turn-hint").textContent = "DRAW";
    updateTurn();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusMessage.textContent = `${playerName(currentPlayer)}'s turn`;
  turnStatus.querySelector(".turn-hint").textContent = "GO FOR IT";
  updateTurn();
}

function startRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  roundOver = false;
  for (const cell of cells) {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "winner");
    const index = Number(cell.dataset.index);
    cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, empty`);
  }
  statusMessage.textContent = "Player One's turn";
  turnStatus.querySelector(".turn-hint").textContent = "GO FOR IT";
  updateTurn();
}

cells.forEach((cell) => cell.addEventListener("click", playCell));
document.querySelector("#new-round").addEventListener("click", startRound);
document.querySelector("#reset-game").addEventListener("click", () => {
  scores = { X: 0, O: 0 };
  scoreElements.X.textContent = "0";
  scoreElements.O.textContent = "0";
  startRound();
});

updateTurn();
