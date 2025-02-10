import Grid from './grid.js';
import Tile from './tile.js';
const DefaultButtonColor = 'gainsboro';
const buttons = document.querySelectorAll('#button').forEach(button => {button.style.backgroundColor = DefaultButtonColor});

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);

grid.getRandomEmptyCell().tile = new Tile(gameBoard);
grid.getRandomEmptyCell().tile = new Tile(gameBoard);

setupInput();

function setupInput() {
   const handleOnce = (event) => {
      handleInput(event);
      cleanUp();
   }
   
   const upClick = () => handleOnce({key: 'ArrowUp'});
   const downClick = () => handleOnce({key: 'ArrowDown'});
   const leftClick = () => handleOnce({key: 'ArrowLeft'});
   const rightClick = () => handleOnce({key: 'ArrowRight'});

   const cleanUp = () => {
      window.removeEventListener('keydown', handleOnce);
      document.querySelector('.up').removeEventListener('click', upClick);
      document.querySelector('.down').removeEventListener('click', downClick);
      document.querySelector('.left').removeEventListener('click', leftClick);
      document.querySelector('.right').removeEventListener('click', rightClick);
   };

   window.addEventListener('keydown', handleOnce);
   document.querySelector('.up').addEventListener('click', upClick);
   document.querySelector('.down').addEventListener('click', downClick);
   document.querySelector('.left').addEventListener('click', leftClick);
   document.querySelector('.right').addEventListener('click', rightClick);
}

function flashButtonColor(selector, color, duration = 100) {
    const button = document.querySelector(selector);
    const originalColor = button.style.backgroundColor;
    button.style.backgroundColor = color;
    setTimeout(() => {
        button.style.backgroundColor = originalColor;
    }, duration);
}

async function handleInput(event) {
   console.log(event.key);
   switch(event.key) {
      case 'ArrowUp':
         if(!canMoveUp()) {
            flashButtonColor('.up', 'red');
            setupInput();
            return;
         }
         await moveUp();
         break;
      case 'ArrowDown':
         if(!canMoveDown()) {
            flashButtonColor('.down', 'red');
            setupInput();
            return;
         }
         await moveDown();
         break;
      case 'ArrowLeft':
         if(!canMoveLeft()) {
            flashButtonColor('.left', 'red');
            setupInput();
            return;
         }
         await moveLeft();
         break;
      case 'ArrowRight':
         if(!canMoveRight()) {
            flashButtonColor('.right', 'red');
            setupInput();
            return;
         }
         await moveRight();
         break;
      default:
         setupInput();
         return;
   }

   grid.cells.forEach(cell => cell.margeTiles());
   grid.getRandomEmptyCell().tile = new Tile(gameBoard);

   if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
      alert('Game Over');
   }
   setupInput();
}

function moveUp() {
   return slideTilds(grid.getCellColumn);
}

function moveDown() {
   return slideTilds(grid.getCellColumn.map(column => column.reverse()));
}

function moveLeft() {
   return slideTilds(grid.getCellRow);
}

function moveRight() {
   return slideTilds(grid.getCellRow.map(row => row.reverse()));
}

function slideTilds(cells) {
   return Promise.all(
      cells.flatMap(group => {
         const promise = [];
         for(let i = 1; i < group.length; i++) {
            const cell = group[i];

            if(cell.tile == null) continue;

            let lastValidCell = null;
            for(let j = i - 1; j >= 0; j--) {
               const nextCell = group[j];

               if(!nextCell.canMove(cell.tile)) break;

               lastValidCell = nextCell;
            }

            if(lastValidCell != null) {
               promise.push(cell.tile.waitForMove());
               if(lastValidCell.tile != null) {
                  lastValidCell.margeTile = cell.tile;
               }
               else {
                  lastValidCell.tile = cell.tile;
               }

               cell.tile = null;
            }
         }
         return promise;
      })
   );
}

function canMoveUp() {
   return canMove(grid.getCellColumn);
}

function canMoveDown() {
   return canMove(grid.getCellColumn.map(column => column.reverse()));
}

function canMoveLeft() {
   return canMove(grid.getCellRow);
}

function canMoveRight() {
   return canMove(grid.getCellRow.map(row => row.reverse()));
}

function canMove(cells) {
   return cells.some(group => {
      return group.some((cell, index) => {
         if(index === 0) return false;
         if(cell.tile == null) return false;

         const nextCell = group[index - 1];
         return nextCell.canMove(cell.tile);
      });
   })
}