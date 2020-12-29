//get canvas
var canvas = document.getElementById("one");
var ctx = canvas.getContext("2d");

//get button
var btn = document.getElementById("btn");
var btnImg = document.getElementById("btnImg");

//get volume button
var volbtn = document.getElementById("volbtn");
var volbtnImg = document.getElementById("volbtnImg");

//game states - booleans for if the player has died or the game has finished, the game is paused, there is dialogue running, the game is won, etc
var gameStart = false;
var gameEnd = false;
var pause = false;
var win = false;
var musicSound = false; //check if music button is sound on or sound off

var pauseButton = {
    pauseGame: function(){
        pause = !pause;
        console.log("pause");
    },
    drawPauseScreen: function(){
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = "bold 20px Courier New";
        ctx.fillText("paused", canvas.width/2 - 30 , canvas.height/2);
    }
}

//canvas background
var bg = {
    show: function(){
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, canvas.width*4.5, canvas.height-100);
        var bg = new Image();
        bg.src = "images/cloudbg.png";
        ctx.globalAlpha = 0.8;
        ctx.drawImage(bg,0, 0, canvas.width*4.5, canvas.height-100);
        ctx.globalAlpha = 1;
    }
}

//floor or foreground
var fgy=canvas.height - 100; // y axis of fg 
var fg = {
    show: function(){
        ctx.fillStyle = "black";
        ctx.fillRect(0, fgy, canvas.width*4.5, 100);
        var fg = new Image();
        fg.src = "images/floor.png";
        ctx.globalAlpha = 0.9;
        ctx.drawImage(fg,0, fgy, canvas.width*4.5, 100);
        ctx.globalAlpha = 1;
    }
}

//player
var player = {
    x: 65,
    y: fgy-100,
    width: 30,
    height: 100,
    health: 100,
    poison: 0,
    yVel: 0,
    xVel: 0,
    jumpSpeed: 10,
    gravity: 0.5,
    inAir: false,
    show: function(){
        if(left){
            character.src = "images/Player_1i.png";
        }else if(right){
            character.src = "images/Player_1.png";
        }
        ctx.drawImage(character,player.x, player.y, player.width,player.height);////
    },
    drawHealth: function(x){
        let fullHealth = 100;
        ctx.fillStyle = 'black';
        ctx.strokeRect(30 - x, 30, fullHealth*2, 20);
        var grd = ctx.createLinearGradient(player.x-50, 0,player.x+50, 0);
        grd.addColorStop(0, '#105932');
        grd.addColorStop(1, '#1b9454');
        ctx.fillStyle = grd;   
        ctx.fillRect(30 - x, 30, player.health*2, 20);
    },
    decreaseHealth: function(){
        if(player.health > 0){
            player.health -= 0.1;
        }
    },
    increaseHealth: function(){
        if(player.health < 80){
            player.health += 20;
        } else {
            player.health += (100 - player.health);
        }
    },
    detectPotion: function(potionX, potionY, potionWidth, potionHeight, potionStatus, potionType){
        let isCollideWithPotion = player.x <= potionX + potionWidth && player.x + player.width >= potionX && player.y <= potionY && player.y + player.height >= potionY + potionHeight;

        if(isCollideWithPotion && potionType == 'health' && !potionStatus){
            player.increaseHealth();  
            if(musicSound){
                var audio = document.getElementById("collect");// get collect healing potion audio
                audio.play();
            }
        } else if(isCollideWithPotion && potionType == 'poison' && !potionStatus){
            player.poison++;
            if(musicSound){
            var audio1 = document.getElementById("collect1"); // get collect poison potions audio
            audio1.play();
            }
        }
    },
    move: function(direction){
        player.x += direction;
    },
    jump: function(){
        if(!player.inAir){
            player.inAir = true;
            player.yVel = -player.jumpSpeed;
        }
    }
    //jump function and related properties (gravity, jumpSpeed, vy (renamed yVel here)) taken from this stack overflow answer https://stackoverflow.com/questions/49958701/game-player-doesnt-fall-in-canvas-fiddle-javascript-html5  by user Stuart (the top and only answer to this question)
    //jump function altered by adding if condition to prevent player from jumping in midair
}

// player image
var character = new Image();
character.src = "images/Player_1.png";
ctx.drawImage(character,player.x, player.y, player.width,player.height);

//decoration purpose images class
class DecoImage{
    constructor(x, y, width, height, src, opacity){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.src = src;
        this.opacity = opacity;
    }
    show(){
        var deco = new Image();
        deco.src = this.src;
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(deco,this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }
}

//Cloud type 1
let cloud1 = [];
let cloud1x = [500, 1200, 1700, 2200, 3000, 3650];
let cloud1y = [120, 80, 60, 160, 160, 80];

for(let i = 0; i < 6; i++){
    cloud1[i] = new DecoImage(cloud1x[i], cloud1y[i], 100, 40, "images/cloud1.png", 0.6);
}
//Cloud type 2
let cloud2 = [];
let cloud2x = [300, 900, 1600, 2400, 4000];
let cloud2y = [160, 40, 70, 100, 100];

for(let i = 0; i < 5; i++){
    cloud2[i] = new DecoImage(cloud2x[i], cloud2y[i], 150, 60, "images/cloud2.png", 0.7);
}

//Cloud type 3
let cloud3 = [];
let cloud3x = [200, 800, 1300, 1800, 2000, 2500, 3100, 3500, 3800, 4200];
let cloud3y = [180, 40, 70, 100, 200, 250, 120, 180, 50, 100];

for(let i = 0; i < 10; i++){
    cloud3[i] = new DecoImage(cloud3x[i], cloud3y[i], 50, 15, "images/cloud3.png", 0.3);
}
//mountain type 1
let mountain1 = [];
let mountain1x = [100, 500, 900, 1200, 1500, 1900, 2300, 2600, 3000, 3500, 3800, 4200];//x axis
let mountain1w = [500, 460, 480, 450, 480, 460, 480, 450, 480, 460, 480, 450];//width
let mountain1h = [120, 100, 120, 100, 120, 130, 120, 180, 80, 100, 140, 80];//height

for(let i = 0; i < 12; i++){
    mountain1[i] = new DecoImage(mountain1x[i], fgy-mountain1h[i], mountain1w[i], mountain1h[i], "images/mountain1.png", 0.9);
}

//mountain type 2
let mountain2 = [];
let mountain2x = [0, 300, 700, 850, 1100, 1400, 1700, 2200, 2500, 2850, 3100, 3400, 3700, 4100, 4300];//x axis
let mountain2w = [300, 330, 370, 320, 320, 350, 380, 360, 380, 300, 350, 370, 350, 300, 350];//width
let mountain2h = [100, 140, 80, 100, 140, 100, 150, 130, 100, 140, 160, 120, 160, 100, 170];//height

for(let i = 0; i < 15; i++){
    mountain2[i] = new DecoImage(mountain2x[i], fgy-mountain2h[i], mountain2w[i], mountain2h[i], "images/mountain2.png", 0.9);
}

//trees type 1
let tree1 = [];
var tree1x = 20;

for(let i = 0; i < 70; i++){
    var x = Math.floor(Math.random() * 100); 
    tree1[i] = new DecoImage(tree1x, fgy-90, 30, 90, "images/darkTree1.png", 0.9);
    tree1x = tree1x + x + 30
}

//trees type 2
let tree2 = [];
var tree2x = 8;

for(let i = 0; i < 50; i++){
    var x = Math.floor(Math.random() * 200); 
    tree2[i] = new DecoImage(tree2x, fgy-120, 70, 120, "images/dTree3.png", 0.9);
    tree2x = tree2x + x + 60
}

//trees type 3
let tree3 = [];
var tree3x = 60;

for(let i = 0; i < 30; i++){
    var x = Math.floor(Math.random() * 250); 
    tree3[i] = new DecoImage(tree3x, fgy-150, 100, 150, "images/dTree1.png", 1);
    tree3x = tree3x + x + 100
}

//bushes
let bush = [];
var bushx = 0;

for(let i = 0; i <60; i++){
    var x = Math.floor(Math.random() * 30); 
    bush[i] = new DecoImage(bushx, fgy-20, 80, 20, "images/bush.png", 0.9);
    bushx = bushx + x + 70
}

//array to keep platforms in
let platformArr = [];

//class platform to create platform objects efficiently
class Platform {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    //function to draw platform
    drawPlatform(){
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//two arrays to store platform x and y start positions
let platformXArr = [600, 800, 1200, 1600, 2100, 2500, 2800, 3300, 3400, 3600];
let platformYArr = [400, 300, 200, 200, 400, 200, 300, 200, 400, 300];

//creating platform objects in platformArr
for(let i = 0; i < 10; i++){
    platformArr[i] = new Platform(platformXArr[i], platformYArr[i], 200, 20);
}

//potion class
class Potion {
    constructor(x, y, width, height, collected, type){
        this.x = x;
        this.y = y;
        this. width = width;
        this.height = height;
        this.collected = collected;
        this.type = type;
    }

    drawPotion(){
        if(!this.collected){
            var potion = new Image();
            if(this.type == 'health'){
                potion.src = "images/potion.png";
            } else {
                potion.src = "images/green.png";
            }
            ctx.drawImage(potion,this.x, this.y, this.width, this.height);
        }
    }

    //note: potion might not detect collision in some situations
    detectPlayer(playerX, playerY, playerWidth, playerHeight){
        //boolean for collision detection between potion and player
        let isCollidingWithPlayer = playerX <= this.x + this.width && playerX + playerWidth >= this.x && playerY <= this.y && playerY + playerHeight >= this.y + this.height;

        if(isCollidingWithPlayer){
            this.collected = true;
        }
    }
}

//array to keep health potions in
//arrays to store health potion x and y values in
let healthPotionArr = [];
let healthPotionXArr = [700, 1300, 2200, 2900, 3500];
let healthPotionYArr = [250, 150, 350, 150, 250];

//array to keep poison potions in
//array to store posion potion x and y values in
let poisonPotionArr = [];
let poisonPotionXArr = [900, 1500, 2500, 3200, 3800];
let poisonPotionYArr = [250, 150, 350, 150, 250];

//creating health potion objects
for(let i = 0; i < 5; i++){
    healthPotionArr[i] = new Potion(healthPotionXArr[i], healthPotionYArr[i], 15, 40, false, 'health');
}

//creating posion potion objects
for(let i = 0; i < 5; i++){
    poisonPotionArr[i] = new Potion(poisonPotionXArr[i], poisonPotionYArr[i], 15, 40, false, 'poison');
}

//concatenating health potion and poison potion arrays for convenience
let allPotionArr = healthPotionArr.concat(poisonPotionArr);

//drawing all potions
function drawAllPotions(){
    for(let i = 0; i < allPotionArr.length; i++){
        allPotionArr[i].drawPotion();
    }
}

// draw all decoration images
function drawAllDecorations(){
    for(let i = 0; i < cloud1.length; i++){
        cloud1[i].show();
    }
    for(let i = 0; i < cloud2.length; i++){
        cloud2[i].show();
    }
    for(let i = 0; i < cloud3.length; i++){
        cloud3[i].show();
    }
    for(let i = 0; i < mountain2.length; i++){
        mountain2[i].show();
    }
    for(let i = 0; i < mountain1.length; i++){
        mountain1[i].show();
    }
    for(let i = 0; i < tree1.length; i++){
        tree1[i].show();
    }
    for(let i = 0; i < tree2.length; i++){
        tree2[i].show();
    }
    for(let i = 0; i < tree3.length; i++){
        tree3[i].show();
    }
    for(let i = 0; i < bush.length; i++){
        bush[i].show();
    }
}

//function to check if potion is touching player
function potionDetectPlayer(){
    for(let i = 0; i < allPotionArr.length; i++){
        allPotionArr[i].detectPlayer(player.x, player.y, player.width, player.height);
    }
}

//function to check if player is touching potion
function playerDetectPotion(){
    for(let i = 0; i < allPotionArr.length; i++){
       player.detectPotion(allPotionArr[i].x, allPotionArr[i].y, allPotionArr[i].width, allPotionArr[i].height, allPotionArr[i].collected, allPotionArr[i].type);
    }
}

//function to call draw all the platforms out
function drawAllPlatforms(){
    for(let i = 0; i < platformArr.length; i++){
        platformArr[i].drawPlatform();
    }
}

//function to draw foreground and background
function drawScenery(){
    bg.show();
    fg.show();
}

//gravity function modified from this stack overflow answer https://stackoverflow.com/questions/49958701/game-square-doesnt-fall-in-canvas-fiddle-javascript-html5 by user Stuart (the top and only answer to this question) as part of making the player jump
//changed if condition to reflect where the floor and platforms are drawn in this game
function gravity(){
    player.y += player.yVel;
    player.yVel += player.gravity;

    //check for floor so player doesn't fall through the ground
    detectCollision();
}

//collision detection
function detectCollision(){
    for(let i = 0; i < platformArr.length; i++){
        if(player.x + player.width/2 >= platformArr[i].x && player.x + player.width/2 <= platformArr[i].x + platformArr[i].width && player.y >= platformArr[i].y-player.height && player.y < platformArr[i].y){
            player.y = platformArr[i].y-player.height;
            player.yVel = 0;
            player.inAir = false;
        } else if(player.y >=  fgy-player.height){
            player.y =  fgy-player.height;
            player.yVel = 0;
            player.inAir = false;
        }
    }
}

//checks if the player is still alive
//will change gameEnd to true if player is dead - game over
function checkPlayerStatus(){
    if(player.health <= 0 && !win ){
        gameEnd = true;
    }
}

var overStopLoop = false;// make sure game over music only play once
function drawGameOver(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "bold 20px Courier New";
    ctx.fillText("GAME OVER", canvas.width/2 - 50 , canvas.height/2);
    if(!overStopLoop && musicSound){
        var audio = document.getElementById("over");// get game over audio
        audio.play();
        overStopLoop = true;
    }
}

//function to track collected poison potions to make gameWin = true
function checkWin(){
    if(player.poison == poisonPotionArr.length){
        win = true;
    }
}

var winStopLoop = false;//make sure win music only play once
function drawGameWin(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "bold 20px Courier New";
    ctx.fillText("You win!", canvas.width/2 - 40 , canvas.height/2);
    if(!winStopLoop && musicSound){
        var audio = document.getElementById("end");//get win game audio
        audio.play();
        winStopLoop = true;
    }
}

//booleans for control keys
let left = false;
let right = false;
let up = false;

//sets left, right and up to true if the user is pressing down on any of the control keys
//control keys are right, left and up arrows and WASD keys and spacebar
function readInput(e){
    //37 left arrow, 65 'a' key
    //39 right arrow, 68 'd' key
    if(e.keyCode == 37 || e.keyCode == 65){
        left = true;
    } else if(e.keyCode == 39 || e.keyCode == 68){
        right = true;
    }
    //38 up arrow, 87 'w' key, 32 spacebar
    if(e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32){
        up = true;        
    }
}

//deltaX stores the change in x as the user moves left and right across the screen
//used to help the game scroll sideways
let deltaX = 0;

//function to update the position of viewport and player
function updatePos(){
    //move distance - how far player moves on 1 key press
    let moveDist = 8;

    if(left && player.x > 0){
        //change deltaX to move viewport
        //viewport will move when player is between 100 and 3600
        //lets player to move up to the left and right edges when near them
        if(player.x > 100 && player.x <= 3600){
            deltaX += moveDist;
        }
        //update player x value so that it moves
        player.move(-moveDist);
    } else if(right && player.x < canvas.width*4.5 - player.width){
        //viewport won't move unless player is between 100 and 3600
        //lets player to move up to the edges
        if(player.x >= 100 && player.x < 3600){
            deltaX -= moveDist;
        }
        player.move(moveDist);
    }
    
    if(up){
        player.jump();
    }

    //apply gravity
    gravity();
    //gravity function modified from this stack overflow answer https://stackoverflow.com/questions/49958701/game-square-doesnt-fall-in-canvas-fiddle-javascript-html5 by user Stuart (the top and only answer to this question) as part of making the player jump
}

//changes values of booleans for control keys to false when user no longer pressing them
function listenForKeyUp(e){
    //37 left arrow, 65 'a' key
    //39 right arrow, 68 'd' key
    if(e.keyCode == 37 || e.keyCode == 65){
        left = false;
    } else if(e.keyCode == 39 || e.keyCode == 68){
        right = false;
    }
    
    //38 up arrow, 87 'w' key, 32 spacebar
    if(e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32){
        up = false;
    }
}

//calls readInput() every time a key is pressed. readInput() sees if the user is pressing the control keys
window.addEventListener("keydown", readInput, false);

//calls listenForKeyUp() when key is lifted up. sees if the user is not pressing any keys
window.addEventListener("keyup", listenForKeyUp, false);

//draws everything onto canvas
function draw(){
    //sidescrolling achieved by translating canvas by deltaX and clearing the previously drawn screen to remove trails where objects were drawn previously
    ctx.save();
    ctx.translate(deltaX, 0);
    ctx.clearRect(deltaX-player.width/2, 0, canvas.width*4.5, canvas.height);

    //draw everything back onto screen
    drawScenery();
    drawAllDecorations();
    drawAllPlatforms();
    drawAllPotions();
        
    player.show();
    player.drawHealth(deltaX);
        
    playerDetectPotion();
    potionDetectPlayer();

    ctx.restore();
}

//game loop
function loop(){
    draw();
    gameStart = true;
    var playing = document.getElementById("theGame");//audio
    playing.loop = true;//repeat music
    playing.volume = 0.4;//music volume

    //update
    if(!pause && !gameEnd && gameStart){
        checkPlayerStatus();
        checkWin();
        updatePos();
        player.decreaseHealth();
        if(musicSound){
            playing.play();//play music
        }else{
            playing.pause();//pause music
        }
    }

    //draw/render
    if(pause){
        pauseButton.drawPauseScreen();
        btnImg.setAttribute("src", "images/play.png");
        document.getElementById("volbtn").style.display = 'none';        
    } else if(gameEnd){
        playing.pause();
        drawGameOver();
        document.getElementById("btn").style.display = 'none';
        document.getElementById("volbtn").style.display = 'none';
    } else if(win && !gameEnd) {
        playing.pause();
        drawGameWin();
        document.getElementById("btn").style.display = 'none';
        document.getElementById("volbtn").style.display = 'none';
    } else {
        draw();
        btnImg.setAttribute("src", "images/pause.png");
        document.getElementById("volbtn").style.display = 'block';
    }
    window.requestAnimationFrame(loop);
}

function checkStart(){
    if(startGame){
        window.requestAnimationFrame(loop);
        musicSound = true;
    }
}

//pauses the updating section of game loop when button is clicked
btn.addEventListener("click", function(){
    pauseButton.pauseGame();
    pauseButton.drawPauseScreen();
}, false);

volbtn.addEventListener("click", function(){
    if(musicSound){
        musicSound = false;
        volbtnImg.setAttribute("src", "images/soundoff.png");
    }else{
        musicSound = true;
        volbtnImg.setAttribute("src", "images/soundon.png");
    }
}, false);

//old man dialogue
var startGame = false;

let counts = 0;
let out = document.getElementById('output');
let msg;
var oldMan2 = "images/old_man2.png";
var oldMan = "images/old_man.png";
var heal = "images/potion.png";
var poison = "images/green.png";
var img = document.getElementById("old_man");

var talking = document.getElementById("explain");//get intro dialogue audio
talking.volume = 0.5;//music volume
talking.loop = true;//repeat music

function checkTalk(){
        talking.play();//play music for intro dialogue
}
//show dialogue function
function msgClick(e){
    e.preventDefault();
    counts ++;
    if(counts === 1) {
      msg = script[0];
      img.src = oldMan2;
    }
    else if(counts === 2) {
      msg = script[1];
    img.src = heal;
    }
    else if(counts === 3) {
      msg = script[2];
     img.src = oldMan2;
    }
    else if(counts ===4) msg = script[3];
    else if(counts === 5) {
      msg = script[4];
     img.src = poison;
    }
    else if(counts === 6){
     msg = script[5];
     img.src = oldMan;
    }
    else if(counts === 7) msg = script[6];
    else if(counts >= 8){ //show game scene when dialogue ends
      document.getElementById("btn1").style.display = 'none';
       document.getElementById("old_man").style.display = 'none';
       document.getElementById("output").style.display = 'none';
       document.getElementById("redbg").style.display = 'none';
       document.getElementById("hell").style.display = 'none';
       document.getElementById("btn").style.display = 'block';
       document.getElementById("volbtn").style.display = 'block';
       startGame = true;
       talking.pause();
       window.requestAnimationFrame(checkStart);
    }
    out.innerHTML = msg;
}

document.getElementById('btn1').addEventListener('click', msgClick);
document.getElementById('hell').addEventListener('mouseover', checkTalk);//start music when the screen shows intro background
//dialogue
let script = [ "You are under the influence of the seven deadly sins, which feast on your health.", 
                        "To regain HP you must collect the pink healing potion of the seven virtues to reduce the influence of these sins.",
                        "Each time a healing potion is collected this will extend the amount of time you have to collect the next potion.",
                        "Use your left and right arrow keys or A and D keys to move from side to side. Use the up arrow/ W/ space bar key to jump.", 
                        "The level will only be won once all of the green poison potions on the screen have been collected.",
                        "You do not have to collect all the healing potions in order to win the game, but must ensure that the HP bar is above zero at all times.",
                        "Good luck! Let the level commence."];