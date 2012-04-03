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

var sceneWidth = 1024;
var sceneHeight = 768;
var sceneCenterX = sceneWidth/2;
var sceneCenterY = sceneHeight/2;

var cardSize = 132;
var boardSize = cardSize*3;


// entrypoint
game.start = function(){


  var director = new lime.Director(document.body, sceneWidth, sceneHeight);
  var scene1 = new lime.Scene;
  var scene2 = new lime.Scene;

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

  var btn1 = new lime.Sprite().setFill('assets/images/btn_1.png');
  var btn2 = new lime.Sprite().setFill('assets/images/btn_2.png');

  var button = new lime.Button(
    btn1,
    btn2
  ).setPosition(sceneCenterX,sceneCenterY+100);;

  goog.events.listen(button, 'click', function() {
    director.replaceScene(scene2);
  });

  scene1.appendChild(button);


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

  game.addCardNumber(background2);  
  game.addCardPicture(background2);
  // set current scene active
  director.makeMobileWebAppCapable();
  director.replaceScene(scene1);
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

game.addCardPicture = function(layer) {
  cardNumber = 0;
  var x = [100, 200, 150, 250, 123, 256, 130, 175, 225];
  var y = [120, 300, 500, 400, 203, 450, 450, 350, 250];

  var boardTopX = sceneCenterX - 200 - (boardSize/2) + cardSize/2;
  var boardTopY = sceneCenterY - (boardSize/2) + cardSize/2;  

  for(i=0; i<3; i++) {
    for(j=0; j<3; j++) {    
      var card = new lime.Sprite().setFill('assets/images/image_'+(cardNumber+1)+'.png');
      card.setPosition(x[cardNumber]+550, y[cardNumber]);
      layer.appendChild(card);

      !function(myX, myY, myCard){
        goog.events.listen(card, ['mousedown', 'touchstart'], function(e) {
          e.startDrag();

          e.swallow(['mouseup','touchend'], function(e2){
            stopX = myCard.getPosition().x+(cardSize/2);
            stopY = myCard.getPosition().y+(cardSize/2);

            console.log("in if");
            console.log(cardNumber);

            console.log("stopX: " + stopX);
            console.log("stopY: " + stopY);

            console.log("myX  : " + myX);
            console.log("myX 2: " + myX + cardSize);            
            console.log("myY  : " + myY);
            console.log("myY 2: " + myY + cardSize);

            if( stopX > myX && stopX < myX + cardSize){
              if( stopY > myY && stopY < myY + cardSize) {
                console.log("valid");
                myCard.setPosition(myX, myY);
                countDownToFinish--;
              }
            }
            //var answer = btnIndex+1;
            // ame = grand_father.answer(answer, game, scene, gameController);
          });
        });
      }((boardTopX + cardSize*j), (boardTopY + cardSize*i), card);        



      cardNumber++;
    }
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
