//board loading
const userBoard = document.querySelector(".board--user");
const computerBoard = document.querySelector(".board--computer");
const allShipsBoard = document.querySelector(".board--all-ships");
const computerBoardContainer = document.querySelector(
  ".board-container--computer"
);

//ships loading
const ships = document.querySelectorAll(".ship");
const quintupleShip = document.querySelector(".quintuple-ship");
const quadrupleShip = document.querySelector(".quadruple-ship");
const trippleShip = document.querySelector(".tripple-ship");
const doubleShip = document.querySelector(".double-ship");
const singleShip = document.querySelector(".single-ship");

//buttons
const startGameBtn = document.querySelector(".options__start-btn");
const rotateBtn = document.querySelector(".options__rotate-btn");
const againBtn = document.querySelector(".options__again-btn");

//display
const roundDisplay = document.querySelector(".round-display");

//variables etc
const userObj = {
  id: 1,
  name: "Player",
  fields: [],
  quintupleShipCords: [],
  quadrupleShipCords: [],
  trippleShipCords: [],
  doubleShipCords: [],
  singleShipCords: [],

  quintupleShipCordsClone: [],
  quadrupleShipCordsClone: [],
  trippleShipCordsClone: [],
  doubleShipCordsClone: [],
  singleShipCordsClone: [],
};

const computerObj = {
  id: 2,
  name: "Computer",
  fields: [],
  quintupleShipCords: [],
  quadrupleShipCords: [],
  trippleShipCords: [],
  doubleShipCords: [],
  singleShipCords: [],
  shotCords: [],

  quintupleShipCordsClone: [],
  quadrupleShipCordsClone: [],
  trippleShipCordsClone: [],
  doubleShipCordsClone: [],
  singleShipCordsClone: [],
};

let user = Object.create(userObj);
let computer = Object.create(computerObj);

let shipsDirection = 0;
let canStartGame = false;
let whoseTurn = 0;
let roundCounter = 1;
let gameStarted = false;
let winner = "";

const allShips = [
  {
    name: "single-ship",
    occupied: [[0], [0]],
    locked: [
      [-1, 9, -9, 1, -10, -11, 10, 11],
      [-1, 9, -9, 1, -10, -11, 10, 11],
    ],
  },
  {
    name: "double-ship",
    occupied: [
      [0, 1],
      [0, 10],
    ],
    locked: [
      [-1, 2, -11, -10, -9, -8, 9, 10, 11, 12],
      [-9, -10, -11, 20, 19, 21, -1, 9, 1, 11],
    ],
  },
  {
    name: "tripple-ship",
    occupied: [
      [0, 1, 2],
      [0, 10, 20],
    ],

    locked: [
      [-1, 3, -11, -10, -9, -8, -7, 9, 10, 11, 12, 13],
      [-9, -10, -11, 30, 19, 21, 29, -1, 9, 1, 11, 31],
    ],
  },
  {
    name: "quadruple-ship",
    occupied: [
      [0, 1, 2, 3],
      [0, 10, 20, 30],
    ],

    locked: [
      [-1, 4, -11, -10, -9, -8, -7, -6, 9, 10, 11, 12, 13, 14],
      [-9, -10, -11, 40, 19, 21, 29, -1, 9, 1, 11, 31, 39, 41],
    ],
  },
  {
    name: "quintuple-ship",
    occupied: [
      [0, 1, 2, 3, 4],
      [0, 10, 20, 30, 40],
    ],
    locked: [
      [-1, 5, -11, -10, -9, -8, -7, -6, -5, 9, 10, 11, 12, 13, 14, 15],
      [-9, -10, -11, 50, 19, 21, 29, -1, 9, 1, 11, 31, 39, 41, 49, 51],
    ],
  },
];

startGameBtn.style.display = "none";
computerBoardContainer.style.display = "none";

//Buttons event-listeners
rotateBtn.addEventListener("click", () => {
  shipsDirection === 0 ? (shipsDirection = 1) : (shipsDirection = 0);
  ships.forEach((ship) => {
    const shipName = ship.id;
    ship.classList.toggle(shipName);
    ship.classList.toggle(shipName + "--vertical");

    allShipsBoard.classList.toggle("board--vertical");
    allShipsBoard.classList.toggle("board--horizontal");
  });
});

startGameBtn.addEventListener("click", () => {
  //view and game settings for game
  startGameBtn.style.display = "none";
  computerBoardContainer.style.display = "block";

  if (canStartGame) {
    roundDisplay.innerText = "Player starts!";
    for (let i = 0; i < 100; i++) {
      computer.shotCords.push(i);
    }
    user.fields.forEach((element) => {
      if (element.classList.contains("locked")) {
        element.classList.remove("locked");
      }
    });
    //clone cords
    cloneCoordinates();
    //actual start game
    takeRound();
  }
});

againBtn.addEventListener("click", () => {
  reload = location.reload();
});




//game mechanics
//creating board 10x10
function createBoard(board, fields) {
  for (let i = 0; i < 100; i++) {
    const field = document.createElement("div");
    field.classList.add("board__field");
    field.dataset.id = i;
    board.appendChild(field);
    fields.push(field);
  }
}
createBoard(userBoard, user.fields);
createBoard(computerBoard, computer.fields);


//setting computer ships
function setComputerShips(ship) {
  let drawShipDirection = Math.floor(Math.random() * 2);
  let shipFields = ship.occupied[drawShipDirection];
  let lockedFielsd = ship.locked[drawShipDirection];
  drawShipDirection === 0 ? (direction = 1) : (direction = 10);
  let drawShipStart = Math.abs(
    Math.floor(
      Math.random() * computer.fields.length -
        ship.occupied[0].length * direction
    )
  );

  let shipTaken = false;
  let canSetShip = true;
  const isTaken = shipFields.some((index) => {
    if (
      shipFields.some(
        (index) =>
          computer.fields[drawShipStart + Number(index)].classList.contains(
            "taken"
          ) === true
      )
    ) {
      shipTaken = true;
    } else if (
      shipFields.some(
        (index) =>
          computer.fields[drawShipStart + Number(index)].classList.contains(
            "locked"
          ) === true
      )
    ) {
      shipTaken = true;
    }
  });

  const checkRightEdge = shipFields.some(
    (index) => (drawShipStart + index) % 10 === 9
  );
  const checkLeftEdge = shipFields.some(
    (index) => (drawShipStart + index) % 10 === 0
  );

  if (!shipTaken && !checkRightEdge && !checkLeftEdge) {
    shipFields.forEach((index) => {
      computer.fields[drawShipStart + index].classList.add(
        "taken",
        `${ship.name}--item`
      );
      if (ship.occupied[0].length === 1) {
        computer.singleShipCords.push(
          computer.fields[drawShipStart + index].dataset.id
        );
      } else if (ship.occupied[0].length === 2) {
        computer.doubleShipCords.push(
          computer.fields[drawShipStart + index].dataset.id
        );
      } else if (ship.occupied[0].length === 3) {
        computer.trippleShipCords.push(
          computer.fields[drawShipStart + index].dataset.id
        );
      } else if (ship.occupied[0].length === 4) {
        computer.quadrupleShipCords.push(
          computer.fields[drawShipStart + index].dataset.id
        );
      } else if (ship.occupied[0].length === 5) {
        computer.quintupleShipCords.push(
          computer.fields[drawShipStart + index].dataset.id
        );
      }
    });
    lockedFielsd.forEach((index) => {
      if (computer.fields[drawShipStart + index] != undefined) {
        computer.fields[drawShipStart + index].classList.add(
          "locked",
          `${ship.name}--item`
        );
      }
    });
  } else {
    setComputerShips(ship);
  }
}

setComputerShips(allShips[0]);
setComputerShips(allShips[1]);
setComputerShips(allShips[2]);
setComputerShips(allShips[3]);
setComputerShips(allShips[4]);


//user ships drag&drop
ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
user.fields.forEach((field) => field.addEventListener("dragstart", dragStart));
user.fields.forEach((field) => field.addEventListener("dragover", dragOver));
user.fields.forEach((field) => field.addEventListener("dragenter", dragEnter));
user.fields.forEach((field) => field.addEventListener("dragleave", dragLeave));
user.fields.forEach((field) => field.addEventListener("drop", dragDrop));
user.fields.forEach((field) => field.addEventListener("dragend", dragEnd));

let selectedShipNameWithIndex;
let draggedShip;
let draggedShipLength;

ships.forEach((ship) =>
  ship.addEventListener("mousedown", (e) => {
    selectedShipNameWithIndex = e.target.id;
  })
);

function dragStart(e) {
  draggedShip = this;
  draggedShipLength = this.childElementCount;
}
function dragOver(e) {
  e.preventDefault();
}
function dragEnter(e) {
  e.preventDefault();
}
function dragLeave() {}

function dragDrop() {
  let shipID = draggedShip.children[draggedShipLength - 1].id;
  let shipName = shipID.slice(0, -3);
  let shipStyleName = shipName + "--item";
  let boardDropIndex = this.dataset.id;
  let selectedShipPart = selectedShipNameWithIndex.substr(-1);
  let canSet = true;

  //shipsDirection: 0 - horizontal; 1 - vertical
  if (shipsDirection === 0) {
    for (let i = 0; i < draggedShipLength; i++) {
      if (
        user.fields[boardDropIndex - selectedShipPart + i].classList.contains(
          "taken"
        )
      )
        canSet = false;
      if (
        user.fields[boardDropIndex - selectedShipPart + i].classList.contains(
          "locked"
        )
      )
        canSet = false;
      if (
        i != 1 &&
        user.fields[boardDropIndex - selectedShipPart + i].dataset.id % 10 === 0
      )
        canSet = false;

      if (
        i != draggedShipLength - 2 &&
        user.fields[boardDropIndex - selectedShipPart + i].dataset.id % 10 === 9
      )
        canSet = false;
    }

    if (canSet === true) {
      for (let i = 0; i < draggedShipLength; i++) {
        if (draggedShipLength === 1) {
          user.fields[boardDropIndex - selectedShipPart + i].classList.add(
            "taken",
            "ship__item",
            "ship__item--single"
          );
        } else {
          if (i === 0) {
            user.fields[boardDropIndex - selectedShipPart + i].classList.add(
              "taken",
              "ship__item",
              "ship__item--first"
            );
          }
          if (i === draggedShipLength - 1) {
            user.fields[boardDropIndex - selectedShipPart + i].classList.add(
              "taken",
              "ship__item",
              "ship__item--last"
            );
          } else {
            user.fields[boardDropIndex - selectedShipPart + i].classList.add(
              "taken",
              "ship__item"
            );
          }
        }

        if (draggedShipLength === 1) {
          user.singleShipCords.push(
            user.fields[boardDropIndex - selectedShipPart + i].dataset.id
          );

          allShips[0].locked[0].forEach((index) => {
            if (
              user.fields[Number(user.singleShipCords[0]) + index] != undefined
            ) {
              user.fields[
                Number(user.singleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        } else if (draggedShipLength === 2) {
          user.doubleShipCords.push(
            user.fields[boardDropIndex - selectedShipPart + i].dataset.id
          );
          allShips[1].locked[0].forEach((index) => {
            if (
              user.fields[Number(user.doubleShipCords[0]) + index] != undefined
            ) {
              user.fields[
                Number(user.doubleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        } else if (draggedShipLength === 3) {
          user.trippleShipCords.push(
            user.fields[boardDropIndex - selectedShipPart + i].dataset.id
          );
          allShips[2].locked[0].forEach((index) => {
            if (
              user.fields[Number(user.trippleShipCords[0]) + index] != undefined
            ) {
              user.fields[
                Number(user.trippleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        } else if (draggedShipLength === 4) {
          user.quadrupleShipCords.push(
            user.fields[boardDropIndex - selectedShipPart + i].dataset.id
          );
          allShips[3].locked[0].forEach((index) => {
            if (
              user.fields[Number(user.quadrupleShipCords[0]) + index] !=
              undefined
            ) {
              user.fields[
                Number(user.quadrupleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        } else if (draggedShipLength === 5) {
          user.quintupleShipCords.push(
            user.fields[boardDropIndex - selectedShipPart + i].dataset.id
          );
          allShips[4].locked[0].forEach((index) => {
            if (
              user.fields[Number(user.quintupleShipCords[0]) + index] !=
              undefined
            ) {
              user.fields[
                Number(user.quintupleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        }
      }
    } else {
      return draggedShip;
    }
  } else if (shipsDirection === 1) {
    let shipBeginning = boardDropIndex - selectedShipPart * 10;

    for (let i = 0; i < draggedShipLength; i++) {
      if (
        user.fields[shipBeginning + 10 * i] === undefined ||
        user.fields[shipBeginning + 10 * i].classList.contains("taken") ||
        user.fields[shipBeginning + 10 * i].classList.contains("locked")
      ) {
        canSet = false;
      }
      if (i != 0 && user.fields[shipBeginning + 10 * i].dataset.id % 10 === 0)
        canSet = false;

      if (
        i != draggedShipLength - 2 &&
        user.fields[shipBeginning + 10 * i].dataset.id % 10 === 9
      )
        canSet = false;
    }
    if (canSet === true) {
      for (let i = 0; i < draggedShipLength; i++) {
        if (draggedShipLength === 1) {
          user.fields[shipBeginning + 10 * i].classList.add(
            "taken",
            "ship__item",
            "ship__item--single"
          );
        } else {
          if (i === 0) {
            user.fields[shipBeginning + 10 * i].classList.add(
              "taken",
              "ship__item",
              "ship__item--first-vertical"
            );
          }
          if (i === draggedShipLength - 1) {
            user.fields[shipBeginning + 10 * i].classList.add(
              "taken",
              "ship__item",
              "ship__item--last-vertical"
            );
          } else {
            user.fields[shipBeginning + 10 * i].classList.add(
              "taken",
              "ship__item"
            );
          }
        }

        if (draggedShipLength === 1) {
          user.singleShipCords.push(
            user.fields[shipBeginning + 10 * i].dataset.id
          );

          allShips[0].locked[1].forEach((index) => {
            if (
              user.fields[Number(user.singleShipCords[0]) + index] != undefined
            ) {
              user.fields[
                Number(user.singleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        } else if (draggedShipLength === 2) {
          user.doubleShipCords.push(
            user.fields[shipBeginning + 10 * i].dataset.id
          );
          allShips[1].locked[1].forEach((index) => {
            if (
              user.fields[Number(user.doubleShipCords[0]) + index] != undefined
            ) {
              user.fields[
                Number(user.doubleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        } else if (draggedShipLength === 3) {
          user.trippleShipCords.push(
            user.fields[shipBeginning + 10 * i].dataset.id
          );
          allShips[2].locked[1].forEach((index) => {
            if (
              user.fields[Number(user.trippleShipCords[0]) + index] != undefined
            ) {
              user.fields[
                Number(user.trippleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        } else if (draggedShipLength === 4) {
          user.quadrupleShipCords.push(
            user.fields[shipBeginning + 10 * i].dataset.id
          );
          allShips[3].locked[1].forEach((index) => {
            if (
              user.fields[Number(user.quadrupleShipCords[0]) + index] !=
              undefined
            ) {
              user.fields[
                Number(user.quadrupleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        } else if (draggedShipLength === 5) {
          user.quintupleShipCords.push(
            user.fields[shipBeginning + 10 * i].dataset.id
          );
          allShips[4].locked[1].forEach((index) => {
            if (
              user.fields[Number(user.quintupleShipCords[0]) + index] !=
              undefined
            ) {
              user.fields[
                Number(user.quintupleShipCords[0]) + index
              ].classList.add("locked");
            }
          });
        }
      }
    } else {
      return draggedShip;
    }
  }

  allShipsBoard.removeChild(draggedShip);
  if (allShipsBoard.childElementCount === 0) {
    allShipsBoard.style.display = "none";
    rotateBtn.style.display = "none";

    startGameBtn.style.display = "block";
    canStartGame = true;
  }
}
function dragEnd() {}


function game(e) {
  const userShotTarget = e.target;
  const userShotTargetID = e.target.dataset.id;
  if (
    !userShotTarget.classList.contains("shot") &&
    !userShotTarget.classList.contains("miss")
  ) {
    if (whoseTurn === 0) {
      if (userShotTarget.classList.contains("taken")) {
        userShotTarget.classList.add("shot");
        handleShot(computer.quintupleShipCords, userShotTargetID);
        handleShot(computer.quadrupleShipCords, userShotTargetID);
        handleShot(computer.trippleShipCords, userShotTargetID);
        handleShot(computer.doubleShipCords, userShotTargetID);
        handleShot(computer.singleShipCords, userShotTargetID);

        checkIfSunk(
          computer.singleShipCords,
          computer.singleShipCordsClone,
          computer
        );
        checkIfSunk(
          computer.doubleShipCords,
          computer.doubleShipCordsClone,
          computer
        );
        checkIfSunk(
          computer.trippleShipCords,
          computer.trippleShipCordsClone,
          computer
        );
        checkIfSunk(
          computer.quadrupleShipCords,
          computer.quadrupleShipCordsClone,
          computer
        );
        checkIfSunk(
          computer.quintupleShipCords,
          computer.quintupleShipCordsClone,
          computer
        );
      } else {
        userShotTarget.classList.add("miss");
      }
    }
    whoseTurn = 1;
    checkGameEnd(computer);
    computerMove();
  }
}

function takeRound() {
  userBoard.style.opacity = 0.5;
  computerBoard.style.opacity = 1;
  computer.fields.forEach((field) =>
    field.addEventListener("click", (e) => game(e))
  );
}

function computerMove() {
  if (winner === "") {
    roundDisplay.innerText = "Computer Round";
    computerBoard.style.opacity = 0.5;
    userBoard.style.opacity = 1;
  }

  computer.fields.forEach((field) => field.removeEventListener("click", game));

  const nextShot = Math.floor(Math.random() * computer.shotCords.length);
  const shotCord = computer.shotCords[nextShot];
  const shotIndex = computer.shotCords.indexOf(shotCord);
  const awaitTime = Math.random() * 1500;

  console.log("shot cord: " + shotCord);
  setTimeout(() => {
    if (whoseTurn === 1) {
      if (user.fields[shotCord].classList.contains("taken")) {
        user.fields[shotCord].classList.add("shot");

        handleShot(user.quintupleShipCords, String(shotCord));
        handleShot(user.quadrupleShipCords, String(shotCord));
        handleShot(user.trippleShipCords, String(shotCord));
        handleShot(user.doubleShipCords, String(shotCord));
        handleShot(user.singleShipCords, String(shotCord));

        checkIfSunk(user.singleShipCords, user.singleShipCordsClone, user);
        checkIfSunk(user.doubleShipCords, user.doubleShipCordsClone, user);
        checkIfSunk(user.trippleShipCords, user.trippleShipCordsClone, user);
        checkIfSunk(
          user.quadrupleShipCords,
          user.quadrupleShipCordsClone,
          user
        );
        checkIfSunk(
          user.quintupleShipCords,
          user.quintupleShipCordsClone,
          user
        );
      } else {
        user.fields[shotCord].classList.add("miss");
      }

      computer.shotCords.splice(shotIndex, 1);
      checkGameEnd(user);
      whoseTurn = 0;
    }
    if (winner === "") {
      userBoard.style.opacity = 0.5;
      computerBoard.style.opacity = 1;
      roundDisplay.innerText = "Player Round";
    }
  }, awaitTime);
}

function handleShot(shipCords, targetID) {
  if (shipCords.includes(targetID)) {
    shipCords[shipCords.indexOf(targetID)] = "X";
  }
}

function checkIfSunk(shipCords, shipCordsClone, player) {
  if (!shipCords.some((cord) => cord != "X")) {
    shipCordsClone.forEach((cord) => {
      player.fields[cord].classList.add("sunk");
      player.fields[cord].innerHTML = "&#10005";
    });
  }
}

function drawAroundComputerShip() {
  lockedFielsd.forEach((index) => {
    if (computer.fields[drawShipStart + index] != undefined) {
      computer.fields[drawShipStart + index].classList.add(
        "locked",
        `${ship.name}--item`
      );
    }
  });
}

function checkGameEnd(player) {
  if (
    player.singleShipCords.some((cord) => cord != "X") ||
    player.doubleShipCords.some((cord) => cord != "X") ||
    player.trippleShipCords.some((cord) => cord != "X") ||
    player.quadrupleShipCords.some((cord) => cord != "X") ||
    player.quintupleShipCords.some((cord) => cord != "X")
  ) {
  } else {
    player.id === 1 ? (winner = computer.name) : (winner = user.name);

    userBoard.style.display = "none";
    computerBoard.style.display = "none";
    allShipsBoard.style.display = "none";
    startGameBtn.style.display = "none";
    rotateBtn.style.display = "none";
    roundDisplay.innerText = "Game over! \n" + winner + " won!";
  }
}



function cloneCoordinates() {
  user.singleShipCordsClone = [...user.singleShipCords];
  computer.singleShipCordsClone = [...computer.singleShipCords];

  user.doubleShipCordsClone = [...user.doubleShipCords];
  computer.doubleShipCordsClone = [...computer.doubleShipCords];

  user.trippleShipCordsClone = [...user.trippleShipCords];
  computer.trippleShipCordsClone = [...computer.trippleShipCords];

  user.quadrupleShipCordsClone = [...user.quadrupleShipCords];
  computer.quadrupleShipCordsClone = [...computer.quadrupleShipCords];

  user.quintupleShipCordsClone = [...user.quintupleShipCords];
  computer.quintupleShipCordsClone = [...computer.quintupleShipCords];
}