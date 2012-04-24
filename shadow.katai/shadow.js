//set main namespace
goog.provide('shadow');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.GlossyButton');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.Easing');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.audio.Audio');

	var callbackFactory, choiceAmount = 3, problemAmount = 1, correctCount = 0, gameCount = 0;

	//path 
	imagePath = "assets/images/";
	soundPath = "assets/sound/";

	//screen attributes
	sceneWidth = 800;
	sceneHeight = 600;
	sceneCenterX = sceneWidth/2;
	sceneCenterY = sceneHeight/2;
	
	callbackFactory = {
	    timer: function() {}
	};

	problems = [
		{
			shadowID: "A",
			shadow: "char1-shadow.png",
			noneshadow: "char1.png"
		},
		{
			shadowID: "B",
			shadow: "char2-shadow.png",
			noneshadow: "char2.png"
		},
		{
			shadowID: "C",
			shadow: "char3-shadow.png",
			noneshadow: "char3.png"
		},
		{
			shadowID: "D",
			shadow: "char4-shadow.png",
			noneshadow: "char4.png"
		},
		{
			shadowID: "E",
			shadow: "char5-shadow.png",
			noneshadow: "char5.png"
		},
		{
			shadowID: "F",
			shadow: "char6-shadow.png",
			noneshadow: "char6.png"
		}
	];
	
	randomItemManager = function() {
	    var IconItemArray, lastGetIdx, size;
	    size = goog.object.getCount(problems);
	    IconItemArray = goog.object.getValues(problems);
	    lastGetIdx = 0;
	    goog.array.shuffle(IconItemArray);
	    return {
	      size: size,
	      getItem: function() {
	        return IconItemArray[lastGetIdx++];
	      },
	      getAll: function() {
	        return IconItemArray;
	      },
	      getAt: function(idx) {
	        return IconItemArray[0];
	      }
	    };
	  };
	
	timerManager = function(opts) {
	    var counter, decreaseBy, delay;
	    if (opts == null) opts = {};
	    counter = opts.limit || 10;
	    delay = opts.delay || 1000;
	    decreaseBy = opts.decreaseBy || 1;
	    if (opts != null) {
	      if (typeof opts.runningCallback === "function") {
	        opts.runningCallback(counter);
	      }
	    }
	    counter = counter - 1;
	    (function() {
	      callbackFactory.timer = function(dt) {
	        if (!(counter > 0)) {
	          if (counter <= 0) {
	            if (opts != null) {
	              if (typeof opts.timeoutCallback === "function") {
	                opts.timeoutCallback(counter);
	              }
	            }
	          }
	        } else {
	          if (opts != null) {
	            if (typeof opts.runningCallback === "function") {
	              opts.runningCallback(counter);
	            }
	          }
	        }
	        return counter = counter - decreaseBy;
	      };
	      return lime.scheduleManager.scheduleWithDelay(callbackFactory.timer, opts.limeScope || callbackFactory, delay);
	    })();
	    return {
	      addTime: function(time) {
	        counter += time;
	        return opts != null ? typeof opts.runningCallback === "function" ? opts.runningCallback(counter) : void 0 : void 0;
	      }
	    };
	  };

// entrypoint
shadow.start = function() {
	var director = new lime.Director(document.body, 800, 600),
        sceneIntro = new lime.Scene(),
		sceneLevel = new lime.Scene(),
        sceneEasyPlay = new lime.Scene(),
		sceneHardPlay = new lime.Scene(),
		sceneScore = new lime.Scene(),
		sprite = new lime.Sprite(),
		score = 0,
		
		setupIntro = function(scene) {
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				startButton = new lime.Sprite(),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(sceneCenterX,100),
				engGamename = new lime.Sprite().setFill(imagePath + "engGamename.png").setPosition(sceneCenterX,200),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430),
				doll = new lime.Sprite().setFill(imagePath + "doll.png").setOpacity(0.1),
				dollShadow = new lime.Sprite().setFill(imagePath + "dollShadow.png"),
				dollLayer = new lime.Layer(),
				gameNameSound = new lime.audio.Audio(soundPath + "gamename.mp3"),
				levelSound = new lime.audio.Audio(soundPath + "level.mp3");
			
			setTimeout(function () {
				gameNameSound.play();
			}, 200);
				
			startButton.domClassName = goog.getCssName('lime-button');
			startButton
				.setFill(imagePath + "startButton.png")
				.setPosition(sceneCenterX, 260);
			
			//add Background to intro screen
			
			dollLayer.setSize(134, 133).setPosition(sceneCenterX, sceneCenterY + 80).setScale(0.9);
			dollLayer
				.appendChild(dollShadow)
				.appendChild(doll);
			
			background
				.appendChild(sky)
				.appendChild(tree3)
				.appendChild(tree1)
				.appendChild(tree2)
				.appendChild(boy)
				.appendChild(girl)
				.appendChild(border)
				.appendChild(startButton)
				.appendChild(gameName)
				.appendChild(engGamename)
				.appendChild(dollLayer);
			
			//add Character to intro screen
			
			scene.appendChild(background);
			
			//begin Button
			
			background.appendChild(startButton);
			
			goog.events.listen(startButton,['click', 'touchstart'], function (e){
				levelSound.play();
				setupLevelScene(sceneLevel);
				director.replaceScene(sceneLevel);	
			});
		},
		
		setupLevelScene = function (scene){
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(sceneCenterX,100),
				engGamename = new lime.Sprite().setFill(imagePath + "engGamename.png").setPosition(sceneCenterX,200),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430).setOpacity(0.2),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420).setOpacity(0.2),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500).setOpacity(0.2),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450).setOpacity(0.1),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430).setOpacity(0.1),
				easyButtonLayer = new lime.Layer().setSize(303, 80).setPosition(sceneCenterX,sceneCenterY),
				hardButtonLayer = new lime.Layer().setSize(303, 80).setPosition(sceneCenterX, sceneCenterY + 90),
				blueButton1 = new lime.Sprite().setFill(imagePath + "blueButton.png"),
				blueButton2 = new lime.Sprite().setFill(imagePath + "blueButton.png"),
				easyText = new lime.Sprite().setFill(imagePath + "level1.png"),
				hardText = new lime.Sprite().setFill(imagePath + "level2.png"),
				beginSound = new lime.audio.Audio(soundPath + "begin.wav");
			
			easyButtonLayer.domClassName = goog.getCssName('lime-button');
			easyButtonLayer
				.appendChild(blueButton1)
				.appendChild(easyText);
				
			hardButtonLayer.domClassName = goog.getCssName('lime-button');
			hardButtonLayer
				.appendChild(blueButton2)
				.appendChild(hardText);
			
			//add Background to intro screen
			
			background
				.appendChild(sky)
				.appendChild(tree3)
				.appendChild(tree1)
				.appendChild(tree2)
				.appendChild(boy)
				.appendChild(girl)
				.appendChild(border)
				.appendChild(gameName)
				.appendChild(engGamename)
				.appendChild(easyButtonLayer)
				.appendChild(hardButtonLayer);
			
			//add Character to intro screen
			
			scene.appendChild(background);
			
			goog.events.listen(easyButtonLayer, ['click','touchstart'], function (e){
				beginSound.play();
				setupEasyGame(sceneEasyPlay);
				director.replaceScene(sceneEasyPlay);
			});
			
			goog.events.listen(hardButtonLayer, ['click', 'touchstart'], function (e){
				beginSound.play();
				setupHardGame(sceneHardPlay);
				director.replaceScene(sceneHardPlay);
			});
		},
		
		setupEasyGame = function (scene) {
			//UI Element
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(230,50).setScale(0.6),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430).setOpacity(0.2),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420).setOpacity(0.2),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500).setOpacity(0.2),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450).setOpacity(0.1),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430).setOpacity(0.1),
				tv = new lime.Sprite().setFill(imagePath + "tv.png").setPosition(sceneCenterX,sceneCenterY-30),
				timer = new lime.Sprite().setFill(imagePath + "timer.png").setPosition(700,100),
				themeSound = new lime.audio.Audio(soundPath + "theme.mp3"),
				buttonSound = new lime.audio.Audio(soundPath + "button.mp3"),
				correctSound = new lime.audio.Audio(soundPath + "correct.mp3"),
				incorrectSound = new lime.audio.Audio(soundPath + "incorrect.mp3"),
				timerLabel = new lime.Label()
					.setSize(50,60)
					.setFontSize(30)
					.setPosition(timer.getPosition().x, timer.getPosition().y + 30)
					.setFontColor('#000'),
				allChoice,problem, //Helper Function
				generateProblem = function (){
					var randomX = Math.floor(Math.random()*450) + 120;
						randomY = Math.floor(Math.random()*150) + 200;
						randomRotation = Math.floor(Math.random()*350);
						randomManager = randomItemManager();
						shadowProblem = randomManager.getItem();
						problemShadow = new lime.Sprite().setFill(imagePath + shadowProblem.shadow).setPosition(randomX, randomY).setScale(0.7).setRotation(randomRotation);
					return problemShadow;
				},
				buildChoice = function () {
					var buildChoiceAnswer = function (imageName, isCorrect){
						var answerLayer = new lime.Layer(),
							wood = new lime.Sprite().setFill(imagePath + "woodborder.bmp").setScale(0.8),
							choiceImage = new lime.Sprite().setFill(imagePath + imageName).setScale(0.3),
							isCorrect,tmp;
							
						answerLayer.domClassName = goog.getCssName('lime-button');
						
						answerLayer
							.appendChild(wood)
							.appendChild(choiceImage)
							.setSize(139, 117);
							
						!function(localLayer) {
							goog.events.listen(localLayer, ['click', 'touchstart'], function (e){
								buttonSound.stop();
								buttonSound.play();
								if(isCorrect){
									console.log("correct");
									problem.setFill(imagePath + imageName);
									correctSound.stop();
									correctSound.play();
									choiceLabel.removeChild(localLayer);
									spawnAnimationWithString("correct");
									score += 5;
									++gameCount;
									if (gameCount >= 3)
										choiceAmount = 4;
										
									setTimeout(function () {
										scene
											.removeChild(problemShadow)
											.removeChild(choiceLabel);
										problem = generateProblem();
										allChoice = generateChoice(choiceAmount);
										choiceLabel = buildChoice();
										scene
											.appendChild(problemShadow)
											.appendChild(choiceLabel);
									}, 1000);
								}else {
									console.log("incorrect");
									incorrectSound.stop();
									incorrectSound.play();
									spawnAnimationWithString("incorrect");
									choiceLabel.removeChild(localLayer);
								}
							});
						}(answerLayer)
						
						return answerLayer;
					}; 
					
					var choiceLabel = new lime.Node();
					
					var startPosX = gap = 200;
					if(choiceAmount == 4){
						startPosX = 220;
						gap = 150;
					}
						var posX = sceneCenterX - startPosX;
						allChoice.forEach (function (element, index, array){
							isCorrect = (shadowProblem.shadowID == element.shadowID);
							tmp = buildChoiceAnswer(element.noneshadow, isCorrect);
							tmp.setPosition(posX, sceneCenterY + 210);

							choiceLabel.appendChild(tmp);	
							posX = posX + gap;
						});
					
					
					return choiceLabel;
				},
				generateChoice = function (c){
					var allChoiceTMP;
					while(true){
						var exist = false;
						randomManager2 = randomItemManager();
						allData = randomManager2.getAll();
						allChoiceTMP = goog.array.slice(allData,0,c);

						allChoiceTMP.forEach (function (element, index, array){
							if (element.shadowID === shadowProblem.shadowID){
								exist = true;
							}
						});

						if(exist === true)
							break;
					}

					for(var i=0; i<3; ++i){
						goog.array.shuffle(allChoiceTMP);
					}
					
					return allChoiceTMP;
				},
				spawnAnimationWithString = function (s){
					var spawnImage;
					if (s == "correct"){
						spawnImage = new lime.Sprite().setFill(imagePath + "correct.png").setScale(0.8).setPosition(sceneCenterX, sceneCenterY);
					}else if (s == "incorrect"){
						spawnImage = new lime.Sprite().setFill(imagePath + "incorrect.png").setScale(0.8).setPosition(sceneCenterX, sceneCenterY);
					}
					var spawnAnimation = new lime.animation.Sequence(
							new lime.animation.FadeTo(1).setDuration(0.5),
							new lime.animation.FadeTo(0).setDuration(0.5)
						);
					spawnImage.runAction(spawnAnimation);
					scene.appendChild(spawnImage);
				}
				
				setTimeout(function () {
					themeSound.baseElement.loop = true;
					themeSound.play();
				}, 500);
				
				background
					.appendChild(sky)
					.appendChild(tree3)
					.appendChild(tree1)
					.appendChild(tree2)
					.appendChild(boy)
					.appendChild(girl)
					.appendChild(tv)
					.appendChild(timer)
					.appendChild(border)
					.appendChild(gameName)
					
				problem = generateProblem();
				allChoice = generateChoice(3);
				choiceLabel = buildChoice();
				
				timerManager({
			      limit: 30,
			      delay: 1000,
			      limeScope: callbackFactory,
			      runningCallback: function(rt) {
			        return timerLabel.setText(rt);
			      },
			      timeoutCallback: function(rt) {
			        timerLabel.setText("0 ");
			        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
			        console.log("Game Ended --> Score is: " + score);
			
					if (themeSound.isPlaying())
						themeSound.stop();
			
					setupScoreScene(sceneScore);
					director.replaceScene(sceneScore);
			      }
			    })
				
				scene
					.appendChild(background)
					.appendChild(problem)
					.appendChild(choiceLabel)
					.appendChild(timerLabel);
		},
					
		setupHardGame = function (scene){
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(230,50).setScale(0.6),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430).setOpacity(0.2),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420).setOpacity(0.2),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500).setOpacity(0.2),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450).setOpacity(0.1),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430).setOpacity(0.1),
				tv = new lime.Sprite().setFill(imagePath + "tv.png").setPosition(sceneCenterX,sceneCenterY-30),
				timer = new lime.Sprite().setFill(imagePath + "timer.png").setPosition(700,100),
				themeSound = new lime.audio.Audio(soundPath + "theme.mp3"),
				buttonSound = new lime.audio.Audio(soundPath + "button.mp3"),
				correctSound = new lime.audio.Audio(soundPath + "correct.mp3"),
				incorrectSound = new lime.audio.Audio(soundPath + "incorrect.mp3"),
				timerLabel = new lime.Label()
					.setSize(50,60)
					.setFontSize(30)
					.setPosition(timer.getPosition().x, timer.getPosition().y + 30)
					.setFontColor('#000'),
				problemArray, allChoice, shadowLayer,
				
				generateProblem = function (pbAmount){
					var randomManager = randomItemManager(),
						pbsArray = randomManager.getAll(),
						pbsTMP = [];
					for(var i=0; i<pbAmount; i++){
						 pbsTMP.push(pbsArray[i]);
					}
					return pbsTMP;
				},
				generateShadow = function (pArray){
					var shadowArrayTMP = [], shadowLayerTMP = new lime.Layer().setSize(800, 600);
					goog.array.forEach(pArray, function (element, index){
						var randomX = Math.floor(Math.random()*450) + 120,
							randomY = Math.floor(Math.random()*150) + 200,
							randomRotation = Math.floor(Math.random()*350);
						shadowArrayTMP.push(new lime.Sprite().setFill(imagePath + element.shadow).setPosition(randomX, randomY).setScale(0.7).setRotation(randomRotation));
					});
					
					goog.array.forEach(shadowArrayTMP, function (element, index){
						shadowLayerTMP.appendChild(element);
					});
					
					return shadowLayerTMP;
				},
				
				generateChoice = function (c){
					var allChoiceTMP = [], choiceWithoutProblem = [];
					
					problemArray.forEach(function (element, index, array){
						allChoiceTMP.push(element);
					});
					
					moreChoice = c - problemArray.length;
					
					// create list of choice without problems
					goog.array.forEach(problems, function (elementA, index){
						var exist = false;
						goog.array.forEach(problemArray, function (elementB, index){
							if (elementA.shadowID == elementB.shadowID)
								exist = true;
						});
						
						if (!exist)
							choiceWithoutProblem.push(elementA);
					});
					
					//shuffle the above list
					goog.array.shuffle(choiceWithoutProblem);
					
					for (var i=0; i<moreChoice; ++i){
						allChoiceTMP.push(choiceWithoutProblem[i]);
					}
					
					for (var i=0; i<3; ++i){
						goog.array.shuffle(allChoiceTMP);
					}
					
					return allChoiceTMP;
				},
				setupChoice = function(cArray){
					var isCorrect, choiceTMP;
					var createEachChoice = function (imageName, isCorrect){
						var choiceLayer = new lime.Layer(),
							wood = new lime.Sprite().setFill(imagePath + "woodborder.bmp").setScale(0.8),
							image = new lime.Sprite().setFill(imagePath + imageName).setScale(0.3);
						
						choiceLayer.domClassName = goog.getCssName('lime-button');
						choiceLayer
							.appendChild(wood)
							.appendChild(image)
							.setSize(139, 117);
						
						!function (localChoice){
							goog.events.listen(localChoice, ['click', 'touchstart'], function (e){
								buttonSound.stop();
								buttonSound.play();
								if (isCorrect){
									console.log("correct");
									correctSound.stop();
									correctSound.play();
									spawnAnimationWithString("correct");
									allChoiceLayer.removeChild(localChoice);
									score += 5;
									++gameCount;
									++correctCount;
									
									//change scene
									if (correctCount == problemAmount){
										//change to hard mose
										if (gameCount >= 5){
											choiceAmount = 4;
											problemAmount = 2;
										}
										
										setTimeout(function () {
											scene
												.removeChild(shadowLayer)
												.removeChild(allChoiceLayer);

											problemArray = generateProblem(problemAmount);
											allChoice = generateChoice(choiceAmount);
											shadowLayer = generateShadow(problemArray);
											choiceLayer = setupChoice(allChoice);

											scene
												.appendChild(shadowLayer)
												.appendChild(choiceLayer);
										}, 1000);
										correctCount = 0;
									}
								}else {
									console.log("incorrect");
									incorrectSound.stop();
									incorrectSound.play();
									spawnAnimationWithString("incorrect");
									allChoiceLayer.removeChild(localChoice);
								}
							});
						}(choiceLayer)
					
						return choiceLayer;
					};
					
					var allChoiceLayer = new lime.Node(),
						diffPosX = choiceGap = 200;
					if(choiceAmount == 4){
						diffPosX = 220;
						choiceGap = 150;
					}
					
					var posX = sceneCenterX - diffPosX;
					goog.array.forEach(cArray, function (elementA, index){
						isCorrect = false;
						goog.array.forEach(problemArray, function (elementB, index){
							if (elementB.shadowID == elementA.shadowID)
								isCorrect = true;
						});
						choiceTMP = createEachChoice(elementA.noneshadow, isCorrect);
						choiceTMP.setPosition(posX, sceneCenterY + 210);
						allChoiceLayer.appendChild(choiceTMP);
						posX += choiceGap;
					});
					
					return allChoiceLayer;
				},
				spawnAnimationWithString = function (s){
					var spawnImage;
					if (s == "correct"){
						spawnImage = new lime.Sprite().setFill(imagePath + "correct.png").setScale(0.8).setPosition(sceneCenterX, sceneCenterY);
					}else if (s == "incorrect"){
						spawnImage = new lime.Sprite().setFill(imagePath + "incorrect.png").setScale(0.8).setPosition(sceneCenterX, sceneCenterY);
					}
					var spawnAnimation = new lime.animation.Sequence(
							new lime.animation.FadeTo(1).setDuration(0.5),
							new lime.animation.FadeTo(0).setDuration(0.5)
						);
					spawnImage.runAction(spawnAnimation);
					scene.appendChild(spawnImage);
				}
				
				setTimeout(function () {
					themeSound.baseElement.loop = true;
					themeSound.play();
				}, 500);
				
				// add element to Background
				background
					.appendChild(sky)
					.appendChild(tree3)
					.appendChild(tree1)
					.appendChild(tree2)
					.appendChild(boy)
					.appendChild(girl)
					.appendChild(tv)
					.appendChild(timer)
					.appendChild(border)
					.appendChild(gameName)
				
				
				// timer 
				timerManager({
			      limit: 30,
			      delay: 1000,
			      limeScope: callbackFactory,
			      runningCallback: function(rt) {
			        return timerLabel.setText(rt);
			      },
			      timeoutCallback: function(rt) {
			        timerLabel.setText("0 ");
			        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
			        console.log("Game Ended --> Score is: " + score);
			
					if (themeSound.isPlaying())
						themeSound.stop();
					
					setupScoreScene(sceneScore);
					director.replaceScene(sceneScore);
			      }
			    })
			
				//----------------------------------------------
				
				problemArray = generateProblem(problemAmount);
				allChoice = generateChoice(choiceAmount);
				shadowLayer = generateShadow(problemArray);
				choiceLayer = setupChoice(allChoice); 
				
				//add element to screen
				scene
					.appendChild(background)
					.appendChild(timerLabel)
					.appendChild(shadowLayer)
					.appendChild(choiceLayer);
		},
		
		setupScoreScene = function (scene) {
			var background = new lime.Layer().setSize(sceneWidth,sceneHeight).setPosition(0,0),
				border = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "border.png").setPosition(0, 0),
				sky = new lime.Sprite().setAnchorPoint(0, 0).setFill(imagePath + "sky.bmp").setSize(sceneWidth-50,sceneHeight-50).setPosition(25, 20),
				gameName = new lime.Sprite().setFill(imagePath + "gamename.png").setPosition(230,50).setScale(0.6),
				tree1 = new lime.Sprite().setFill(imagePath + "tree1.png").setPosition(90,430).setOpacity(0.2),
				tree2 = new lime.Sprite().setFill(imagePath + "tree2.png").setPosition(650,420).setOpacity(0.2),
				tree3 = new lime.Sprite().setFill(imagePath + "tree3.png").setPosition(400,500).setOpacity(0.2),
				boy = new lime.Sprite().setFill(imagePath + "boyBG.png").setPosition(600,450).setOpacity(0.1),
				girl = new lime.Sprite().setFill(imagePath + "girlBG.png").setPosition(280,430).setOpacity(0.1),
				tv = new lime.Sprite().setFill(imagePath + "tv.png").setPosition(sceneCenterX,sceneCenterY-30),
				bless = new lime.Label().setText("เก่งมากจ้ะ").setFontSize(32).setPosition(sceneCenterX - 50, sceneCenterY - 50),
				timeoutSound = new lime.audio.Audio(soundPath + "timeout.wav"),
				getScoreLabel = new lime.Label().setText("หนูทำได้    " + score + "    คะแนน").setFontSize(32).setPosition(sceneCenterX - 50, sceneCenterY);
				
				setTimeout(function () {
					timeoutSound.play();
				}, 200);
				
				background
					.appendChild(sky)
					.appendChild(tree3)
					.appendChild(tree1)
					.appendChild(tree2)
					.appendChild(boy)
					.appendChild(girl)
					.appendChild(tv)
					.appendChild(border)
					.appendChild(gameName);
					
				scene
					.appendChild(background)
					.appendChild(bless)
					.appendChild(getScoreLabel);
		}
		
	// set up intro layer
    setupIntro(sceneIntro);

	// set current scene active
	director.replaceScene(sceneIntro);
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('shadow.start', shadow.start);
