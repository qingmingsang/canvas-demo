//将utils定义为window对象下的一个属性，属性值为对象
window.utils = {};

//在utils对象上定义捕获坐标的方法
window.utils.captureMouse = function (element) {
    //定义一个名为mouse的对象
    var mouse = {x: 0, y: 0};

    //为元素绑定mousemove事件
    element.addEventListener('mousemove', function (event) {
        var x, y;

        //获取鼠标位于当前屏幕的位置， 并作兼容处理
        if (event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        //将当前的坐标值减去元素的偏移位置，即为鼠标位于当前canvas的位置
        x -= element.offsetLeft;
        y -= element.offsetTop;

        mouse.x = x;
        mouse.y = y;
    }, false);
    //返回值为mouse对象
    return mouse;
}

window.utils.captureTouch = function (element) {
    var touch = {
        x: null,
        y: null,
        isPressed: false,
        event: null
    }
    var body_scrollLeft = document.body.scrollLeft,
        element_scrollLeft = document.documentElement.scrollLeft,
        body_scrollTop = document.body.scrollTop,
        element_scrollTop = document.documentElement.scrollTop,
        offsetLeft = element.offsetLeft,
        offsetTop = element.offsetTop;

    // 绑定touchstart事件
    element.addEventListener('touchstart', function (event) {
        touch.isPressed = true;
        touch.event = event;
    }, false);

    // 绑定touchend事件
    element.addEventListener('touchend', function (event) {
        touch.isPressed = false;
        touch.x = null;
        touch.y = null;
        touch.event = event;
    }, false);

    //绑定touchmove事件
    element.addEventListener('touchmove', function (event) {
        var x, y,
            touch_event = event.touches[0]; //第一次touch

        if (touch_event.pageX || touch_event.pageY) {
            x = touch_event.pageX;
            y = touch_event.pageY;
        } else {
            x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
            y = touch_event.clientY + body_scrollTop + element_scrollTop;
        }
        //减去偏移量
        x -= offsetLeft;
        y -= offsetTop;

        touch.x = x;
        touch.y = y;
        touch.event = event;
    }, false);
    //返回touch对象
    return touch;
}

//动画循环
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
        return window.setTimeout(callback, 17 /*~ 1000/60*/);
    });
}

//动画循环取消
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
    window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
    window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
    window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
    window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
    window.clearTimeout);
}


window.utils.parseColor = function (color, toNumber) {
    if (toNumber === true) {
        if (typeof color === 'number') {
            return (color | 0); //chop off decimal
        }
        if (typeof color === 'string' && color[0] === '#') {
            color = color.slice(1);
        }
        return window.parseInt(color, 16);
    } else {
        if (typeof color === 'number') {
            color = '#' + ('00000' + (color | 0).toString(16)).substr(-6); //pad
        }
        return color;
    }
};

//颜色解析函数
/*window.utils.parseColor = function(color,toNumber){
 if(toNumber === true){
 if(typeof color === 'number'){
 return (color | 0); // num | 0 -> num
 }
 if(typeof color === 'string' && color[0] === '#'){
 color = color.slice(1); //如果传入的是#fff000,那么得到的是fff000，将#剪切掉
 }
 return window.parseInt(color,16); //如果color='fff000',得到 16773120
 }else{
 if(typeof color === 'number'){
 //比如：color = 100;
 //(color | 0).toString(16) -> 64
 //'00000' + (color | 0).toString(16) ->'0000064';
 //'#'+('00000' + (color | 0).toString(16)).substr(-6); ->'#000064';

 color = '#' +('00000' + (color | 0).toString(16)).substr(-6);
 }
 return color;
 }
 };*/

utils.containsPoint = function(rect, x, y){
    //判断是否落于该矩形区域
    return !(x<rect.x ||
    x>rect.x + rect.width ||
    y<rect.y ||
    y>rect.y + rect.height);
}

utils.intersects = function(rectA, rectB){
    //这种判定比较粗糙，速度较快时容易出错
    return !(rectA.x + rectA.width < rectB.x ||
    rectB.x + rectB.width < rectA.x ||
    rectA.y + rectA.height < rectB.y ||
    rectB.y + rectB.height < rectA.y);
}