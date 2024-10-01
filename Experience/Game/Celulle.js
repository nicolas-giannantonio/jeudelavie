import * as THREE from "three";
import VertexShader from "../shaders/vertex.glsl";
import FragmentShader from "../shaders/fragment.glsl";
import {Binder} from "../Utils/Shorcuts.js";

export default class Celulle {
    position; //x, y, z
    size;
    experience;
    id;

    constructor() {
        Binder(this, ["update", "getNeighboursPositions"]);
        this.size = {
            height: 1,
            width: 1,
        }

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
        this.mesh.name = "cellule";
        this.id = this.mesh.id;
        this.move(position);

        this.experience.time.on("tick", this.update);
    }


    move(position) {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.position = this.mesh.position;
    }

    update() {

    }

    getNeighboursPositions() {
        console.log(this.experience.world.grid)
    }

    resize() {
        console.log("cellule resize")

    }

}