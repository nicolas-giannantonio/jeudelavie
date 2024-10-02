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
    timeIsAlive = 0;

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


        this.ambiantLight = new THREE.Color("#dddddd")
        this.diffuseLight = new THREE.Color("#e8e8e8")
        this.specularLight = new THREE.Color("white")


        this.material = new THREE.ShaderMaterial({
            vertexShader: VertexShader,
            fragmentShader: FragmentShader,
            uniforms:
                {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color("white")},
                    uOpacity: { value: 1.0 },
                    uLightPosition: { value: new THREE.Vector3(-4, -1, 2.5)},
                    uCameraPosition: { value: new THREE.Vector3(0, 0, 35)},
                    uAmbientLightColor: { value: this.ambiantLight},
                    uDiffuseLight: { value: this.diffuseLight},
                    uSpecularLight: { value: this.specularLight},
                    uShininess: { value: 50. },
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
        if(!this.isAnimate) this.material.uniforms.uOpacity.value = this.isAlive ? 1.0 : 0.9;
        if(!this.isAnimate) this.material.uniforms.uColor.value = this.isAlive ? new THREE.Color("#c3eac5") : new THREE.Color("white");

        if (this.nextState !== undefined) {
            this.isAlive = this.nextState;
        }

        if (this.isAlive) {
            this.timeIsAlive += 0.005;
            this.mesh.scale.z += this.timeIsAlive;
            this.mesh.position.z += this.timeIsAlive * 0.5;
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
            duration: 2.25,
            x: zoom.x,
            y: zoom.y,
            z: zoom.z,
            delay: delay,
            ease: "elastic.inOut(1.5, 0.45)",
        });

        gsap.to(this.cellule.mesh.material.uniforms.uOpacity, {
            duration: 2.75,
            value: .75,
            delay: delay,
            ease: "expo.inOut",
        });
    }

    gradient(delay) {
        gsap.to(this.cellule.mesh.material.uniforms.uOpacity, {
            duration: 1.25,
            value: .9,
            delay: delay + 1.5,
            ease: "expo.inOut",
            onComplete: () => {
                this.cellule.isAnimate = false;
            }
        });
    }

}
