var util = require('util.js');
var common = require('common.js');
var gameOver = require('prefab/gameOver.js');
var promptWords = require('prefab/promptWords.js');
var user_item = require('prefab/user_item.js');
var current_column=require('prefab/current_column.js');
var fallDownNode=[];
cc.Class({
	extends: cc.Component,
	properties: {
		level: cc.Node,
		levelBg: cc.Node,
		levelBgRect: cc.Node,
		levelText: cc.Label,
		levelNum: cc.Label,
		levelInfo: cc.Node,
		game_bg: cc.Node,
		rect_list_bg: cc.Node,
		rect_list: cc.Node,
		square_list: cc.Node,
		next_time_show: cc.Node,
		netShowRect: cc.Node,
		netShowRect: cc.Node,
		users: cc.Node,
	},
	onLoad() {
		var that = this;
		var com = common;

		com.init(); //初始化获取数据
		that.rect_item_width = com.gridWidth; //每一个方格的宽度
		that.rect_item_line = com.gridWidth + 2; //行标
		that.rectList_x = com.gridSize_x; //x轴的矩阵个数
		that.rectList_y = com.gridSize_y; //y轴的矩阵个数

		// 等级
		that.levelBg_Graphics = that.levelBg.getComponent(cc.Graphics);
		that.levelBgRect_Graphics = that.levelBgRect.getComponent(cc.Graphics);
		that.level.x = -(com.screenWidth / 2 + 10);
		that.level.y = (com.screenHeight / 2) - 80;
		that.levelText.string = '难度';
		that.levelNum.string = com.gameLevel + '';
		that.updateLevelWidth();

		// 白色背景
		that.game_bg.width = com.game_white_bg_width;
		that.game_bg.height = com.game_white_bg_height;
		that.game_bg_Graphics = that.game_bg.getComponent(cc.Graphics);
		that.game_bg_Graphics.roundRect(0, 0, com.game_white_bg_width, com.game_white_bg_height, 15);
		that.game_bg_Graphics.fill();

		// 矩阵下方的红色背景
		that.rect_list_bg.width = com.game_red_bg_width;
		that.rect_list_bg.height = com.game_red_bg_height;
		that.rect_list.width = com.game_red_bg_width;
		that.rect_list.height = com.game_red_bg_height;
		that.rect_list_bg_Graphics = that.rect_list_bg.getComponent(cc.Graphics);
		that.rect_list_Graphics = that.rect_list.getComponent(cc.Graphics);
		that.rect_list_bg_Graphics.fillRect(0, 0, com.game_red_bg_width, com.game_red_bg_height);
		that.rect_list_bg_Graphics.fill();

		// 绘制矩阵
		var rect_color = ['#F385A4', '#ffffff'];
		for (var y = 0; y < that.rectList_y; y++) {
			for (var x = 0; x < that.rectList_x; x++) {
				com.rectList_coord.push({
					x: x * that.rect_item_width + (x * 2),
					y: y * that.rect_item_width + (y * 2),
					isNull: true
				})
				util.draw_fillrect(that.rect_list_Graphics, x * that.rect_item_width + (x * 2), y * that.rect_item_width + (y * 2),
					that.rect_item_width,
					that.rect_item_width, rect_color[0]);

			}
		}
		// console.log(com.rectList_coord)

		// 下一次方块出现的位置
		that.next_time_show_Graphics = that.next_time_show.getComponent(cc.Graphics);
		that.next_time_show.width = com.game_white_bg_width;
		that.next_time_show.height = com.game_white_bg_height;
		that.netShowRect.width = com.next_time_show_width;
		that.netShowRect.height = com.next_time_show_height;
		that.next_time_show_Graphics.roundRect(18, 15, com.next_time_show_width, com.next_time_show_height, 15);
		that.next_time_show_Graphics.fill();

		// 绘制方块的
		that.square_list.width = com.game_red_bg_width;
		that.square_list.height = com.game_red_bg_height;

		// 设置用户头像及分数的大小
		that.users.width = com.game_red_bg_width;
		that.users.height = com.game_red_bg_height + 160;

		
		that.gameInit();// 先显示游戏提示在初始化
		that.user_item();//初始化头像和成绩预制组件
		that.scheduleOnce(function() {
			that.squareinit();
		}, 3.1);
	},
	// 修改等级
	updateLevel() {
		var com = common;
		var that = this;
		if (com.score > 10) {
			com.gameLevel = 2;
			com.removeScore = 2;
			common.square_width_num_arr=[1,2,3,4];
		} else if (com.score > 30) {
			com.gameLevel = 3;
			com.removeScore = 3;
		} else if (com.score > 40) {
			com.gameLevel = 4;
			com.removeScore = 4;
		}
		that.levelNum.string = com.gameLevel + '';
		that.updateLevelWidth();
	},
	// 根据等级修改等级框的宽度
	updateLevelWidth() {
		var com = common;
		var that = this;
		var width_num = util.isNum(com.gameLevel);
		var width = 25;
		// console.log()
		var maxWidth = width * width_num + 120;
		var minWidth = width * width_num + 110;
		that.levelBg_Graphics.clear()
		that.levelBg_Graphics.roundRect(0, 0, maxWidth, 70, 12);
		that.levelBg_Graphics.fill()

		that.levelBgRect_Graphics.clear()
		that.levelBgRect_Graphics.roundRect(5, 5, minWidth, 60, 12);
		that.levelBgRect_Graphics.fill()
	},
	// 游戏提示
	gameInit() {
		var that = this;
		that.promptWords(-1);
	},
	// 方块初始化
	squareinit() {
		var that = this;
		var com = common;
		var rectList_coord = com.rectList_coord;
		var current_square = {};
		that.new_rectList_coord = [];
		for (var i in rectList_coord) {
			that.new_rectList_coord.push(util.deepClone(rectList_coord[i]));
		}
		current_square = that.init_random_rect(that.new_rectList_coord, 2); //随机获取5个矩阵坐标

		com.current_square = that.random_width(current_square); //随机宽度
		that.updateIsNull(); //没有方块的方格isNull属性是true
		that.addColor(com.current_square);
		that.initFall(); //第一次上面的哪行不能有可以下落的
		that.updateIsNull(); //没有方块的方格isNull属性是true
		that.renderNode();
		that.next_tiem_show(true);
		com.remove_line = that.getremoveLine();
		that.removeSquare(false);
		// console.log(com.current_square)
	},
	// 渲染初始化
	renderNode() {
		var that = this;
		var com = common;
		var randomObj = com.current_square;
		// console.log(com.square_coord)
		for (var i in randomObj) {
			for (var j = 0; j < randomObj[i].length; j++) {
				if (!randomObj[i][j]) { //确保坐标中不会有undefined
					randomObj[i].splice(j, 1);
				} else {
					that.addNode(randomObj[i][j].color, randomObj[i][j].color, randomObj[i][j].x, randomObj[i][j].y, randomObj[i][j]
						.width, com.gridWidth);
				}
			}
		}

	},
	// 创建节点
	addNode(nodeName, url, x, y, width, height) {
		var that = this;
		var url = "square/" + url;
		cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
			var node = new cc.Node(nodeName);
			var sprite = node.addComponent(cc.Sprite);
			sprite.spriteFrame = spriteFrame;
			node.parent = that.square_list;
			sprite.node.width = width;
			sprite.node.height = height;
			sprite.node.x = x;
			sprite.node.y = y;
			sprite.node.anchorX = 0;
			sprite.node.anchorY = 0;
			node.on(cc.Node.EventType.TOUCH_START, that.touchStart, that);
			node.on(cc.Node.EventType.TOUCH_MOVE, that.touchMove, that);
			node.on(cc.Node.EventType.TOUCH_END, that.touchEnd, that);
			node.on(cc.Node.EventType.TOUCH_CANCEL, that.touchEnd, that);
		});
	},

	/*
	 *从数组中随机获取数据
	 * arr{array}要随机的原始数组
	 * line{number}矩阵中有方块的行数
	 * num{number}要随机去的数据条数
	 * init表示是不是初始化
	 */
	init_random_rect(arr, line) {
		var obj = util.deepClone(util.json_merge(arr));
		var com = common;
		com.total_coord = util.json_merge(arr);
		com.square_coord = util.json_merge(arr);
		var result = {};
		var result_arr = [];
		var num_arr = [3, 4, 5];
		var num = 0;
		var rectHeight = com.gridWidth + 2;
		for (var i = 0; i < line; i++) {
			result[i * rectHeight] = [];
			num = num_arr[Math.floor(Math.random() * num_arr.length)];
			rand(num); //随机 n 条
			function rand(k) {
				if (k == 0) {
					return;
				}
				var flag = true;
				for (var item in result) {
					var index = Math.floor(Math.random() * obj[item].length);
					for (var i = 0; i < result[item].length; i++) {
						if (util.objectIsEqual(result[item][i], obj[item][index])) {
							flag = false;
						}
					}
					if (flag) {
						obj[item][index].isNull = false;
						result[item].push(obj[item][index]);
					}
				}
				k--;
				rand(k);
			}
		}
		// console.log(result)
		return result;
	},

	// 第一次确保第二行不会下落
	initFall() {
		var that = this;
		var com = common;
		var current_square = util.deepClone(com.current_square);
		var square_coord = util.deepClone(com.square_coord);
		var rectLength = 0;
		var gridWidth = com.gridWidth;
		var isFallDown = false;
		var temp = [];
		var line = gridWidth + 2;
		// 		console.log(square_coord)
		// 		console.log(util.deepClone(com.current_square))
		for (var i = 0; i < current_square[line].length; i++) {
			for (var j = 0; j < square_coord[0].length; j++) {
				if (current_square[line][i].x == square_coord[0][j].x) {
					rectLength = Math.floor(current_square[line][i].width / gridWidth);
					isFallDown = that.isFallDown(0, j, square_coord, rectLength);
					if (isFallDown) {
						// console.log(current_square[line])
						current_square[line][i].isfallDown = true;
						that.updateStatus(line, j, rectLength, true, square_coord);
						that.updateStatus(0, j, rectLength, false, square_coord);
					}
				}
			}
		}
		// that.updateIsNull(); //没有方块的方格isNull属性是true
		temp = util.obj_arr(current_square);
		// console.log(temp)
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].isfallDown) {
				temp[i].y = 0;
			}
		}
		current_square = util.objSort(util.json_merge(temp));
		// console.log(current_square)
		com.current_square = current_square;
	},
	
	/*
	 *根据坐标随机宽度
	 * obj{object}随机到的数据
	 */
	random_width(obj) {
		var com = common;
		var that = this;
		var rect_width = com.gridWidth;
		var square_list_width = com.square_list_width;
		var obj = util.objSort(util.deepClone(obj));
		for (var i in obj) {
			for (var j = 0; j < obj[i].length; j++) {
				if (!obj[i][j]) { //确保坐标中不会有undefined
					obj[i].splice(j, 1);
				} else {
					if (j + 1 < obj[i].length) {
						var num = Math.floor((obj[i][j + 1].x - obj[i][j].x) / rect_width);
						obj[i][j].width = that.random(num);
						obj[i][j].ex = obj[i][j].x + obj[i][j].width;
					} else { //最后一项
						var num = Math.floor((square_list_width - obj[i][obj[i].length - 1].x) / rect_width);
						obj[i][j].width = that.random(num);
						obj[i][j].ex = obj[i][j].x + obj[i][j].width;
					}
				}
			}
		}
		return obj;
	},
	/*
	 *根据坐标随机宽度
	 * range{number}该方块的宽度占了几个方格
	 */

	random(range) {
		var com = common;
		var result = 0;
		var arr = [];
		var num = 0; //占得格数
		var rect_width = com.gridWidth;
		var total_coord = com.total_coord;
		var gameLevel = com.gameLevel;
		var square_width_num_arr = com.square_width_num_arr;
		for (var i = 1; i < range + 1; i++) {
			arr.push(i);
		}
		if (range >= square_width_num_arr[0] && range <= square_width_num_arr[square_width_num_arr.length - 1]) {
			arr = arr;
		} else {
			arr = square_width_num_arr;
		}
		result = Math.floor(Math.random() * arr.length);
		num = arr[result]; //宽度占得格数
		return num * rect_width + (num - 1) * 2;
	},

	// square_coord判断空闲的方格
	updateIsNull() {
		var com = common;
		var that = this;
		var square_coord = util.deepClone(com.total_coord);
		var rect_width = com.gridWidth;
		var num = 0;
		var isLeftMove = that.isLeftMove;
		var current_square = com.current_square;
		for (var i in current_square) {
			var csLen = current_square[i].length
			for (var z = 0; z < csLen; z++) {
				num = Math.floor(current_square[i][z].width / rect_width);
				var scLen = square_coord[i].length;
				for (var j = 0; j < scLen; j++) {
					if (current_square[i][z].x == square_coord[i][j].x) {
						that.updateStatus(i, j, num, false, square_coord);
					}
				}
			}
		}
	},

	updateStatus(i, j, num, isInsteadTrue, square_coord) {
		var com = common;
		for (var a = j; a < j + num; a++) {
			if (isInsteadTrue) {
				square_coord[i][a].isNull = true;
			} else {
				square_coord[i][a].isNull = false;
			}
		}
		com.square_coord = square_coord;
		// 		console.log("更改isNull之后的数据")
		// 		console.log(square_coord)
		// console.log(com.current_square)
	},

	addColor(randomCoord) {
		var color = ['blue', 'green', 'red', 'grey', 'yellow'];
		var index = 0;
		for (var i in randomCoord) {
			for (var j = 0; j < randomCoord[i].length; j++) {
				index = Math.floor(Math.random() * color.length);
				randomCoord[i][j].color = color[index];
			}
		}
		return randomCoord;
	},

	// 选中一个方块时给一个这一列给一个透明的背景
	current_column_init(x,widht){
		var that=this;
		cc.loader.loadRes("prefab/current_column", function(err, prefab) {
			if (err) {
				console.log(err);
				return;
			}
			that.current_column = cc.instantiate(prefab);
			that.square_list.addChild(that.current_column);
			that.current_column.getComponent(current_column).show(x,widht);
		});
	},
	
	// 更新节点的位置
	updateNodePosition(x, y1, y2, Touch) {
		var that = this;
		var com = common;
		var square_list = that.square_list;
		var square_list_child = square_list.getChildren();
		var time=1;
		for (var i = 0; i < square_list_child.length; i++) {
			if (square_list_child[i].x == x && square_list_child[i].y == y1) {
				square_list_child[i].y=y2;
// 				var jumpTo=cc.moveTo(0.5,cc.v2(square_list_child[i].x, y2))
// 				var callFunc1=cc.callFunc(function(node){
// 					node.y=y2;
// 				})
// 				var callFunc2=cc.callFunc(function(){
// 					com.remove_line = that.getremoveLine();
// 				})
// 				var callFunc3=cc.callFunc(function(){
// 					that.removeSquare(Touch);
// 				})
// 				square_list_child[i].runAction(cc.sequence(jumpTo,cc.delayTime(time),callFunc1,callFunc2,callFunc3));
			}
		}
		// console.log(square_list_child)
	},
	update_current_square(x, y1, y2) {
		var temp = [];
		var com = common;
		var that = this;
		var current_square = {};
		var square_list = that.square_list;
		temp = util.obj_arr(util.deepClone(com.current_square));
		// console.log(temp)
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].x == x && temp[i].y == y1) {
				temp[i].y = y2;
			}
		}
		current_square = util.objSort(util.json_merge(temp));
		com.current_square = current_square;
		that.updateIsNull(com.current_square);
		console.log('有下落的下落之后的数据')
		console.log(com.current_square)
	
	},
	
	//targetLine是要判断的哪一行targetLine,
	// 是当前移动的那个能不能下落
	updateY(targetLine, Touch) {
		console.log('Touch==='+Touch)
		var com = common;
		var that = this;
		var current_square = util.deepClone(com.current_square);
		var square_coord = util.deepClone(com.square_coord);
		var rect_item_line = that.rect_item_line;
		var topLine = targetLine == 0 ? rect_item_line : targetLine;
		var bottomLine = targetLine == 0 ? 0 : targetLine - rect_item_line;
		var num = 0;
		var isFallDown = false;
		var rect_width = com.gridWidth;
		var temp = {};
		var keys = Object.keys(current_square);
		var isFallDownArr = [];
		if (topLine <= keys[keys.length - 1]) {
			if (current_square[topLine]) {
				for (var j = 0; j < current_square[topLine].length; j++) {
					for (var z = 0; z < square_coord[bottomLine].length; z++) {
						if (current_square[topLine][j].x == square_coord[bottomLine][z].x) {
							num = Math.floor(current_square[topLine][j].width / rect_width);
							isFallDown = that.isFallDown(bottomLine, z, square_coord, num);
							isFallDownArr.push(isFallDown);
							fallDownNode.push(isFallDown)
							if (isFallDown) {
								temp = util.deepClone(current_square[topLine][j]);
								com.fallDownNode.push(temp);
								that.updateNodePosition(temp.x, temp.y, temp.y - rect_item_line, Touch);
								that.update_current_square(temp.x, temp.y, temp.y - rect_item_line);
								that.updateStatus(topLine, z, num, true, square_coord);
								that.updateStatus(bottomLine, z, num, false, square_coord);
							}
						}
					}
				}
				// 			console.log(isFallDownArr)
				if (isFallDownArr.indexOf(true) != -1) {
					topLine = topLine - rect_item_line;
				} else {
					topLine = topLine + rect_item_line;
				}
				that.updateY(topLine, Touch);
			} else {
				that.removeAfterFallDown(current_square, topLine)
			}
		} else {
			return;
		}
	},
	
	// 判断是否可以下落
	// 	line是square_coord的第几行
	// 	squareindex是square_coord的line行的第几个
	// 	num是current_square的方块占得方格数
	isFallDown(line, squareindex, square_coord, num) {
		var com = common;
		var rect_width = com.gridWidth;
		// var num = Math.floor(currentWidth / rect_width);
		var status = [];
		var isfallDown = false; //默认不可以下落
		for (var a = squareindex; a < squareindex + num; a++) {
			status.push(square_coord[line][a].isNull);
		}
		if (status.indexOf(false) != -1) {
			isfallDown = false;
		} else {
			isfallDown = true;
		}
		return isfallDown;
	},

	// 销毁节点
	destroynode(remove_line) {
		var that = this;
		var com = common;
		var square_list = that.square_list;
		var square_list_child = square_list.getChildren();
		for (var i = 0; i < square_list_child.length; i++) {
			if (square_list_child[i].y == remove_line) {
				square_list_child[i].destroy();
			}
		}
		// that.updateCurrentData()
	},
	// 判断有没有可以消除的行
	// 如果有common.score+1,同时判断common.score+1的范围如果超过10,则将common.gameLevel+1,同时common..square_width_num_arr改为[1,2,3,4]
	getremoveLine() {
		// 判断有方块的每一行的的数组长度是不是等于common.gridSize_x
		var com = common;
		var that = this;
		var current_square = util.deepClone(com.current_square);
		var gridSize_x = com.gridSize_x;
		var current_square_width = {};
		var remove_line = com.remove_line;
		var rect_item_width = that.rect_item_width;
		var minWidth = gridSize_x * rect_item_width;//558
		var maxWidth = com.square_list_width;//574
// 		console.log(minWidth);
// 		console.log(maxWidth);
		for (var i in current_square) {
			var width = 0;
			for (var j = 0; j < current_square[i].length; j++) {
				if (current_square[i][j]) {
					width = width + current_square[i][j].width;
					current_square_width[i] = width;
				}
			}
		}
		// console.log(current_square_width)
		for (var a in current_square_width) {
			if (current_square_width[a] >= minWidth && current_square_width[a] <= maxWidth) {
				//可以消除一行
				remove_line.push(a * 1);
			}
		}
		remove_line=util.arr_remove_repeat(remove_line);
		// console.log(remove_line)
		return remove_line;
	},
	removeSquare(touch) {
		var that = this;
		var com = common;
		var current_square = util.deepClone(com.current_square);
		var remove_line = com.remove_line;
		var level_critical_value = [11,31,41];
		if(remove_line.length!=0){
			for (var i = 0; i < remove_line.length; i++) {
				com.score = com.score + com.removeScore; //修改分数
				that.promptWords(1);
				that.updateLevel();
				that.removeAnimation(current_square,remove_line[i],touch);
			}
			that.scheduleOnce(function() {
				if(remove_line.length>1){
					that.promptWords(2,remove_line.length);
				}
			},1.5);
			that.scheduleOnce(function() {
				com.remove_line = [];
			},1.6);
			that.scheduleOnce(function() {
				if (level_critical_value.indexOf(com.score) != -1) {
					that.promptWords(3);
				}
			}, 3);
		}else {
			if(touch){
				that.scheduleOnce(function() {
					that.addRect();
				},0.5);
			}
		}
		
		// 		console.log('删除之后的数据')
		// 		console.log(com.current_square)

	},
	// 删除动画
	removeAnimation(current_square, remove_line, touch) {
		var that = this;
		var com = common;
		var square_list = that.square_list;
		var square_list_child = square_list.getChildren();
		// console.log(current_square, remove_line, touch)
		var arr = current_square[remove_line];
		for (var j = 0; j < arr.length; j++) {
			for (var i = 0; i < square_list_child.length; i++) {
				if (square_list_child[i].x == arr[j].x && square_list_child[i].y == arr[j].y) {
					var action1 = cc.moveTo(0.3,cc.v2(square_list_child[i].x+8, square_list_child[i].y));
					var action2 = cc.moveTo(0.3,cc.v2(square_list_child[i].x-8, square_list_child[i].y));
					var action3 = cc.moveTo(0.3,cc.v2(square_list_child[i].x+8, square_list_child[i].y));
					var action4 = cc.moveTo(0.3,cc.v2(square_list_child[i].x, square_list_child[i].y));
					var callback1 = cc.callFunc(function() {
						delete current_square[remove_line];
						com.current_square = current_square;
						that.updateIsNull(com.current_square);
						that.destroynode(remove_line);
						if (JSON.stringify(current_square) == '{}') {
							that.scheduleOnce(function() {
								that.addRect();
							}, 0.5);
						} else {
							that.scheduleOnce(function() {
								that.removeAfterFallDown(current_square, remove_line[i], touch);
							}, 0.5);
						}
					});
					var callback2=cc.callFunc(function() {
						that.userScoreLabel.string = com.score + '';
					})
					square_list_child[i].runAction(cc.sequence(action1,action2,action3,action4,callback1,callback2));
				}
			}
		}
		// console.log(arr)
	},
	// 下落一行
	removeAfterFallDown(current_square, remove_line, touch) {
		var that = this;
		var com = common;
		var square_list = that.square_list;
		var temp = [];
		var objTemp = {};
		var rect_item_line = that.rect_item_line;
		temp = util.obj_arr(util.deepClone(current_square));
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].y > remove_line) {
				objTemp = util.deepClone(temp[i]);
				that.updateNodePosition(objTemp.x, objTemp.y, objTemp.y - rect_item_line);
				that.update_current_square(objTemp.x, objTemp.y, objTemp.y - rect_item_line);
			}
		}
		that.updateY(rect_item_line, false);
		com.remove_line = that.getremoveLine();
		if (com.remove_line.length != 0) {
			// that.removeSquare();
		}
		if (touch) {
			// console.log(touch)
			that.scheduleOnce(function() {
				that.addRect();
			}, 0.5);
		}
	},
	addRect() {
		var com = common;
		var that = this;
		var temp = [];
		var current_square = util.deepClone(com.current_square);
		var result = {};
		var remove_line = com.remove_line;
		var square_list = that.square_list;
		var objTemp = {};
		var keys = [];
		var rect_item_line = that.rect_item_line;
		var newData = that.next_tiem;
		if (JSON.stringify(current_square) != '{}') {
			for (var i in current_square) {
				for (var j = 0; j < current_square[i].length; j++) {
					objTemp = util.deepClone(current_square[i][j]);
					// that.updateNodePosition(objTemp.x,objTemp.y,objTemp.y+rect_item_line);
					current_square[i][j].y = current_square[i][j].y + rect_item_line;
					temp.push(current_square[i][j])
				}
			}
			if (JSON.stringify(newData) != '{}') {
				temp = newData[0].concat(temp);
			}
			result = util.json_merge(temp);
		} else {
			result = newData;
		}
		com.current_square = result;
		that.updateIsNull(com.current_square);
		square_list.destroyAllChildren();
		that.renderNode(com.current_square);
		// 				console.log('新增一行之后的数据')
		// 				console.log(com.current_square);
		that.scheduleOnce(function() {
			that.updateY(rect_item_line, false);
			com.remove_line = that.getremoveLine();
		}, 0.3);
		that.scheduleOnce(function() {
			if (com.remove_line.length != 0) {
				that.removeSquare(false);
			}
		}, 0.5);
		that.scheduleOnce(function() {
			that.next_tiem_show(false);
		}, 0.6);
		that.scheduleOnce(function() {
			keys = Object.keys(com.current_square);
			com.square_line_num = keys.length;
			that.gameOver(); //游戏结束
		}, 1);

	},
	// 绘制下次出现的方块的
	next_tiem_show(init) {
		var that = this;
		var com = common;
		var newData = that.init_random_rect(that.new_rectList_coord, 1); //随机获取矩阵坐标
		newData = that.random_width(newData);
		newData = that.addColor(newData);
		var ctx = that.netShowRect.getComponent(cc.Graphics);
		// console.log(init)
		if (!init) {
			ctx.clear(); //先清除之前绘制的
		}
		for (var i = 0; i < newData[0].length; i++) {
			ctx.roundRect(newData[0][i].x + 2, 5, newData[0][i].width, 20, 10);
			ctx.fill();
		}
		that.next_tiem = newData;

		// console.log(that.next_tiem)
	},


	touchStart(event) {
		var that = this;
		var com=common;
		that.startLocation = util.worldConvertLocalPointAR(that.square_list, event);
		that.targetX = event.target.x;
		// com.remove_line = [];
		that.current_column_init(event.target.x,event.target.width)// 初始化选中方块的透明背景
		
	},
	touchMove(event) {
		var that = this;
		var com = common;
		that.moveLoaction = util.worldConvertLocalPointAR(that.square_list, event);
		var mx = Math.floor(that.moveLoaction.x);
		var my = that.moveLoaction.y;
		var targetY = event.target.y;
		var targetX = event.target.x;
		var current_square = util.deepClone(com.current_square);
		var sx = that.startLocation.x;
		var sy = that.startLocation.y;
		that.isLeftMove = false;
		var index = 0;
		var rect_item_width = that.rect_item_width;
		var isAttack = false;
		// console.log(targetX)
		// 		console.log(current_square)
		// 		console.log(current_square[targetY])
		if (Math.abs(sx - mx) != 0) {
			//获取当前要移动的方块的index值
			if (current_square[targetY]) {
				current_square[targetY].map(function(x, y, z) {
					if (targetX == current_square[targetY][y].x) {
						index = y;
						that.index = y;
					}
				})
				that.target = util.deepClone(com.current_square[targetY][index])
				if (sx - mx > 0) { //左
					that.isLeftMove = true;
					if (mx <= event.target.x) {
						if (index == 0) { //移动的是第一个
							if (mx <= 0) {
								event.target.x = 0;
								isAttack = true;
							} else {
								event.target.x = mx;
							}
						} else { //移动的是其他的
							if (current_square[targetY][index - 1].x + current_square[targetY][index - 1].width + 2 < mx) {
								event.target.x = mx;
							} else {
								event.target.x = current_square[targetY][index - 1].x + current_square[targetY][index - 1].width + 2;
								isAttack = true;
							}
						}
					}
				} else if (sx - mx < 0) { //右
					that.isLeftMove = false;
					if (mx > event.target.x) {
						if (index != current_square[targetY].length - 1) { //不是最后一个
							if (mx < current_square[targetY][index + 1].x - current_square[targetY][index].width - 2) {
								event.target.x = mx;
							} else {
								event.target.x = current_square[targetY][index + 1].x - current_square[targetY][index].width - 2;
								isAttack = true;
							}
						} else {
							if (mx + current_square[targetY][index].width < com.right_coord + rect_item_width) {
								event.target.x = mx;
							} else {
								event.target.x = com.right_coord + rect_item_width - current_square[targetY][index].width;
								isAttack = true;
							}
						}
					}
				}
				that.current_column.getComponent(current_column).show(event.target.x,event.target.width);//透明背景移动
				current_square[targetY][index].x = event.target.x; //将变化的值复制给坐标中
				current_square[targetY][index].ex = event.target.x + current_square[targetY][index].width; //将变化的值复制给坐标中
				com.current_square = current_square;
				that.isAttack = isAttack;
			}
		}
	},
	touchEnd(event) {
		var that = this;
		var com = common;
		that.endLocation = util.worldConvertLocalPointAR(that.square_list, event);
		var current_square = util.deepClone(com.current_square);
		var targetY = event.target.y;
		var targetX = that.targetX;
		var index = that.index;
		var ex = that.endLocation.x;
		var sx = that.startLocation.x;
		var ey = that.endLocation.y;
		var rectList_coord = util.json_merge(com.rectList_coord);
		var coordIndex = -1;
		var half = 0;
		var rect_item_width = that.rect_item_width;
		var rect_num = Math.floor(event.target.width / rect_item_width); //当前方块占了几个坐标
		var isAdd = false;
		var isAttack = that.isAttack;
		var rect_item_line = that.rect_item_line;
		var len=Object.keys(current_square);
		that.current_column.getComponent(current_column).hidden();//透明背景消失
		// console.log(rectList_coord)
		if (Math.abs(ex - sx) != 0) {
			if (rectList_coord[targetY]) {
				rectList_coord[targetY].map(function(x, y, z) {
// 					console.log(event.target.x + event.target.width)
// 					console.log("rectList_coord[targetY][y].x==="+rectList_coord[targetY][y].x)
// 					console.log(rectList_coord[targetY][y].x + rect_item_width+2)
					if (event.target.x > rectList_coord[targetY][y].x && event.target.x < rectList_coord[targetY][y].x + rect_item_width && that.isLeftMove) { //左移
						coordIndex = y;
					} else if (event.target.x + event.target.width >= rectList_coord[targetY][y].x && event.target.x + event.target.width <rectList_coord[targetY][y].x + rect_item_width && !that.isLeftMove) {
						coordIndex = y;
					}
				})
				// console.log(coordIndex)
				if (!isAttack) { //没有碰撞的时候才进行下面的
					if (coordIndex >= 0) {
						half = rectList_coord[targetY][coordIndex].x + rect_item_width / 2;
						if (that.isLeftMove) { //左移
							if (ex - sx < 0) {
								if (event.target.x > rectList_coord[targetY][coordIndex].x && event.target.x < half) { //超过二分之一
									if (coordIndex > 0) {
										event.target.x = rectList_coord[targetY][coordIndex].x;
									} else if (coordIndex <= 0) {
										event.target.x = 0
									}
								} else {
									if (coordIndex < 8) {
										event.target.x = rectList_coord[targetY][coordIndex + 1].x;
									} else if (coordIndex >= 8) {
										event.target.x = rectList_coord[targetY][8].x + rect_item_width - event.target.width
									}
								}
							}
						} else { //右移
							if (ex - sx > 0) {
								if (event.target.x + event.target.width > half && event.target.x + event.target.width < rectList_coord[
										targetY]
									[coordIndex].x + rect_item_width) { //超过二分之一
									event.target.x = rectList_coord[targetY][coordIndex + 1 - rect_num].x;
								} else {
									event.target.x = rectList_coord[targetY][coordIndex - rect_num].x;
								}
							}
						}
					}
				}
				current_square[targetY][index].x = event.target.x; //将变化的值复制给坐标中
				current_square[targetY][index].ex = event.target.x + current_square[targetY][index].width; //将变化的值复制给坐标中
				
				if (current_square[targetY][index].x != targetX) { //有方块位移移动才新增
					com.current_square = current_square;
					that.updateIsNull();
// 					if(targetY!=0||len.length==1){
// 						that.scheduleOnce(function() {
// 							that.addRect();
// 						}, 0.5);
// 					}else{
// 						that.updateY(rect_item_line, true);
// 						if(fallDownNode.indexOf(true)==-1){
// 							that.scheduleOnce(function() {
// 								that.addRect();
// 								fallDownNode=[];
// 							}, 0.5);
// 						}
// 					}
					
					that.scheduleOnce(function() {
						that.updateY(rect_item_line, true);
						com.remove_line = that.getremoveLine();
						if (com.remove_line.length == 0) {
							that.scheduleOnce(function() {
								that.addRect();
							}, 0.5);
						} else {
							that.scheduleOnce(function() {
								that.removeSquare(true);
							}, 0.5);
						}
					}, 0.2);
				}
			}
		}
	},


	// 预制件的使用
	promptShow() {
		var that = this;
		var com = common;
		var level_critical_value = [11,31,41];
		var removeMore=com.removeMore;
		console.log(removeMore)
		if(removeMore!=0){
			that.promptWords(1);
			that.scheduleOnce(function() {
				if(removeMore>1){
					that.promptWords(2,removeMore);
				}
			}, 0.5);
		}
		that.scheduleOnce(function() {
			if (level_critical_value.indexOf(com.score) != -1) {
				that.promptWords(3);
			}
		}, 1);
		
	},
	// 加载游戏结束的预制组件
	gameOver() {
		var com = common;
		// console.log(com.square_line_num)
		cc.loader.loadRes("prefab/gameOver", function(err, prefab) {
			if (err) {
				console.log(err);
				return;
			}
			var newNode = cc.instantiate(prefab);
			cc.director.getScene().addChild(newNode);
			newNode.getComponent(gameOver).show(com.square_line_num);
		});
	},

	//提示文字
	promptWords(status,removeMore) {
		cc.loader.loadRes("prefab/promptWords", function(err, prefab) {
			if (err) {
				console.log(err);
				return;
			}
			var newNode = cc.instantiate(prefab);
			cc.director.getScene().addChild(newNode);
			newNode.getComponent(promptWords).show(status);
		});
	},
	// 成绩增加
	user_item() {
		var that = this;
		cc.loader.loadRes("prefab/user_item", function(err, prefab) {
			if (err) {
				console.log(err);
				return;
			}
			var newNode = cc.instantiate(prefab);
			cc.director.getScene().addChild(newNode);
			newNode.getComponent(user_item).show();
			that.userScoreLabel = newNode.getComponent(user_item).score;
		});
	},
});
