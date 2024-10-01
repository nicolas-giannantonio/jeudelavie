import * as THREE from "three";
import VertexShader from "../shaders/vertex.glsl";
import FragmentShader from "../shaders/fragment.glsl";
import {Binder} from "../Utils/Shorcuts.js";

export default class Celulle {
    position; //x, y, z
    size;
    experience;
    id;
    isAlive;
    nextState;

    constructor() {
        Binder(this, ["update", "getNeighboursPositions"]);
        this.size = {
            height: 1,
            width: 1,
        }

        this.isAlive = Math.random() > 0.5;
    }

    init(position, experience) {
        this.experience = experience;
        this.geometry = new THREE.BoxGeometry(this.size.width, this.size.height, 1);

        // this.material = new THREE.ShaderMaterial({
        //     vertexShader: VertexShader,
        //     fragmentShader: FragmentShader,
        //     uniforms:
        //         {
        //             uTime: { value: 0 }
        //         },
        // })

        this.material = new THREE.MeshBasicMaterial({ color: 0xcccccc });


        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.id = this.mesh.id;
        this.move(position);
    }


    move(position) {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.position = this.mesh.position;
    }

    update() {
        // console.log("cellule update")
        this.material.color.set(this.isAlive ? "black" : "lightgray");

        if (this.nextState !== undefined) {
            this.isAlive = this.nextState;
        }
    }

    getNeighboursPositions(gridSize, x, y) {
        const neighbors = [];

        const directions = [
            { x: -1, y: -1 }, // Haut gauche
            { x: 0,  y: -1 }, // Haut
            { x: 1,  y: -1 }, // Haut droite
            { x: -1, y: 0 },  // Gauche
            { x: 1,  y: 0 },  // Droite
            { x: -1, y: 1 },  // Bas gauche
            { x: 0,  y: 1 },  // Bas
            { x: 1,  y: 1 }   // Bas droite
        ];

        directions.forEach(direction => {
            const newX = x + direction.x;
            const newY = y + direction.y;

            if (newX >= 0 && newX < gridSize.width && newY >= 0 && newY < gridSize.height) {
                neighbors.push({ x: newX, y: newY });
            }
        });

        return neighbors;
    }



    resize() {
        console.log("cellule resize")

    }

}
