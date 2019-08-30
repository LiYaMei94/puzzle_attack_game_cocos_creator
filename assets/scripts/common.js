var util = require('util.js');


module.exports = {
	// 网格大小
	gridSize_x: 9,
	gridSize_y: 12,
	gridWidth: 0,
	current_square: {}, //当前在矩阵中的方块的信息
	square_line_num: 2, //当前行数
	current_square_arr: [],
	rectList_coord: [], //矩阵中的坐标
	square_coord: {}, //这个是判断下落的时候使用
	total_coord: {}, //所有坐标
	right_coord: 0, //x轴的最后一个坐标
	square_list_width: 0, //居中的宽度
	gameLevel: 1, //难度等级
	removeScore: 1, //消除一行的分数
	score: 0, //分数
	square_width_num_arr: [1, 2, 3],
	remove_line: [],
	fallDownNode: [],
	screenWidth: 0,
	screenHeight: 0,
	game_white_bg_width: 0,
	game_white_bg_height: 0,
	game_red_bg_width: 0,
	game_red_bg_height: 0,
	next_time_show_width: 0,
	next_time_show_height: 30,
	gameinit:false,
	init: init,
};

function init() { //等级修改
	// let module=module;
	let windowSize = cc.view.getVisibleSize();
	module.exports.screenWidth = Math.floor(windowSize.width);
	module.exports.screenHeight = Math.floor(windowSize.height);
	module.exports.game_white_bg_width = module.exports.screenWidth - 40;
	module.exports.game_white_bg_height = module.exports.screenHeight - 200;
	module.exports.gridWidth = Math.floor((module.exports.screenWidth - 80 - 2 * (module.exports.gridSize_x - 1)) / module
		.exports.gridSize_x);
	module.exports.game_red_bg_width = module.exports.gridWidth * module.exports.gridSize_x + (2 * (module.exports.gridSize_x -
		1));
	module.exports.game_red_bg_height = module.exports.gridWidth * module.exports.gridSize_y + (2 * (module.exports.gridSize_y -
		1));
	module.exports.square_list_width = module.exports.game_red_bg_width;
	module.exports.right_coord = module.exports.game_red_bg_width - module.exports.gridWidth;
	module.exports.next_time_show_width = module.exports.game_white_bg_width - 36;
}




