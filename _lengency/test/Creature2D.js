// Creature2D.js




var getopt = function(opt, field_name, default_value) {
    if(typeof opt === 'undefined') { return default_value; }
    return (typeof opt[field_name] !== 'undefined') ? opt[field_name] : default_value;
}











var PIXI = PIXI || {};
var Phaser = Phaser || {};
var Creature2D = Creature2D || {};


function inherits(Child, Parent) {
    var F = function () {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
}


function NamedClass(name) {
    this.name = name || 'Unnamed';
}

NamedClass.prototype = {
    getName: function() {return this.name;},
    setName: function(newname) {this.name = newname;}
}


function CreatureClass(name) {
    NamedClass.call(this, name);
}
inherits(CreatureClass, NamedClass);

function BodyBlockClass(name) {
    NamedClass.call(this, name);
}
inherits(BodyBlockClass, NamedClass);

function BodyComponentClass(name) {
    NamedClass.call(this, name);
}
inherits(BodyComponentClass, NamedClass);

function OrganClass(name) {
    NamedClass.call(this, name);
}
inherits(OrganClass, NamedClass);



// 识，传感频道，sensorChannel

function sensorChannel(name) {
    this.name = name || 'UnnamedChannel';
    this.portList = [];
}
sensorChannel.prototype = {
    addPort: function(port){this.portList.push(port);}
}

var defaultchannel = new sensorChannel('DefaultShi');
var yannshi = new sensorChannel('YannShi');//眼识
var erershi = new sensorChannel('ErerShi');//耳识
var bibishi = new sensorChannel('BibiShi');//鼻识
var sheeshi = new sensorChannel('SheeShi');//舌识
var shenshi = new sensorChannel('ShenShi');//身识


var examplePortOption = {
    r: 0;
    g: 0;
    b: 0;
}
//Object.keys(examplePortOption).length;

function sensorPort(name, opt) {
    this.name = name || 'UnnamedPort';
    this.option = opt;
}







































