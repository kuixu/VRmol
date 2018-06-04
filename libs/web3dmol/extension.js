/**
 * Created by zhangdawei on 2017/5/21.
 */
/**
 * 方法可返回对拥有指定 ID 的第一个对象的引用
  * @param id
 * @returns {HTMLElement}
 */
var w3m_$ = function(id) { return document.getElementById(id) }

/**
 * 方法返回文档中所有指定类名的元素集合，作为 NodeList 对象。
 * @param cls
 * @returns {NodeList}
 */
var w3m_$$ = function ( cls ) { return document.getElementsByClassName(cls) }

/**
 * 执行空方法
 */
var w3m_pass = function() {}

/**
 * 获取window.event 或者 参数中的事件
 * @returns {Event|*}
 */
var w3m_event = function () { return window.event || arguments.callee.caller.arguments[0]; }

/**
 * 清空数组
 * @param array
 */
var w3m_clear_array = function ( array ) { array = [] }

/**
 * 清空对象
 * @param obj
 */
var w3m_clear_object = function ( obj ) { obj = {} }

/**
 * 字符串移除两侧空白
 * @param s
 * @returns {string}
 */
var w3m_trim = function(s) { return s.replace( /^\s+/, '' ).replace( /\s+$/, '' ) }

/**
 * 判断两个参数是否相等
 * @param v1
 * @param v2
 * @returns {*}
 */
var w3m_equal = function ( v1, v2 ) { return Array.isArray(v1) && Array.isArray(v2) ? w3m_array_equal(v1, v2) : v1 == v2; }

/**
 * 将两个数组合并并同时改变两个数组为合并后数组
 * @param array
 * @param pushed
 */
var w3m_array_push = function ( array, pushed ) { Array.prototype.push.apply(array, pushed) }

/**
 * 数据合并，合并后的顺序与参数顺序相同
 * @returns {Array.<T>}
 */
var w3m_array_merge = function () { return Array.prototype.concat.apply([], arguments) }

/**
 * 数组添加元素，已有元素不添加
 * @param array
 * @param item
 */
var w3m_array_add = function ( array, item ) { array.indexOf(item) >= 0 ? void(0) : array.push(item) }

/**
 * 数组移除元素，已有元素移除
 * @param array
 * @param item
 */
var w3m_array_remove = function ( array, item ) { var i = array.indexOf(item); i >= 0 ? array.splice(i, 1) : void(0) }

/**
 * 数组切换，已有元素移除，没有元素添加
 * @param array
 * @param item
 */
var w3m_array_toggle = function ( array, item ) { var i = array.indexOf(item); i >= 0 ? array.splice(i, 1) : array.push(item) }

/**
 * 判断数组是否有该元素
 * @param array
 * @param item
 * @returns {boolean}
 */
var w3m_array_has = function ( array, item ) { return array.indexOf(item) >= 0 ? true : false; }

/**
 * 数据升序排列
 * @param array
 * @returns {Array.<T>|*}
 */
var w3m_array_sort = function ( array ) { return array.sort(function(a, b){ return a-b }) }

/**
 * 判断两个队列是否相等
 * @param array_1
 * @param array_2
 * @returns {boolean}
 */
var w3m_array_equal = function ( array_1, array_2 ) {
    if ( !Array.isArray(array_1) || !Array.isArray(array_2) ) { return false; }
    if ( array_1.length != array_2.length ) { return false; }
    var eq = true;
    for ( var i = 0, l = array_1.length; i < l; i++ ) { if ( array_1[i] != array_2[i] ) { eq = false; break; } }
    return eq;
}

/**
 * 对象转换成数组
 * @param obj
 * @returns {Array}
 */
var w3m_object2array = function ( obj ) { var array = []; for ( var i in obj ) { array.push(obj[i]); } return array; }

/**
 * 字符串截取（并去除首尾空字符串）
 * @param s
 * @param start
 * @param stop
 * @returns {string}
 */
var w3m_sub = function(s, start, stop) { return stop ? w3m_trim(s.substring(start-1, stop)) : w3m_trim(s.charAt(start-1)) }

/**
 * 字符串首字母大写
 * @param s
 * @returns {string}
 */
var w3m_capfirst = function(s) { return s[0].toUpperCase() + s.slice(1); }

/**
 * 字符串尾字母大写
 * @param s
 * @returns {string}
 */
var w3m_caplast = function(s) { var i = s.length - 1; return s.slice(0, i) + s[i].toUpperCase(); }

/**
 * 单词首字母大写
 * @param s
 * @returns {string}
 */
var w3m_capword = function ( s ) { return s.toLowerCase().replace(/\b([\w|']+)\b/g, function(word) { return word.replace(word.charAt(0), word.charAt(0).toUpperCase());}); }

/**
 * 判断字符串首字母
 * @param s
 * @param token
 * @returns {boolean}
 */
var w3m_start_with = function ( s, token ) { return s.indexOf(token) == 0 }

/**
 * 判断变量是否定义
 * @param o
 * @returns {boolean}
 */
var w3m_isset = function(o) { return typeof(o) != 'undefined' }

/**
 * 判断一个对象自身(不包括原型链)是否具有指定名称的属性
 * @param o
 * @returns {boolean}
 */
var w3m_isempty = function(o) { for ( var i in o ) { if ( o.hasOwnProperty(i) ) { return false; } } return true; }

/**
 * 数据复制
 * @param o
 * @returns {Array.<T>|string|Blob}
 */
var w3m_copy = function(o) { return Array.isArray(o) ? o.slice(0) : o; }

/**
 * 设置节点显示属性
 * @param node
 * @param display
 */
var w3m_show = function( node, display ) { node.style.display = display || 'block'; }

/**
 * 隐藏节点
 * @param node
 */
var w3m_hide = function( node ) { node.style.display = 'none'; }

/**
 * 节点切换显示
 * @param node
 */
var w3m_toggle_display = function ( node ) { node.style.display = ( node.style.display == '' || node.style.display == 'none' ? 'block' : 'none' ); }

/**
 * 节点的html内容切换
 * @param node
 * @param txt1
 * @param txt2
 */
var w3m_toggle_html = function ( node, txt1, txt2 ) { node.innerHTML = node.innerHTML == txt1 ? txt2 : txt1 }

/**
 * 判断节点是否隐藏，若隐藏则返回true
 * @param node
 * @returns {boolean}
 */
var w3m_is_hidden = function ( node ) { return node.style.display == '' || node.style.display == 'none' ? true : false; }

/**
 * 判断元素内容是否定义，如果定义，则改变元素内容，否则返回元素内容
 * @param ele
 * @param s
 * @returns {*}
 */
var w3m_html = function(ele, s) { return w3m_isset(s) ? ele.innerHTML = s : ele.innerHTML; }

/**
 * 判断value是否存在，如果存在，设置attr的值为value，否则返回ele的属性值
 * @param ele
 * @param attr
 * @param value
 * @returns {*}
 */
var w3m_attr = function(ele, attr, value) { return w3m_isset(value) ? ele.setAttribute(attr, value) : ele.getAttribute(attr); }

/**
 * 判断value是否定义，如果定义设置元素的style【key】=value，否则返回ele.style[key]
 * @param ele
 * @param key
 * @param value
 * @returns {*}
 */
var w3m_style = function(ele, key, value) { return w3m_isset(value) ? ele.style[key] = value : ele.style[key]; }

/**
 * 获取元素width值，value符合就设置元素的width为value，否则返回元素的clientWidth
 * @param ele
 * @param value
 * @returns {*}
 */
var w3m_width = function(ele, value) { return w3m_isset(value) && !isNaN(value) ? ele.style.width = value : ele.clientWidth; }

var w3m_width_adjust = function( node ) { node.style.width = node.clientWidth + 'px'; }

/**
 * 获取元素height值，value符合就设置元素的height为value，否则返回元素的clientHeight
 * @param ele
 * @param value
 * @returns {*}
 */
var w3m_height = function(ele, value) { return w3m_isset(value) && !isNaN(value) ? ele.style.height = value : ele.clientHeight; }

var w3m_height_adjust = function( node ) { node.style.height = node.clientHeight + 'px'; }

/**
 * 元素classList添加元素
 * @param ele
 * @param cls
 */
var w3m_add_class = function(ele, cls) { ele.classList.add(cls); }

/**
 * 元素classList移除元素
 * @param ele
 * @param cls
 */
var w3m_remove_class = function(ele, cls) { ele.classList.remove(cls); }

/**
 * 元素classList切换元素
 * @param ele
 * @param cls
 */
var w3m_toggle_class = function(ele, cls) { ele.classList.toggle(cls); }

/**
 * fn1操作通过ID获取的对象，fn2操作通过cls获取的对象
 * @param id
 * @param cls
 * @param fn1
 * @param fn2
 */
var w3m_toggle = function ( id, cls, fn1, fn2 ) {
    var node = document.getElementById(id);
    var nodelist = document.getElementsByClassName(cls);
    for ( var i = 0, l = nodelist.length; i < l; i++ ) {
        var n = nodelist.item(i);
        fn2(n);
    }
    fn1(node);
}

/**
 * 创建元素
 * @param tag
 * @returns {HTMLElement}
 */
var w3m_node_create = function ( tag ) { return document.createElement(tag) }

/**
 * 移除元素node
 * @param node
 */
var w3m_node_remove = function ( node ) { node.parentNode.removeChild(node); }

/**
 * 将child元素添加到father元素
 * @param father
 * @param child
 */
var w3m_node_append = function ( father, child ) { father.appendChild(child) }

/**
 * 获取元素的父元素
 * @param node
 * @returns {Function|Node}
 */
var w3m_father = function( node ) { return node.parentNode; }

var w3m_child = function ( node ) { return node.childNodes; }


var w3m_last_brother = function ( node ) { var n = node.previousSibling; while ( n && n.nodeType == 3 ) { n = n.previousSibling; } return n; }


var w3m_next_brother = function ( node ) { var n = node.nextSibling; while ( n && n.nodeType == 3 ) { n = n.nextSibling; } return n; }

/**
 * 判断child元素是否是father元素的子元素
 * @param father
 * @param child
 * @returns {*}
 */
var w3m_ischild = function ( father, child ) {
    if ( father.contains ) {
        return father != child && father.contains(child);
    } else {
        return !(father.compareDocumentPosition(child) & 16);
    }
}


/**
 * 为document添加contextmenu事件，再取消掉其默认事件，让自定义菜单显示出来
 * @param ele
 * @param event_name
 */
var w3m_ban = function(ele, event_name) {
    ele.addEventListener(event_name, function(event) {
        var e = event || window.event;
        e.preventDefault ? e.preventDefault() : w3m_pass;
        e.returnValue ? e.returnValue = false : w3m_pass;
        return false;
    });
}

var w3m_clear = function(o) { for ( var i in o ) { delete o[i]; } }
var w3m_time = function () { return Date.now ? Date.now() : (new Date()).getTime(); }

/**
 * 开启动画的循环
 * @type {Function}
 */
var w3m_cycle_start = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

/**
 * 关闭动画的循环
 * @type {*|Function}
 */
var w3m_cycle_stop  = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msRequestAnimationFrame;

/**
 * 将素组第一个元素赋给return_item
 * @param array
 * @param return_item
 * @returns {*}
 */
var w3m_find_first = function ( array, return_item ) {
    var return_item = w3m_isset(return_item) ? return_item : false;
    var l = array.length, i = 0;
    for ( ; i < l; i++ ) {
        if ( array[i] ) {
            return return_item ? array[i] : i;
        }
    }
    return null;
}

/**
 * 将素组最后一个元素赋给return_item
 * @param array
 * @param return_item
 * @returns {*}
 */
var w3m_find_last = function ( array, return_item ) {
    var return_item = w3m_isset(return_item) ? return_item : false;
    var l = array.length, i = l - 1;
    for ( ; i > -1; i-- ) {
        if ( array[i] ) {
            return return_item ? array[i] : i;
        }
    }
    return null;
}

/**
 * 将对象第一个元素赋给return_item
 * @param obj
 * @param return_item
 * @returns {*}
 */
var w3m_find_object_first = function ( obj, return_item ) {
    var return_item = w3m_isset(return_item) ? return_item : false;
    for ( var i in obj ) {
        if ( obj[i] ) {
            return return_item ? obj[i] : i;
        }
    }
    return null;
}

/**
 * 将对象最后一个元素赋给return_item
 * @param obj
 * @param return_item
 * @returns {*}
 */
var w3m_find_object_last = function ( obj, return_item ) {
    var return_item = w3m_isset(return_item) ? return_item : false;
    var last = null;
    for ( var i in obj ) {
        last = i;
    }
    return return_item ? obj[last] : last;
}

/**
 * 判断数组中是否有未定义的项
 * @param array
 * @param start
 * @param stop
 * @returns {Array}
 */
var w3m_split_by_undefined = function ( array, start, stop ) {
    // split array by undefined items
    var part   = [],
        start  = start || 0,
        stop   = stop || ( array.length - 1 ),
        offset = start,
        undefined_in_row = true;
    for ( var i = start; i <= stop; i++ ) {
        if ( !w3m_isset(array[i]) ) {
            if( !undefined_in_row ) {
                part.push([offset, i-1]);
                undefined_in_row = true;
            }
            offset = i + 1;
            continue;
        }
        undefined_in_row = false;
    }
    undefined_in_row ? void(0) : part.push([offset, stop]);
    return part;
}

/**
 * 去除数组中相同的项
 * @param array
 * @param start
 * @param stop
 * @returns {Array}
 */
var w3m_split_by_difference = function ( array, start, stop ) {
    // split array by different items
    var part   = [],
        start  = start || 0,
        stop   = stop || ( array.length - 1 ),
        offset = start,
        last   = array[start],
        undefined_in_row = true;
    for ( var i = start; i <= stop; i++ ) {
        if ( !w3m_isset(array[i]) ) {
            if ( !undefined_in_row ) {
                part.push([offset, i-1, last]);
                undefined_in_row = true;
            }
            offset = i + 1;
            last   = array[i+1];
            continue;
        }
        undefined_in_row = false;
        if ( array[i] != last ) {
            part.push([offset, i-1, last]);
            offset = i;
            last   = array[i];
        }
    }
    undefined_in_row ? void(0) : part.push([offset, stop, array[offset]]);
    return part;
}

/**
 * 将正常颜色值转换成rgb值
 * @param color
 * @returns {*[]}
 */
var w3m_color_normal_2_rgb = function ( color ) {
    return color.length == 3 ? [ Math.round(color[0] * 255), Math.round(color[1] * 255), Math.round(color[2] * 255) ]
        : [ Math.round(color[0] * 255), Math.round(color[1] * 255), Math.round(color[2] * 255), color[3] ];
}

/**
 * 将RGB转换成正常颜色数值
 * @param color
 * @returns {*[]}
 */
var w3m_color_rgb_2_normal = function ( color ) {
    return color.length == 3 ? [ color[0] / 255, color[1] / 255, color[2] / 255 ]
        : [ color[0] / 255, color[1] / 255, color[2] / 255, color[3] ];
}


var w3m_time = function () { return (new Date()).getTime() }

/**
 * 对象复制
 * @param o
 * @returns {{}}
 */
var w3m_copy_object = function(o) {
    var _o = {};
    for ( var i in o ) {
        var it = o[i];
        if ( Array.isArray(it) ) {
            _o[i] = it.slice(0);
        } else {
            _o[i] = it;
        }
    }
    return _o;
}

/**
 * 返回是否全屏显示
 * @returns {*}
 */
var w3m_check_fullscreen = function () {
    return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
}

