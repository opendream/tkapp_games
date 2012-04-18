//set main namespace
goog.provide('question');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.GlossyButton');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.Easing');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.audio.Audio');

// entrypoint
question.start = function() {
    var director = new lime.Director(document.body, 800, 600),
        sceneIntro = new lime.Scene(),
        sceneChoice = new lime.Scene(),
		sceneScore = new lime.Scene(),
		correctSound = new lime.audio.Audio("assets_q/sound/correct-sound.mp3"),
		incorrectSound = new lime.audio.Audio("assets_q/sound/wrong-sound.mp3"),
		bgSound = new lime.audio.Audio("assets_q/sound/theme-song.mp3"),
		endedSound = new lime.audio.Audio("assets_q/sound/sound70.mp3"),
		no = 0,
		score = 0,
		sprite = new lime.Sprite(),
        text = {
            arrowText: "เริ่มทำแบบทดสอบ",
            boardText: "แบบทดสอบมีทั้งหมด 10 ข้อ",
            nextQuestion: "ข้อถัดไป",
			sumScore: "รวมคะแนนทั้งหมด",
			maxScore: "คะแนนเต็ม 10 คะแนน",
			getScoreText: "ทำได้",
			getScoreText2: "คะแนน",
			exitText: "ออก"
        },
        background = function () {
            var background = {};

            background.normal = new lime.Sprite()
                .setAnchorPoint(0, 0)
                .setPosition(0, 0)
                .setFill("assets_q/bg1.jpg");
			
			background.correct = new lime.Sprite()
				.setAnchorPoint(0, 0)
				.setPosition(0, 0)
				.setFill("assets_q/bg2.jpg");
			
			background.incorrect = new lime.Sprite()
				.setAnchorPoint(0, 0)
				.setPosition(0, 0)
				.setFill("assets_q/bg3.jpg");

            return background;
        },
        doctor = function () {
            var doctor = {};

            doctor.normal = new lime.Sprite()
                .setFill("assets_q/doctor.png")
                .setPosition(650, 410);

			doctor.correct = new lime.Sprite()
				.setFill("assets_q/doctor-correct.png")
				.setPosition(645, 410);
				
			doctor.incorrect = new lime.Sprite()
				.setFill("assets_q/doctor-wrong.png")
				.setPosition(630, 410);

            return doctor;
        },
		setupScore = function (scene){
			var bird = new lime.Sprite(),
				doctor = new lime.Sprite(),
				board = new lime.Sprite(),
				boardText = new lime.Label(),
				boardText2 = new lime.Label(),
				boardText3 = new lime.Label(),
				boardText4 = new lime.Label(),
				scoreText = new lime.Label(),
				medal = new lime.Sprite();
				
				//set medal
				var getMedal;
				if (score >= 0 && score < 4)
					getMedal = "assets_q/bronze-prize.png";
				else if (score >= 4 && score < 7)
					getMedal = "assets_q/silver-prize.png";
				else if (score >= 7 && score <= 10)
					getMedal = "assets_q/gold-prize.png";
					
				medal
					.setFill(getMedal)
					.setPosition(270,285);
				
				// set board
	            board
	                .setFill("assets_q/board.png")
	                .setPosition(408, 358);

	            boardText
	                .setText(text.sumScore)
	                .setFontSize(35)
	                .setFontColor('#FFF')
	                .setPosition(400, 160);
				
				boardText2
					.setText(text.maxScore)
					.setFontSize(30)
					.setFontColor('#FFF')
					.setPosition(400, 335);
					
				boardText3
					.setText(text.getScoreText)
					.setFontSize(30)
					.setFontColor('#FFF')
					.setPosition(300,385);
				
				boardText4
					.setText(text.getScoreText2)
					.setFontSize(30)
					.setFontColor('#FFF')
					.setPosition(410,385)
						
				scoreText
					.setText(score)
					.setFontSize(30)
					.setFontColor('#FFF')
					.setPosition(350,385);

				// set doctor
				doctor
					.setFill("assets_q/doctor-write.png")
					.setPosition(675,395);

	            scene
	                .appendChild(background().normal)
	                .appendChild(board)
	                .appendChild(boardText)
					.appendChild(boardText2)
					.appendChild(boardText3)
					.appendChild(boardText4)
					.appendChild(scoreText)
	                .appendChild(doctor)
					.appendChild(medal)
	                .appendChild(bird);
		},
        setupIntro = function (scene) {
            var arrow = new lime.Sprite(),
                arrowText = new lime.Label(),
                bird = new lime.Sprite(),
                board = new lime.Sprite(),
                boardText = new lime.Label(),
                arrowLayer = new lime.Layer();
			
			// if (bgSound.isLoaded()){
			// 				bgSound.baseElement.loop = true;
			// 				bgSound.play();
			// 			}
			setTimeout(function () {
				bgSound.baseElement.loop = true;
				bgSound.play();
			}, 500);
			
            // set board
            board
                .setFill("assets_q/txt-quiz.png")
                .setPosition(408, 358);

            boardText
                .setText(text.boardText)
                .setFontSize(24)
                .setFontColor('#FFF')
                .setPosition(400, 430);

            // set bird
            bird
                .setFill("assets_q/bird.png")
                .setPosition(400, 89);

            arrowLayer
                .setSize(225, 99)
                .setPosition(400, 100);

            // set arrow
            arrow
                .setPosition(10, 43)
                .setSize(225, 99)
                .setFill("assets_q/arrow.png");
            // set label
            arrowText
                .setText(text.arrowText)
                .setFontSize(24)
                .setFontColor('#FFF')
                .setPosition(10, 48);

            // add both to layer
            arrowLayer.domClassName = goog.getCssName('lime-button');
            arrowLayer
                .appendChild(arrow)
                .appendChild(arrowText);

            scene
                .appendChild(background().normal)
                .appendChild(board)
                .appendChild(boardText)
                .appendChild(doctor().normal)
                .appendChild(arrowLayer)
                .appendChild(bird);

            // bind event
            // goog.events.listen(arrowLayer, 'mouseover', function (e) {
            //     arrowLayer.runAction(
            //         new lime.animation.ScaleTo(1.1).setDuration(0));

            //     // bird.runAction(new lime.animation.Sequence(
            //     //     // new lime.animation
            //     //     //         .MoveBy(0, -10)
            //     //     //         .setDuration(.05)
            //     //     //         .setEasing(lime.animation.Easing.EASEIN),
            //     //     // new lime.animation
            //     //     //         .MoveBy(0, 8)
            //     //     //         .setDutation(.05)
            //     //     //         .setEasing(lime.animation.Easing.EASEOUT)
            //     // ));
                   
            //     e.swallow('mouseout', function () {
            //         arrowLayer.runAction(
            //             new lime.animation.ScaleTo(1.0).setDuration(.05));

            //         // bird.runAction(
            //         //     new lime.animation.MoveBy(0, 2).setDutation(.05));
            //     });
            // });

            goog.events.listen(arrowLayer, 'click', function (e) {
            	director.replaceScene(sceneChoice);
            });

        },
        setupChoice = function (scene) {
            var board = new lime.Sprite(),
                backgroundNormal = background().normal,
				backgroundCorrect = background().correct,
				backgroundIncorrect = background().incorrect,
                doctorNormal = doctor().normal,
				doctorCorrect = doctor().correct,
				doctorIncorrect = doctor().incorrect,
                nextButton = function () {
                    var layer = new lime.Layer(),
                        arrow = new lime.Sprite(),
                        arrowText = new lime.Label();

                    arrow
                        .setFill("assets_q/arrow2.png")
                        .setSize(173, 76)
                        .setPosition(90, 40);

                    arrowText
                        .setText(text.nextQuestion)
                        .setFontColor('#FFF')
                        .setFontSize(24)
                        .setPosition(84, 46);

                    layer
                        .appendChild(arrow)
                        .appendChild(arrowText)
                        .setSize(180, 80)
                        .setPosition(122, 452);
					
					layer.domClassName = goog.getCssName('lime-button');
                    
					goog.events.listen(layer, 'click', function (e) {
							scene.removeChild(choiceLabel);
							no = no + 1;
							if(no < 10){
								choiceLabel = buildChoice(choice[no]);
								scene.appendChild(choiceLabel);
								scene.removeChild(nextButton);
								scene.removeChild(sprite);
								
								scene.appendChild(backgroundNormal,0);
								if(scene.getChildIndex(backgroundCorrect) !== false){
									scene.removeChild(backgroundCorrect);
								}
								if(scene.getChildIndex(backgroundIncorrect) !== false){
									scene.removeChild(backgroundIncorrect);
								}
								
								
								if(scene.getChildIndex(doctorCorrect) !== false){
									scene.removeChild(doctorCorrect);
								}
								if(scene.getChildIndex(doctorIncorrect) !== false){
									scene.removeChild(doctorIncorrect);
								}
								scene.appendChild(doctorNormal);
								
								if(correctSound.isPlaying()){
									correctSound.stop();
								}
								if(incorrectSound.isPlaying()){
									incorrectSound.stop();
								}
							}else{
								//set up Score Layer
								//var medal = scoreManager(score);
								if (bgSound.isPlaying()){
									bgSound.stop();
								}
								endedSound.play();
								setupScore(sceneScore);
								director.replaceScene(sceneScore);
							}        
						});

                    return layer;
                } (),
                choice = [
				{
					question: "1. บ้านของยายละไมมีลักษณะเป็นแบบใด",
                    choices: [
                        "บ้านตึกแถว",
                        "บ้านริมคลอง",
                        "บ้านเรือนไทย",
						"บ้านชั้นเดียว"
                    ],
                    correct: 3
				},
				{
					question: "2. ข้อใดไม่ใช่ลักษณะของดอกรัก",
                    choices: [
                        "เป็นหมาพันธุ์ดี ตัวอ้วน ตัวใหญ่",
                        "วิ่งซนตลอดเวลา ไม่เคยอยู่เฉย",
                        "ชอบกัดของให้เป็นชิ้นเล็กๆ",
						"บนตัวมีจุดดำอยู่สองแห่ง"
                    ],
                    correct: 1
				},
				{
					question: "3. เกิดอะไรขึ้นขณะที่ยายละไมนั่งหยอดดินสอพอง",
                    choices: [
                        "ดอกรักกัดหมอนขาดกระจุย",
                        "ตะแกรงดินสอพองตกพื้นแตก",
                        "ดอกรักเหยียบดินสอพองเสียหาย",
						"ทางมะพร้าวตกจากระเบียงบ้าน"
                    ],
                    correct: 3
				},
				{
					question: "4. ทำไมดอกรักจึงงับมือยายละไมขณะที่ยายหยอดดินสอพอง",
                    choices: [
                        "ชวนยายละไมไปเล่นด้วยกัน",
                        "อยากให้ยายละไมอารมณ์ดี",
                        "อยากกินขนมของยายละไม",
						"เห็นมือยายละไมเป็นขนม"
                    ],
                    correct: 2
				},
				{
					question: "5. ดอกรักทำอย่างไร เพื่อชวนให้คนมาเล่นด้วย",
                    choices: [
                        "เห่าเสียงดัง",
                        "กระโดดเข้าใส่",
                        "ชันหูเอียงคอให้",
						"งับขาคนๆ นั้นเบาๆ"
                    ],
                    correct: 3
				},
				{
					question: "6. ''ดินสอพอง'' คืออะไร",
                    choices: [
                        "อาหารเสริมชนิดหนึ่ง",
                        "เครื่องประทินผิวชนิดหนึ่ง",
                        "อุปกรณ์ใช้ผสมสีสำหรับวาดรูป",
						"ดินสอที่มีขนาดใหญ่ขึ้นเมื่อโดนความร้อน"
                    ],
                    correct: 2
				},
				{
					question: "7. ''ว้าเหว่'' มีความหมายตรงกับข้อใด",
                    choices: [
                        "ดอกรักชอบแหย่แม่ของมันบ่อยๆ",
                        "ดอกรักจะกระดิกหางให้เมื่อมีคนมอง",
                        "ดอกรักหงอยเหงาเพราะไม่มีใครสนใจ",
						"ดอกรักนอนหมอบนอกชานมองยายละไม"
                    ],
                    correct: 3
				},
				{
					question: "8. เหตุการณ์ใดที่ยายละไมไม่ควรดุดอกรักที่สุด",
                    choices: [
                        "ยืนกระดิกหางให้ยายละไม",
                        "กัดทึ้งสิ่งของกระจัดกระจาย",
                        "ถลาเหยียบตะแกรงดินสอพอง",
						"งับมือของยายละไมขณะหยอดดินสอพอง"
                    ],
                    correct: 1
				},
				{
					question: "9. ดอกรักรู้สึกอย่างไรเมื่อยายละไมดุเอา",
                    choices: [
                        "งุนงง",
                        "น้อยใจ",
                        "โศกเศร้า",
						"สำนึกผิด"
                    ],
                    correct: 1
				},
				{
					question: "10. ขอ้ดีของดอกรักคืออะไร",
                    choices: [
                        "ดอกรักมักจะเอาของในบ้านมากัดเล่น",
                        "ดอกรักคอยชวนแม่ของมันเล่นบ่อยๆ",
                        "ขณะที่คนอื่นพักผ่อน ดอกรักจะวิ่งไปทั่ว",
						"แม้จะโดนดุบ่อยๆ แต่ดอกรักก็ยังรักยายละไม"
                    ],
                    correct: 4
				}
                ],
                buildChoice = function (choice) {
                    var buildChoiceAnswer = function (text, isCorrect) {
                        var normalColor = '#990000',
                            hoverColor = '#003399',
                            answer = new lime.Label(),
                            list = new lime.Layer(),
                            pin = new lime.Circle(),
                            answer,
                            isCorrect;

                        list.domClassName = goog.getCssName('lime-button');

                        list
                            .appendChild(pin)
                            .appendChild(answer)
                            .setSize(300, 50);

                        pin
                            .setSize(16, 16)
                            .setPosition(-160, -10)
                            .setFill(normalColor);

                        answer
                            .setText(text)
                            .setAlign('left')
                            .setFontSize(20)
                            .setSize(250, 50)
                            .setPosition(5, 5)
                            .setFontColor(normalColor);

                        goog.events.listen(answer, ['mouseover', 'mousemove'], function (e) {
                            answer.setFontColor(hoverColor);
                            pin.setFill(hoverColor);

                            e.swallow('mouseout', function () {
                                answer.setFontColor(normalColor);
                                pin.setFill(normalColor);
                            });
                        });

						!function(localList) {
							 goog.events.listen(localList, 'click', function (e) {
									goog.array.forEach(localList.getParent().children_, function(e, i, arr) {
									  goog.events.removeAll(e)
									});
									
									answer.setFontColor(hoverColor);
		                            pin.setFill(hoverColor);
		
									scene.removeChild(doctorNormal);
									scene.removeChild(backgroundNormal);
		                            if (isCorrect) {
		                                scene.appendChild(nextButton);
										scene.appendChild(doctorCorrect);
										scene.appendChild(backgroundCorrect,0);
										score = score + 1;
										
										//sound when correct
										
										correctSound.play();
										
										//light effect when correct
										
										sprite
											.setSize(800, 600)
											.setAnchorPoint(0, 0) //0.5,1
											.setPosition(0, 0) //400, 600
											.setFill("assets_q/set-animation-1.png")
											.setScale(1.0);
										scene.appendChild(sprite,1);
										
										var animation = new lime.animation.KeyframeAnimation();
										animation.setDelay(0.01);
										for (var i=1; i<=6; ++i){
												animation.addFrame("assets_q/set-animation-" + i + ".png");
										}
										sprite.runAction(animation);
										
		                            }else {
										incorrectSound.play();		
										scene.appendChild(nextButton);
										scene.appendChild(doctorIncorrect);
										scene.appendChild(backgroundIncorrect,0);
									}
		                        });							
						}(list)
                       

                        return list;
                    };

                    var choiceLabel = new lime.Node();

                    // make question label
                    choiceLabel.appendChild(
                        new lime.Label()
                                .setSize(440, 100)
                                .setText(choice.question)
                                .setFontSize(28)
                                .setFontColor('#990000')
                                .setPosition(300, 135)
                    );

                    // make answer label
                    for (i in choice.choices) {
                        isCorrect = (parseInt(i) === (choice.correct - 1));
                        answer = buildChoiceAnswer(choice.choices[i], isCorrect);
                        answer.setPosition(340, 260 + (i * 50));

                        choiceLabel.appendChild(answer);
                    }
					
                    return choiceLabel;
                };

            board
                .setFill("assets_q/board2.png")
                .setPosition(300, 300);

			choiceLabel = buildChoice(choice[no]);
            
            scene
                .appendChild(backgroundNormal)
                .appendChild(board)
                .appendChild(doctorNormal)
                .appendChild(choiceLabel);
        };
    
    // set up intro layer
    setupIntro(sceneIntro);

    // set up choice layer
    setupChoice(sceneChoice);
	
	// set current scene active
	director.replaceScene(sceneIntro); //sceneIntro
	
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('question.start', question.start);
