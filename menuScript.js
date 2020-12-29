//set default window size
var gWidth = 1540;//window width
var gHeight = 755;//window height

// main menu stage
var mainStage = new Konva.Stage({
container: 'menu',
width: gWidth,
height: gHeight
});

//shadow for buttons
function buttonShadow( a, b, c){
    a.opacity(0.8);
    a.shadowColor('rgb(80, 30, 40)');
    a.shadowBlur(1);
    a.shadowOffset({
            x: b,
            y: c
        });
}

//function for button mouseover
function buttonHover(a, b, c, d){
    a.opacity(b);
    a.shadowColor(c);
    mainStage.container().style.cursor = d;
}

//function for button mouseclick
function buttonClick(a, b, c, d){
    buttonHover(a, 1, b, 'pointer');
    a.move({
        x: c,
        y: d
    });
}

//background image layer
var bglayer = new Konva.Layer();
var bgObj = new Image();
bgObj.onload = function () {
    var bg = new Konva.Image({
        x: 0,
        y: 0,
        image: bgObj,
        width: gWidth,
        height: gHeight,
    });
    // add the shape to the layer
    bglayer.add(bg);
    bglayer.draw();
};
bgObj.src="images/bg_1.png";
mainStage.add(bglayer);

//title layer
var titlelayer = new Konva.Layer();
mainStage.add(titlelayer);  
var titleObj = new Image();
titleObj.src="images/title.png";
titleObj.onload = function () {
    var title = new Konva.Image({
        x: gWidth*0.22,
        y: gHeight*0.2,
        image: titleObj,
        width: (this.width)*0.7,
        height: (this.height)*0.7,
    });
    // set shadow color with color string
    title.shadowColor('black');
    title.shadowBlur(10);
    title.shadowOffset({
        x: 0,
        y: 10
    });
    // add the shape to the layer
    titlelayer.add(title);
    titlelayer.batchDraw();

    //floating
    //modified from https://konvajs.org/docs/animations/Moving.html
    var amplitude = 10;
    var period = 2000; // in ms
    var centerX = gHeight*0.2;
    var floating = new Konva.Animation(function (frame) {
        title.y(
        amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + centerX
        );
    }, titlelayer);
    floating.start();
};

//start button layer
var btlayer = new Konva.Layer();
var btObj = new Image();
    btObj.onload = function () {
        var bt = new Konva.Image({
            x: gWidth*0.4,
            y: gHeight*0.55,
            image: btObj,
            width: (this.width)*0.4,
            height: (this.height)*0.4,
        });
    // set shadow
    buttonShadow(bt, -4, 4);
    btlayer.draw();
    bt.on('mouseover', function () {
        buttonHover(bt, 1, 'rgb(100, 40, 50)', 'pointer');
        btlayer.draw();
    });
    bt.on('mouseout', function () {
        buttonHover(bt, 0.8, 'rgb(80, 30, 40)','default');
        btlayer.draw();
    });
    bt.on('mousedown', function () {
        buttonClick(bt,'rgba(0,0,0,0)', -4, 4);
        btlayer.draw();
    });
    bt.on('mouseup', function () {
        buttonClick(bt,'rgb(100, 40, 50)', 4, -4);
        btlayer.draw();
        document.getElementById("game").style.display = "block";
        document.getElementById("menu").style.display = "none";
        state = true;
        audio.pause();
    });
btlayer.add(bt);
btlayer.batchDraw();
mainStage.add(btlayer);
};
btObj.src="images/start.png";

//setting button layer
var stlayer = new Konva.Layer();

var dropdown = false;//check if music and tutorial button is shown
var audio = document.getElementById("music");
audio.loop = true;//repeat music
audio.autoplay= true;//play on load
var state = false;//music on or off
var tutorial = false;//check if tutorial is shown
var leave = false;// check if cursor leaves the help button

var stObj = new Image();
    stObj.onload = function () {
        var st = new Konva.Image({
            x: gWidth -(this.width)*0.2,
            y: 10,
            image: stObj,
            width: ((this.width)*0.2)*gWidth/1536,
            height: ((this.height)*0.2)*gWidth/1536,
        });
    // set shadow 
    buttonShadow(st, -2, 2);
    stlayer.draw();
    st.on('mousedown', function () {
        buttonClick(st, 'rgba(0,0,0,0)',-2, 2);
        //music
        if(dropdown){
            dropdown = false;
            stgroup.hide();
        }else{
            dropdown = true;
            stgroup.show();
        }
        stlayer.draw();
    });
    st.on('mouseup', function () {
        buttonClick(st,'rgb(100, 40, 50)', 2, -2);
        stlayer.draw();
    });
    st.on('mouseover', function () {
        buttonHover(st, 1, 'rgb(100, 40, 50)', 'pointer');
        stlayer.draw();
    });

    st.on('mouseout', function () {
        buttonHover(st, 0.8, 'rgb(80, 30, 40)','default');
        stlayer.draw();
    });
    
    // add the shape to the layer
    stlayer.add(st);
    stlayer.draw();
    
};
stObj.src="images/setting.png";

//create group for buttons that hold by setting button
var stgroup = new Konva.Group();

//music button
    var mcObj = new Image();
    mcObj.src="images/soundon.png";
    var mc2Obj = new Image();
    mc2Obj.src="images/soundoff.png";
    mcObj.onload = function () {
        
        var mc = new Konva.Image({
            x: gWidth -(this.width)*0.2,
            y: gHeight/7.5,
            image: mcObj,
            width: (this.width)*0.15,
            height: (this.height)*0.15,
        });
    // set shadow
    buttonShadow(mc, -2, 2);
    mc.on('mouseover', function () {
        buttonHover(mc, 1, 'rgb(100, 40, 50)', 'pointer');
        stlayer.draw();
    });
    mc.on('mouseout', function () {
        buttonHover(mc, 0.8, 'rgb(80, 30, 40)','default');
        stlayer.draw();
    });
    mc.on('mousedown', function () {
        buttonClick(mc, 'rgba(0,0,0,0)', -2, 2);
        if(state){
            state = false;
            audio.play();
            this.setAttr('image', mcObj);
        }else{
            state = true;
            audio.pause();
            this.setAttr('image', mc2Obj);
        }
        stlayer.draw();            
    });
    mc.on('mouseup', function () {
        buttonClick(mc,'rgb(100, 40, 50)', 2, -2);
        stlayer.draw();
    });
    stgroup.add(mc);
    
};


//help button
    var hpObj = new Image();
    hpObj.onload = function () {
        
        var hp = new Konva.Image({
            x: gWidth -(this.width)*0.2,
            y: gHeight/5,
            image: hpObj,
            width: (this.width)*0.10,
            height: (this.height)*0.10,
        });
    // set shadow
    buttonShadow(hp, -2, 2);
    hp.on('mouseover', function () {
        buttonHover(hp, 1, 'rgb(100, 40, 50)', 'pointer');
        stlayer.draw();
        leave = false;
    });

    hp.on('mouseout', function () {
        buttonHover(hp, 0.8, 'rgb(80, 30, 40)','default');
        stlayer.draw();
        leave = true;
        if(tutorial){
            mainStage.container().style.cursor = 'pointer';
        }
    });
    hp.on('mousedown', function () {
        buttonClick(hp, 'rgba(0,0,0,0)', -2, 2);
        stlayer.draw();
    });
    hp.on('mouseup', function () {
        buttonClick(hp,'rgb(100, 40, 50)', 2, -2);
        ttgroup.show();
        btlayer.hide();
        tutorial = true;
        stlayer.draw();
    });
    stgroup.add(hp);
    
};
hpObj.src="images/help.png";
stlayer.add(stgroup);
stgroup.hide();

var ttgroup = new Konva.Group();
var rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: gWidth,
    height: gHeight,
    fill: 'black',
    opacity: 0.5,
});
ttgroup.add(rect);
var ttObj = new Image();
    ttObj.onload = function () {
        var tt = new Konva.Image({
            x: gWidth*0.3,
            y: gHeight*0.05,
            image: ttObj,
            width: (this.width)*0.7,
            height: (this.height)*0.7,
        });
    // set shadow 
    buttonShadow(tt, -4, 4);
    ttgroup.add(tt);
};
ttObj.src="images/tutorial.png";
document.body.addEventListener("click", function(){
    if(tutorial && leave){
        ttgroup.hide();
        tutorial = false;
        mainStage.container().style.cursor = "default";
        btlayer.show();
        stlayer.draw();
    }

});
stlayer.add(ttgroup);
ttgroup.hide();
stlayer.draw();
mainStage.add(stlayer);

//make canvas adjust size based on width
function fitStageIntoParentContainer() {
    var container = document.querySelector('#menu-parent');

    // now we need to fit stage into parent
    var containerWidth = container.offsetWidth;
    // to do this we need to scale the stage
    var scale = containerWidth / gWidth;

    mainStage.width(gWidth * scale);
    mainStage.height(gHeight * scale);
    mainStage.scale({ x: scale, y: scale });
    mainStage.draw();
  }

  fitStageIntoParentContainer();
  // adapt the stage on any window resize
  window.addEventListener('resize', fitStageIntoParentContainer);