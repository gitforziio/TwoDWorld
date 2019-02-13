
var time = 0;

var gameW = 800;
var gameH = 600;

var stay = 'stay';

var score = 0;
var reward = 0;
var rreward;
var action;

var s = [0,0,0,0,0,0,0,0];



var lastDistance = gameH;
var cartDistance = gameH;




var game = new Phaser.Game(gameW, gameH, Phaser.CANVAS, 'worldbox', { preload: preload, create: create, update: update, render: render });


//-----------------------------------------------------------
//          VARS
//-----------------------------------------------------------

var jonitforce = 999999999999;


//-----------------------------------------------------------
//          FUNCTIONS
//-----------------------------------------------------------

function footStand(foot) {
    foot.mainpart.body.static = true;
}
function footRest(foot) {
    foot.mainpart.body.static = false;
}
function footRotateLeft(foot) {
    //foot.mainpart.body.static = true;
    foot.mainpart.body.rotateLeft(500);
    //foot.mainpart.body.static = false;
}
function footRotateRight(foot) {
    //foot.mainpart.body.static = true;
    foot.mainpart.body.rotateRight(500);
    //foot.mainpart.body.static = false;
}


//-----------------------------------------------------------
//          CLASSES
//-----------------------------------------------------------

function makeCircleTex(diameter, fillC, fillA, lineW, lineC, lineA) {
    g = game.add.graphics(0,0);
    g.lineStyle(lineW, lineC, lineA);
    g.beginFill(fillC, fillA);
    g.drawCircle(-gameW, -gameH, diameter)
    g.endFill();
    tex = {};
    tex.diameter = diameter;
    tex.radius = diameter/2;
    tex.texture = g.generateTexture()
    return tex;
}

function makeBarTex(height, fillC, fillA, lineW, lineC, lineA) {
    g = game.add.graphics(0,0);
    g.lineStyle(lineW, lineC, lineA);
    g.beginFill(fillC, fillA);
    g.drawRect(-gameW, -gameH, 2, height)
    g.endFill();
    tex = {};
    tex.height = height;
    tex.texture = g.generateTexture()
    return tex;
}

function computeCircleMass(radius) {
    s = Math.pow(radius,2);
    mass = Math.ceil(s/10);
    return mass;
}

function makeCircleSprite(tex, key) {
    sp = game.add.sprite(gameW/2, gameH/2, tex.texture);
    game.physics.p2.enable([ sp ], true);
    sp.body.setCircle(tex.radius);
    sp.body.mass = computeCircleMass(tex.radius);
    sp.body.static = true;
    sp.key = key||'nokey';
    sp.tex = tex;
    return sp;
}

function makeBarSprite(tex, key) {
    sp = game.add.sprite(gameW/2, gameH/2, tex.texture);
    game.physics.p2.enable([ sp ], true);
    //sp.body.setRect(tex.height);
    sp.body.mass = Math.ceil(tex.height*2/10);
    sp.body.static = true;
    sp.key = key||'nokey';
    sp.tex = tex;
    return sp;
}


function makeFootAgentPart(diameter, fillC, fillA, lineW, lineC, lineA) {
    footTex = makeCircleTex(diameter, fillC, fillA, lineW, lineC, lineA);
    foot = makeCircleSprite(footTex);
    footjointTex = makeCircleTex(10, fillC, fillA, lineW, lineC, lineA);
    footjoint1 = makeCircleSprite(footjointTex);
    footjoint2 = makeCircleSprite(footjointTex);

    game.physics.p2.createLockConstraint(foot, footjoint1, [diameter/2+footjointTex.radius, 0], (0)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(foot, footjoint2, [-diameter/2-footjointTex.radius, 0], (1)*Math.PI, jonitforce);
    //game.physics.p2.createRevoluteConstraint(foot, [foot.x, foot.y], footjoint1, [footjoint1.x,footjoint1.y], jonitforce);
    //game.physics.p2.createRevoluteConstraint(foot, [foot.x, foot.y], footjoint2, [footjoint2.x,footjoint2.y], jonitforce);

    foot.body.static = false;
    footjoint1.body.static = false;
    footjoint2.body.static = false;

    footAgentPart = {};
    footAgentPart.mainpart = foot;
    footAgentPart.joint = new Array();
    footAgentPart.joint[1] = footjoint1;
    footAgentPart.joint[2] = footjoint2;

    return footAgentPart;
}

function makeBarAgentPart(height, fillC, fillA, lineW, lineC, lineA) {
    barTex = makeBarTex(height, fillC, fillA, lineW, lineC, lineA);
    bar = makeBarSprite(barTex);
    barjointTex = makeCircleTex(10, fillC, fillA, lineW, lineC, lineA);
    barjoint1 = makeCircleSprite(barjointTex);
    barjoint2 = makeCircleSprite(barjointTex);

    game.physics.p2.createLockConstraint(bar, barjoint1, [0, height/2+barjointTex.radius], (1/2)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(bar, barjoint2, [0, -height/2-barjointTex.radius], (3/2)*Math.PI, jonitforce);
    //game.physics.p2.createRevoluteConstraint(bar, [bar.x, bar.y], barjoint1, [barjoint1.x,barjoint1.y], jonitforce);
    //game.physics.p2.createRevoluteConstraint(bar, [bar.x, bar.y], barjoint2, [barjoint2.x,barjoint2.y], jonitforce);

    bar.body.static = false;
    barjoint1.body.static = false;
    barjoint2.body.static = false;

    barAgentPart = {};
    barAgentPart.mainpart = bar;
    barAgentPart.joint = new Array();
    barAgentPart.joint[1] = barjoint1;
    barAgentPart.joint[2] = barjoint2;
    return barAgentPart;
}



//-----------------------------------------------------------
//          TEXES
//-----------------------------------------------------------



//-----------------------------------------------------------
//          GAME ENGINE
//-----------------------------------------------------------

function preload() {

}

var result = 'Move with the cursors';

function create() {

    game.stage.disableVisibilityChange=true;


    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    barbar = makeBarAgentPart(50, 0x0000ff, 1, 1, 0x0000ff, 0.5);
    foot1 = makeFootAgentPart(50, 0xff0000, 1, 1, 0xff0000, 0.5);
    foot2 = makeFootAgentPart(50, 0x00ff00, 1, 1, 0x00ff00, 0.5);
    game.physics.p2.createLockConstraint(barbar.joint[1], foot1.joint[1], [foot1.joint[1].tex.radius+barbar.joint[1].tex.radius, 0], (1)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(barbar.joint[2], foot2.joint[1], [foot2.joint[1].tex.radius+barbar.joint[2].tex.radius, 0], (1)*Math.PI, jonitforce);


    mouseTex = makeCircleTex(25, 0xffff00, 1, 1, 0xffffff, 1);
    mouse = makeCircleSprite(mouseTex, 'mouse');
    game.physics.p2.createLockConstraint(mouse, foot1.joint[2], [foot1.joint[2].tex.diameter, 0], (1)*Math.PI, jonitforce);
    mouse.body.static = false;
    mouse.body.x = 1;


    pupupTex = makeCircleTex(25, 0xffffff, 1, 1, 0xffffff, 1);
    pupup = makeCircleSprite(pupupTex, 'pupup');
    game.physics.p2.createLockConstraint(pupup, foot2.joint[2], [foot2.joint[2].tex.diameter, 0], (1)*Math.PI, jonitforce);
    pupup.body.static = false;
    pupup.body.x = 800;



    wwwTex = makeCircleTex(50, 0xffffff, 1, 1, 0x000000, 1);
    www = makeCircleSprite(wwwTex, 'target');
    www.body.static = false;


    //  Check for the block hitting another object
    mouse.body.onBeginContact.add(mouseHit, this);

    //game.input.addMoveCallback(move, this);


}

// function move(pointer, x, y, isDown) {

//     mouse.body.x = x;
//     mouse.body.y = y;
//     line.setTo(organ.x, organ.y, mouse.x, mouse.y);

// }


function agentMove(act) {
    if (act == 1) {
        footRotateLeft(foot1);
        stay='footRotateLeft(foot1);';
    }
    else if (act == 2) {
        footRotateLeft(foot2);
        stay='footRotateLeft(foot2);';
    }
    else if (act == 3) {
        footRotateRight(foot1);
        stay='footRotateRight(foot1);';
    }
    else if (act == 4) {
        footRotateRight(foot2);
        stay='footRotateRight(foot2);';
    }
    else if (act == 5) {
        pupup.body.moveForward(100);
        stay='pupup.body.moveForward(100);';
    }
    else if (act == 6) {
        pupup.body.moveBackward(100);
        stay='pupup.body.moveForward(100);';
    }
    else {
        stay='none';
    }
}


function wwwMove(act) {
    if (0 <= act <= 0.2) {
        www.body.moveForward(80);
    }
    else if (0.2 < act <= 0.4) {
        www.body.moveForward(80);
    }
    else if (0.4 < act <= 0.6) {
        www.body.rotateLeft(80);
    }
    else if (0.6 < act <= 0.8) {
        www.body.rotateRight(80);
    }
    else {
    }
}


function mouseHit (body, bodyB, shapeA, shapeB, equation) {

    rreward = 0;
    if (body)
    {
        if (body.sprite.key == 'target') {
            score += 1;
            rreward = 200;
        }
        else {
            rreward = 0;
        }
    }
    else
    {
        rreward = -10;
    }

}

var d = 0.001;

function update() {

    wwwMove(Math.random());

    cartDistance = Phaser.Math.distance(mouse.x, mouse.y, www.x, www.y);

    rrreward = 0;
    if (cartDistance < lastDistance) {
        rrreward = 10;//1;//d;
    }
    else {
        rrreward = 0//-1;
    }

    s1=foot1.mainpart.body.x;
    s2=foot1.mainpart.body.y;
    s3=foot2.mainpart.body.x;
    s4=foot2.mainpart.body.y;
    s5=foot1.mainpart.body.angle;
    s6=foot2.mainpart.body.angle;
    s7=www.body.velocity.x;
    s8=www.body.velocity.y;
    s9=www.body.x;
    s10=www.body.y;
    s11=barbar.mainpart.body.velocity.x;
    s12=barbar.mainpart.body.velocity.y;
    s13=barbar.mainpart.body.angle;
    s14=cartDistance;

    s = [s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14];

    var action = agent.act(s);
    agentMove(action);
    time += 1;

    reward = 30-0.1*cartDistance;
    if(rreward){
        reward += rreward;
    }
    if(rrreward){
        reward += rrreward;
    }

    agent.learn(reward);

    lastDistance = cartDistance;
    rreward = 0;

}

function preRender() {
}

function render() {

    // game.debug.text(ball.body.angle, 32, 160);
    // game.debug.text(www.body.angle, 32, 192);
    game.debug.text(stay, 32, 128);
    game.debug.text(reward, 32, 96);
    game.debug.text("score = "+score, 32, 32);
    game.debug.text(time, 32, 160);
    //game.debug.text(s1+"  "+s2+"  "+s3+"  "+s4+"  "+s5+"  "+s6+"  "+s7+"  "+s8+"  "+s9+"  "+s10+"  "+s11+"  "+s12+"  "+s13+"  "+s14, 32, 64);

}

