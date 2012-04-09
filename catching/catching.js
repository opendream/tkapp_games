//set main namespace
goog.provide('catching');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.Button');
goog.require('lime.RoundedRect');
goog.require('lime.fill.LinearGradient');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

var sceneWidth = 1024;
var sceneHeight = 768;
var sceneCenterX = sceneWidth/2;
var sceneCenterY = sceneHeight/2;

// entrypoint
catching.start = function(){

	catching.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    //var introScene = new lime.Scene;
    //var modeScene = new lime.Scene;
    //var gameScene = new lime.Scene;
    //var summaryScene = new lime.Scene;

    var scene = catching.intro();

	// set current scene active
	catching.director.replaceScene(scene);

}

catching.intro = function(){
    var scene = new lime.Scene;

    var background = new lime.Layer();
    scene.appendChild(background);

    var gameBackground = new lime.Sprite();
    gameBackground.setFill('assets/images/scene_bg.png');
    //800, 600
    gameBackground.setSize(sceneWidth - 150, sceneHeight - 130);
    gameBackground.setPosition(sceneCenterX + 4, sceneCenterY - 10);
    background.appendChild(gameBackground);

    var char1 = new lime.Sprite();
    char1.setFill('assets/images/boy.png');
    char1.setPosition(sceneCenterX - 280, sceneCenterY + 180);
    background.appendChild(char1);

    var char2 = new lime.Sprite();
    char2.setFill('assets/images/girl.png');
    char2.setPosition(sceneCenterX - 100, sceneCenterY + 200);
    background.appendChild(char2);

    var postbox = new lime.Sprite();
    postbox.setFill('assets/images/postbox.png');
    postbox.setPosition(sceneCenterX + 350, sceneCenterY + 150);
    background.appendChild(postbox);

    var frame = new lime.Sprite();
    frame.setFill('assets/images/game_frame.png');
    //870, 639
    frame.setSize(sceneWidth + 40,sceneHeight - 20);
    frame.setPosition(sceneCenterX,sceneCenterY - 0);
    background.appendChild(frame);

    var board = new lime.Sprite();
    board.setSize(sceneWidth,sceneHeight);
    board.setPosition(sceneCenterX,sceneCenterY);
    board.setFill('assets/images/game_bg.png');
    background.appendChild(board);

    var title1 = new lime.Sprite();
    title1.setFill('assets/images/title_1.png');
    title1.setPosition(sceneCenterX, sceneCenterY - 200);
    background.appendChild(title1);

    var title2 = new lime.Sprite();
    title2.setFill('assets/images/title_2.png');
    title2.setPosition(sceneCenterX, sceneCenterY - 75);
    background.appendChild(title2);

    var btnState1 = new lime.Sprite();
    btnState1.setFill('assets/images/btn_start_normal.png');
    var btnState2 = new lime.Sprite();
    btnState2.setFill('assets/images/btn_start_active.png');
    var btnStart = new lime.Button(
        btnState1,
        btnState2
    ).setPosition(sceneCenterX + 300, sceneCenterY + 260);
    btnStart.setScale(1.3);
    background.appendChild(btnStart);

    goog.events.listen(btnStart, 'click', function() {
        var scene2 = new lime.Scene();
        
        catching.director.replaceScene(scene2);
    });


    return scene;
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('catching.start', catching.start);
