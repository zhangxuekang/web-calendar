/**
 * 公共方法模块
 */
var util = (function() {
	'use strict'
	var utilObject = {};
	/**
	 * 判断一个元素是否含有某各类名
	 * @param {Element} el
	 * @param {String} classVal 
	 * @return {Boolean}
	 */
	utilObject.hasClass = function(el, classVal) {
		var classNameArr = el.className.split(" ");
		if (classNameArr.indexOf(classVal) > -1) {
			return true;
		} else {
			return false;
		};
	}
	/**
	 * 给元素添加类，如果已经有该类，则不会重复添加，返回元素节点
	 * @param {Element} el       
	 * @param {String,Array} classVal 
	 * @return {Element}
	 */
	utilObject.addClass = function(el, classVal) {
		var classNameArr = el.className.split(" ")
		//如果参数是字符串
		if (Object.prototype.toString.call(classVal).toLowerCase() === "[object string]") {
			if (utilObject.hasClass(el, classVal)) {
				return el;
			}
			classNameArr.push(classVal);
			//如果有的话，去掉多余的空格
			classNameArr = utilObject.arrayFormatBlank(classNameArr);
			el.setAttribute("class", classNameArr.join(" "));
		}else if(Object.prototype.toString.call(classVal).toLowerCase() === "[object array]"){
            for (var i = classVal.length - 1; i >= 0; i--) {
            	utilObject.addClass(el,classVal[i]);
            }
		}
		return el;
	};
	/**
	 * 删除类，返回元素节点
	 * @param  {[type]} el       [description]
	 * @param  {[type]} classVal [description]
	 * @return {[type]}          [description]
	 */
	utilObject.removeClass = function(el, classVal) {
		if (!utilObject.hasClass(el, classVal)) {
			return el;
		}
		var classNameArr = el.className.split(" ");
		classNameArr.splice(classNameArr.indexOf(classVal), 1);
		//如果有的话，去掉多余的空格
		classNameArr = utilObject.arrayFormatBlank(classNameArr);
		el.setAttribute("class", classNameArr.join(" "));
		return el;
	}
	/**
	 * 去掉数组中的空格项
	 * @param  {[array]} arr
	 * @return {[array]} arr
	 */
	utilObject.arrayFormatBlank = function(arr) {
		if (Object.prototype.toString.call(arr).toLowerCase() !== "[object array]") {
			return false;
		}
		for (var i = arr.length - 1; i >= 0; i--) {
			if (/^\s*$/.test(arr[i])) {
				arr.splice(i, 1);
			}
		}
		return arr;
	}

	return utilObject;

})();