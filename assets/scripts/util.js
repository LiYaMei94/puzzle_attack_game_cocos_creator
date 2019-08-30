module.exports = {
	draw_rect: draw_rect,
	draw_fillrect: draw_fillrect,
	worldConvertLocalPointAR:worldConvertLocalPointAR,
	json_merge:json_merge,
	deepClone:deepClone,
	objectIsEqual:objectIsEqual,
	objSort:objSort,
	objSort_call:objSort_call,
	obj_arr:obj_arr,
	deleteObjValue:deleteObjValue,
	arr_remove_repeat:arr_remove_repeat,
	isNum:isNum
}

function draw_rect(graphics, x, y, width, height, lineWidth, strokeColor) {
	graphics.lineWidth = lineWidth;
	graphics.strokeColor = strokeColor;
	graphics.rect(x, y, width, height);
	graphics.stroke();
}

function draw_fillrect(graphics, x, y, width, height, fillColor) {
	graphics.fillColor = fillColor;
	graphics.fillRect(x, y, width, height);
	graphics.fill();
}
//判断两个对象是否相等
function objectIsEqual(object1, object2) {
	var isObject1 = object1 instanceof Object;
	var isObject2 = object2 instanceof Object;
	var flag;
	if (isObject1 && isObject2) { //先判断是不是都是对象
		if (Object.keys(object1).length == Object.keys(object2).length) { //再判断长度是不是一样
			for (var key in object1) {
				var value1 = object1[key] instanceof Object;
				var value2 = object2[key] instanceof Object;
				if (value1 && value2) {
					return objectIsEqual(object1[key], object2[key]) //递归，可能对象的value值也是一个对象
				} else if (object1[key] != object2[key]) {
					flag = false;
					return false
				} else {
					flag = true;
				}
			}
		} else {
			flag = false;
		}
	} else {
		flag = false;
	}
	return flag
}

// js把json中相同key的数据添加进一个对象,并对key值排序
function json_merge(arr) {
	var result={};
	var jmap = {};
	arr.forEach(function(al) {
		var key = al.y;
		if (typeof jmap[key] === 'undefined') {
			jmap[key] = [];
		}
		jmap[key].push(al);
	})
	return jmap;
	
}
// 对象排序
function objSort(obj){
	for(var i in obj){
		obj[i]=obj[i].sort(objSort_call);
	}
	return obj
}
function objSort_call(a,b){
	return a.x-b.x
}
// 将对象拆分成数组
function obj_arr(obj){
	var temp=[];
	for(var i in obj){
		for(var j=0;j<obj[i].length;j++){
			temp.push(obj[i][j]);
		}
	}
	return temp;
}
/**
 * 把一个世界坐标的点，转换到某个节点下的坐标
 * 原点在node中心
 * @param {*} node 
 * @param {*} worldPoint 
 */
function worldConvertLocalPointAR(node, event) {
	//触摸点的世界坐标
	var pos=new cc.Vec2(event.getLocationX(),event.getLocationY());
	//转换为UI坐标
	pos=node.convertToNodeSpaceAR(pos);
	return pos
}

// 指定删除对象一项内容
function deleteObjValue(obj,key){
	var temp={};
	for(var i in obj){
		if(i*1<key*1){
		  temp[i]=obj[i]
		}
	}	
	return temp;
}

// 对象深拷贝
function deepClone(obj) {
    var type = Object.prototype.toString.call(obj);  //通过原型对象获取对象类型
    var newObj;
    if(type ==='[object Array]'){
        //数组
        newObj =[];
        if(obj.length >0){
            for(var x=0;x<obj.length;x++){
                newObj.push(deepClone(obj[x]));
            }
        }
    }else if(type==='[object Object]'){
        //对象
        newObj = {};
        for(var x in obj) {
            newObj[x] = deepClone(obj[x]);
        }
    }else{
        //基本类型和方法可以直接赋值
        newObj = obj;
    }
    return newObj;
}

// 数组去重，重复的要最后一项
function arr_remove_repeat(arr){
	var temp=[];
	for(var i=0;i<arr.length;i++){
		if(temp.indexOf(arr[i])==-1){//这是没有
			temp.push(arr[i]);
		}
	}
	return temp;
}
// 判断是几位数
function isNum(num){
	var num=num+'';
	num=num.replace(/[^\d]/,"");
	var arr=num.split('');
	return arr.length;
}
// mx是移动x坐标,ex是当前方块的结束坐标
// if('左移'){
// 	if('是第一个'){
// 		if(mx<=0){// 判断左边有没有出界
// 			console.log('左边是边界，将当前的坐标x设置为0')
// 		}else{
// 			console.log('左边不是边界，将当前的坐标x设置为mx')
// 		}
// 	}else if('是最后一个或者中间'){//判断左边有没有障碍物
// 		if('前一个的ex加上2小于mx'){
// 			console.log('将当前的坐标x设置为mx')
// 		}else if('前一个的ex加上2大于等于mx'){
// 			console.log('将当前的坐标x设置为前一个的ex加上2')
// 		}
// 	}
// }else{//右移
// 	if('是第一个或者是中间的'){// 判断右边有没有障碍物
// 		if('mx小于下一个的x-2'){
// 			console.log('将当前的坐标x设置为mx')
// 		}else{
// 			console.log('将当前的坐标x设置为x-2')
// 		}
// 	}else if('是最后一个'){//判断右边有没有出界
// 		if('mx+width<466'){
// 			console.log('将当前的坐标x设置为mx')
// 		}else{
// 			console.log('将当前的坐标x设置为466-width')
// 		}
// 	}
// }


// 初始化:
// 移动:
// 1:先改变x轴坐标,
// 2:更新矩阵的isNull,
// 3:又可以自动下落的就自动下落,
// 4:判断有没有可以消除的行