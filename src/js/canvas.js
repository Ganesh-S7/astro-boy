import gsap from 'gsap'

import {
 isOnTopOfPlatform,
 collisionTop, 
 isOnTopOfPlatformCircle, 
 createImage, 
 createImageAsync,
 hitBottomOfPlatform,
 hitSideOfPlatform,
 objectTouch
  } from './utils.js'

import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'
import block from '../img/block.png'
import blockTri from '../img/blockTri.png'


import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'
import spritejumpLeft from '../img/spritejumpLeft.png'
import spritejumpRight from '../img/spritejumpRight.png'
import spriteFireFlower from '../img/spriteFireFlower.png'
import flagPoleSprite from '../img/flagPole.png'


import spriteFireFlowerRunLeft from '../img/spriteFireFlowerRunLeft.png'
import spriteFireFlowerRunRight from '../img/spriteFireFlowerRunRight.png'
import spriteFireFlowerStandLeft from '../img/spriteFireFlowerStandLeft.png'
import spriteFireFlowerStandRight from '../img/spriteFireFlowerStandRight.png'
import spriteFireFlowerjumpLeft from '../img/spriteFireFlowerjumpLeft.png'
import spriteFireFlowerjumpRight from '../img/spriteFireFlowerjumpRight.png'
import spriteFireFlowerShootRight from '../img/spriteFireFlowerShootRight.png'
import spriteFireFlowerShootLeft from '../img/spriteFireFlowerShootLeft.png'
import spriteslideRight from '../img/spriteslideRight.png'
import spriteFireFlowerslideRight from '../img/spriteFireFlowerslideRight.png'

import spriteGoomba from '../img/spriteGoomba.png'


import {audio} from  './audio.js'

import {images} from  './images.js'

const canvas = document.querySelector('canvas')
const c=canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

let gravity = 1.5

class Player {
  constructor() {
    this.shooting = false
    this.speed = 10
    this.position = {
    x: 100,
    y: 100
  }
  this.velocity = {
    x: 0,
    y: 0
  }

  this.width = 66
  this.height = 150

  this.image = createImage(spriteStandRight)
  this.frames = 0
  this.sprites = {
    stand: {
      right: createImage(spriteStandRight),
      left: createImage(spriteStandLeft),
      fireFlower: {
      right: createImage(spriteFireFlowerStandRight),
      left: createImage(spriteFireFlowerStandLeft),
      },
      CropWidth: 177,
      width: 66
    },

    run: {
      right: createImage(spriteRunRight),
      left: createImage(spriteRunLeft),
      fireFlower: {
      right: createImage(spriteFireFlowerRunRight),
      left: createImage(spriteFireFlowerRunLeft),
      },
      CropWidth: 341,
      width: 127.875
    },

    jump: {
      right: createImage(spritejumpRight),
      left: createImage(spritejumpLeft),
      fireFlower: {
      right: createImage(spriteFireFlowerjumpRight),
      left: createImage(spriteFireFlowerjumpLeft),
      },
      CropWidth: 341,
      width: 127.875
    },

    shoot: { 
      right: createImage(spriteFireFlowerShootRight),
      left: createImage(spriteFireFlowerShootLeft),
      CropWidth: 330,
      width: 127.875
      },

    slide: {
        right : createImage(spriteslideRight),
        fireFlower: {
          right: createImage(spriteFireFlowerslideRight)
        },
        CropWidth: 330,
        width: 127.875
      }
   }

   this.currentSprite = this.sprites.stand.right
   this.currentCropWidth = 177
   this.powerUps ={
    fireFlower: false
   }
   this.invincible = false
   this.opacity = 1
  }

  draw(){
   /* c.fillStyle = 'rgba(255,0,0,.2)'
     c.fillRect(this.position.x, this.position.y, this.width, this.height) */
    c.save()
    c.globalAlpha = this.opacity
        c.drawImage(
          this.currentSprite,
          this.currentCropWidth * this.frames,
          0,
          this.currentCropWidth,
          400,
          this.position.x,
          this.position.y,
          this.width,
          this.height
          )
        c.restore()
      }

  update() {
    this.frames++
    const { currentSprite,sprites} = this
    if( this.frames > 59 && (currentSprite === sprites.stand.right || currentSprite === sprites.stand.left || currentSprite === sprites.stand.fireFlower.right || currentSprite === sprites.stand.fireFlower.left)) 
      this.frames = 0
    else if (this.frames > 29 && (currentSprite === sprites.run.right || currentSprite === sprites.run.left || currentSprite === sprites.run.fireFlower.right || currentSprite === sprites.run.fireFlower.left))
      this.frames = 0
    else if (currentSprite === sprites.jump.right || currentSprite === sprites.jump.left || currentSprite === sprites.jump.fireFlower.right || currentSprite === sprites.jump.fireFlower.left || currentSprite === sprites.shoot.right || currentSprite === sprites.shoot.left || currentSprite === sprites.slide.right || currentSprite === sprites.slide.fireFlower.right)
      this.frames = 0
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if(this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity

     if( this.invincible){
      if(this.opacity === 1) this.opacity = 0
        else this.opacity = 1
      } else this.opacity = 1
   }
}



class Platform {
  constructor({x , y, image, block,text}) {
    this.position = {
      x,
      y
    }

    this.velocity = {
      x:0
    }

    this.image = image
    this.width = image.width
    this.height = image.height
    this.block = block
    this.text = text
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)

    if(this.text){
    c.fillStyle = 'yellow'
    c.fillText(this.text,this.position.x, this.position.y)
   }
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
  }
}



class GenericObject {
  constructor({x , y, image}) {
    this.position = {
      x,
      y
    }

    this.velocity = {
      x:0
    }

    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {

    c.drawImage(this.image, this.position.x, this.position.y)
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
  }
}



class Goomba {
  constructor({
    position, 
    velocity, 
    distance = {
    limit: 50,
    traveled: 0
    }
    }) {
    this.position = {
      x: position.x,
      y: position.y
    }

    this.velocity = { 
      x: velocity.x,
      y: velocity.y
    }

    this.width = 43.33
    this.height = 50
    this.image = createImage(spriteGoomba)
    this.frames = 0

    this.distance = distance
  }

  draw() {
    //c.fillStyle = 'red'
    //c.fillRect(this.position.x,this.position.y,this.width,this.height)
  
        c.drawImage(
          this.image,
          130 * this.frames,
          0,
          130,
          150,
          this.position.x,
          this.position.y,
          this.width,
          this.height
          )
      }
  
  update() {
    this.frames ++
    if ( this.frames >= 58) this. frames = 0
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if(this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity

    //walk goomba back and front
    this.distance.traveled += Math.abs(this.velocity.x )
    if( this.distance.traveled > this.distance.limit){
      this.distance.traveled = 0
      this.velocity.x = -this.velocity.x
    }
  }
}


class FireFlower {
  constructor({position, velocity }) {
    this.position = {
      x: position.x,
      y: position.y
    }

    this.velocity = { 
      x: velocity.x,
      y: velocity.y
    }

    this.width = 56
    this.height = 60

    this.image = createImage(spriteFireFlower)
    this.frames = 0
  }

  draw() {  
        c.drawImage(
          this.image,
          56 * this.frames,
          0,
          56,
          60,
          this.position.x,
          this.position.y,
          this.width,
          this.height
          )
      }
  
  update() {
    this.frames ++
    if ( this.frames >= 75) this. frames = 0
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if(this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity

    
  }
}

class Particle {
  constructor({position,velocity,radius, color = '#654428',fireball = false,fades = false}) {
    this.position ={
      x: position.x,
      y: position.y
    }

    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }
    this.radius = radius
    this.ttl = 300
    this.color = color
    this.fireball= fireball
    this.opacity = 1
    this.fades = fades
  }
  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2,false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }
  update(){
  this.ttl--
  this.draw()
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y



  if(this.position.y + this.radius + this.velocity.y <= canvas.height)
      this.velocity.y += gravity * 0.4

    if(this.fades && this.opacity > 0 ){      
      this.opacity -= 0.01
    }

    if(this.opacity < 0)
      this.opacity = 0
 }
}



let platformImage
let platformSmallTallImage 
let blockTriImage 
let blockImage

let player = new Player()
let platforms = []
let genericObjects = []
let goombas = []
let particles = []
let fireFlowers = []

let lastKey
let keys 

let scrollOffset 

let flagPole 
let flagPoleImage
let game 
let currentLevel = 1

function selectLevel(currentLevel){
  if(!audio.musicLevel1.playing())
    audio.musicLevel1.play()
  switch(currentLevel){
  case 1:
    init()
    break
  case 2:
    initLevel2()
    break
  }
}
async function init() {

  player = new Player()
  keys = {
    right: {
      pressed: false
  },
    left: {
      pressed: false
  }
}

scrollOffset = 0

  game = {
  disableUserInput: false
}

 platformImage = await createImageAsync(platform)
 platformSmallTallImage  = await createImageAsync(platformSmallTall)
 blockTriImage  = await createImageAsync(blockTri)
 blockImage  = await createImageAsync(block)
 flagPoleImage  = await createImageAsync(flagPoleSprite)


 flagPole = new GenericObject({
  x:9850,
  //x:500,
  y:canvas.height-platformImage.height-flagPoleImage.height+20,
  image:flagPoleImage

})

fireFlowers = [
  new FireFlower
({
  position:{ x: 400, y: 100}, 
  velocity:{x:0, y: 0} 
})
]

 player = new Player()

goombas = [
  new Goomba({
    position:{
      x: 800,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 200,
      traveled: 0
    }
  }),
  new Goomba({
    position:{
      x: 1350,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 1400,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 1450,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 2100,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 2500,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 200,
      traveled: 0
    }
  }),
  new Goomba({
    position:{
      x: 2550,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 200,
      traveled: 0
    }
  }),
  new Goomba({
    position:{
      x: 4800,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 4850,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 4900,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 4950,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 5000,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 6970,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 6920,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  }),
  new Goomba({
    position:{
      x: 6870,
      y: 100
    },
    velocity: {
      x: -0.3,
      y: 0
    }
  })
  
  
  
  
  
  
  
  
  
  
  
  
  ]

particles = []

 //Platform placing
 platforms = [
  new Platform({
    x: platformImage.width * 4 + 300-2 + platformImage.width - platformSmallTallImage.width, 
    y: 270, 
    image: createImage(platformSmallTall)
  }),
  new Platform({
    x: platformImage.width * 6 + 700-2 + platformImage.width - platformSmallTallImage.width, 
    y: 270, 
    image: createImage(platformSmallTall)
  }),
  
  new Platform({
    x: platformImage.width * 10 + 900-2 + platformImage.width - platformSmallTallImage.width, 
    y: 270, 
    image: createImage(platformSmallTall)
  }),
  new Platform({
    x: platformImage.width * 10 + 1185-2 + platformImage.width - platformSmallTallImage.width, 
    y: 270, 
    image: createImage(platformSmallTall)
  }),
  new Platform({
    x: platformImage.width * 10 + 1400-2 + platformImage.width - platformSmallTallImage.width, 
    y: 270, 
    image: createImage(platformSmallTall)
  }),
  
  new Platform({
    x: platformImage.width * 7 + 700-2 + platformImage.width - platformSmallTallImage.width, 
    y: 270, 
    image: createImage(platformSmallTall)
  }),

  
  
  
  new Platform({
    x: -1, 
    y: 470, 
    text:'1',
    image: platformImage}), 
  new Platform({
    x: platformImage.width -3, 
    y: 470, 
    text:'2',
    image: platformImage}),
  new Platform({
    x: platformImage.width * 2 + 100, 
    y: 470,
    image: platformImage,
    text: '3',
    block:true,
  }),
  new Platform({
    x: platformImage.width * 3 + 300, 
    y: 470, 
    text:'4',
    block:true,
    image: platformImage}),
  new Platform({
    x: platformImage.width * 4 + 300-3, 
    y: 470, 
    text:'5',
    image: platformImage}),
  new Platform({
    x: platformImage.width * 6 + 700-3, 
    y: 470, 
    image: platformImage,
    text:'6',
    block:true,
  }),
  new Platform({
    x: platformImage.width * 7 + 700-3, 
    y: 470, 
    text:'7',
    image: platformImage}),
  new Platform({
    x: platformImage.width * 8 + 700-3, 
    y: 470, 
    text:'8',
    image: platformImage}),
  new Platform({
    x: platformImage.width * 10 + 1000-3, 
    y: 470, 
    text:'9',
    image: platformImage}),
  new Platform({
    x: platformImage.width * 11 + 1000-3, 
    y: 470, 
    text:'10',
    image: platformImage}),
  new Platform({
    x: platformImage.width * 12 + 1500-4, 
    y: 470, 
    text:'11',
    image: platformImage}),
  new Platform({
    x: platformImage.width * 13 + 1500-5, 
    y: 470, 
    text:'12',
    image: platformImage}),
  new Platform({
    x: platformImage.width * 14 + 1500-5, 
    y: 470,
    text:'13', 
    image: platformImage}),
  new Platform({
    x: platformImage.width * 15 + 1500-5, 
    y: 470,
    text:'14', 
    image: platformImage}),
  



  new Platform({
    x: 830, 
    y: 260, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 2500, 
    y: 260, 
    image: blockTriImage,
    block: true 
  }),


  new Platform({
    x: 1800, 
    y: 260, 
    image: blockImage,
    block: true 
  }),

  new Platform({
    x: 3350, 
    y: 250, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 3750, 
    y: 200, 
    image: blockTriImage,
    block: true 
  }),


  new Platform({
    x: 6100, 
    y: 260, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 6300, 
    y: 230, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 6500, 
    y: 220, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 6700, 
    y: 230, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 4700, 
    y: 220, 
    image: blockImage,
    block: true 
  }),

  new Platform({
    x: 8200, 
    y: 280, 
    image: blockImage,
    block: true 
  }),


  new Platform({
    x: 9210+50, 
    y: 420, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9310, 
    y: 420, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9460, 
    y: 420, 
    image: blockTriImage,
    block: true 
  }),

  new Platform({
    x: 9260+50, 
    y: 370, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9310, 
    y: 370, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9460, 
    y: 370, 
    image: blockTriImage,
    block: true 

  }),

  new Platform({
    x: 9310+50, 
    y: 320, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9460, 
    y: 320, 
    image: blockTriImage,
    block: true 
  }),

  new Platform({
    x: 9360+50, 
    y: 270, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9460, 
    y: 270, 
    image: blockTriImage,
    block: true 
  }),

  new Platform({
    x: 9460, 
    y: 220, 
    image: blockTriImage,
    block: true 
  }),
  

  new Platform({
    x: 9460+50, 
    y: 220-50, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 9460+100, 
    y: 220-50, 
    image: blockImage,
    block: true 
  }),


  
  
  ]

 genericObjects = [ 
  new GenericObject({
  x: -1,
  y: -1, 
  image: createImage(background)
}),
  new GenericObject({
  x: -1,
  y: -1, 
  image: createImage(hills)
})
]
scrollOffset = 0
}


//level2
async function initLevel2() {

  player = new Player()
  keys = {
    right: {
      pressed: false
  },
    left: {
      pressed: false
  }
}

scrollOffset = 0

  game = {
  disableUserInput: false
}

 platformImage = await createImageAsync(images.levels[2].Platform)
 blockTriImage  = await createImageAsync(blockTri)
 blockImage  = await createImageAsync(block)
 flagPoleImage  = await createImageAsync(flagPoleSprite)
 const mountains  = await createImageAsync(images.levels[2].mountains)


 flagPole = new GenericObject({
  x:9850,
  //x:500,
  y:canvas.height-platformImage.height-flagPoleImage.height+5,
  image:flagPoleImage

})

fireFlowers = [
  new FireFlower
({
  position:{ x: 400, y: 100}, 
  velocity:{x:0, y: 0} 
}),
new FireFlower
({
  position:{ x: 6600-2, y: 100}, 
  velocity:{x:0, y: 0} 
})

  
]

 player = new Player()

goombas = [
  new Goomba({
    position:{
      x: 800,
      y: 100
    },
    velocity: {
      x: 1.4,
      y: 0
    },
    distance: {
      limit: 55,
      traveled: 0
    }

  }),

  new Goomba({
    position:{
      x: 1600,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }
 }),

  new Goomba({
    position:{
      x: 1650,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
  new Goomba({
    position:{
      x: 1700,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
  new Goomba({
    position:{
      x: 2200,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
  new Goomba({
    position:{
      x: 2250,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
  new Goomba({
    position:{
      x: 2300,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
  new Goomba({
    position:{
      x: 3750,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 50,
      traveled: 0
    }

  }),

new Goomba({
    position:{
      x: 4000-2,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
new Goomba({
    position:{
      x: 4050-2,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
new Goomba({
    position:{
      x: 4100-2,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }
 }),

new Goomba({
    position:{
      x: 4720,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 100,
      traveled: 0
    }
  }),
new Goomba({
    position:{
      x: 4770,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 100,
      traveled: 0
    }
  }),
new Goomba({
    position:{
      x: 6500,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
new Goomba({
    position:{
      x: 6550,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }

  }),
new Goomba({
    position:{
      x: 6600,
      y: 100
    },
    velocity: {
      x: 1.2,
      y: 0
    },
    distance: {
      limit: 250,
      traveled: 0
    }
 }),
new Goomba({
    position:{
      x: 7950,
      y: 100
    },
    velocity: {
      x: 0.5,
      y: 0
    },
    distance: {
      limit: 50,
      traveled: 0
    }
 }),
new Goomba({
    position:{
      x: 7250,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    distance: {
      limit: 0,
      traveled: 0
    }
 }),



new Goomba({
    position:{
      x: 7450,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    distance: {
      limit: 0,
      traveled: 0
    }
 }),

new Goomba({
    position:{
      x: 8280,
      y: 100
    },
    velocity: {
      x: 0.5,
      y: 0
    },
    distance: {
      limit: 20,
      traveled: 0
    }
 }),

new Goomba({
    position:{
      x: 8330,
      y: 100
    },
    velocity: {
      x: 0.5,
      y: 0
    },
    distance: {
      limit: 20,
      traveled: 0
    }
 }),

  
  ]

particles = []

 //Platform placing
 platforms = [
new Platform({
    x: -1, 
    y: 470, 
    text:'1',
    image: platformImage}),
new Platform({
    x:platformImage.width -3, 
    y: 470,
    image: platformImage,
    text: '2',
    block:true,
  }),
new Platform({
    x: platformImage.width * 2 + 370, 
    y: 470,
    image: platformImage,
    text: '3',
    block:true,
  }),
new Platform({
    x: platformImage.width * 3 + 370-2, 
    y: 470, 
    text:'4',
    block:true,
    image: platformImage}),
new Platform({
    x: platformImage.width * 4 + 370-3, 
    y: 470, 
    text:'5',
    block:true,
    image: platformImage}),

//layer1
new Platform({
    x: platformImage.width * 4 + 370-3, 
    y: 430, 
    text:'5',
    block:true,
    image: platformImage}),
new Platform({
    x: platformImage.width * 4 + 370-3, 
    y: 390, 
    text:'5',
    block:true,
    image: platformImage}),
new Platform({
    x: platformImage.width * 4 + 370-3, 
    y: 350, 
    text:'5',
    block:true,
    image: platformImage}),
//

new Platform({
    x: platformImage.width * 5 + 1750, 
    y: 470, 
    text:'6',
    block:true,
    image: platformImage}),
new Platform({
    x: platformImage.width * 6 + 1750-3, 
    y: 470, 
    text:'7',
    block:true,
    image: platformImage}),

//layer2
new Platform({
    x: platformImage.width * 6 + 1750-3, 
    y: 430, 
    text:'7',
    block:true,
    image: platformImage}),
new Platform({
    x: platformImage.width * 6 + 1750-3, 
    y: 390, 
    text:'7',
    block:true,
    image: platformImage}),
new Platform({
    x: platformImage.width * 6 + 1750-3, 
    y: 350, 
    text:'7',
    block:true,
    image: platformImage}),
//

new Platform({
    x: 6000, 
    y: 470, 
    text:'8',
    block:true,
    image: platformImage}),
new Platform({
    x: 6000 + 450, 
    y: 470, 
    text:'9',
    block:true,
    image: platformImage}),

//layer3
new Platform({
    x: 6000, 
    y: 430, 
    text:'8',
    block:true,
    image: platformImage}),
new Platform({
    x: 6000, 
    y: 390, 
    text:'8',
    block:true,
    image: platformImage}),
new Platform({
    x: 6000, 
    y: 350, 
    text:'8',
    block:true,
    image: platformImage}),
//

new Platform({
    x: 8500, 
    y: 470, 
    text:'10',
    block:true,
    image: platformImage}),
new Platform({
    x: 8500 + 450, 
    y: 470, 
    text:'11',
    block:true,
    image: platformImage}),
new Platform({
    x: 8500 + 900, 
    y: 470, 
    text:'12',
    block:true,
    image: platformImage}),

new Platform({
    x: 8500 + 900 + 450, 
    y: 470, 
    text:'13',
    block:true,
    image: platformImage}),

new Platform({
    x: 8500 + 900 + 900, 
    y: 470, 
    text:'14',
    block:true,
    image: platformImage}),
//
new Platform({
    x: 1550, 
    y: 260, 
    image: blockTriImage,
    block: true 
  }),
new Platform({
    x: 2900, 
    y: 260, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 3300, 
    y: 210, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 3700, 
    y: 310, 
    image: blockTriImage,
    block: true 
  }),

  new Platform({
    x: 5100, 
    y: 300, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 5300, 
    y: 250, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 5500, 
    y: 310, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 5700, 
    y: 350, 
    image: blockImage,
    block: true 
  }),

  new Platform({
    x: 400, 
    y: 250, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 6600, 
    y: 250, 
    image: blockImage,
    block: true 
  }),

  new Platform({
    x: 7050, 
    y: 370, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 7250, 
    y: 320, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 7450, 
    y: 270, 
    image: blockImage,
    block: true 
  }),
new Platform({
    x: 7650, 
    y: 220, 
    image: blockImage,
    block: true 
  }),
new Platform({
    x: 7900, 
    y: 300, 
    image: blockTriImage,
    block: true 
  }),

new Platform({
    x: 8250, 
    y: 370, 
    image: blockTriImage,
    block: true 
  }),




  new Platform({
    x: 9210+50, 
    y: 420, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9310, 
    y: 420, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9460, 
    y: 420, 
    image: blockTriImage,
    block: true 
  }),


  new Platform({
    x: 9260+50, 
    y: 370, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9310, 
    y: 370, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9460, 
    y: 370, 
    image: blockTriImage,
    block: true 

  }),

  new Platform({
    x: 9310+50, 
    y: 320, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9460, 
    y: 320, 
    image: blockTriImage,
    block: true 
  }),


  new Platform({
    x: 9360+50, 
    y: 270, 
    image: blockTriImage,
    block: true 
  }),
  new Platform({
    x: 9460, 
    y: 270, 
    image: blockTriImage,
    block: true 
  }),

  new Platform({
    x: 9460, 
    y: 220, 
    image: blockTriImage,
    block: true 
  }),
  

  new Platform({
    x: 9460+50, 
    y: 220-50, 
    image: blockImage,
    block: true 
  }),
  new Platform({
    x: 9460+100, 
    y: 220-50, 
    image: blockImage,
    block: true 
  }),
 
  ]


 


 genericObjects = [ 
  new GenericObject({
  x: -1,
  y: -1, 
  image: createImage(images.levels[2].background)
}),
  new GenericObject({
  x: -1,
  y: canvas.height -mountains.height, 
  image: mountains
}),
  new GenericObject({
  x: 600,
  y: 100, 
  image: createImage(images.levels[2].sun)
})
]
scrollOffset = 0
}


//animation
function animate() {
 requestAnimationFrame(animate)
 c.fillStyle = 'white'
 c.fillRect(0, 0, canvas.width, canvas.height)

 genericObjects.forEach((genericObject) => {
  genericObject.update()
  genericObject.velocity.x = 0
 })


platforms.forEach((platform) => {
  platform.update()
  platform.velocity.x = 0

})

particles.forEach((particle,i) => {
  particle.update()
  if(particle.fireball && (particle.position.x - particle.radius >= canvas.width || particle.position.x + particle.radius <= 0))
setTimeout(() =>{


    particles.splice(i,1)
  },0)

})

if(flagPole){
  flagPole.update()
  flagPole.velocity.x = 0

//player touch flagpole
if( !game.disableUserInput && objectTouch({
    object1: player,
    object2: flagPole
  }))
{
  audio.completeLevel.play()
  audio.musicLevel1.stop()    
  game.disableUserInput = true
  player.velocity.x = 0
  player.velocity.y = 0
  gravity = 0

  player.currentSprite = player.sprites.slide.right

  if(player.powerUps.fireFlower)
    player.currentSprite = player.sprites.slide.fireFlower.right
  
  
  gsap.to(player.position, {
    y: canvas.height-platformImage.height-player.height+18,
    duration:1,

    //complete level 1
    onComplete() {
        player.currentSprite = player.sprites.run.right
        if(player.powerUps.fireFlower)
        player.currentSprite = player.sprites.run.fireFlower.right
       
    }
  })

  //flagpoll slide
  setTimeout(() => {
  audio.descend.play()
  },200)
  gsap.to(player.position, {
    delay:1,
    x: canvas.width,
    duration: 2,
    ease : 'power1.in'
  })

  //fireworks for win
const particleCount = 500
const radians = Math.PI * 2/ particleCount
const power = 8
let increment = 1

const intervalId = setInterval(()=>{

for(let i = 0; i < particleCount ; i++)
  {
    particles.push(new Particle({
      position:{
        x: canvas.width/4 * increment,
        y: canvas.height/2
      },
      velocity:{
        x: Math.cos(radians * i) * power * Math.random(),
        y: Math.sin(radians * i) * power * Math.random()
       },
      radius: 3 * Math.random(),
      color:`hsl(${Math.random() * 500},50%, 50%)`,
      fades :true
     })
    ) 
   }

   audio.fireworkBurst.play()
   audio.fireworkWhistle.play()   

   if(increment === 3 ) clearInterval(intervalId)
   increment++
  },1000)

//switch next level
setTimeout(() => {
  currentLevel++
  gravity = 1.5
selectLevel(currentLevel)
    },8000)
  }
}

//power up obtains
fireFlowers.forEach((fireFlower,i) => {
  if(objectTouch({
    object1: player,
    object2: fireFlower
  }))
    { 
      audio.obtainPowerUp.play()
      player.powerUps.fireFlower = true
      setTimeout(()=> {
        fireFlowers.splice(i,1)
      },0)

  } 
  else  fireFlower.update()
})

goombas.forEach((goomba, index) => {
  goomba.update()
  
     // remove goomba on fireball hit
    particles.forEach((particle, particleIndex) => {
      if (
        particle.fireball &&
        particle.position.x + particle.radius >= goomba.position.x &&
        particle.position.y + particle.radius >= goomba.position.y &&
        particle.position.x - particle.radius <=
          goomba.position.x + goomba.width &&
        particle.position.y - particle.radius <=
          goomba.position.y + goomba.height
      ) {
        for (let i = 0; i < 50; i++) {
          particles.push(
            new Particle({
              position: {
                x: goomba.position.x + goomba.width / 2,
                y: goomba.position.y + goomba.height / 2
              },
              velocity: {
                x: (Math.random() - 0.5) * 7,
                y: (Math.random() - 0.5) * 15
              },
              radius: Math.random() * 3
            })
          )
        }
        setTimeout(() => {
          goombas.splice(index, 1)
          particles.splice(particleIndex, 1)
        }, 0)
      }
    })

  //goomba stomp
  if ( collisionTop({
    object1: player,
    object2: goomba
  })) {
    audio.goombaSquash.play()

    for (let i = 0;i< 50; i++)
      {
        particles.push(new Particle({
          position :{
            x: goomba.position.x + goomba.width/2,
            y: goomba.position.y + goomba.width/2
          },
          velocity :{
            x: (Math.random() - 0.5 )* 7,
            y: (Math.random() - 0.5 )* 15
          },
          radius : Math.random() * 3
         })
        )
      }
    player.velocity.y -= 40
    setTimeout(() => {
      goombas.splice(index, 1)

      
    }, 0)
  } else if (
    player.position.x + player.width >= goomba.position.x && 
    player.position.y + player.height >= goomba.position.y && 
    player.position.x <= goomba.position.x + goomba.width
    )

  {
//player hit goomba

    if(player.powerUps.fireFlower){
      player.invincible = true
      player.powerUps.fireFlower = false
      audio.losePowerUp.play()

      setTimeout(() => {
        player.invincible = false
      },1000)
    }
  else if(!player.invincible)
  {
    audio.die.play()
  selectLevel(currentLevel)
    }
  }
})



player.update()

let hitSide = false

if(game.disableUserInput)
  return


// scrolling boundary .start
 if (keys.right.pressed && player.position.x < 400) {
  player.velocity.x = player.speed
 } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
  player.velocity.x = -player.speed
 } else {
  player.velocity.x = 0


// side scroll
  if (keys.right.pressed) {
    for (let i = 0; i< platforms.length;i++){
      const platform = platforms[i]
    platform.velocity.x = -player.speed

       if (platform.block && hitSideOfPlatform({
       object: player,
        platform
    })
    ) {
    platforms.forEach((platform) => {
    platform.velocity.x = 0
 })
    hitSide = true
    break
}
}



 
if (!hitSide){
      scrollOffset += player.speed

      flagPole.velocity.x = -player.speed

    genericObjects.forEach((genericObject) => {
      genericObject.velocity.x = -player.speed * 0.66
    })
    goombas.forEach((goomba) => {
    goomba.position.x -= player.speed
})
     fireFlowers.forEach((fireFlower) => {
    fireFlower.position.x -= player.speed
})
    particles.forEach((particle) => {
    particle.position.x -= player.speed
})
  }
  } else if ( keys.left.pressed && scrollOffset > 0){

    for (let i = 0; i< platforms.length;i++){
      const platform = platforms[i]
    platform.velocity.x = player.speed

    if (platform.block && hitSideOfPlatform({
       object: player,
        platform
    })
    ) {
    platforms.forEach((platform) => {
    platform.velocity.x = 0
 })
    hitSide = true
    break
  }
}

    if(!hitSide){
          scrollOffset -= player.speed 

    flagPole.velocity.x = player.speed


    genericObjects.forEach((genericObject) => {
      genericObject.velocity.x = player.speed * 0.66
    })
    goombas.forEach((goomba) => {
    goomba.position.x += player.speed

})
    particles.forEach((particle) => {
    particle.position.x += player.speed
})
        fireFlowers.forEach((fireFlower) => {
    fireFlower.position.x += player.speed
})
    }
  }
}



//platform collision detection
platforms.forEach((platform) => {
 if (
  isOnTopOfPlatform({
    object: player,
    platform
 })
) {
  player.velocity.y = 0
 }


if (platform.block &&  hitBottomOfPlatform( { 
object: player,
platform
})) {
  player.velocity.y = -player.velocity.y
}


if (platform.block && hitSideOfPlatform({
  object: player,
  platform
})) {
  player.velocity.x = 0
}

//particles bounce
 particles.forEach((particle, index) => {
 if (
  isOnTopOfPlatformCircle({
    object: particle,
       platform
      })
    ) {
  const bounce = 0.9
     particle.velocity.y = -particle.velocity.y * 0.99


   if ( particle.radius - 0.4 < 0 ) 
    particles.splice(index, 1)
    else
   particle.radius -= 0.4
     }
if ( particle.ttl < 0)
    particles.splice(index, 1)

})


goombas.forEach((goomba) => {
 if (
  isOnTopOfPlatform({
    object: goomba,
       platform
      })
    ) {
     goomba.velocity.y = 0
     }
  })

fireFlowers.forEach((fireFlowers) => {
 if (
  isOnTopOfPlatform({
    object: fireFlowers,
       platform
      })
    ) {
     fireFlowers.velocity.y = 0
     }
  })

})



//win condition
      if(platformImage && scrollOffset > platformImage.width * 13 + 1500-4){
        console.log('you win')
      }

//lose condition
      if(player.position.y >= canvas.height){
        audio.die.play()
      selectLevel(currentLevel)
  }



if(player.shooting) {
  player.currentSprite = player.sprites.shoot.right
  player.currentCropWidth = player.sprites.shoot.CropWidth
  player.width = player.sprites.shoot.width

if(lastKey === 'left')
  player.currentSprite = player.sprites.shoot.left
  player.currentCropWidth = player.sprites.shoot.CropWidth
  player.width = player.sprites.shoot.width

  return
}

//sprite switching & jump
if(player.velocity.y !== 0) return

      if (
        keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right
        ) {  
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.CropWidth
        player.width = player.sprites.run.width
      }else if (
        keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left
      ) {
      player.currentSprite = player.sprites.run.left
      player.currentCropWidth = player.sprites.run.CropWidth
      player.width = player.sprites.run.width
      } else if (
      !keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left
      ) {
      player.currentSprite = player.sprites.stand.left
      player.currentCropWidth = player.sprites.stand.CropWidth
      player.width = player.sprites.stand.width
      }
      else if (
      !keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right
      ) {
      player.currentSprite = player.sprites.stand.right
      player.currentCropWidth = player.sprites.stand.CropWidth
      player.width = player.sprites.stand.width
      }
      

//fireflower sprites switching

      if(!player.powerUps.fireFlower) return
    
    if (
        keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.fireFlower.right
        ) {  
        player.currentSprite = player.sprites.run.fireFlower.right
      }else if (
        keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.fireFlower.left
      ) {
      player.currentSprite = player.sprites.run.fireFlower.left
      } else if (
      !keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.fireFlower.left
      ) {
      player.currentSprite = player.sprites.stand.fireFlower.left
      }
      else if (
      !keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.fireFlower.right
      ) {
      player.currentSprite = player.sprites.stand.fireFlower.right
      }
}

//end animation loop

selectLevel(currentLevel)
//initLevel2()

animate()

addEventListener('keydown', ({ keyCode }) => {
  //console.log(keyCode)
  if(game.disableUserInput)
    return
  switch (keyCode) {
  case 65:
    console.log('left')
    keys.left.pressed = true
    lastKey = 'left'
    break

  case 83:
    console.log('down')
    break

  case 68:
    console.log('right')
    keys.right.pressed = true
    lastKey = 'right'
    break

  case 87:
    console.log('up')
    if(player.velocity.y === 0)
    player.velocity.y -= 25
    audio.jump.play()
    if(lastKey === 'left') {
  player.currentSprite = player.sprites.jump.left
  player.currentCropWidth = player.sprites.jump.CropWidth
  player.width = player.sprites.jump.width
  }
    else {
  player.currentSprite = player.sprites.jump.right
  player.currentCropWidth = player.sprites.jump.CropWidth
  player.width = player.sprites.jump.width
  }

  if(!player.powerUps.fireFlower)
    break

    if(lastKey === 'left') 
    player.currentSprite = player.sprites.jump.fireFlower.left
  else
    player.currentSprite = player.sprites.jump.fireFlower.right
   break
  
case 32:
  console.log('space')

  if(!player.powerUps.fireFlower) return

 audio.fireFlowerShot.play()
  player.shooting = true

setTimeout(() => {
  player.shooting = false
}, 150)


  let velocity = 15
  if(lastKey === 'left') velocity = - velocity

  
  particles.push(new Particle({
    position:{
      x:player.position.x+player.width,
      y:player.position.y+ player.height * 0.65
    },
    velocity:{
      x:velocity,
      y:0
    },
    radius:5,
    color:'blue',
    fireball:true
  }))

}
})

addEventListener('keyup', ({ keyCode }) => {
  //console.log(keyCode)

   if(game.disableUserInput)
    return
  switch (keyCode){
  case 65:
    console.log('left')
    keys.left.pressed = false
    break

  case 83:
    console.log('down')
    break

  case 68:
    console.log('right')
    keys.right.pressed = false
    break

  case 87:
    console.log('up')
    break
  }
})
