var common = require('common.js');
var util = require('util.js');
cc.Class({
	extends: cc.Component,

	properties: {
		header_bg: cc.Node,
		header_img: cc.Node,
		score: cc.Label
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		
	},
	headerImg() {
		var url='user/header';
		var that=this;
		cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
			var node = new cc.Node('avatar');
			var sprite = node.addComponent(cc.Sprite);
			sprite.spriteFrame = spriteFrame;
			var mask = new cc.Node();
			var mask_node = mask.addComponent(cc.Mask); // 真正的创建出 mask
			mask.parent = that.header_img;
			node.parent =mask;
			sprite.node.width = 90;
			sprite.node.height = 90;
			sprite.node.x = -45;
			sprite.node.y = -45;
			sprite.node.anchorX = 0;
			sprite.node.anchorY = 0;
			mask.x=50;
			mask.y=40;
			mask.width=90;
			mask.height=90;
			if(that.node.active){
				mask_node.type = cc.Mask.Type.ELLIPSE; // 这里才是 mask_node 设置为圆
			}
		});
	},
	show(init){
		var that = this;
		var com = common;
		that.node.width=100;
		that.node.height=160;
		that.header_bg.width = 100;
		that.header_bg.height = 100;
		that.header_bg_Graphics = that.header_bg.getComponent(cc.Graphics);
		that.header_bg_Graphics.circle(50, 40, 50);
		that.header_bg_Graphics.fill();
		that.score.string=''+com.score;
		that.node.y=com.game_white_bg_height+90;
		that.score.node.y=-45;
		that.headerImg();
	},
	start() {

	},

	// update (dt) {},
});
