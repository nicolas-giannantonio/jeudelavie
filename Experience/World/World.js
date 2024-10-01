import Celulle from "../Game/Celulle.js";
import {Binder} from "../Utils/Shorcuts.js";

export default class World {
    grid = [];
    gridSize;
    gap = 1.25;

    constructor(experience) {
        Binder(this, ["resize"]);
        this.experience = experience;
        this.scene = this.experience.scene;

        this.gridSize = {
            width: 10,
            height: 10,
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
           const pos = {x,y}

            for (let i = 0; i <=8; i++) {

            }
        })
    }

    update() {
        // for (let i = 0; i < this.gridSize.width; i++) {
        //     for (let j = 0; j < this.gridSize.height; j++) {
        //         this.grid[i][j].update();
        //     }
        // }
    }

    resize () {
        console.log("Cellues resize")
        // this.actionAll((i, j) => {
        //     this.grid[i][j].resize();
        // })
    }
}
