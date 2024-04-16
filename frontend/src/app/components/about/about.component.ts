import { Component, ViewChild, inject } from '@angular/core';
import kaboom from 'kaboom';
import * as Utils from '../utils.js'
import { Router } from '@angular/router';



@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  @ViewChild('map') mapElement: any;
  map!: google.maps.Map

  scaleFactor = 4
  private router = inject(Router)
  mapHidden = true

  ngAfterViewInit(): void {
    const mapProperties = {
      center: new google.maps.LatLng(1.292321038097562, 103.7765463514608),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(1.2923210380975625, 103.7765463514608),
      map: this.map,
    });

    //Kaboom
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    const k = kaboom({
      global: false,
      touchToMouse: true,
      canvas: canvas,
      debug: true, // set to false once ready for production
    });
    

    k.loadSprite("spritesheet", "/assets/kaboom/spritesheet.png", {
      sliceX: 39,
      sliceY: 31,
      anims: {
        "idle-down": 960,
        "walk-down": { from: 960, to: 963, loop: true, speed: 8 },
        "idle-side": 999,
        "walk-side": { from: 999, to: 1002, loop: true, speed: 8 },
        "idle-up": 1038,
        "walk-up": { from: 1038, to: 1041, loop: true, speed: 8 }, 
      }
    })

    k.loadSprite("map", "/assets/kaboom/map.png")
    k.setBackground(k.Color.fromHex("#311047"))

    k.scene("main", async() => {
      const mapData = await (await fetch("/assets/kaboom/map.json")).json()
      const layers = mapData.layers

      const map = k.add([k.sprite("map"),k.pos(0),k.scale(this.scaleFactor)])

      const player = k.make([
        k.sprite("spritesheet", {anim: "idle-down"}), 
        k.area({shape: new k.Rect(k.vec2(0,3), 10, 10)}),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(this.scaleFactor),
        {
          speed: 250,
          direction: "down",
          isInDialogue: false
        },
        "player",
      ])

      for(const layer of layers){
        if(layer.name === "boundaries"){
          for(const boundary of layer.objects){
            map.add([
              k.area({
                shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
              }),
              k.body({ isStatic: true }),
              k.pos(boundary.x, boundary.y),
              boundary.name,
            ])

            if(boundary.name){
              player.onCollide(boundary.name, () => {
                player.isInDialogue = true
                this.displayDialogue(Utils.dialogueData[boundary.name as keyof typeof Utils.dialogueData], () => (player.isInDialogue = false))
              })
            }
          }
          continue
        }

        if (layer.name === "spawnpoints") {
          for (const entity of layer.objects) {
            if (entity.name === "player") {
              player.pos = k.vec2(
                (map.pos.x + entity.x) * this.scaleFactor,
                (map.pos.y + entity.y) * this.scaleFactor
              );
              k.add(player);
              continue;
            }
          }
        }
      }

      // Utils.setCamScale(k)

      k.onResize(() => {
        this.setCamScale(k)
      })

      k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y + 100)
      })

      k.onMouseDown((mouseBtn) => {
        if(mouseBtn !== "left" || player.isInDialogue) return;
        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if (
          mouseAngle > lowerBound &&
          mouseAngle < upperBound &&
          player.curAnim() !== "walk-up"
        ) {
          player.play("walk-up");
          player.direction = "up";
          return;
        }

        if (
          mouseAngle < -lowerBound &&
          mouseAngle > -upperBound &&
          player.curAnim() !== "walk-down"
        ) {
          player.play("walk-down");
          player.direction = "down";
          return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
          player.flipX = false;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "right";
          return;
        }
    
        if (Math.abs(mouseAngle) < lowerBound) {
          player.flipX = true;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "left";
          return;
        }
      })
    })

    k.go("main")
  }

  displayDialogue(text : string, onDisplayEnd : any) {
    const dialogueUI = document.getElementById("textbox-container")
    const dialogue = document.getElementById("dialogue")

    if(dialogueUI){
      dialogueUI.style.display = "block"
    }
    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        if(dialogue){
          dialogue.innerHTML = currentText;
        }
        index++;
        return;
      }
  
      clearInterval(intervalRef);
    }, 1);
  
    const closeBtn = document.getElementById("close");
  
    function onCloseBtnClick() {
      onDisplayEnd();
      if(dialogueUI){
        dialogueUI.style.display = "none";
      }
      if(dialogue){
        dialogue.innerHTML = "";
      }
      clearInterval(intervalRef);
      closeBtn?.removeEventListener("click", onCloseBtnClick);
    }
  
    closeBtn?.addEventListener("click", onCloseBtnClick);
  
    addEventListener("keypress", (key) => {
      if (key.code === "Enter") {
        closeBtn?.click();
      }
    });
  }

  setCamScale(k: any) {
    const resizeFactor = k.width() / k.height();
    if (resizeFactor < 1) {
      k.camScale(k.vec2(1));
    } else {
      k.camScale(k.vec2(1.5));
    }
  }


}



