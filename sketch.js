//Declaring variables to be used later in code
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkeyImage;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var gameOverImg, restartImg;
//Loading pictures that will be used in output
function preload(){
  monkeyImage = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png","sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}
//Creating the canvas, sprites, adding Images, scaling and setting them visible or not
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  monkey = createSprite(50,height - 40,20,50);
  monkey.addAnimation("monkey jumping",monkeyImage);
  
  monkey.scale = 0.1;
  
  ground = createSprite(200,height - 20,400,20);
  ground.addImage(groundImage);
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height - 130);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height - 90);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height - 10,400,10);
  invisibleGround.visible = false;
  //Creating groups for clouds and obstacles
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  //Declaring the score
  score = 0;
}

function draw() {
  //Setting background
  background(255);
  //Displaying score
  text("Score: "+ score, width - 130,height - 150);
  //Dividing the draw code into 2 gamestates: What should run during PLAY and what should run during END
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length>0 || keyDown("space")) && monkey.y >= height - 50) {
      monkey.velocityY = -12;
      touches = [];
    }
  
    monkey.velocityY = monkey.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    monkey.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(monkey)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //Setting the velcity of each game object to 0
    ground.velocityX = 0;
    monkey.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    
    //Setting the lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    //Reset the game using the mouse
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  //Displaying the output
  drawSprites();
}

function spawnClouds() {
  //Spawning clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,height - 120,40,10);
    cloud.y = Math.round(random(height - 140, height - 100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //Assigning lifetime
    cloud.lifetime = 200;
    
    //Adjusting the depth
    cloud.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    //Add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  //Spawning obstacles using switch, case and break method
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height - 35,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //Assigning scale and lifetime to the obstacle          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //Add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  //What happens when game is reset
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  

  //Reseting the score
  score = 0;
  
}