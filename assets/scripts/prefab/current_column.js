var common = require('common.js');
var util = require('util.js');
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		
	},
	show(x,width){
		// console.log(isshow)
		var that=this;
		var com=common;
		that.node.height=com.game_red_bg_height;
		that.current_column_Graphics=that.node.getComponent(cc.Graphics);
		that.current_column_Graphics.clear()
		that.current_column_Graphics.fillRect(x, 0, width, com.game_red_bg_height);
		that.current_column_Graphics.fill();
	},
	hidden(){
		var that=this;
		that.node.active=false;
	},
    start () {

    },

    // update (dt) {},
});
