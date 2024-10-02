import {Binder} from "./Shorcuts.js";
import * as THREE from "three";

export default class Ray {
    isClicked;

    constructor(experience) {
        Binder(this, ["click"]);
        this.experience = experience;

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        window.addEventListener( 'click', this.click);
    }

    click(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        const intersects = this.raycaster.intersectObjects(this.scene.children );

        for ( let i = 0; i < intersects.length; i ++ ) {
            if(intersects[i].object.name === "cellule" && !this.isClicked) {
                const celluleClicked = intersects[i].object;

                this.experience.world.actionAll((x, y) => {
                    const cellule = this.experience.world.grid[x][y];

                    cellule.celluleFx.position(x * 0.015 + y * 0.015, {
                        x: 0,
                        y: 0,
                        z: 0
                    });

                    cellule.celluleFx.zoom(x * 0.015 + y * 0.015 + .5, {
                        x: 1.5,
                        y: 1.5,
                        z: 1.5
                    });
                })
            }
        }
        this.isClicked = true;

    }

    render(instance, scene, camera) {
        this.raycaster.setFromCamera(this.pointer, camera);
        this.scene = scene;
    }

}