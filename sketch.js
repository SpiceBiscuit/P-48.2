var level = 1;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var man, man_running, man_jumping, man_collided;
var ground, invisibleGround, groundImage, floatGround;
var floatImg, floatGroundImg

var obstaclesGroup, hurdleImg, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var floatGroup

var score=0;

var gameOver, restart, restartImg;


function preload(){
  restartImg = loadImage("Images/restart.png");
  hurdleImg = loadImage("Images/Hurdle1.png");
  floatImg = loadImage("Images/blah2.png")
  man_collided = loadAnimation("Images/man(1).png", "Images/man(2).png");
  man_jumping = loadAnimation("Images/man3.png", "Images/man1.png", "Images/man2.png");
  man_running = loadAnimation("Images/man(1).png", "Images/man(2).png", "Images/man1.png", "Images/man2.png", "Images/man3.png", "Images/man(2).png");

  groundImage = loadImage("Images/prototype (Concept1).jpg");
  pool = loadImage("Images/pool.jpg")
  floatGroundImg = loadImage("Images/Diving board.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  obstaclesGroup = new Group();
  floatGroup = new Group();


  ground = createSprite(width/2 +555, height/2, width, height);
  ground.addImage("bg", groundImage);
  ground.scale = 2.59;
  ground.velocityX = -15
  
  invisibleGround = createSprite(width/2, height/4*3, width, 10);
  invisibleGround.debug = true;

  floatGround = createSprite(width/4, height/2+height/8, width/2,100);
  floatGround.addImage("planks", floatGroundImg);
  floatGround.scale = 1.5;
  floatGround.debug = true;
  floatGround.setCollider("rectangle",0, 0, floatGround.height, 20);

  man = createSprite(width/4, height/3);
  man.addAnimation("run", man_running);
  restart = createSprite(width/2*1.85, height/8)
  restart.addImage("blah", restartImg)
}

function draw() {
  background(0);
  drawSprites();
  
  man.velocityY += 0.5

  if(gameState === PLAY){
    if (level === 1) {
      man.collide(invisibleGround);
      floatGround.visible = false;
      spawnHurdles();
      if (obstaclesGroup.isTouching(man)){
        gameState = END
      }
    } else if (level === 2){
      ground.addImage("pool", pool);
      ground.changeImage("pool", pool);
      spawnFloats();
      disappearingFloat();
      man.collide(floatGround);
      man.collide(floatGroup);
      floatGround.visible = true;
      obstaclesGroup.destroyEach();
      if (man.isTouching(invisibleGround)){
        console.log("isTouching");
        gameState = END;
      }
    }
    if (score>20) {
      level = 2;
    }
    //
    textSize(40)
    fill("blue")
    text("Score: "+ Math.round(score), width/2+width/4,100);
    score = score + getFrameRate()/480;
    //console.log(getFrameRate());
    invisibleGround.visible = false;
    
    if (keyDown("space") && man.y>height/2 -100){
      jump()
    } else{
      man.changeAnimation("run", man_running)
    } 
    if (ground.x<0){
      ground.x = width/2 +555
    } 
  } else if(gameState === END){
    textSize(50);
    fill(255, 0, 0);
    text("GAME OVER", width/2, height/2)
    ground.velocityX = 0;
    man.velocityY = 0;
    //obstaclesGroup.setVelocityXEach(0)
    obstaclesGroup.setLifetimeEach(-1)
    //floatGroup.setVelocityXEach(0)
    floatGroup.setLifetimeEach(-1)
    man.addAnimation("owie", man_collided);
    man.changeAnimation("owie", man_collided)
    restart.scale = 2;

  }
  
  if(mousePressedOver(restart)){
    reset();
  }
  
}


function spawnHurdles() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var hurdle = createSprite(width,height/4.5*3,40,235);
    hurdle.setCollider("rectangle", 0, 0, 50, hurdle.height)
    //hurdle.y = Math.round(random(80,120));
    hurdle.addImage(hurdleImg);
    hurdle.scale = 0.65;
    hurdle.velocityX = -15;
    
     //assign lifetime to the variable
     hurdle.lifetime = 200;
    
    //adjust the depth
    //hurdle.depth = man.depth;
    man.depth = hurdle.depth + 1;
    
    //add each cloud to the group
    obstaclesGroup.add(hurdle);
  }
  
}

function spawnFloats() {
  //write code here to spawn the clouds
  if (frameCount % 70 === 0) {
    var float = createSprite(width,height/4.5*3,235,40);
    float.setCollider("rectangle", 0, 0, float.width, 50)
    float.debug = true;
    //hurdle.y = Math.round(random(80,120));
    float.addImage(floatImg);
    //float.scale = 0.65;
    float.velocityX = -15;
    
     //assign lifetime to the variable
     float.lifetime = 200;
    
    //adjust the depth
    //hurdle.depth = man.depth;
    man.depth = float.depth + 1;
    //add each cloud to the group
    floatGroup.add(float);
  }
  
}


function reset(){
  gameState = PLAY;
  //gameOver.visible = false;
  //restart.visible = false;
  
  obstaclesGroup.destroyEach();
  obstaclesGroup.x = width;
  obstaclesGroup.y = height/4.5*3
  
  man.changeAnimation("run",man_running);

  score = 0; 
  ground.velocityX = -15;
  restart.destroy();
  console.log(restart)
  console.log(gameState)
  level = 1;
  ground.changeImage("bg", groundImage);
}

function jump(){
  //man.velocityY = -17.5;
  man.velocityY = -15;
  man.addAnimation("jump", man_jumping);
  man.changeAnimation("jump", man_jumping);
}

function disappearingFloat(){
 if (frameCount % 125 === 0){
   floatGround.destroy();
 } 
}