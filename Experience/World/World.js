import Celulle from "./Celulle.js";
import {Binder} from "../Utils/Shorcuts.js";
import * as THREE from "three";
// import Ray from "../Utils/Ray.js";

export default class World {
    grid = [];
    gridSize;
    gap = 1.5;
    lastUpdateTime = 0;

    constructor(experience) {
        Binder(this, ["resize"]);
        this.experience = experience;
        this.scene = this.experience.scene;

        this.gridSize = {
            width: 30,
            height: 30,
        }

        // this.ray = new Ray(this.experience);
        this.init();

        this.$aliveCounter = document.querySelector("#aliveCounter");
    }


    actionAll(action) {
        for (let i = 0; i < this.gridSize.width; i++) {
            for (let j = 0; j < this.gridSize.height; j++) {
                action(i, j);
            }
        }
    }

    init() {
        this.cellulesGroup = new THREE.Group();

        for (let i = 0; i < this.gridSize.width; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.gridSize.height; j++) {
                const cellule = new Celulle();
                cellule.init({ x: i * this.gap, y: j * this.gap }, experience);
                this.grid[i][j] = cellule;
                this.cellulesGroup.add(cellule.mesh);
            }
        }

        this.cellulesGroup.position.x = this.gridSize.width * this.gap * -0.5;
        this.cellulesGroup.position.y = this.gridSize.height * this.gap * -0.5;

        this.experience.sizes.on("resize", this.resize);
        this.analyseGrid();

        this.scene.add(this.cellulesGroup);
        this.actionAll((x, y) => {
            this.grid[x][y].celluleFx.zoom(x * 0.015 + y * 0.02);
        });
    }

    analyseGrid() {
        let counter = 0;
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

            counter += cellule.isAlive ? 1 : 0;
            this.$aliveCounter ? this.$aliveCounter.innerHTML = counter : null;
        });
    }

    update() {
        // this.ray.render(this.experience.renderer, this.scene, this.experience.camera.instance);

        if (!this.lastUpdateTime || Date.now() - this.lastUpdateTime > 500) {
            this.analyseGrid();

            this.actionAll((x, y) => {
                this.grid[x][y].update();
            });
            this.lastUpdateTime = Date.now();
        }
    }

    resize () {
        // this.actionAll((i, j) => {
        //     this.grid[i][j].resize();
        // })
    }
}

