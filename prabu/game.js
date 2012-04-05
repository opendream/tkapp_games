//set main namespace
goog.provide('game');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('lime.Button');
goog.require('lime.audio.Audio');

var sceneWidth = 1024;
var sceneHeight = 768;
var sceneCenterX = sceneWidth/2;
var sceneCenterY = sceneHeight/2;

var cardSize = 132;
var boardSize = cardSize*3;
var complete = [];
var timer = 30;
var cards = [];

var x = [100, 200, 150, 250, 123, 256, 130, 175, 225];
var y = [120, 300, 500, 400, 203, 450, 450, 350, 250];

var timerCountDown = 1;



// entrypoint
game.start = function(){
  var bell = new lime.audio.Audio('assets/sounds/bell.mp3');
  var pop = new lime.audio.Audio('assets/sounds/pop.mp3');

  game.director = new lime.Director(document.body, sceneWidth, sceneHeight);
  var scene1 = new lime.Scene;
  var scene2 = new lime.Scene;
  var scene3 = new lime.Scene;
  var scene4 = new lime.Scene;

  //
  // Scene 2
  //

  var background2 = new lime.Layer();
  var background2Color = new lime.Sprite().setSize(sceneWidth, sceneHeight)
  background2Color.setPosition(sceneCenterX, sceneCenterY).setFill(229, 0, 146);
  background2.appendChild(background2Color);  
  scene2.appendChild(background2);

  var board = new lime.RoundedRect().setSize(boardSize+100, boardSize+100);
  board.setPosition(sceneCenterX-200,sceneCenterY).setFill(229,172,0);
  board.setRadius(15,false);
  background2.appendChild(board);

  var board2 = new lime.RoundedRect().setSize(boardSize+50, boardSize+50);
  board2.setPosition(sceneCenterX-200,sceneCenterY).setFill(51,0,0);
  board2.setRadius(15,false);
  background2.appendChild(board2);

  var board3 = new lime.Sprite().setSize(boardSize, boardSize);
  board3.setPosition(sceneCenterX-200,sceneCenterY).setFill(0,102,153);
  board3.setStroke(2,255,255,255,1);
  background2.appendChild(board3);

  background2.appendChild(game.createStroke(2, boardSize, sceneCenterX-200-(boardSize/2)+cardSize, sceneCenterY));
  background2.appendChild(game.createStroke(2, boardSize, sceneCenterX-200-(boardSize/2)+cardSize*2, sceneCenterY));  
  background2.appendChild(game.createStroke(boardSize, 2, sceneCenterX-200, sceneCenterY-(boardSize/2)+cardSize));
  background2.appendChild(game.createStroke(boardSize, 2, sceneCenterX-200, sceneCenterY-(boardSize/2)+cardSize*2)); 

  var title = new lime.Sprite().setScale(0.7,0.7);
  title.setFill("assets/images/title.png");
  title.setPosition(200, 100);
  background2.appendChild(title);

  var lblTimer = new lime.Label();
  lblTimer.setText(timer).setSize(50,50).setFontSize(50).setPosition(sceneCenterX,sceneCenterY+320);
  lblTimer.setFontColor('#FFFFFF');
  scene2.appendChild(lblTimer);

  game.addCardNumber(background2);

  var boardPicture = new lime.Layer();
  scene2.appendChild(boardPicture);
  game.addCardPicture(boardPicture, scene3);

  //
  // Scene 3
  //
  var background3 = new lime.Layer();
  var background3Color = new lime.Sprite().setSize(sceneWidth, sceneHeight)
  background3Color.setPosition(sceneCenterX, sceneCenterY).setFill(229, 0, 146);
  background3.appendChild(background3Color);  
  scene3.appendChild(background3);

  var board = new lime.RoundedRect().setSize(boardSize+100, boardSize+100);
  board.setPosition(sceneCenterX-200,sceneCenterY).setFill(229,172,0);
  board.setRadius(15,false);
  background3.appendChild(board);

  var title = new lime.Sprite().setScale(0.7,0.7);
  title.setFill("assets/images/title.png");
  title.setPosition(200, 100);
  background3.appendChild(title);
  game.addFullCardPicture(scene3);

  var youWin = new lime.Sprite();
  youWin.setFill('assets/images/txt-win.png').setPosition(sceneCenterX , sceneCenterY-50);
  scene3.appendChild(youWin);  

  var completeBtn = game.makeButton(sceneCenterX+220,sceneCenterY+200,1);
  goog.events.listen(completeBtn, 'click', function() {
    pop.stop();
    pop.play();    
    game.director.replaceScene(scene1);
  });
  scene3.appendChild(completeBtn);

  //
  // Scene 4
  //
  var background4 = new lime.Layer();
  var background4Color = new lime.Sprite().setSize(sceneWidth, sceneHeight)
  background4Color.setPosition(sceneCenterX, sceneCenterY).setFill(229, 0, 146);
  background4.appendChild(background4Color);
  scene4.appendChild(background4);

  var youLose = new lime.Sprite();
  youLose.setFill('assets/images/txt-lose.png').setPosition(sceneCenterX , sceneCenterY-50);
  scene4.appendChild(youLose);  

  var restartBtn = game.makeButton(sceneCenterX,sceneCenterY+100,1);
  goog.events.listen(restartBtn, 'click', function() {
    pop.stop();
    pop.play();
    game.director.replaceScene(scene1);
  });

  scene4.appendChild(restartBtn);

  //
  // Scene 1
  //
  var background1 = new lime.Layer();
  var background1Color = new lime.Sprite().setSize(sceneWidth, sceneHeight)
  background1Color.setPosition(sceneCenterX, sceneCenterY).setFill(229, 0, 146);
  background1.appendChild(background1Color);

  var title = new lime.Sprite().setFill("assets/images/title.png");
  title.setPosition(sceneCenterX, sceneCenterY-150);
  background1.appendChild(title);

  scene1.appendChild(background1);

  var startBtn = game.makeButton(sceneCenterX, sceneCenterY+100,1);
  goog.events.listen(startBtn, 'click', function() {
    bell.stop();
    bell.play();

    game.setStart();
    boardPicture.removeAllChildren();
    game.addCardPicture(boardPicture, scene3);    

    game.director.replaceScene(scene2);
    timerCountDown = 1;
    game.gameTimer(lblTimer, scene4);
  });

  scene1.appendChild(startBtn);

  // set current scene active
  game.director.makeMobileWebAppCapable();
  game.director.replaceScene(scene1);
}

game.gameTimer = function(lbl, loseScene){
  lbl.setText(timer);

  if(timer == 0){
      timer = 0;
      game.director.replaceScene(loseScene);
  }else{
    if (timerCountDown != 0){
      setTimeout(function(){
        timer = timer - timerCountDown;
        game.gameTimer(lbl, loseScene);
      },1000);
    }
  }
}

game.makeButton = function(x, y, scale){
  var btn1 = new lime.Sprite().setFill('assets/images/btn-start.png');
  var btn2 = new lime.Sprite().setFill('assets/images/btn-start-hover.png');

  var button = new lime.Button(
    btn1,
    btn2
  ).setPosition(x,y);
  button.setScale(scale);
  return button;
}

game.addCardNumber = function(layer) {
  cardNumber = 1;
  var topX = sceneCenterX - 200 - (boardSize/2) + cardSize/2 - 5;
  var topY = sceneCenterY - (boardSize/2) + cardSize/2 - 10;
  for(i=0; i<3; i++) {
    for(j=0; j<3; j++) {
      var number = new lime.Label().setSize(5,5).setFontSize(30);
      number.setFontColor('#FFFFFF');
      number.setText(cardNumber);
      number.setPosition(topX + cardSize*j, topY + cardSize*i);
      layer.appendChild(number);
      cardNumber++;
    }
  }
}

game.addFullCardPicture = function(layer) {
  cardNumber = 0;
  var boardTopX = sceneCenterX - 200 - (boardSize/2) + cardSize/2;
  var boardTopY = sceneCenterY - (boardSize/2) + cardSize/2;  
  for(i=0; i<3; i++) {
    for(j=0; j<3; j++) {
      var card = new lime.Sprite().setFill('assets/images/image_'+(cardNumber+1)+'.png');
      card.setPosition((boardTopX + cardSize*j), (boardTopY + cardSize*i));
      layer.appendChild(card);
      cardNumber++;
    }
  }
}

game.addCardPicture = function(layer, nextScene) {
  cardNumber = 0;

  var boardTopX = sceneCenterX - 200 - (boardSize/2) + cardSize/2;
  var boardTopY = sceneCenterY - (boardSize/2) + cardSize/2;  

  for(i=0; i<3; i++) {
    for(j=0; j<3; j++) {    
      var card = new lime.Sprite().setFill('assets/images/image_'+(cardNumber+1)+'.png');
      card.setPosition(x[cardNumber]+550, y[cardNumber]);
      layer.appendChild(card);

      !function(myX, myY, myCard, myNumber){
        goog.events.listen(card, ['mousedown', 'touchstart'], function(e) {
          e.startDrag();

          e.swallow(['mouseup','touchend'], function(e2){
            stopX = myCard.getPosition().x+(cardSize/2);
            stopY = myCard.getPosition().y+(cardSize/2);

            if( (stopX > myX && stopX < myX + cardSize) && 
                (stopY > myY && stopY < myY + cardSize) ){
              myCard.setPosition(myX, myY);
              complete[myNumber] = true;

              if(game.countFinish() == true) {
                game.director.replaceScene(nextScene);
                timerCountDown = 0;
              }

            } else {
              complete[myNumber] = false;
            }
          });
        });
      }((boardTopX + cardSize*j), (boardTopY + cardSize*i), card, cardNumber);        

      cards[cardNumber] = card;

      cardNumber++;
    }
  }
}

game.setStart = function(){
  timer = 30;
  for(i=0; i<9; i++) {
    complete[i] = false;
  }
}

game.setCardPosition = function() {
  for(i=0; i<9; i++) {
    cards[i].setPosition(x[cardNumber]+550, y[cardNumber]);
  }
}

game.countFinish = function(){
  countComplete = 0;
  for(i=0; i<9; i++) {
    if(complete[i] === true) {
      countComplete++;
    }
  }
  if (countComplete == 9) {
    return true;
  } else {
    return false;
  }
}

game.createStroke = function(w, h, x, y){
  var stroke = new lime.Sprite().setSize(w, h);
  stroke.setPosition(x, y);
  stroke.setFill(255,255,255);
  return stroke;
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);
