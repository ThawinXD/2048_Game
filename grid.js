const GridSize = 4;
const CellSize = 15;
const GapSize = 2;

export default class Grid {
   constructor(gridElement) {
      gridElement.style.setProperty('--grid-size', GridSize);
      gridElement.style.setProperty('--cell-size', `${CellSize}vmin`);
      gridElement.style.setProperty('--gap-size', `${GapSize}vmin`);
      this.cells = createCellElements(gridElement);
      // console.log(this.cells);
   }

   get emptyCells() {
      const emptyCells = [];
      for(let cell of this.cells) {
         if(cell.tile == null) {
            emptyCells.push(cell);
         }
      }
      return emptyCells;
   }

   get getCellColumn() {
      return this.cells.reduce((cellGrid, cell) => {
         cellGrid[cell.x] = cellGrid[cell.x] || [];
         cellGrid[cell.x][cell.y] = cell;
         return cellGrid;
      }, [])
   }

   get getCellRow() {
      return this.cells.reduce((cellGrid, cell) => {
         cellGrid[cell.y] = cellGrid[cell.y] || [];
         cellGrid[cell.y][cell.x] = cell;
         return cellGrid;
      }, [])
   }

   getRandomEmptyCell() {
      const randomIndex = Math.floor(Math.random() * this.emptyCells.length);
      
      return this.emptyCells[randomIndex];
   }
}

class Cell {
   cellElement;
   x;
   y;
   #tile;
   #margeTile;

   constructor(cellElement, x, y) {
      this.cellElement = cellElement;
      this.x = x;
      this.y = y;
   }

   get tile() {
      return this.#tile;
   }
   
   set tile(value) {
      this.#tile = value;
      if(value == null) return;
      this.#tile.x = this.x;
      this.#tile.y = this.y;
   }
   
   get margeTile() {
      return this.#margeTile;
   }

   set margeTile(value) {
      this.#margeTile = value;
      if(value == null) return;

      this.#margeTile.x = this.x;
      this.#margeTile.y = this.y;
   }

   canMove(tile) {
      // console.log(tile);
      // console.log("canMove = " + (this.#tile == null || (this.margeTile == null && this.#tile.value === tile.value)));
      return (this.#tile == null || (this.margeTile == null && this.#tile.value === tile.value));
   }

   margeTiles() {
      if(this.#tile == null || this.#margeTile == null) return;

      this.#tile.value *= 2;
      this.#margeTile.remove();
      this.#margeTile = null;
   }
}

function createCellElements(gridElement) {
   const cells = [];
   for(let i = 0; i < GridSize; i++) {
      for(let j = 0; j < GridSize; j++) {
         const cell = document.createElement('div');
         cell.classList.add('cell');
         cells.push(new Cell(cell, i, j));
         gridElement.append(cell);
      }
   }
   return cells;
}