import {Binder} from "./Shorcuts.js";
import * as THREE from "three";

export default class Ray {
    cliked = false;

    constructor() {
        Binder(this, ["move"]);

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        window.addEventListener( 'click', this.move);
    }

    move(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        const intersects = this.raycaster.intersectObjects(this.scene.children );

        for ( let i = 0; i < intersects.length; i ++ ) {
            if(intersects[i].object.name === "cellule") {
                // console.log("Click on cellule", intersects[i].object);
                const celluleClicked = intersects[i].object;
                celluleClicked.material.color.set( "darkgrey" );
                this.cliked = true;
                console.log(celluleClicked.position)
            }
        }

        this.cliked = false
    }

    render(instance, scene, camera) {
        this.raycaster.setFromCamera(this.pointer, camera);
        this.scene = scene;
    }

}