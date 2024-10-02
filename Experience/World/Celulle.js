import * as THREE from "three";
import VertexShader from "../shaders/vertex.glsl";
import FragmentShader from "../shaders/fragment.glsl";
import {Binder} from "../Utils/Shorcuts.js";
import gsap from "gsap";
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default class Celulle {
    position; //x, y, z
    size;
    experience;
    id;
    isAlive;
    nextState;
    isAnimate = true;

    constructor() {
        Binder(this, ["update", "getNeighboursPositions"]);
        this.size = {
            height: 1,
            width: 1,
        }

        this.isAlive = Math.random() > .5;
    }

    init(position, experience) {
        this.experience = experience;
        this.geometry = new RoundedBoxGeometry(this.size.width, this.size.height, 1, 3);

        this.material = new THREE.ShaderMaterial({
            vertexShader: VertexShader,
            fragmentShader: FragmentShader,
            uniforms:
                {
                    uTime: { value: 0 },
                    uOpacity: { value: 0.75 },
                },
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = "cellule";
        this.mesh.scale.set(0, 0, 0);

        this.celluleFx = new CelluleFx(this);

        this.id = this.mesh.id;
        this.move(position);
    }


    move(position) {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.position = this.mesh.position;
    }

    update() {
        if(!this.isAnimate) this.material.uniforms.uOpacity.value = this.isAlive ? .75 : 0.85;

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
}

class CelluleFx {

    constructor(cellule) {
        this.cellule = cellule;
    }

    zoom(delay, zoom= {x: 1, y: 1, z: 1}) {
        gsap.to(this.cellule.mesh.scale, {
            duration: 1.75,
            x: zoom.x,
            y: zoom.y,
            z: zoom.z,
            delay: delay,
            ease: "elastic.inOut(1.5, 0.45)",
        });

        gsap.to(this.cellule.mesh.material.uniforms.uOpacity, {
            duration: 1.75,
            value: .85,
            delay: delay,
            ease: "elastic.inOut(1.5, 0.45)",
            onComplete: () => {
                this.cellule.isAnimate = false;
            }
        });
    }

}
