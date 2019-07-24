/**
 * Created by Web3Dmol, modified by zhangdawei on 2017/5/21.
 */
var w3m_$ = function(id) { return document.getElementById(id) }

var w3m_$$ = function ( cls ) { return document.getElementsByClassName(cls) }

var w3m_pass = function() {}

var w3m_event = function () { return window.event || arguments.callee.caller.arguments[0]; }

var w3m_clear_array = function ( array ) { array = [] }

var w3m_clear_object = function ( obj ) { obj = {} }

var w3m_trim = function(s) { return s.replace( /^\s+/, '' ).replace( /\s+$/, '' ) }

var w3m_equal = function ( v1, v2 ) { return Array.isArray(v1) && Array.isArray(v2) ? w3m_array_equal(v1, v2) : v1 == v2; }

var w3m_array_push = function ( array, pushed ) { Array.prototype.push.apply(array, pushed) }

var w3m_array_merge = function () { return Array.prototype.concat.apply([], arguments) }

var w3m_array_add = function ( array, item ) { array.indexOf(item) >= 0 ? void(0) : array.push(item) }

var w3m_array_remove = function ( array, item ) { var i = array.indexOf(item); i >= 0 ? array.splice(i, 1) : void(0) }

var w3m_array_toggle = function ( array, item ) { var i = array.indexOf(item); i >= 0 ? array.splice(i, 1) : array.push(item) }

var w3m_array_has = function ( array, item ) { return array.indexOf(item) >= 0 ? true : false; }

var w3m_array_sort = function ( array ) { return array.sort(function(a, b){ return a-b }) }

var w3m_array_equal = function ( array_1, array_2 ) {
    if ( !Array.isArray(array_1) || !Array.isArray(array_2) ) { return false; }
    if ( array_1.length != array_2.length ) { return false; }
    var eq = true;
    for ( var i = 0, l = array_1.length; i < l; i++ ) { if ( array_1[i] != array_2[i] ) { eq = false; break; } }
    return eq;
}

var w3m_object2array = function ( obj ) { var array = []; for ( var i in obj ) { array.push(obj[i]); } return array; }

var w3m_sub = function(s, start, stop) { return stop ? w3m_trim(s.substring(start-1, stop)) : w3m_trim(s.charAt(start-1)) }

var w3m_capfirst = function(s) { return s[0].toUpperCase() + s.slice(1); }

var w3m_caplast = function(s) { var i = s.length - 1; return s.slice(0, i) + s[i].toUpperCase(); }

var w3m_capword = function ( s ) { return s.toLowerCase().replace(/\b([\w|']+)\b/g, function(word) { return word.replace(word.charAt(0), word.charAt(0).toUpperCase());}); }

var w3m_start_with = function ( s, token ) { return s.indexOf(token) == 0 }

var w3m_isset = function(o) { return typeof(o) != 'undefined' }

var w3m_isempty = function(o) { for ( var i in o ) { if ( o.hasOwnProperty(i) ) { return false; } } return true; }

var w3m_copy = function(o) { return Array.isArray(o) ? o.slice(0) : o; }

var w3m_show = function( node, display ) { node.style.display = display || 'block'; }

var w3m_hide = function( node ) { node.style.display = 'none'; }

var w3m_toggle_display = function ( node ) { node.style.display = ( node.style.display == '' || node.style.display == 'none' ? 'block' : 'none' ); }

var w3m_toggle_html = function ( node, txt1, txt2 ) { node.innerHTML = node.innerHTML == txt1 ? txt2 : txt1 }

var w3m_is_hidden = function ( node ) { return node.style.display == '' || node.style.display == 'none' ? true : false; }

var w3m_html = function(ele, s) { return w3m_isset(s) ? ele.innerHTML = s : ele.innerHTML; }

var w3m_attr = function(ele, attr, value) { return w3m_isset(value) ? ele.setAttribute(attr, value) : ele.getAttribute(attr); }

var w3m_style = function(ele, key, value) { return w3m_isset(value) ? ele.style[key] = value : ele.style[key]; }

var w3m_width = function(ele, value) { return w3m_isset(value) && !isNaN(value) ? ele.style.width = value : ele.clientWidth; }

var w3m_width_adjust = function( node ) { node.style.width = node.clientWidth + 'px'; }

var w3m_height = function(ele, value) { return w3m_isset(value) && !isNaN(value) ? ele.style.height = value : ele.clientHeight; }

var w3m_height_adjust = function( node ) { node.style.height = node.clientHeight + 'px'; }

var w3m_add_class = function(ele, cls) { ele.classList.add(cls); }

var w3m_remove_class = function(ele, cls) { ele.classList.remove(cls); }

var w3m_toggle_class = function(ele, cls) { ele.classList.toggle(cls); }

var w3m_toggle = function ( id, cls, fn1, fn2 ) {
    var node = document.getElementById(id);
    var nodelist = document.getElementsByClassName(cls);
    for ( var i = 0, l = nodelist.length; i < l; i++ ) {
        var n = nodelist.item(i);
        fn2(n);
    }
    fn1(node);
}

var w3m_node_create = function ( tag ) { return document.createElement(tag) }

var w3m_node_remove = function ( node ) { node.parentNode.removeChild(node); }

var w3m_node_append = function ( father, child ) { father.appendChild(child) }

var w3m_father = function( node ) { return node.parentNode; }

var w3m_child = function ( node ) { return node.childNodes; }

var w3m_last_brother = function ( node ) { var n = node.previousSibling; while ( n && n.nodeType == 3 ) { n = n.previousSibling; } return n; }

var w3m_next_brother = function ( node ) { var n = node.nextSibling; while ( n && n.nodeType == 3 ) { n = n.nextSibling; } return n; }

var w3m_ischild = function ( father, child ) {
    if ( father.contains ) {
        return father != child && father.contains(child);
    } else {
        return !(father.compareDocumentPosition(child) & 16);
    }
}

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

var w3m_cycle_start = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var w3m_cycle_stop  = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msRequestAnimationFrame;


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

var w3m_find_object_first = function ( obj, return_item ) {
    var return_item = w3m_isset(return_item) ? return_item : false;
    for ( var i in obj ) {
        if ( obj[i] ) {
            return return_item ? obj[i] : i;
        }
    }
    return null;
}

var w3m_find_object_last = function ( obj, return_item ) {
    var return_item = w3m_isset(return_item) ? return_item : false;
    var last = null;
    for ( var i in obj ) {
        last = i;
    }
    return return_item ? obj[last] : last;
}

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

var w3m_color_normal_2_rgb = function ( color ) {
    return color.length == 3 ? [ Math.round(color[0] * 255), Math.round(color[1] * 255), Math.round(color[2] * 255) ]
        : [ Math.round(color[0] * 255), Math.round(color[1] * 255), Math.round(color[2] * 255), color[3] ];
}

var w3m_color_rgb_2_normal = function ( color ) {
    return color.length == 3 ? [ color[0] / 255, color[1] / 255, color[2] / 255 ]
        : [ color[0] / 255, color[1] / 255, color[2] / 255, color[3] ];
}

var w3m_time = function () { return (new Date()).getTime() }

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

var w3m_check_fullscreen = function () {
    return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
}
