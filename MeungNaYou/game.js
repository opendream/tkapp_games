var game_func = function () {

// Flood Fill ================================================================
function getPixelEasy(pixelData, x, y) {
    if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
        return NaN;
    }
    var pixels = pixelData.data;
    var i = (y * pixelData.width + x) * 4;
    return {
        'r': pixels[i + 0],
        'g': pixels[i + 1],
        'b': pixels[i + 2],
        'i': pixels[i + 3]
    };
}
function getPixel(pixelData, x, y) {
    if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
        return NaN;
    }
    var pixels = pixelData.data;
    var i = (y * pixelData.width + x) * 4;
    return ((pixels[i + 0] & 0xFF) << 24) |
           ((pixels[i + 1] & 0xFF) << 16) |
           ((pixels[i + 2] & 0xFF) <<  8) |
           ((pixels[i + 3] & 0xFF) <<  0);
}
function setPixel(pixelData, x, y, color) {
    var i = (y * pixelData.width + x) * 4;
    var pixels = pixelData.data;
    pixels[i + 0] = (color >>> 24) & 0xFF;
    pixels[i + 1] = (color >>> 16) & 0xFF;
    pixels[i + 2] = (color >>>  8) & 0xFF;
    pixels[i + 3] = (color >>>  0) & 0xFF;
}
function buildColor(color) {
    return color.r*Math.pow(256, 3) + color.g*Math.pow(256, 2) + color.b*Math.pow(256, 1) + 255*Math.pow(256, 0);
}
function diff(c1, c2) {
    if (isNaN(c1) || isNaN(c2)) {
        return Infinity;
    }

    var dr = ((c1 >>> 24) & 0xFF) - ((c2 >>> 24) & 0xFF);
    var dg = ((c1 >>> 16) & 0xFF) - ((c2 >>> 16) & 0xFF);
    var db = ((c1 >>>  8) & 0xFF) - ((c2 >>>  8) & 0xFF);
    var da = ((c1 >>>  0) & 0xFF) - ((c2 >>>  0) & 0xFF);

    return dr*dr + dg*dg + db*db + da*da;
}
function floodFill(canvas, x, y, replacementColor, delta, black) {
    var current, w, e, stack, color, cx, cy;
    var context = canvas.getContext("2d");
    var pixelData = context.getImageData(0, 0, canvas.width, canvas.height);
    var done = [];
    var black = black? black: 70;
    for (var i = 0; i < canvas.width; i++) {
        done[i] = [];
    }

    var targetColor = getPixel(pixelData, x, y);
    var tre = getPixelEasy(pixelData, x, y);
    if ((tre.r < black && tre.g < black && tre.b < black) || targetColor == 0) {
        return;
    }
    
    delta *= delta;

    stack = [ [x, y] ];
    done[x][y] = true;
    while ((current = stack.pop())) {
        cx = current[0];
        cy = current[1];
        var tc = getPixel(pixelData, cx, cy);
        var tre2 = getPixelEasy(pixelData, cx, cy);
        if (!((tre2.r < black && tre2.g < black && tre2.b < black) || tc == 0) && diff(tc, targetColor) <= delta) {
            setPixel(pixelData, cx, cy, replacementColor);

            w = e = cx;
            while (w > 0 && diff(getPixel(pixelData, w - 1, cy), targetColor) <= delta) {
                --w;
                if (done[w][cy]) break;
                setPixel(pixelData, w, cy, replacementColor);
            }
            while (e < pixelData.width - 1 && diff(getPixel(pixelData, e + 1, cy), targetColor) <= delta) {
                ++e;
                if (done[e][cy]) break;
                setPixel(pixelData, e, cy, replacementColor);
            }

            for (cx = w; cx <= e; cx++) {
                if (cy > 0) {
                    color = getPixel(pixelData, cx, cy - 1);
                    if (diff(color, targetColor) <= delta) {
                        if (!done[cx][cy - 1]) {
                            stack.push([cx, cy - 1]);
                            done[cx][cy - 1] = true;
                        }
                    }
                }
                if (cy < canvas.height - 1) {
                    color = getPixel(pixelData, cx, cy + 1);
                    if (diff(color, targetColor) <= delta) {
                        if (!done[cx][cy + 1]) {
                            stack.push([cx, cy + 1]);
                            done[cx][cy + 1] = true;
                        }
                    }
                }
            }
        }
    }

    context.putImageData(pixelData, 0, 0, 0, 0, canvas.width, canvas.height);
}

// End Flood Fill ================================================================


//set main namespace
goog.provide('game');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.MoveBy');

goog.require('lime.fill.LinearGradient');
goog.require('lime.Sprite');
goog.require('lime.Renderer');
goog.require('lime.audio.Audio');


var sceneWidth = 850;
var sceneHeight = 670;

var sceneCenterX = sceneWidth/2;
var sceneCenterY = sceneHeight/2;

var boardWidth = sceneWidth-20;
var boardHeight = sceneHeight-20;
var boardTop = sceneCenterY - (boardWidth/2);
var boardLeft = sceneCenterX - (boardHeight/2);

// entrypoint
game.start = function(){
    
    director = new lime.Director(document.getElementById('game5'), sceneWidth, sceneHeight);    
	
	var board = new lime.Sprite()
        .setSize(boardWidth, boardHeight)
        .setPosition(sceneCenterX, sceneCenterY)
        .setFill('assets/images/board.png');
        
    var boder = new lime.Sprite()
        .setPosition(sceneCenterX, sceneCenterY)
        .setFill('assets/images/border.png');
    
    var frame = new lime.Sprite()
        .setPosition(sceneCenterX, sceneCenterY-15)
        .setFill('assets/images/frame.png');

    
    // ==============================================
    //  Intro game
    // ==============================================
    
    var cloud = new lime.Sprite()
        .setPosition(sceneCenterX, 375)
        .setFill('assets/images/cloud.png');
        
    var title = new lime.Sprite()
        .setPosition(sceneCenterX + 20, 255)
        .setFill('assets/images/title.png');
    
    var titleBg = new lime.Sprite()
        .setPosition(sceneCenterX, 255)
        .setFill('assets/images/title-bg.png');

    var boy = new lime.Sprite()
        .setPosition(190, 500)
        .setFill('assets/images/boy.png');
	
	var girl = new lime.Sprite()
        .setPosition(695, 500)
        .setFill('assets/images/girl.png');
    
    var gradient1 = new lime.fill.LinearGradient()
        .addColorStop(0, 243, 151, 73, 1)
        .addColorStop(1, 238, 81, 18 ,1);
    var playBg1 = new lime.Circle()
        .setPosition(sceneCenterX - 10, 410)
        .setFill(gradient1)
        .setSize(250, 80);
    
    var gradient2 = new lime.fill.LinearGradient()
        .addColorStop(0, 240, 102, 33, 1)
        .addColorStop(1, 237, 69, 8 ,1);
    var playBg2 = new lime.Circle()
        .setPosition(sceneCenterX + 80, 445)
        .setFill(gradient2)
        .setSize(90, 40);
        
    var playGame = new lime.Sprite()
        .setPosition(sceneCenterX - 10, 410)
        .setFill('assets/images/play-game.png');
    playGame.domClassName = goog.getCssName('lime-button');

    var playColor = new lime.Sprite()
        .setPosition(sceneCenterX + 150, 380)
        .setFill('assets/images/play-color.png');
        
    var intro = new lime.Scene();
    
    intro.appendChild(board);
    intro.appendChild(cloud);
    intro.appendChild(titleBg);
    intro.appendChild(title);
    intro.appendChild(boy);
    intro.appendChild(girl);
    intro.appendChild(boder);
    intro.appendChild(frame);
    intro.appendChild(playBg2);
    intro.appendChild(playBg1);
    intro.appendChild(playGame);
    intro.appendChild(playColor);
    
    // set current scene active
    director.makeMobileWebAppCapable();
	director.replaceScene(intro);
	
	// ==============================================
    //  Play game
    // ==============================================
	
    var smallTitle = new lime.Sprite()
        .setScale(0.5)
        .setPosition(195, 55)
        .setFill('assets/images/title.png');
        
    var paper = new lime.Sprite()
        .setPosition(sceneCenterX, 285)
        .setFill('assets/images/paper.png');
            
    var stand1 = new lime.Sprite()
        .setPosition(sceneCenterX, 265)
        .setFill('assets/images/stand1.png');
    var stand2 = new lime.Sprite()
        .setPosition(sceneCenterX, 515)
        .setFill('assets/images/stand2.png');
    
    var howTo = new lime.Layer()

    var detail = new lime.Sprite()
        .setPosition(sceneCenterX-3, 280)
        .setFill('assets/images/how-to.png');
        
    var close = new lime.Sprite()
        .setPosition(650, 135)
        .setFill('assets/images/close.png');
    close.domClassName = goog.getCssName('lime-button');
    
    howTo.appendChild(detail);
    howTo.appendChild(close);
    
    var palette = new lime.Sprite()
        .setPosition(733, 278)
        .setFill('assets/images/palette.png');

    var colorSize = 35;
    var colors = [];
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(255,0,0   ).setPosition(750, 175));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(241,93,33 ).setPosition(714, 190));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(241,146,54).setPosition(686, 219));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(245,184,57).setPosition(674, 256));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(255,255,0 ).setPosition(674, 295));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(178,230,57).setPosition(686, 332));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(98,199,81 ).setPosition(714, 362));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(127,41,168).setPosition(748, 383));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(34,35,239 ).setPosition(753, 223));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(180,52,147).setPosition(723, 259));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(89,49,171 ).setPosition(723, 301));
    colors.push(new lime.Circle().setSize(colorSize, colorSize).setFill(23,161,161).setPosition(753, 336));
    
    var tool1 = new lime.Sprite()
        .setPosition(90, 278)
        .setFill('assets/images/tool1.png');

    var tool2 = new lime.Sprite()
        .setPosition(150-40, 278-90)
        .setFill('assets/images/tool2.png');
    
    var tool3 = new lime.Sprite()
        .setPosition(150, 278)
        .setFill('assets/images/tool2.png');
    
    var tool4 = new lime.Sprite()
        .setPosition(150-40, 278+90)
        .setFill('assets/images/tool2.png');
        
    var brush = new lime.Sprite()
        .setPosition(150-30, 278-115)
        .setFill('assets/images/brush-active.png')
        .setRenderer(lime.Renderer.CANVAS);
    
    var rubber = new lime.Sprite()
        .setPosition(150-40, 278+90)
        .setFill('assets/images/rubber.png');
    
    var mix = new lime.Sprite()
        .setPosition(150, 278)
        .setFill('assets/images/mix.png');

     
    var mixResult = new lime.Sprite()
        .setPosition(sceneCenterX, 550+120)
        .setFill('assets/images/mix-result.png')
        .setHidden(true);
    
    var mixColor = new lime.Circle()
        .setPosition(5, -16)
        .setFill(255, 0, 0)
        .setSize(70, 45)
        .setHidden(true);
    
    var mixReset = new lime.Label()
        .setText('RESET')
        .setPosition(-70, 23)
        .setFontSize(21)
        .setFontColor('#FC0')
        .setFontWeight('bold');
    
    var mixClose = new lime.Label()
        .setText('CLOSE')
        .setPosition(70, 23)
        .setFontSize(21)
        .setFontColor('#FC0')
        .setFontWeight('bold');
        
    mixResult.appendChild(mixColor);
    mixResult.appendChild(mixReset);
    mixResult.appendChild(mixClose);
    
    
    var mixPalette = new lime.Sprite()
        .setPosition(733+140, 278)
        .setFill('assets/images/palette.png')
        .setHidden(true);
    
    var mixMixs = [];
    var mixSize = 50;
    mixMixs.push(new lime.Circle().setSize(mixSize, mixSize).setFill(255, 0  , 0  ).setPosition(10, -80));
    mixMixs.push(new lime.Circle().setSize(mixSize, mixSize).setFill(0  , 255, 0  ).setPosition(-30, -30));
    mixMixs.push(new lime.Circle().setSize(mixSize, mixSize).setFill(0  , 0  , 255).setPosition(-30, 30));
    mixMixs.push(new lime.Circle().setSize(mixSize, mixSize).setFill(255, 255, 255).setPosition(10, 80));
    
    for (i in mixMixs) {
        var mixMix = mixMixs[i];
        mixMix.domClassName = goog.getCssName('lime-button');
        
        goog.events.listen(mixMix, ['mousedown', 'touchstart'], function(evt) {
            evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
                
                var mixFill = this.getFill();
                var r, g, b;
                
                if (mixColor.getHidden()) {
                    mixColor.setHidden(false);
                    
                    r = mixFill.r;
                    g = mixFill.g;
                    b = mixFill.b;
                }
                else {
                    var currentFill = mixColor.getFill();

                    r = Math.floor((currentFill.r + mixFill.r)/2);
                    g = Math.floor((currentFill.g + mixFill.g)/2);
                    b = Math.floor((currentFill.b + mixFill.b)/2);
                }
                mixColor.setFill(r, g, b);
                
            });
        });
        mixPalette.appendChild(mixMix);
    }
    
    var gradient3 = new lime.fill.LinearGradient()
        .addColorStop(0, 147, 214, 82, 1)
        .addColorStop(1, 155, 202, 128 ,1);
    var howToButton  = new lime.Circle()
        .setSize(65, 65)
        .setPosition(730, 540)
        .setFill(gradient3);
    var howToLabel = new lime.Label()
        .setText('HOW TO PLAY')
        .setPosition(0, -3)
        .setFontSize(13)
        .setFontColor('#FFF')
        .setFontWeight('bold');
    howToButton.appendChild(howToLabel);
    
    var gradient4 = new lime.fill.LinearGradient()
        .addColorStop(0, 147, 214, 82, 1)
        .addColorStop(1, 155, 202, 128 ,1);
    var clearButton  = new lime.Circle()
        .setSize(65, 65)
        .setPosition(125, 540)
        .setFill(gradient4);
    var clearLabel = new lime.Sprite()
        .setScale(0.9)
        .setPosition(1, 2)
        .setFill('assets/images/clear.png');
    clearButton.appendChild(clearLabel);
    
    var character = 'assets/images/character/character-' + (Math.floor(Math.random()*5)+1) + '.png';
    var paintImage = new lime.Sprite()
        .setScale(0.65)
        .setPosition(sceneCenterX, 285)
        .setFill(character)
        .setRenderer(lime.Renderer.CANVAS)
        .setHidden(true);
    
    var scene = new lime.Scene();
    
    // Variables ================================================
    var currentColor = {'r': 255, 'g': 255, 'b': 255};
    var oldColor = {'r': 255, 'g': 255, 'b': 255};
    var paintImageSize;
    var paintImageObX;
    var paintImageObY;
    var mode = 'brush';
    var mixResultIsShow = false;
    var mixPaletteIsShow = false;
    
    var scope = {};
    scope.timer = function(){
        paintImageSize = paintImage.getSize();
        paintImageObX = paintImageSize.width/2;
        paintImageObY = paintImageSize.height/2;
        lime.scheduleManager.unschedule(scope.timer, scope);  
    }
    lime.scheduleManager.scheduleWithDelay(scope.timer, scope, 1000);
    
    var isFirefox = navigator.userAgent.toLowerCase().match('firefox');
    if (isFirefox) {
        var clickSound = new lime.audio.Audio('assets/sounds/click.ogg');
    }
    else {
        var clickSound = new lime.audio.Audio('assets/sounds/click.mp3');
    }
        
    var moveLeft = new lime.animation.MoveBy(-140, 0);
    var moveRight = new lime.animation.MoveBy(140, 0);
    var moveUp = new lime.animation.MoveBy(0, -120);
    var moveDown = new lime.animation.MoveBy(0, 120);
    
    // Events  ==================================================
    goog.events.listen(playGame, ['mousedown', 'touchstart'], function(e) {
        clickSound.stop();
        clickSound.play();
        scene.appendChild(board);
        scene.appendChild(stand2);
        scene.appendChild(paper);
        scene.appendChild(palette);
        
        for (i in colors) {
            var color = colors[i];
            color.domClassName = goog.getCssName('lime-button');
            
            goog.events.listen(color, ['mousedown', 'touchstart'], function(evt) {
                evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
                    if (mode == 'rubber') {
                        return false;
                    }
                    currentColor = this.getFill();
                    oldColor = currentColor;
                    var color = buildColor(currentColor);
                    floodFill(brush.domElement, 70, 30, color, 128);
                });
            });
            scene.appendChild(color);
        }
        
        scene.appendChild(mixPalette);
        scene.appendChild(mixResult);
        scene.appendChild(tool1);
        scene.appendChild(tool2);
        scene.appendChild(tool3);
        scene.appendChild(tool4);
        scene.appendChild(brush);
        scene.appendChild(mix);
        scene.appendChild(rubber);
        scene.appendChild(howToButton);
        scene.appendChild(clearButton);
        scene.appendChild(frame);
        scene.appendChild(boder);
        scene.appendChild(smallTitle);
        scene.appendChild(stand1);
        scene.appendChild(howTo);
        scene.appendChild(paintImage);
        
    	director.makeMobileWebAppCapable();
    	director.replaceScene(scene);
    });
    
    goog.events.listen(close, ['mousedown', 'touchstart'], function(e) {
        clickSound.stop();
        clickSound.play();
        paintImage.setHidden(false);
        howTo.setHidden(true);
    });
    
    goog.events.listen(paintImage, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
            if (!paintImageSize.width || !paintImageSize.height) {
                paintImageSize = paintImage.getSize();
                paintImageObX = paintImageSize.width/2;
                paintImageObY = paintImageSize.height/2;
            }

            var color = buildColor(currentColor);
            var x = Math.floor(e.position.x + paintImageObX);
            var y = Math.floor(e.position.y + paintImageObY);

            floodFill(paintImage.domElement, x, y, color, 128);
        });
    });
    
    goog.events.listen(brush, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
            if (mode == 'brush') {
                return false;
            }
            clickSound.stop();
            clickSound.play();
            
            mode = 'brush';
            brush.setFill('assets/images/brush-active.png');
            rubber.setFill('assets/images/rubber.png');
            mix.setFill('assets/images/mix.png');
            currentColor = oldColor;
            
            var color = buildColor(currentColor);
            setTimeout(function () {
                floodFill(brush.domElement, 70, 30, color, 128);         
            }, 100);
            
            if(mixPaletteIsShow) {
               mixPalette.runAction(moveRight);
               for (i in colors) {
                   colors[i].setHidden(false);
               }
               goog.events.listen(moveRight, lime.animation.Event.STOP, function(){
                   mixPalette.setHidden(true);
                   mixPaletteIsShow = false;                  
               });
            }
        });
    });
    
    goog.events.listen(rubber, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
            if (mode == 'rubber') {
                return false;
            }
            clickSound.stop();
            clickSound.play();
            
            mode = 'rubber';
            rubber.setFill('assets/images/rubber-active.png');
            brush.setFill('assets/images/brush.png');
            mix.setFill('assets/images/mix.png');
            oldColor = currentColor;
            currentColor = {'r': 255, 'g': 255, 'b': 255};
            
            var color = buildColor(oldColor);
            setTimeout(function () {
                floodFill(brush.domElement, 70, 30, color, 128);         
            }, 100);
        });
    });
    
    goog.events.listen(mix, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
            if (mode == 'mix') {
                return false;
            }
            clickSound.stop();
            clickSound.play();
            
            mode = 'mix';
            mix.setFill('assets/images/mix-active.png');
            brush.setFill('assets/images/brush.png');
            rubber.setFill('assets/images/rubber.png');
            currentColor = oldColor;
            
            var color = buildColor(currentColor);
            setTimeout(function () {
                floodFill(brush.domElement, 70, 30, color, 128);         
            }, 100);
            
            if (!mixResultIsShow) {
                mixResult.setHidden(false);
                mixResult.runAction(moveUp);
                goog.events.listen(moveUp, lime.animation.Event.STOP, function(){
                    mixResultIsShow = true;
                });
            }
            if(!mixPaletteIsShow) {
                mixPalette.setHidden(false);
                mixPalette.runAction(moveLeft); 

                goog.events.listen(moveLeft, lime.animation.Event.STOP, function(){
                    for (i in colors) {
                        colors[i].setHidden(true);
                    }
                    mixPaletteIsShow = true;
                });
            }
        });
    });
    goog.events.listen(mixColor, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
            if (mode == 'rubber') {
                return false;
            }
            clickSound.stop();
            clickSound.play();
            
            currentColor = mixColor.getFill();
            oldColor = currentColor;
            var color = buildColor(currentColor);
            floodFill(brush.domElement, 70, 30, color, 128);
        });
    });
           
    goog.events.listen(mixReset, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {          
            mixColor.setHidden(true);
        });
    });
    
    goog.events.listen(mixClose, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {          
            if (mixResultIsShow) {
                mixResult.runAction(moveDown);
                goog.events.listen(moveDown, lime.animation.Event.STOP, function(){
                    mixResult.setHidden(true);
                    mixResultIsShow = false;
                });
            }
            if (mixPaletteIsShow) {
                mixPalette.runAction(moveRight);
                for (i in colors) {
                    colors[i].setHidden(false);
                }
                goog.events.listen(moveRight, lime.animation.Event.STOP, function(){
                    mixPalette.setHidden(true);
                    mixPaletteIsShow = false;
                });
            }
        });
    });
    
    goog.events.listen(clearButton, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
            clickSound.stop();
            clickSound.play();
            paintImage.setFill(character);
        });
    });
    
    goog.events.listen(howToButton, ['mousedown', 'touchstart'], function(evt) {
        evt.swallow(['mouseup', 'touchend', 'touchcancel'], function(e) {
            clickSound.stop();
            clickSound.play();
            howTo.setHidden(false);
            paintImage.setHidden(true);
        });
    });
    
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('game.start', game.start);

return game;
}