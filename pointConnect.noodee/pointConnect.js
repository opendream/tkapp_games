(function() {
  var clickSound, IconItem, IconText, addCharacter, blockPattern, blockPatternHard, buildSetOfAnimation, callbackFactory, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth, spawnQuestionAndAnswer, startTimer;

  goog.provide('pointConnect');

  goog.require('lime.Director');

  goog.require('lime.Scene');

  goog.require('lime.Layer');

  goog.require('lime.Circle');

  goog.require('lime.Label');

  goog.require('lime.Button');

  goog.require('lime.RoundedRect');

  goog.require('lime.fill.LinearGradient');

  goog.require('lime.animation.Spawn');

  goog.require('lime.animation.Sequence');

  goog.require('lime.animation.FadeTo');

  goog.require('lime.animation.ScaleTo');

  goog.require('lime.animation.MoveTo');

  goog.require('lime.animation.MoveBy');

  goog.require('lime.animation.ScaleBy');

  goog.require('lime.audio.Audio');

  goog.require('goog.array');

  goog.require('lime.GlossyButton');

  sceneWidth = 800;

  sceneHeight = 600;

  sceneCenterX = sceneWidth / 2;

  sceneCenterY = sceneHeight / 2;

  callbackFactory = {
    timer: function() {}
  };

  this.allScenes = [];

  pointConnect.isGameEnded = false;

  this.score = (function() {
    var add, getScore, reset, _score;
    _score = 0;
    add = function() {
      _score+=1;
      return this;
    };
    reset = function() {
      return _score = 0;
    };
    getScore = function() {
      return _score;
    };
    return {
      getScore: getScore,
      add: add,
      reset: reset
    };
  })();



  addCharacter = function(image, opts) {
    var char2acter, height, posX, posY, weight, width;
    char2acter = new lime.Sprite;
    char2acter.setFill("assets/images/" + image);
    if ((opts.absolutePosition != null) === true || (opts.absolute != null) === true) {
      posX = opts.x;
      posY = opts.y;
    } else {
      posX = sceneCenterX + opts.x;
      posY = sceneCenterY + opts.y;
    }
    if (opts.w != null) width = opts.w;
    if (opts.h != null) height = opts.h;
    weight = weight || 100;
    if ((opts.x != null) && (opts.y != null)) char2acter.setPosition(posX, posY);
    if ((opts.w != null) && (opts.h != null)) char2acter.setSize(width, height);
    opts.at.appendChild(char2acter, weight);
    if (typeof opts.callback === "function") opts.callback(char2acter);
    if (opts.name != null) char2acter.name = opts.name;
    return char2acter;
  };

  startTimer = function(opts) {
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
    return (function() {
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
  };



  pointConnect.start = function() {
    var scene;
    pointConnect.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    try {
      this.theme = new lime.audio.Audio("assets/sound/theme-song.mp3");
      this.theme.baseElement.loop = true;

    } catch (e) {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.log === "function") console.log(e);
      }
    }
    return scene = pointConnect.intro();
  };
  pointConnect.stop = function() { 
      this.theme.stop();
      lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
  };
  pointConnect.intro = function() {
    var background, btnStart, btnState1, btnState2, scene;
    pointConnect.isGameEnded = false;
    this.allScenes = [];
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    var gameNameSound = new lime.audio.Audio("assets/sound/gamename.mp3");
    lime.scheduleManager.callAfter(function(){gameNameSound.play()}, gameNameSound, 500)
    //this.gameNameSound = new lime.audio.Audio("assets/sound/gamename.mp3");
    //this.gameNameSound.play();
    scene.appendChild(background);
    addCharacter("scene_bg.png", {
      x: 2,
      y: 10,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.8);
      }
    });

    var _arrow = addCharacter("arrow.png", {
      x: 200,
      y: 140,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.9);
      }
    });
    var click = new lime.Label().setFontSize(23).setFontColor("#FFF").setText("CLICK").setPosition(sceneWidth*0.73,sceneHeight*0.73);
    background.appendChild(click);

    addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.95, 0.9);
      }
    });
    
 

    btnState1 = new lime.Sprite().setFill('assets/images/btn_start_normal.png');
    btnState2 = new lime.Sprite().setFill('assets/images/btn_start_active.png');
    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 140, sceneCenterY + 200).setScale(0.9);
    background.appendChild(btnStart);
    pointConnect.director.replaceScene(scene);
    _arrow.domClassName = goog.getCssName('lime-button');
    clickSound = new lime.audio.Audio("assets/sound/click.mp3");

    goog.events.listen(_arrow, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
    goog.events.listen(click, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
    return goog.events.listen(btnStart, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
  };


  pointConnect.secondScene = function() {
    var correctSound = new lime.audio.Audio("assets/sound/correct.mp3");
    var background, clock, col, questionLayer, scene, helperCount,frame,wrongPicture,rightPicture,pic1,pic2;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.play();
    scene.appendChild(background);

    addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
     addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.95, 0.9);
      }
    });  
    clock = addCharacter("clock.png", {
      x: sceneWidth-80,
      y: 100,
      absolute: true,
      at: background,
      name: 'Clock',
    });
    gameLabel = addCharacter("title_2.png",{
      absolute : true,
      x: 30,
      y: 10,
      at: background,
      w:200,
      h:50,
    });
    //gameLabel.setScale(0.8)
    //GAME SECTION
    //Question
    
     var questions = [
    {
           label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['7','14','21','28','35','42','49','56','63','70','77','84']],
            position:[
                      [
                        {x:92.65306122448979,y:25.102040816326507}
                        ,{x:66.93877551020407,y:70.40816326530609}
                        ,{x:74.28571428571428,y:112.0408163265306}
                        ,{x:90.20408163265304,y:161.02040816326524}
                        ,{x:134.28571428571428,y:165.91836734693874}
                        ,{x:92.65306122448979,y:180.61224489795916}
                        ,{x:48.571428571428584,y:183.0612244897959}
                        ,{x:19.18367346938777,y:198.97959183673464}
                        ,{x:5.714285714285722,y:240.61224489795916}
                        ,{x:16.734693877551024,y:277.3469387755102}
                        ,{x:42.448979591836746,y:296.93877551020404}
                        ,{x:74.28571428571428,y:304.2857142857142}
                        ,{x:108.57142857142856,y:288.3673469387755}
                        ,{x:128.1632653061224,y:267.5510204081632}
                        ,{x:129.38775510204079,y:224.69387755102036}
                        ,{x:162.44897959183675,y:218.57142857142856}
                        ,{x:183.26530612244898,y:230.81632653061217}
                        ,{x:204.0816326530612,y:244.28571428571422}
                        ,{x:218.77551020408163,y:256.5306122448979}
                        ,{x:223.67346938775506,y:284.69387755102036}
                        ,{x:243.26530612244898,y:269.99999999999994}
                        ,{x:244.48979591836735,y:245.5102040816326}
                        ,{x:251.83673469387753,y:230.81632653061217}
                        ,{x:275.1020408163265,y:241.83673469387753}
                      ]
            ],
            before:"assets/images/problems/1a.png",
            after:"assets/images/problems/1c.png",
            gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
          },
    {
         label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['11','22','33','44','55','66','77','88','99','110','121']],
          position:[
                    
              [
              {x:5.829596412556043,y:128.47533632286996}
              ,{x:11.210762331838538,y:62.55605381165921}
              ,{x:54.26008968609864,y:23.54260089686099}
              ,{x:114.7982062780269,y:10.08968609865471}
              ,{x:167.2645739910314,y:24.887892376681634}
              ,{x:196.8609865470852,y:63.90134529147983}
              ,{x:202.2421524663677,y:125.78475336322873}
              ,{x:143.04932735426007,y:110.98654708520183}
              ,{x:97.30941704035874,y:128.47533632286996}
              ,{x:44.84304932735424,y:136.54708520179372}
              ],
              [
              {x:231.8385650224215,y:194.39461883408075}
              ,{x:206.27802690582962,y:190.35874439461884}
              ,{x:207.62331838565024,y:209.19282511210764}
              ,{x:221.07623318385652,y:213.22869955156955}
              ,{x:217.0403587443946,y:228.02690582959644}
              ,{x:198.2062780269058,y:229.37219730941706}
              ],
              [
              {x:183.4080717488789,y:307.3991031390135}
              ,{x:159.19282511210764,y:323.542600896861}
              ,{x:128.25112107623318,y:322.1973094170404}
              ,{x:101.34529147982062,y:311.43497757847535}
              ,{x:113.45291479820628,y:288.5650224215247}
              ]
                    
          ],
          before:"assets/images/problems/3a.png",
          after:"assets/images/problems/3c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 11']
        },


    {
          label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30','32','34','36','38','40','42','44','46','48','50'],['7','14','21','28','35','42','49','56','63','70','77','84']],
          position:[
                    [
              {x:43.49775784753362,y:312.78026905829597}
              ,{x:56.9506726457399,y:302.017937219731}
              ,{x:59.64125560538116,y:292.60089686098655}
              ,{x:70.40358744394618,y:268.3856502242153}
              ,{x:67.71300448430492,y:254.932735426009}
              ,{x:77.13004484304932,y:226.68161434977583}
              ,{x:104.03587443946188,y:226.68161434977583}
              ,{x:124.21524663677127,y:226.68161434977583}
                    ],
            [
              {x:58.295964125560516,y:73.31838565022423}
              ,{x:79.82062780269058,y:63.90134529147983}
              ,{x:90.5829596412556,y:41.03139013452915}
              ,{x:110.76233183856499,y:20.852017937219728}
              ,{x:137.66816143497755,y:10.08968609865471}
              ,{x:159.19282511210764,y:8.744394618834093}
              ,{x:184.75336322869953,y:15.470852017937233}
              ,{x:204.93273542600895,y:30.26905829596413}
              ,{x:213.0044843049327,y:55.82959641255607}
              ,{x:215.695067264574,y:86.77130044843051}
              ,{x:207.62331838565024,y:104.26008968609867}
              ,{x:190.13452914798205,y:131.16591928251125}
              ,{x:168.60986547085201,y:144.61883408071753}
              ,{x:139.01345291479822,y:150}
              ,{x:102.69058295964123,y:151.34529147982067}
              ,{x:74.43946188340806,y:143.27354260089686}
              ,{x:55.605381165919255,y:109.64125560538116}
            ],
            [
              {x:347.5336322869955,y:199.77578475336327}
              ,{x:363.677130044843,y:190.35874439461884}
              ,{x:404.03587443946185,y:186.322869955157}
              ,{x:422.8699551569507,y:199.77578475336327}
              ,{x:444.3946188340807,y:236.0986547085202}
              ,{x:444.3946188340807,y:258.96860986547085}
              ,{x:424.2152466367713,y:261.65919282511214}
              ,{x:375.7847533632287,y:271.0762331838565}
              ,{x:340.80717488789236,y:276.45739910313904}
              ,{x:305.82959641255604,y:268.3856502242153}
              ,{x:280.2690582959641,y:254.932735426009}
              ,{x:256.05381165919283,y:238.78923766816143}
            ]
          ],
          before:"assets/images/problems/5a.png",
          after:"assets/images/problems/5c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
        },

    {
          label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['11','22','33','44','55','66','77','88','99','110','121'],['7','14','21','28','35','42','49','56','63','70','77','84']],
          position:[
                    [
            {x:54.26008968609864,y:51.79372197309419}
            ,{x:17.937219730941678,y:47.75784753363229}
            ,{x:7.17488789237666,y:78.69955156950675}
            ,{x:13.9013452914798,y:108.29596412556054}
            ,{x:12.556053811659183,y:123.09417040358744}
            ,{x:36.77130044843048,y:141.92825112107624}
            ,{x:73.09417040358744,y:160.76233183856505}
            ,{x:112.10762331838566,y:154.0358744394619}
            ,{x:139.01345291479822,y:116.3677130044843}
            ,{x:148.4304932735426,y:73.31838565022423}
          ],
          [
            {x:98.65470852017935,y:174.21524663677133}
            ,{x:108.07174887892376,y:205.15695067264573}
            ,{x:113.45291479820628,y:244.17040358744396}
            ,{x:79.82062780269058,y:252.2421524663677}
            ,{x:55.605381165919255,y:249.55156950672648}
            ,{x:50.22421524663676,y:283.1838565022422}
            ,{x:78.47533632286994,y:287.2197309417041}
          ],
          [
            {x:191.47982062780267,y:271.0762331838565}
            ,{x:183.4080717488789,y:254.932735426009}
            ,{x:195.51569506726457,y:236.0986547085202}
            ,{x:231.8385650224215,y:245.51569506726457}
            ,{x:256.05381165919283,y:242.82511210762334}
            ,{x:292.37668161434976,y:244.17040358744396}
            ,{x:300.4484304932735,y:218.60986547085201}
            ,{x:321.9730941704036,y:203.81165919282512}
            ,{x:336.7713004484305,y:221.3004484304933}
          ]
          ],
          before:"assets/images/problems/6a.png",
          after:"assets/images/problems/6c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
        },

    {
          label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['7','14','21','28','35','42','49','56','63','70','77','84']],
          position:[
                    [
            {x:112.10762331838566,y:53.13901345291481}
            ,{x:104.03587443946188,y:67.9372197309417}
            ,{x:83.85650224215246,y:81.39013452914799}
            ,{x:83.85650224215246,y:127.13004484304935}
            ,{x:102.69058295964123,y:163.45291479820628}
            ,{x:132.28699551569508,y:184.97757847533632}
            ,{x:147.08520179372198,y:180.94170403587447}
            ,{x:124.21524663677127,y:230.71748878923768}
            ,{x:109.41704035874437,y:264.3497757847534}
            ,{x:98.65470852017935,y:275.1121076233184}
            ,{x:112.10762331838566,y:335.6502242152467}
            ,{x:132.28699551569508,y:351.7937219730942}
            ,{x:136.32286995515693,y:390.8071748878924}
            ,{x:173.99103139013454,y:402.9147982062781}
            ,{x:186.0986547085202,y:374.6636771300449}
            ,{x:187.44394618834082,y:354.4843049327355}
            ,{x:207.62331838565024,y:347.75784753363234}
            ,{x:188.78923766816143,y:339.68609865470853}
            ,{x:196.8609865470852,y:292.60089686098655}
            ,{x:172.64573991031392,y:263.00448430493276}
            ,{x:147.08520179372198,y:275.1121076233184}
            ,{x:175.33632286995515,y:211.88340807174887}
            ,{x:188.78923766816143,y:156.72645739910314}
            ,{x:215.695067264574,y:117.71300448430497}
            ,{x:188.78923766816143,y:71.97309417040361}
            ,{x:179.37219730941706,y:35.65022421524665}
          ] 
          ],
          before:"assets/images/problems/7a.png",
          after:"assets/images/problems/7c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
        },

    {
          label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['7','14','21','28','35','42','49','56','63','70','77','84']],
          position:[
              [
                {x:217.0403587443946,y:116.3677130044843}
                ,{x:222.42152466367713,y:152.6905829596413}
                ,{x:237.21973094170403,y:172.8699551569507}
                ,{x:272.19730941704034,y:180.94170403587447}
                ,{x:312.5560538116592,y:172.8699551569507}
                ,{x:338.1165919282511,y:143.27354260089686}
                ,{x:305.82959641255604,y:197.08520179372198}
                ,{x:340.80717488789236,y:244.17040358744396}
                ,{x:319.2825112107623,y:285.8744394618834}
                ,{x:321.9730941704036,y:297.9820627802691}
                ,{x:274.88789237668163,y:310.08968609865474}
                ,{x:226.45739910313898,y:300.67264573991037}
                ,{x:234.5291479820628,y:271.0762331838565}
                ,{x:204.93273542600895,y:268.3856502242153}
                ,{x:168.60986547085201,y:230.71748878923768}
                ,{x:139.01345291479822,y:250.8968609865471}
                ,{x:130.9417040358744,y:249.55156950672648}
                ,{x:112.10762331838566,y:283.1838565022422}
                ,{x:91.92825112107622,y:276.45739910313904}
                ,{x:98.65470852017935,y:315.47085201793726}
                ,{x:149.7757847533632,y:339.68609865470853}
                ,{x:100,y:363.90134529147986}
                ,{x:73.09417040358744,y:367.9372197309417}
              ] 
          ],
          before:"assets/images/problems/8a.png",
          after:"assets/images/problems/8c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
        },
  
    
    {
          label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30','32'],['7','14','21','28','35','42','49','56','63','70','77','84']],
          position:[
              [
                {x:7.17488789237666,y:191.70403587443946}
                ,{x:21.973094170403584,y:222.64573991031392}
                ,{x:32.7354260089686,y:246.86098654708525}
                ,{x:24.663677130044817,y:260.3139013452915}
                ,{x:94.61883408071748,y:272.42152466367713}
                ,{x:136.32286995515693,y:252.2421524663677}
                ,{x:173.99103139013454,y:253.5874439461884}
                ,{x:256.05381165919283,y:244.17040358744396}
                ,{x:265.4708520179372,y:244.17040358744396}
                ,{x:247.98206278026908,y:193.04932735426013}
                ,{x:258.74439461883406,y:168.8340807174888}
                ,{x:282.9596412556054,y:155.38116591928252}
                ,{x:262.78026905829597,y:147.30941704035877}
                ,{x:245.29147982062779,y:116.3677130044843}
                ,{x:247.98206278026908,y:78.69955156950675}
                ,{x:266.8161434977578,y:46.41255605381167}
              ],
              [
                {x:315.2466367713005,y:244.17040358744396}
                ,{x:362.3318385650224,y:240.1345291479821}
                ,{x:383.8565022421525,y:218.60986547085201}
                ,{x:378.4753363228699,y:191.70403587443946}
                ,{x:366.36771300448436,y:174.21524663677133}
                ,{x:338.1165919282511,y:158.07174887892376}
                ,{x:363.677130044843,y:110.98654708520183}
                ,{x:381.16591928251125,y:97.53363228699553}
                ,{x:390.58295964125557,y:109.64125560538116}
                ,{x:401.3452914798206,y:109.64125560538116}
                ,{x:416.1434977578475,y:88.11659192825113}
                ,{x:444.3946188340807,y:82.73542600896863}
                ,{x:457.84753363228697,y:58.52017937219733}
                ,{x:484.7533632286995,y:61.210762331838566}
                ,{x:527.8026905829596,y:55.82959641255607}
                ,{x:553.3632286995515,y:85.42600896860989}
              ] 
          ],
          before:"assets/images/problems/10a.png",
          after:"assets/images/problems/10c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
        },

    {
          label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['7','14','21','28','35','42','49','56','63','70','77','84']],
          position:[
              [
                {x:5.829596412556043,y:215.91928251121078}
                ,{x:38.1165919282511,y:209.19282511210764}
                ,{x:65.02242152466366,y:217.2645739910314}
                ,{x:74.43946188340806,y:226.68161434977583}
                ,{x:58.295964125560516,y:279.1479820627803}
                ,{x:28.699551569506724,y:285.8744394618834}
                ,{x:12.556053811659183,y:276.45739910313904}
              ],
              [
                {x:169.95515695067263,y:193.04932735426013}
                ,{x:147.08520179372198,y:221.3004484304933}
                ,{x:129.5964125560538,y:256.2780269058296}
                ,{x:121.52466367713004,y:283.1838565022422}
                ,{x:105.3811659192825,y:296.63677130044846}
                ,{x:132.28699551569508,y:306.05381165919283}
                ,{x:151.12107623318383,y:283.1838565022422}
                ,{x:200.8968609865471,y:277.80269058295966}
                ,{x:195.51569506726457,y:261.65919282511214}
                ,{x:188.78923766816143,y:241.47982062780272}
                ,{x:188.78923766816143,y:221.3004484304933}
              ],
              [
                {x:264.1255605381166,y:215.91928251121078}
                ,{x:293.7219730941704,y:210.53811659192826}
                ,{x:328.69955156950675,y:219.9551569506727}
                ,{x:323.31838565022423,y:269.7309417040359}
                ,{x:300.4484304932735,y:283.1838565022422}
                ,{x:265.4708520179372,y:277.80269058295966}
                ,{x:264.1255605381166,y:264.3497757847534}
              ] 
          ],
          before:"assets/images/problems/11a.png",
          after:"assets/images/problems/11c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
        },

    {
          label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30','32'],['7','14','21','28','35','42','49','56','63','70','77','84']],
          position:[
              [
                {x:149.7757847533632,y:137.8923766816144}
                ,{x:167.2645739910314,y:124.43946188340811}
                ,{x:152.4663677130045,y:105.60538116591928}
                ,{x:163.2286995515695,y:62.55605381165921}
                ,{x:134.97757847533632,y:20.852017937219728}
                ,{x:91.92825112107622,y:7.399103139013448}
                ,{x:36.77130044843048,y:24.887892376681634}
                ,{x:5.829596412556043,y:73.31838565022423}
                ,{x:8.520179372197305,y:132.51121076233187}
                ,{x:46.18834080717488,y:162.10762331838566}
                ,{x:78.47533632286994,y:148.65470852017938}
                ,{x:59.64125560538116,y:141.92825112107624}
                ,{x:56.9506726457399,y:125.78475336322873}
                ,{x:81.1659192825112,y:108.29596412556054}
                ,{x:98.65470852017935,y:102.91479820627805}
                ,{x:104.03587443946188,y:80.04484304932737}
                ,{x:132.28699551569508,y:84.08071748878925}
                ,{x:128.25112107623318,y:53.13901345291481}
              ],
              [
                {x:58.295964125560516,y:260.3139013452915}
                ,{x:42.152466367713004,y:303.3632286995516}
                ,{x:81.1659192825112,y:312.78026905829597}
                ,{x:117.48878923766813,y:316.8161434977579}
                ,{x:124.21524663677127,y:263.00448430493276}
                ,{x:124.21524663677127,y:228.02690582959644}
                ,{x:117.48878923766813,y:193.04932735426013}
                ,{x:108.07174887892376,y:166.14349775784757}
                ,{x:141.70403587443946,y:182.28699551569508}
                ,{x:179.37219730941706,y:206.5022421524664}
                ,{x:168.60986547085201,y:214.57399103139016}
                ,{x:178.0269058295964,y:222.64573991031392}
                ,{x:168.60986547085201,y:240.1345291479821}
                ,{x:157.84753363228697,y:232.0627802690583}
                ,{x:140.35874439461884,y:215.91928251121078}
              ] 
          ],
          before:"assets/images/problems/12a.png",
          after:"assets/images/problems/12c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
        },

  

    {
              label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['7','14','21','28','35','42','49','56','63','70','77','84']],
              position:[
                [
                  {x:7.17488789237666,y:214.57399103139016}
                  ,{x:40.80717488789236,y:211.88340807174887}
                  ,{x:63.67713004484304,y:219.9551569506727}
                  ,{x:77.13004484304932,y:228.02690582959644}
                  ,{x:56.9506726457399,y:280.49327354260095}
                  ,{x:28.699551569506724,y:283.1838565022422}
                  ,{x:9.865470852017921,y:275.1121076233184}
                ],
                [
                  {x:265.4708520179372,y:215.91928251121078}
                  ,{x:291.03139013452915,y:209.19282511210764}
                  ,{x:328.69955156950675,y:218.60986547085201}
                  ,{x:326.00896860986546,y:269.7309417040359}
                  ,{x:300.4484304932735,y:280.49327354260095}
                  ,{x:265.4708520179372,y:279.1479820627803}
                  ,{x:265.4708520179372,y:263.00448430493276}
                ],
                [
                  {x:171.30044843049325,y:191.70403587443946}
                  ,{x:187.44394618834082,y:219.9551569506727}
                  ,{x:187.44394618834082,y:240.1345291479821}
                  ,{x:196.8609865470852,y:260.3139013452915}
                  ,{x:199.55156950672648,y:279.1479820627803}
                  ,{x:153.81165919282512,y:280.49327354260095}
                  ,{x:130.9417040358744,y:306.05381165919283}
                  ,{x:104.03587443946188,y:293.9461883408072}
                  ,{x:117.48878923766813,y:283.1838565022422}
                  ,{x:128.25112107623318,y:252.2421524663677}
                  ,{x:148.4304932735426,y:215.91928251121078}
                ]
              ],
              before:"assets/images/problems/14a.png",
              after:"assets/images/problems/14c.png",
              gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
            },
      
  {
          label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30','32','34','36','38','40','42','44','46','48','50'],['7','14','21','28','35','42','49','56','63','70','77','84']],
          position:[
              [
                {x:106.72645739910314,y:166.14349775784757}
                ,{x:137.66816143497755,y:182.28699551569508}
                ,{x:176.68161434977577,y:206.5022421524664}
                ,{x:164.5739910313901,y:211.88340807174887}
                ,{x:180.71748878923768,y:223.99103139013454}
                ,{x:172.64573991031392,y:242.82511210762334}
                ,{x:156.50224215246635,y:232.0627802690583}
                ,{x:141.70403587443946,y:213.22869955156955}
                ,{x:116.14349775784751,y:191.70403587443946}
                ,{x:122.86995515695065,y:232.0627802690583}
                ,{x:122.86995515695065,y:264.3497757847534}
                ,{x:114.7982062780269,y:316.8161434977579}
                ,{x:86.54708520179372,y:316.8161434977579}
                ,{x:44.84304932735424,y:307.3991031390135}
                ,{x:58.295964125560516,y:261.65919282511214}
              ],
              [
                {x:168.60986547085201,y:125.78475336322873}
                ,{x:149.7757847533632,y:139.237668161435}
                ,{x:153.81165919282512,y:101.5695067264574}
                ,{x:160.53811659192826,y:62.55605381165921}
                ,{x:130.9417040358744,y:27.578475336322867}
                ,{x:90.5829596412556,y:10.08968609865471}
                ,{x:38.1165919282511,y:27.578475336322867}
                ,{x:4.484304932735398,y:74.66367713004485}
                ,{x:11.210762331838538,y:132.51121076233187}
                ,{x:46.18834080717488,y:160.76233183856505}
                ,{x:79.82062780269058,y:150}
                ,{x:58.295964125560516,y:144.61883408071753}
                ,{x:58.295964125560516,y:121.74887892376682}
                ,{x:86.54708520179372,y:108.29596412556054}
                ,{x:104.03587443946188,y:97.53363228699553}
                ,{x:104.03587443946188,y:85.42600896860989}
                ,{x:132.28699551569508,y:84.08071748878925}
                ,{x:128.25112107623318,y:51.79372197309419}
              ]
          ],
          before:"assets/images/problems/15a.png",
          after:"assets/images/problems/15c.png",
          gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
        }
    
    ];
    
    
    function getPoint(x,y,i){
        var outterSize = 60;
        var innerSize = 7;
        var pointColor = '#3355ff'
        if(randomIndex == 0){
          pointColor = '#3355ff'
        }else if(randomIndex == 1){
          pointColor = '#f00'
        }else if(randomIndex == 2){
          pointColor = '#0f0'
        }
        var pointLabel = new lime.Label().setText(questions[order[queueIndex]]["label"][randomIndex][i]).setSize(innerSize,innerSize).setPosition(x,y-20).setFontColor(pointColor).setFontSize(10);
        var thePoint = new lime.Circle().setSize(innerSize,innerSize).setFill(pointColor).setPosition(x,y);
        var pointLayer = new lime.Layer();
        //pointLayer.appendChild(pointCover);
        pointLayer.appendChild(thePoint);
        pointLayer.appendChild(pointLabel);
        return {
            point : pointLayer
            ,
            //cover : pointCover
        }
    }

    function line(size, x1, y1, x2, y2){ 
        var dx = Math.abs(x2-x1); 
        var dy = Math.abs(y2-y1); 
        var width = Math.sqrt(dx*dx+dy*dy)+size; 
        return new lime.Sprite().setSize(width, size).setAnchorPoint(size/2/width, .5).setRotation(-Math.atan2(y2-y1, x2-x1)*180/Math.PI).setPosition(x1, y1); 
    } 
    var randomIndex
    var questionManager = function(num){

        var pointIndex = 0;
        var question = questions[num];
        randomIndex =  Math.floor(Math.random() * question["position"].length);
        console.log("question[position].length",question["position"].length)
        console.log("randomIndex",randomIndex);
        var questionLength = question["position"][randomIndex].length
        return {
            dragged : function(){
                pointIndex++
            },
            question : question,
            length : questionLength,
            beforeImage : question["before"],
            afterImage : question["after"],
            startPoint : function(){
                return question["position"][randomIndex][pointIndex];
            },
            endPoint : function(){
                if(pointIndex<questionLength)
                    return question["position"][randomIndex][pointIndex+1];
                else
                    return false;
            },
            isEnd : function(){
                 if(pointIndex==questionLength-1)
                    return true
                 else
                    return true
            },
            gameLabel : question["gameLabel"][randomIndex],
            positionList : question["position"]
        }
    }
    var queueIndex
    var order
    var gameManager = function(){
        queueIndex = 0;
        var questionsLength = questions.length
        order = []
        while(order.length < questionsLength){
            var randomnumber=Math.floor(Math.random() * questionsLength);
            var found=false;
            for(var i=0;i<order.length;i++){
              if(order[i]==randomnumber){found=true;break}
            }
            if(!found)order[order.length]=randomnumber;
        }

        return {
            getQuestionManager : function(){
                return questionManager(order[queueIndex]);
            },
            nextQuestion : function(){
                    queueIndex++;
            },
            noGame : function(){
                if(queueIndex >= questionsLength)
                    return true
                else
                    return false
            }
        }
    }

    var thisGame = gameManager();
    var base_x = 150;
    var base_y = 100;
    var points,lines
    var gameLayer = new lime.Layer();
    var thisQuestion
    var afterImage
    var makeGame = function(){
        points = new Array()
        lines = new Array()
        gameLayer = new lime.Layer();
        if(!thisGame.noGame())
          thisQuestion = thisGame.getQuestionManager()
        else 
          return
        beforeImage = new lime.Sprite().setFill(thisQuestion.beforeImage).setPosition(base_x,base_y).setAnchorPoint(0,0).setOpacity(1);
        afterImage = new lime.Sprite().setFill(thisQuestion.afterImage).setPosition(base_x,base_y).setAnchorPoint(0,0).setOpacity(0.01);
        questionLabel = new lime.Label().setFontSize(20).setFontColor("#3355ff").setText(thisQuestion.gameLabel).setPosition(sceneCenterX,sceneCenterY+220)
        gameLayer.appendChild(beforeImage);
        
        //console.log(thisQuestion.length,thisQuestion.beforeImage,thisQuestion.afterImage,thisQuestion.startPoint(),thisQuestion.endPoint())
        //Draw
        var positionList = thisQuestion.positionList
        var lineSize = 3
        //var freeLines = new Array()
        console.log("Drawing Phase")
        //EXTRA LINE
        for(var i = 0 ; i < positionList.length ; i++){
            !function(i){
              if(i!=randomIndex){
                  for(var j = 0 ; j <positionList[i].length ; j++){
                        !function(i,j){
                              var xPos = positionList[i][j].x+base_x;
                              var yPos = positionList[i][j].y+base_y;
                              if(j < positionList[i].length - 1){
                                    var xPosNext = positionList[i][j+1].x+base_x;
                                    var yPosNext = positionList[i][j+1].y+base_y;
                                    //console.log(xPos,yPos,xPosNext,yPosNext)
                                    gameLayer.appendChild(line(lineSize,xPos,yPos,xPosNext,yPosNext).setFill('#000'))
                              }
                        }(i,j)
                  }
              }
            }(i)
        }
        //
        for(var i = 0 ; i < positionList[randomIndex].length ; i++ ){
            !function(i){
                var xPos = positionList[randomIndex][i].x+base_x;
                var yPos = positionList[randomIndex][i].y+base_y;
                
                points.push(getPoint(xPos,yPos,i))

                if(i < positionList[randomIndex].length - 1 ){

                    var xPosNext = positionList[randomIndex][i+1].x+base_x;
                    var yPosNext = positionList[randomIndex][i+1].y+base_y;
                    !function(i){
                        lines.push(line(lineSize,xPos,yPos,xPosNext,yPosNext).setFill('#000').setOpacity(0));
                        gameLayer.appendChild(lines[i]);
                    }(i)
                }

                gameLayer.appendChild(points[i].point)
                //console.log(positionList[randomIndex][i].x,positionList[randomIndex][i].y)
            }(i)        
        }

        gameLayer.appendChild(questionLabel);
        background.appendChild(gameLayer);
    }


    var insideCircle = function(num,x,y){

        checkingPoint = questions[order[queueIndex]]["position"][randomIndex][num]
        //console.log(checkingPoint.x,checkingPoint.y)
        if(x > checkingPoint.x-23 && x < checkingPoint.x+23 &&
           y > checkingPoint.y-23 && y < checkingPoint.y+23){
            return true
        }else{
            return false
        }
    }
    var questionControl = function(){
            var startIndex = 0;
            var nextIndex = 1;

                  goog.events.listen(background,['mousedown','touchstart'],function(e){
                        var clickPos = background.screenToLocal(e.screenPosition);
                        //{x:0,y:0},{}
                        console.log("{x:" + (clickPos.x-base_x) + ",y:" + (clickPos.y-base_y) + "}")
                        var startFlag = false;
                        var nextFlag = false;
                        e.swallow(['mousemove','touchmove'],function(e){
                            var pos = background.screenToLocal(e.screenPosition);
                            //console.log("x=",pos.x-base_x,"y=",pos.y-base_y);
                            for(var j = 0 ;j < thisQuestion.length ; j++){
                               !function(j){
                                     if(insideCircle(j,pos.x-base_x,pos.y-base_y)){
                                         //console.log("inside ",j)
                                         if(j == startIndex){
                                            startFlag = true
                                         }
                                         if(startFlag){
                                            if(j == nextIndex){
                                              lines[j-1].setOpacity(1);
                                               nextIndex++;
                                               score.add();
                                               if(nextIndex == thisQuestion.length){
                                                  gameLayer.removeAllChildren();
                                                  beforeImage.setOpacity(0)
                                                  correctSound.stop()
                                                  correctSound.play()
                                                  gameLayer.appendChild(afterImage);
                                                  afterImage.setOpacity(1)
                                                  lime.scheduleManager.callAfter(function(){nextQuestion()},gameLayer,2500)
                                               }
                                            }
                                         }
                                     }
                                }(j)
                            }
                        });
                      e.swallow(['mouseup','touchend'],function(e){
                        startIndex = nextIndex - 1;
                      })
                  });
    }

    var playGame = function(){
        score.add();
        questionControl();
    }
    var nextQuestion = function(){
        thisGame.nextQuestion();
        if(!thisGame.noGame()){ 
            background.removeChild(gameLayer)
            makeGame();
            playGame();
        }
    }
    makeGame();
    playGame();

    gameLabel.setAnchorPoint(0,0);
    pointConnect.lblTimer = new lime.Label();
    pointConnect.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x, clock.position_.y + 20);
    pointConnect.lblTimer.setFontColor('#000');
    scene.appendChild(pointConnect.lblTimer);
    pointConnect.director.replaceScene(scene);
    return startTimer({
      limit: 40,
      delay: 1000,
      limeScope: callbackFactory,
      runningCallback: function(rt) {
        return pointConnect.lblTimer.setText(rt);
      },
      timeoutCallback: function(rt) {
        pointConnect.lblTimer.setText("0 ");
        pointConnect.isGameEnded = true;
        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
        scene = pointConnect.timeoutScene();
        return pointConnect.director.replaceScene(scene);
      }
    });
  };

  pointConnect.timeoutScene = function() {
    var background, changeScene, scene;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.stop();
    
    addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
     addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.95, 0.9);
      }
    });
    addCharacter("gameover.png", {
      x: 0,
      y: 0,
      at: background,
      callback: function(char2) {
        char2.setScale(0);
        return char2.runAction(new lime.animation.ScaleTo(1.0));
      }
    });
  
    scene.appendChild(background);
    changeScene = function() {
      return pointConnect.director.replaceScene(pointConnect.lastScene());
    };
    lime.scheduleManager.scheduleWithDelay(changeScene, pointConnect, 1500, 1);
    return scene;
  };

  pointConnect.lastScene = function() {
    var background, bubble, menu, menu2, scene, scoreLabel, title1;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.stop();
    addCharacter("boy.png", {
      x: -230,
      y: 170,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.8);
      }
    });
    addCharacter("girl.png", {
      x: -60,
      y: 150,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.8);
      }
    });
 addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.95, 0.9);
      }
    });
    title1 = addCharacter("title_2.png", {
      x: -225,
      y: -260,
      at: background,
      callback: function(char2) {
        return char2.setScale(0.4);
      }
    });
    menu2bg = addCharacter("replay.png", {
      absolute: true,
      x: sceneCenterX,
      y: sceneCenterY+40,
      at: background
    });
    menu2 = addCharacter("menu-replay.png", {
      absolute: true,
      x: sceneCenterX,
      y: sceneCenterY+40,
      at: background
    });
    bubble = addCharacter("scorebg.png", {
      x: sceneCenterX,
      y: sceneCenterY-100,
      at: background,
      absolute: true
    });
    scoreLabel = new lime.Label;
    scoreLabel.setText(score.getScore()).setPosition(bubble.position_.x + 10, bubble.position_.y + 40).setFontColor('red').setFontSize(40);
    menu2.domClassName = goog.getCssName('lime-button');
    goog.events.listen(menu2, ['click', 'touchstart'], function() {
      return pointConnect.intro();
    });
    scene.appendChild(background);
    scene.appendChild(scoreLabel);
    return scene;
  };

  this.pointConnect = pointConnect;

  goog.exportSymbol('pointConnect.start', pointConnect.start);

  

}).call(this);