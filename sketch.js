var PLAY = 1
var END = 0
var gameState = PLAY
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage, CloudsGroup
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle6, obstacle5, ObstaclesGroup
var score
var gameOver, gameOverImg
var restart, restartImg
var jumpSound, dieSound, checkpointSound

function preload(){
  trex_running= loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png")
  
  cloudImage = loadImage("cloud.png")
  
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  
  gameOverImg = loadImage("gameOver.png")
  
  restartImg = loadImage("restart.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  CloudsGroup = new Group();
  ObstaclesGroup = new Group();
  
  score = 0
  
  gameOver = createSprite(300,100)
  gameOver.addImage("G",gameOverImg)
  gameOver.scale = 0.5
  
  restart = createSprite(300,140)
  restart.addImage("R", restartImg)
  restart.scale = 0.5
  
}

function draw() {
  background("grey");
    
  text("Score:"+ score,500,50)
  
  if(gameState === PLAY){

    ground.velocityX = -(6 + 3*score/100);
    
    score=score+Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkpointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
 
    if(keyDown("space") && trex.y >= 159){
      trex.velocityY = -12 ;
      jumpSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8;
    
    spawnClouds();

    spawnObstacles();

    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("trex_collided");
    
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
 
  trex.collide(invisibleGround);
  

  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("trex");
  
  score = 0;
  
}

function spawnClouds() {

  if (frameCount % 60 === 0) {
    cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage("C1", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    cloud.lifetime = 200;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    CloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*score/100);

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage("O1",obstacle1);
               break;
      case 2: obstacle.addImage("O2",obstacle2);
               break;  
      case 3: obstacle.addImage("O3",obstacle3);
               break;  
      case 4: obstacle.addImage("O4",obstacle4);
               break;      
      case 5: obstacle.addImage("O5",obstacle5);
               break;   
      case 6: obstacle.addImage("O6",obstacle6);
               break;                
               default: break;
    }
         
    obstacle.scale = 0.5;
    
    obstacle.lifetime = 100;

    ObstaclesGroup.add(obstacle);
  }
}

