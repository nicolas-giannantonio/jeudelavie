import Celulle from "../Game/Celulle.js";
import {Binder} from "../Utils/Shorcuts.js";

export default class World {
    grid = [];
    gridSize;
    gap = 1;
    lastUpdateTime = 0;

    constructor(experience) {
        Binder(this, ["resize"]);
        this.experience = experience;
        this.scene = this.experience.scene;

        this.gridSize = {
            width: 40,
            height: 40,
        }

        this.init();
    }


    actionAll(action) {
        for (let i = 0; i < this.gridSize.width; i++) {
            for (let j = 0; j < this.gridSize.height; j++) {
                action(i, j);
            }
        }
    }

    init() {
        for (let i = 0; i < this.gridSize.width; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.gridSize.height; j++) {
                const cellule = new Celulle();
                cellule.init({ x: i * this.gap, y: j * this.gap }, experience);
                this.grid[i][j] = cellule;
                this.scene.add(cellule.mesh);
            }
        }
        this.experience.sizes.on("resize", this.resize);
        this.analyseGrid()
    }

    generateGrid() {

    }

    analyseGrid() {
        this.actionAll((x, y) => {
            const cellule = this.grid[x][y];
            const neighborsPositions = cellule.getNeighboursPositions(this.gridSize, x, y);

            let liveNeighbors = 0;
            neighborsPositions.forEach(neighborPos => {
                const neighbor = this.grid[neighborPos.x][neighborPos.y];
                if (neighbor.isAlive) {
                    liveNeighbors++;
                }
            });

            if (cellule.isAlive) {
                // Vivante -> meurt si moins de 2 ou plus de 3 voisins vivants
                cellule.nextState = !(liveNeighbors < 2 || liveNeighbors > 3);
            } else {
                // Morte -> vivante si 3 voisins vivants
                cellule.nextState = liveNeighbors === 3;
            }
        });
    }



    update() {
        if (!this.lastUpdateTime || Date.now() - this.lastUpdateTime > 1000) {
            this.analyseGrid();

            this.actionAll((x, y) => {
                this.grid[x][y].update();
            });
            this.lastUpdateTime = Date.now();
        }
    }

    resize () {
        console.log("Cellues resize")
        // this.actionAll((i, j) => {
        //     this.grid[i][j].resize();
        // })
    }
}
