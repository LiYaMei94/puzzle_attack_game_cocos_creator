var common = require('common.js');
cc.Class({
    extends: cc.Component,

    properties: {
      first_line:cc.Label,
	  second_line:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		var that=this;
		var com=common;
		that.node.width=com.screenWidth;
		that.node.height=500;
		that.node.active=false;
	},
	show(status,removeMore){
// 		1 是得分
// 		2 是连消
// 		3 是等级增加
		var that=this;
		var com=common;
		var text1='';
		var text2='';
		var isfadeOut=false;
		that.node.active=true;
		if(status==1){
			text1='+'+com.removeScore;
			text2='得分'
			isfadeOut=true;
		}else if(status==2){
			text1='+'+com.removeScore;
			text2='漂亮，连消'+"("+removeMore+")"
			isfadeOut=true;
		}else if(status==3){
			text1='难度提升 得分X'+com.removeScore;
			isfadeOut=true;
		}else if(-1){
			text1='游戏开始';
			text2='拖动方块，消除整行';
			isfadeOut=false;
		}
		that.first_line.string=text1;
		that.second_line.string=text2;
		if(isfadeOut){
			let fadeOut=cc.fadeOut(1.5);
			that.node.runAction(fadeOut)
		}else{
			let scaleBy1=cc.scaleBy(0.5,1.1);
			let scaleBy2=cc.scaleBy(0.5,0.9);
			let scaleBy3=cc.scaleBy(0.5,1.1);
			let scaleBy4=cc.scaleBy(0.5,1);
			let fadeOut=cc.fadeOut(1.3);
			let callback = cc.callFunc(function(){
				com.gameinit=true;
			})
			that.node.runAction(cc.sequence(scaleBy1,scaleBy2,scaleBy3,scaleBy4,fadeOut,callback))
		}
	},
    start () {

    },

    // update (dt) {},
});
