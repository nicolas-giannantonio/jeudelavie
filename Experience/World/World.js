import Celulle from "./Celulle.js";
import * as THREE from "three";
import {GUI} from "dat.gui";

export default class World {
    grid = [];
    gridSize;
    gap = 1.25;
    lastUpdateTime = 0;
    speed = 100;

    constructor(experience) {
        this.gui = new GUI();
        this.experience = experience;
        this.scene = this.experience.scene;

        this.gridSize = {
            width: 40,
            height: 40,
        }

        this.init();
        this.ev();
    }

    ev() {
        this.$aliveCounter = document.querySelector("#aliveCounter");
        this.$speed = document.querySelector("#speed");
        this.$speed.addEventListener("input", (e) => {
            this.speed = e.target.value;
        })

        this.$btn_restart = document.querySelector("#btn_restart");
        this.$btn_restart.addEventListener("click", () => {

            this.actionAll((x, y) => {
                this.grid[x][y].isAnimate = true;
                const centerX = this.gridSize.width * 0.5;
                const centerY = this.gridSize.height * 0.5;

                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

                const scaleFactor = distance * 0.025;

                this.grid[x][y].mesh.scale.set(0, 0, 0);
                this.grid[x][y].celluleFx.zoom(scaleFactor);
                this.grid[x][y].celluleFx.gradient(scaleFactor);
            });

            this.actionAll((x, y) => {
                this.grid[x][y].isAlive = Math.random() > .5;
            });
        });
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

        this.analyseGrid();


        this.scene.add(this.cellulesGroup);


        this.actionAll((x, y) => {
            const centerX = this.gridSize.width * 0.5;
            const centerY = this.gridSize.height * 0.5;

            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            const scaleFactor = distance * 0.035;

            this.grid[x][y].mesh.scale.set(0, 0, 0);
            this.grid[x][y].celluleFx.zoom(scaleFactor);
            this.grid[x][y].celluleFx.gradient(scaleFactor);
        });

        this.GUIHELPER();
    }


    GUIHELPER() {
        // this.specularLight = new THREE.Color("white")
        // FOR I
        this.gui.addColor({ color: "#eaecea" }, "color").onChange((color) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uAmbientLightColor.value = new THREE.Color(color);
            })
        })

        this.gui.addColor({ color: "#eaecea" }, "color").onChange((color) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uDiffuseLight.value = new THREE.Color(color);
            })
        })

        this.gui.addColor({ color: "#eaecea" }, "color").onChange((color) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uSpecularLight.value = new THREE.Color(color);
            })
        })

        this.gui.add({
            x: 0,
            y: 0,
            z: 0
        }, "x", -10, 100).onChange((value) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uCameraPosition.value.x = value;
            })
        })

        this.gui.add({
            x: 0,
            y: 0,
            z: 0
        }, "y", -10, 100).onChange((value) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uCameraPosition.value.y = value;
            })
        })

        this.gui.add({
            x: 0,
            y: 0,
            z: 0
        }, "z", -10, 100).onChange((value) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uCameraPosition.value.z = value;
            })
        });

        this.gui.add({
            x: 0,
            y: 0,
            z: 0
        }, "x", -10, 100).onChange((value) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uLightPosition.value.x = value;
            })
        })

        this.gui.add({
            x: 0,
            y: 0,
            z: 0
        }, "y", -10, 100).onChange((value) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uLightPosition.value.y = value;
            })
        })

        this.gui.add({
            x: 0,
            y: 0,
            z: 0
        }, "z", -10, 10, .25).onChange((value) => {
            this.actionAll((x, y) => {
                this.grid[x][y].material.uniforms.uLightPosition.value.z = value;
            })
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
        if (!this.lastUpdateTime || Date.now() - this.lastUpdateTime > this.speed) {
            this.analyseGrid();

            this.actionAll((x, y) => {
                this.grid[x][y].update();
            });
            this.lastUpdateTime = Date.now();
        }
    }
}

