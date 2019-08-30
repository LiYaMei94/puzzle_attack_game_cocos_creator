var common = require('common.js');
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		var that=this;
		that.node.active=false;
		that.gameOverInfo= that.node.getChildren()[1].getComponent(cc.Graphics);
		that.gameOverInfo.roundRect(0, 0,460, 400, 15);
		that.gameOverInfo.fill();
		
		// 确定取消绑定事件
		that.sure=that.node.getChildren()[1].getChildren()[2];
		that.cancel=that.node.getChildren()[1].getChildren()[3];
		that.sure.on(cc.Node.EventType.TOUCH_START, that.touchStart, that);
		that.cancel.on(cc.Node.EventType.TOUCH_START, that.touchStart, that);
	},
	show(line){
		var that=this;
		var com=common;
		var gridSize_y=com.gridSize_y;
		if(line==gridSize_y){
			that.node.active=true;
		}else{
			that.node.active=false;
		}
	},
	touchStart(event){
		var that=this;
		var name=event.currentTarget.name;
		that.node.active=false;
		if(name=="sure"){
			cc.director.loadScene('game');//重新加载游戏
		}else{
			
		}
	},
    start () {

    },

    update (dt) {
	},
});
