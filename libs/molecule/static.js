var w3m_crossline = function(fn) { return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'; }

/* === Static Resource === */

/* URL 远程分子pdb文件请求路径*/
w3m.url = [ 'https://files.rcsb.org/view/', 'https://www.rcsb.org/pdb/files/' ];
//w3m.url = [ 'http://localhost:8080/molecule_vr/'];

/* Dict */
w3m.dict = {
    amino_acid : ['ala','gly','ile','leu','pro','val','phe','trp','tyr','asp','glu','arg','his','lys','ser','thr','cys','met','asn','gln'], //氨基酸-判断chainType
    nucleic_acid : ['a','da','c','dc','g','dg','u','dt'],//核酸-判断chainType
    cap_last : [ 'da', 'dc', 'dg', 'dt' ],
    special_element : ['fe','cu','co','zn','mn','k','na','ca','mg','al','i'],
    label : ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',"'",'-','.','Å','π','°',"'",'"','²'],
    label_st : {},
    // 
    hydrophobicity : {
        arg : 0.00, lys : 0.06, asn : 0.11, asp : 0.11, gln : 0.11,
        glu : 0.11, his : 0.14, pro : 0.32, tyr : 0.35, trp : 0.40,
        ser : 0.41, thr : 0.42, gly : 0.46, ala : 0.70, met : 0.71,
        cys : 0.78, phe : 0.81, leu : 0.92, val : 0.96, ile : 1.00
    }
}

/* GLSL */
w3m.glsl = {
    geometry : {},
    label    : {}
};
w3m.glsl.geometry.vertex = w3m_crossline(function() {/*
attribute float id;
attribute vec4  xyz;
attribute vec4  color;
attribute vec4  normal;

uniform   mat4  mvp;
uniform   mat4  model;
uniform   mat4  model_it;
uniform   int   picking;          // 0 : disabled; 1: enable

uniform    int  fog_mode;         // 0 : disabled; 1 : linear; 2 : exponential
uniform  float  fog_start;
uniform  float  fog_stop;
uniform  float  fog_density;

varying   vec4  _color;
varying   vec3  _position;
varying   vec3  _normal;
varying  float  _fog_factor;

void main() {
    gl_Position = mvp * xyz;
    gl_PointSize = 3.0;
    _position = vec3(model * xyz);
    _normal = vec3(model_it * normal);
    if ( bool(picking) ) {
        float loc = id / 255.0;
        if ( id <= 255.0 ) {
            _color = vec4( loc, 0.0, 0.0, 1.0 );
        } else {
            _color = vec4( fract(loc), floor(loc)/255.0, 0.0, 1.0 );
        }
    } else {
        // fog
        _fog_factor = 0.0;
        if ( bool(fog_mode) && id != 0.0 ) {
            _fog_factor = clamp((gl_Position.w - fog_start) / (fog_stop - fog_start), 0.0, 1.0);
            if ( fog_mode == 2 ) {
                _fog_factor = clamp(1.0-exp(-fog_density*_fog_factor), 0.0, 1.0);
            }
        } else {
            _fog_factor = 0.0;
        }
        _color = color;
    }
}
*/});
w3m.glsl.geometry.fragment = w3m_crossline(function() {/*
precision mediump float;
precision highp   int;

uniform   vec3  eye;

uniform    int  picking;      // 0 : disabled; 1: enable

uniform    int  light_mode;       // 0 : disabled; 1: parallel; 2 : point
uniform   vec3  light_xyz;        // light direction || light position
uniform   vec3  light_ambient;
uniform   vec3  light_color;

uniform   vec3  material_k;
uniform  float  material_shininess;

uniform   vec3  fog_color;

varying   vec4  _color;
varying   vec3  _position;
varying   vec3  _normal;
varying  float  _fog_factor;

void main() {
    if ( bool(picking) ) {
        gl_FragColor = _color;
    } else {
        // Light
        if ( bool(light_mode) ) {
            vec3 V = normalize(eye - _position);
            vec3 N = length(_normal) == 0.0 ? V : normalize(_normal);
            vec3 L = light_mode == 1 ? normalize(-light_xyz) : normalize(light_xyz - _position);
            vec3 H = normalize(L + V);
            vec3 ambient  = light_ambient;
            vec3 diffuse  = light_color * max(dot(L, N), 0.0);
            vec3 specular = length(_normal) == 0.0 ? vec3(0.0) : light_color * pow(max(dot(H, N), 0.0), material_shininess);
            vec3 light = material_k[0] * ambient + 
                         material_k[1] * diffuse + 
                         material_k[2] * specular;
            gl_FragColor = vec4(light * vec3(_color), _color.a);
        } else {
            gl_FragColor = _color;
        }
        // Final
        gl_FragColor = mix(gl_FragColor, vec4(fog_color, 1.0), _fog_factor);
    }
}
*/});
w3m.glsl.label.vertex = w3m_crossline(function() {/*
attribute vec4  center;
attribute vec2  offset;
attribute vec2  st;

uniform   mat4  mvp;

varying   vec2  _st;

void main() {
    vec4 pos = mvp * center;
    pos.z -= 0.01;
    pos /= pos.w;
    pos.xy += offset;
    gl_Position = pos;
    _st = st;
}
*/});
w3m.glsl.label.fragment = w3m_crossline(function() {/*
precision mediump float;

uniform sampler2D  label_tex;

varying      vec2  _st;

void main() {
    gl_FragColor = texture2D(label_tex, _st);
}
*/});
/**
 * 初始页面
 */
w3m.html = w3m_crossline(function() {/*
<div id="w3m">
    <div id="w3m-widget">
        <div id="w3m-omnibox">
            <div id="w3m-logo"></div>
            <div id="w3m-search">
                <input id="w3m-omnibox-input" autocomplete="off" placeholder="Input PDB-ID Here !" onchange="javascript:w3m.api.loadPDB(this.value);" />
            </div>
            <div id="w3m-omnibox-icon">
                <div class="w3m-icon" title="Load from RCSB PDB" style="background-position:0 0" onclick="javascript:w3m.api.loadPDB(w3m_$('w3m-omnibox-input').value);"></div>
                <div class="w3m-icon-vsp"></div>
                <div class="w3m-icon" style="background-position:0 -40px" title="Load PDB file from local disc.&#13;PDB file will not be uploaded!" onclick="javascript:w3m_$('w3m-file-input').click()"><input id="w3m-file-input" type="file" /></div>
            </div>
        </div>
        <div id="w3m-left">
            <div class="w3m-toolbar" id="w3m-toolbar-left">
                <div class="w3m-icon" title="Representation" style="background-position:0 -80px" onclick="javascript:w3m_toggle('w3m-sidebox-rep', 'w3m-sidebox-left', w3m_show, w3m_hide);"></div>
                <div class="w3m-icon-hsp"></div>
                <div class="w3m-icon" title="Color" style="background-position:0 -120px" onclick="javascript:w3m_toggle('w3m-sidebox-color', 'w3m-sidebox-left', w3m_show, w3m_hide);"></div>
                <div class="w3m-icon-hsp"></div>
                <div class="w3m-icon" title="Label" style="background-position:0 -160px" onclick="javascript:w3m_toggle('w3m-sidebox-label', 'w3m-sidebox-left', w3m_show, w3m_hide);"></div>
                <div class="w3m-icon-hsp"></div>
                <div class="w3m-icon" title="Fragment" style="background-position:0 -200px" onclick="javascript:w3m_toggle('w3m-sidebox-fragment', 'w3m-sidebox-left', w3m_show, w3m_hide);"></div>
                <div class="w3m-icon-hsp"></div>
                <div class="w3m-icon" title="Measure" style="background-position:0 -240px" onclick="javascript:w3m_toggle('w3m-sidebox-measure', 'w3m-sidebox-left', w3m_show, w3m_hide);"></div>
                <div class="w3m-icon-hsp"></div>
                <div class="w3m-icon" title="Tools" style="background-position:0 -280px" onclick="javascript:w3m_toggle('w3m-sidebox-tool', 'w3m-sidebox-left', w3m_show, w3m_hide);"></div>
                <div class="w3m-icon-hsp"></div>
                <div class="w3m-icon" title="Help" style="background-position:0 -320px" onclick="javascript:w3m.api.help();"></div>
            </div>
            <div id="w3m-sidebox-left">
                <div id="w3m-sidebox-rep"      class="w3m-sidebox w3m-sidebox-left"></div>
                <div id="w3m-sidebox-color"    class="w3m-sidebox w3m-sidebox-left"></div>
                <div id="w3m-sidebox-label"    class="w3m-sidebox w3m-sidebox-left"></div>
                <div id="w3m-sidebox-fragment" class="w3m-sidebox w3m-sidebox-left"></div>
                <div id="w3m-sidebox-measure"  class="w3m-sidebox w3m-sidebox-left"></div>
                <div id="w3m-sidebox-tool"  class="w3m-sidebox w3m-sidebox-left"></div>
            </div>
        </div>
        <div id="w3m-right">
            <div id="w3m-toolbar-top">
                <div class="w3m-toolbar" id="w3m-toolbar-top-left">
                    <div class="w3m-icon" title="Configurations" style="background-position:0 -360px" onclick="javascript:w3m_toggle('w3m-sidebox-config', 'w3m-sidebox-right', w3m_show, w3m_hide);"></div>
                    <div class="w3m-icon-vsp"></div>
                    <div class="w3m-icon" title="Sequence Plot" style="background-position:0 -400px" onclick="javascript:w3m_toggle('w3m-sidebox-seqplot', 'w3m-sidebox-right', w3m_show, w3m_hide);"></div>
                    <div class="w3m-icon-vsp"></div>
                    <div class="w3m-icon" title="Information" style="background-position:0 -440px" onclick="javascript:w3m_toggle('w3m-sidebox-info', 'w3m-sidebox-right', w3m_show, w3m_hide);"></div>
                </div>
                <div class="w3m-toolbar" id="w3m-toolbar-top-right">
                    <div id="w3m-ui-fullscreen" class="w3m-icon" title="Fullscreen" style="background-position:0 -480px" onclick="javascript:w3m.api.toggleFullscreen();" token="0"></div>
                </div>
            </div>
            <div id="w3m-sidebox-right">
                <div id="w3m-sidebox-config" class="w3m-sidebox w3m-sidebox-right"></div>
                <div id="w3m-sidebox-seqplot" class="w3m-sidebox w3m-sidebox-right"></div>
                <div id="w3m-sidebox-info" class="w3m-sidebox w3m-sidebox-right"></div>
            </div>
        </div>
        <div id="w3m-float">
            <div class="w3m-popup" id="w3m-popup-pick">
                <div class="w3m-popup-close" title="Close" onclick="javascript:w3m_hide(w3m_father(this));"></div>
                <div class="w3m-popup-help" onclick="javascript:w3m.api.help('Pickup')"></div>
                <div class="w3m-popup-caption">Pick Up</div>
                <div class="w3m-popup-body">
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Mol</div>
                        <div class="w3m-popup-form-text" id="w3m-popup-pick-mol"></div>
                        <div class="w3m-popup-pick-highlight w3m-bold">HighLight</div>
                        <div class="w3m-popup-pick-hide w3m-bold">Hide</div>
                        <div class="w3m-popup-pick-fragment w3m-bold">Fragment</div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Chain</div>
                        <div class="w3m-popup-form-text" id="w3m-popup-pick-chain"></div>
                        <div class="w3m-popup-pick-highlight" id="w3m-popup-pick-chain-highlight"></div>
                        <div class="w3m-popup-pick-hide" id="w3m-popup-pick-chain-hide"></div>
                        <div class="w3m-popup-pick-fragment" id="w3m-popup-pick-chain-fragment"></div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Residue</div>
                        <div class="w3m-popup-form-text" id="w3m-popup-pick-residue"></div>
                        <div class="w3m-popup-pick-highlight" id="w3m-popup-pick-residue-highlight"></div>
                        <div class="w3m-popup-pick-hide" id="w3m-popup-pick-residue-hide"></div>
                        <div class="w3m-popup-pick-fragment" id="w3m-popup-pick-residue-fragment"></div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label" id="w3m-popup-pick-ss-name"></div>
                        <div class="w3m-popup-form-text" id="w3m-popup-pick-ss"></div>
                        <div class="w3m-popup-pick-highlight" id="w3m-popup-pick-ss-highlight"></div>
                        <div class="w3m-popup-pick-hide" id="w3m-popup-pick-ss-hide"></div>
                        <div class="w3m-popup-pick-fragment" id="w3m-popup-pick-ss-fragment"></div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Atom</div>
                        <div class="w3m-popup-form-text" id="w3m-popup-pick-atom"></div>
                        <div class="w3m-popup-pick-link"><a href="javascript:;" onclick="w3m_toggle_display(w3m_next_brother(w3m_father(w3m_father(this))));w3m_toggle_html(this, 'Show Atom Info ↓', 'Hide Atom Info ↑')">Show Atom Info ↓</a></div>
                    </div>
                    <div class="w3m-popup-form-area">
                        <div class="w3m-popup-form-line">
                            <div class="w3m-popup-form-label">Atom ID</div>
                            <div id="w3m-popup-pick-atom-id" class="w3m-popup-form-longtext"></div>
                        </div>
                        <div class="w3m-popup-form-line">
                            <div class="w3m-popup-form-label">Coordinate</div>
                            <div id="w3m-popup-pick-atom-xyz" class="w3m-popup-form-longtext"></div>
                        </div>
                        <div class="w3m-popup-form-line">
                            <div class="w3m-popup-form-label">Occupation</div>
                            <div id="w3m-popup-pick-atom-occupacy" class="w3m-popup-form-longtext"></div>
                        </div>
                        <div class="w3m-popup-form-line">
                            <div class="w3m-popup-form-label">B-Factor</div>
                            <div id="w3m-popup-pick-atom-bfactor" class="w3m-popup-form-longtext"></div>
                        </div>
                    </div>
                    <div class="w3m-popup-form-line" id="w3m-popup-pick-residue-detail"></div>
                </div>
            </div>
            <div class="w3m-popup w3m-popuphet" id="w3m-popup-pickhet">
                <div class="w3m-popup-close" title="Close" onclick="javascript:w3m_hide(w3m_father(this));"></div>
                <div class="w3m-popup-help" onclick="javascript:w3m.api.help('Pickup')"></div>
                <div class="w3m-popup-caption">Pick Up</div>
                <div class="w3m-popup-body">
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Mol</div>
                        <div class="w3m-popup-form-longtext" id="w3m-popup-pickhet-mol"></div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Chain</div>
                        <div class="w3m-popup-form-text" id="w3m-popup-pickhet-chain"></div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Residue</div>
                        <div class="w3m-popup-form-text" id="w3m-popup-pickhet-residue"></div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Atom</div>
                        <div class="w3m-popup-form-text" id="w3m-popup-pickhet-atom"></div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Atom ID</div>
                        <div id="w3m-popup-pickhet-atom-id" class="w3m-popup-form-longtext"></div>
                    </div>
                    <div class="w3m-popup-form-line">
                        <div class="w3m-popup-form-label">Coordinate</div>
                        <div id="w3m-popup-pickhet-atom-xyz" class="w3m-popup-form-longtext"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="w3m-watermark"></div>
        <div id="w3m-toast"></div>
    </div>
    <canvas id="w3m-canvas"></canvas>
    <div id="w3m-mask">
        <div class="w3m-mask">
            <div id="w3m-dialog-slogan"></div>
            <div class="w3m-dialog" id="w3m-dialog-fragment">
                <div id="w3m-dialog-fragment-close" class="w3m-dialog-close" title="Close Dialog" onclick="javascript:w3m.ui.fragment.close()"></div>
                <div id="w3m-dialog-fragment-ok" class="w3m-dialog-ok" title="OK" onclick="javascript:w3m.ui.fragment.ok()"></div>
                <div class="w3m-dialog-caption">Fragment Dialog</div>
                <div class="w3m-dialog-body">
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label">Chain ID</div>
                        <div class="w3m-dialog-form-select">
                            <select id="w3m-dialog-fragment-chain" class="w3m-dialog-form-select-input" onchange="javascript:;">
                            </select>
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label">Residue Start</div>
                        <div class="w3m-dialog-form-select">
                            <select id="w3m-dialog-fragment-start" class="w3m-dialog-form-select-input" onchange="javascript:;">
                            </select>
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label">Residue Stop</div>
                        <div class="w3m-dialog-form-select">
                            <select id="w3m-dialog-fragment-stop" class="w3m-dialog-form-select-input" onchange="javascript:;">
                            </select>
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label">Representation</div>
                        <div class="w3m-dialog-form-select">
                            <select id="w3m-dialog-fragment-rep" class="w3m-dialog-form-select-input" onchange="javascript:;">
                            </select>
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label">Color</div>
                        <div class="w3m-dialog-form-select">
                            <select id="w3m-dialog-fragment-color" class="w3m-dialog-form-select-input" onchange="javascript:;">
                            </select>
                        </div>
                    </div>
                    <div class="w3m-dialog-form-area">
                        <div class="w3m-dialog-form-line">
                            <div class="w3m-dialog-form-label-light">User Defined Color</div>
                            <div id="w3m-dialog-fragment-defined-color" class="w3m-dialog-form-smallcolor"></div>
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label">Label Area</div>
                        <div class="w3m-dialog-form-select">
                            <select id="w3m-dialog-fragment-label-area" class="w3m-dialog-form-select-input" onchange="javascript:;">
                            </select>
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label">Label Content</div>
                        <div class="w3m-dialog-form-select">
                            <select id="w3m-dialog-fragment-label-content" class="w3m-dialog-form-select-input" onchange="javascript:;">
                            </select>
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line-bottom" id="w3m-dialog-fragment-delete">
                        <div class="w3m-dialog-form-vsp"></div>
                        <div class="w3m-dialog-form-button w3m-dialog-form-button-red" onclick="javascript:w3m.ui.fragment.delete();w3m.ui.fragment.close();">Delete This Fragment</div>
                    </div>
                </div>
            </div>
            <div class="w3m-dialog" id="w3m-dialog-share">
                <div class="w3m-dialog-close" title="Close Dialog" onclick="javascript:w3m.ui.helper.closeDialog('w3m-dialog-share')"></div>
                <div class="w3m-dialog-ok" title="Save" onclick="javascript:w3m.ui.helper.closeDialog('w3m-dialog-share')"></div>
                <div class="w3m-dialog-caption">Share</div>
                <div class="w3m-dialog-body">
                    <textarea id="w3m-ui-share" class="w3m-dialog-form-textarea"></textarea>
                    <div class="w3m-dialog-form-line-center"><span class="w3m-bold w3m-red w3m-h1">" Ctrl/Command + C " to Copy !</span></div>
                </div>
            </div>
            <div class="w3m-dialog" id="w3m-dialog-colorpicker">
                <div class="w3m-dialog-close" title="Close Dialog" onclick="javascript:w3m.ui.colorpicker.close()"></div>
                <div class="w3m-dialog-ok" title="Save" onclick="javascript:w3m.ui.colorpicker.ok()"></div>
                <div class="w3m-dialog-caption">Color Picker</div>
                <div class="w3m-dialog-body">
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label-narrow" style="color:#ff0000;">Red</div>
                        <div class="w3m-dialog-form-text">
                            <input type="text" class="w3m-dialog-form-text-input" name="fog_stop" id="w3m_dialog_colorpicker_channel_r_text" value="0" placeholder="0" onchange="javascript:w3m.ui.colorpicker.t2r('r')" />
                        </div>
                        <div class="w3m-dialog-form-range">
                            <input type="range" class="w3m-dialog-form-range-input" id="w3m_dialog_colorpicker_channel_r_range" min="0" max="255" step="1" value="0" onchange="javascript:w3m.ui.colorpicker.r2t('r')" />
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label-narrow" style="color:#00ff00;">Green</div>
                        <div class="w3m-dialog-form-text">
                            <input type="text" class="w3m-dialog-form-text-input" name="fog_stop" id="w3m_dialog_colorpicker_channel_g_text" value="0" placeholder="0" onchange="javascript:w3m.ui.colorpicker.t2r('g')" />
                        </div>
                        <div class="w3m-dialog-form-range">
                            <input type="range" class="w3m-dialog-form-range-input" id="w3m_dialog_colorpicker_channel_g_range" min="0" max="255" step="1" value="0" onchange="javascript:w3m.ui.colorpicker.r2t('g');" />
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label-narrow" style="color:#0000ff;">Blue</div>
                        <div class="w3m-dialog-form-text">
                            <input type="text" class="w3m-dialog-form-text-input" name="fog_stop" id="w3m_dialog_colorpicker_channel_b_text" value="0" placeholder="0" onchange="javascript:w3m.ui.colorpicker.t2r('b')" />
                        </div>
                        <div class="w3m-dialog-form-range">
                            <input type="range" class="w3m-dialog-form-range-input" id="w3m_dialog_colorpicker_channel_b_range" min="0" max="255" step="1" value="0" onchange="javascript:w3m.ui.colorpicker.r2t('b');" />
                        </div>
                    </div>
                    <div class="w3m-dialog-form-line">
                        <div class="w3m-dialog-form-label-narrow" style="color:rgba(0,0,0,0.5)">Alpha</div>
                        <div class="w3m-dialog-form-text">
                            <input type="text" class="w3m-dialog-form-text-input" name="fog_stop" id="w3m_dialog_colorpicker_channel_a_text" value="0" placeholder="0" onchange="javascript:w3m.ui.colorpicker.t2r('a')" />
                        </div>
                        <div class="w3m-dialog-form-range">
                            <input type="range" class="w3m-dialog-form-range-input" id="w3m_dialog_colorpicker_channel_a_range" min="0" max="1.0" step="0.01" value="0" onchange="javascript:w3m.ui.colorpicker.r2t('a');" />
                        </div>
                    </div>
                </div>
                <div class="w3m-dialog-foot">
                    <div id="w3m_dialog_colorpicker_color" class="w3m-dialog-form-blockcolor" style="background-color:rgb(0, 0, 0)"></div>
                </div>
            </div>
            <div class="w3m-dialog" id="w3m-dialog-vectormaker">
                <div class="w3m-dialog-close" title="Close Dialog" onclick="javascript:w3m.ui.vectormaker.close()"></div>
                <div class="w3m-dialog-ok" title="Save" onclick="javascript:w3m.ui.vectormaker.ok()"></div>
                <div class="w3m-dialog-caption">Vector</div>
                <div class="w3m-dialog-body">
                    <div class="w3m-dialog-form-line-center">
                        <div class="w3m-dialog-form-vectortext">
                            <input type="text" class="w3m-dialog-form-vectortext-input" id="w3m_dialog_vectormaker_0" onchange="javascript:w3m.ui.vectormaker.tchange(0)" />
                        </div>
                        <div class="w3m-dialog-form-vectortext">
                            <input type="text" class="w3m-dialog-form-vectortext-input" id="w3m_dialog_vectormaker_1"   onchange="javascript:w3m.ui.vectormaker.tchange(1)" />
                        </div>
                        <div class="w3m-dialog-form-vectortext">
                            <input type="text" class="w3m-dialog-form-vectortext-input" id="w3m_dialog_vectormaker_2" onchange="javascript:w3m.ui.vectormaker.tchange(2)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
*/});

/* structure */
w3m.structure = {
    info : {
        ala : [ 'A',  'Alanine ( Ala )' ],
        gly : [ 'G',  'Glycine ( Gly )' ],
        ile : [ 'I',  'Isoleucine ( Ile )' ],
        leu : [ 'L',  'Leucine ( Leu )' ],
        pro : [ 'P',  'Proline ( Pro )' ],
        val : [ 'V',  'Valine ( Val )' ],
        phe : [ 'F',  'Phenylalanine ( Phe )' ],
        trp : [ 'W',  'Tryptophan ( Trp )' ],
        tyr : [ 'Y',  'Tyrosine ( Tyr )' ],
        asp : [ 'D',  'Aspartic Acid ( Asp )' ],
        glu : [ 'E',  'Glutamic Acid ( Glu )' ],
        arg : [ 'R',  'Arginine ( Arg )' ],
        his : [ 'H',  'Histidine ( His )' ],
        lys : [ 'K',  'Lysine ( Lys )' ],
        ser : [ 'S',  'Serine ( Ser )' ],
        thr : [ 'T',  'Threonine ( Thr )' ],
        cys : [ 'C',  'Cysteine ( Cys )' ],
        met : [ 'M',  'Methionine ( Met )' ],
        asn : [ 'N',  'Asparagine ( Asn )' ],
        gln : [ 'Q',  'Glutamine ( Gln )' ],
        a   : [ 'A',  "Adenosine 5'-monophosphate ( AMP )" ],
        da  : [ 'DA', "Deoxyadenosine 5'-monophosphate ( dAMP )" ],
        c   : [ 'C',  "Cytidine 5'-monophosphate ( CMP )" ],
        dc  : [ 'DC', "Deoxycytidine 5'-monophosphate ( dCMP )" ],
        g   : [ 'G',  "Guanosine 5'-monophosphate ( GMP )" ],
        dg  : [ 'DG', "Deoxyguanosine 5'-monophosphate ( dGMP )" ],
        u   : [ 'U',  "Uridine 5'-monophosphate ( UMP )" ],
        dt  : [ 'DT', "Deoxythymidine 5'-monophosphate ( dTMP )" ]
    },
    enum : {
        ala : ['n', 'ca', 'c', 'o', 'cb'],
        gly : ['n', 'ca', 'c', 'o'],
        ile : ['n', 'ca', 'c', 'o', 'cb', 'cg1', 'cg2', 'cd1'],
        leu : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd1', 'cd2'],
        pro : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd'],
        val : ['n', 'ca', 'c', 'o', 'cb', 'cg1', 'cg2'],
        phe : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd1', 'cd2', 'ce1', 'ce2', 'cz'],
        trp : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd1', 'cd2', 'ne1', 'ce2', 'ce3', 'cz2', 'cz3', 'ch2'],
        tyr : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd1', 'cd2', 'ce1', 'ce2', 'cz', 'oh'],
        asp : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'od1', 'od2'],
        glu : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd', 'oe1', 'oe2'],
        arg : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd', 'ne', 'cz', 'nh1', 'nh2'],
        his : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'nd1', 'cd2', 'ce1', 'ne2'],
        lys : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd', 'ce', 'nz'],
        ser : ['n', 'ca', 'c', 'o', 'cb', 'og'],
        thr : ['n', 'ca', 'c', 'o', 'cb', 'og1', 'cg2'],
        cys : ['n', 'ca', 'c', 'o', 'cb', 'sg'],
        met : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'sd', 'ce'],
        asn : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'od1', 'nd2'],
        gln : ['n', 'ca', 'c', 'o', 'cb', 'cg', 'cd', 'oe1', 'ne2'],
        a   : ["p", "op1", "op2", "o5'", "c5'", "c4'", "o4'", "c3'", "o3'", "c2'", "o2'", "c1'", "n9", "c8", "n7", "c5", "c6", "n6", "n1", "c2", "n3", "c4"],
        da  : ["p", "op1", "op2", "o5'", "c5'", "c4'", "o4'", "c3'", "o3'", "c2'", "c1'", "n9", "c8", "n7", "c5", "c6", "n6", "n1", "c2", "n3", "c4"],
        c   : ["p", "op1", "op2", "o5'", "c5'", "c4'", "o4'", "c3'", "o3'", "c2'", "o2'", "c1'", "n1", "c2", "o2", "n3", "c4", "n4", "c5", "c6"],
        dc  : ["p", "op1", "op2", "o5'", "c5'", "c4'", "o4'", "c3'", "o3'", "c2'", "c1'", "n1", "c2", "o2", "n3", "c4", "n4", "c5", "c6"],
        g   : ["p", "op1", "op2", "o5'", "c5'", "c4'", "o4'", "c3'", "o3'", "c2'", "o2'", "c1'", "n9", "c8", "n7", "c5", "c6", "o6", "n1", "c2", "n2", "n3", "c4"],
        dg  : ["p", "op1", "op2", "o5'", "c5'", "c4'", "o4'", "c3'", "o3'", "c2'", "c1'", "n9", "c8", "n7", "c5", "c6", "o6", "n1", "c2", "n2", "n3", "c4"],
        u   : ["p", "op1", "op2", "o5'", "c5'", "c4'", "o4'", "c3'", "o3'", "c2'", "o2'", "c1'", "n1", "c2", "o2", "n3", "c4", "o4", "c5", "c6"],
        dt  : ["p", "op1", "op2", "o5'", "c5'", "c4'", "o4'", "c3'", "o3'", "c2'", "c1'", "n1", "c2", "o2", "n3", "c4", "o4", "c5", "c7", "c6"]
    },
    pair : {
        ala : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb'],
        gly : ['n', 'ca', 'ca', 'c', 'c', 'o'],
        ile : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg1', 'cb', 'cg2', 'cg1', 'cd1'],
        leu : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd1', 'cg', 'cd2'],
        pro : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd', 'cd', 'n'],
        val : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg1', 'cb', 'cg2'],
        phe : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd1', 'cg', 'cd2', 'cd1', 'ce1', 'cd2', 'ce2', 'ce1', 'cz', 'ce2', 'cz'],
        trp : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd1', 'cg', 'cd2', 'cd1', 'ne1', 'ne1', 'ce2', 'cd2', 'ce2', 'cd2', 'ce3', 'ce2', 'cz2', 'ce3', 'cz3', 'cz2', 'ch2', 'cz3', 'ch2'],
        tyr : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd1', 'cg', 'cd2', 'cd1', 'ce1', 'cd2', 'ce2', 'ce1', 'cz', 'ce2', 'cz', 'cz', 'oh'],
        asp : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'od1', 'cg', 'od2'],
        glu : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd', 'cd', 'oe1', 'cd', 'oe2'],
        arg : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd', 'cd', 'ne', 'ne', 'cz', 'cz', 'nh1', 'cz', 'nh2'],
        his : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'nd1', 'cg', 'cd2', 'nd1', 'ce1', 'cd2', 'ne2', 'ce1', 'ne2'],
        lys : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd', 'cd', 'ce', 'ce', 'nz'],
        ser : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'og'],
        thr : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'og1', 'cb', 'cg2'],
        cys : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'sg'],
        met : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'sd', 'sd', 'ce'],
        asn : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'od1', 'cg', 'nd2'],
        gln : ['n', 'ca', 'ca', 'c', 'c', 'o', 'ca', 'cb', 'cb', 'cg', 'cg', 'cd', 'cd', 'oe1', 'cd', 'ne2'],
        a   : ['p', 'op1', 'p', 'op2', 'p', "o5'", "o5'", "c5'", "c5'", "c4'", "c4'", "o4'", "c4'", "c3'", "c3'", "o3'", "c3'", "c2'", "c2'", "o2'", "c2'", "c1'", "c1'", "o4'", "c1'", 'n9', 'n9', 'c8', 'c8', 'n7', 'n7', 'c5', 'c5', 'c6', 'c6', 'n6', 'c6', 'n1', 'n1', 'c2', 'c2', 'n3', 'n3', 'c4', 'c4', 'c5', 'c4', 'n9'],
        da  : ['p', 'op1', 'p', 'op2', 'p', "o5'", "o5'", "c5'", "c5'", "c4'", "c4'", "o4'", "c4'", "c3'", "c3'", "o3'", "c3'", "c2'", "c2'", "c1'", "c1'", "o4'", "c1'", 'n9', 'n9', 'c8', 'c8', 'n7', 'n7', 'c5', 'c5', 'c6', 'c6', 'n6', 'c6', 'n1', 'n1', 'c2', 'c2', 'n3', 'n3', 'c4', 'c4', 'c5', 'c4', 'n9'],
        c   : ['p', 'op1', 'p', 'op2', 'p', "o5'", "o5'", "c5'", "c5'", "c4'", "c4'", "o4'", "c4'", "c3'", "c3'", "o3'", "c3'", "c2'", "c2'", "o2'", "c2'", "c1'", "c1'", "o4'", "c1'", 'n1', 'n1', 'c2', 'c2', 'o2', 'c2', 'n3', 'n3', 'c4', 'c4', 'n4', 'c4', 'c5', 'c5', 'c6', 'c6', 'n1'],
        dc  : ['p', 'op1', 'p', 'op2', 'p', "o5'", "o5'", "c5'", "c5'", "c4'", "c4'", "o4'", "c4'", "c3'", "c3'", "o3'", "c3'", "c2'", "c2'", "c1'", "c1'", "o4'", "c1'", 'n1', 'n1', 'c2', 'c2', 'o2', 'c2', 'n3', 'n3', 'c4', 'c4', 'n4', 'c4', 'c5', 'c5', 'c6', 'c6', 'n1'],
        g   : ['p', 'op1', 'p', 'op2', 'p', "o5'", "o5'", "c5'", "c5'", "c4'", "c4'", "o4'", "c4'", "c3'", "c3'", "o3'", "c3'", "c2'", "c2'", "o2'", "c2'", "c1'", "c1'", "o4'", "c1'", 'n9', 'n9', 'c8', 'c8', 'n7', 'n7', 'c5', 'c5', 'c6', 'c6', 'o6', 'c6', 'n1', 'n1', 'c2', 'c2', 'n2', 'c2', 'n3', 'n3', 'c4', 'c4', 'c5', 'c4', 'n9'],
        dg  : ['p', 'op1', 'p', 'op2', 'p', "o5'", "o5'", "c5'", "c5'", "c4'", "c4'", "o4'", "c4'", "c3'", "c3'", "o3'", "c3'", "c2'", "c2'", "c1'", "c1'", "o4'", "c1'", 'n9', 'n9', 'c8', 'c8', 'n7', 'n7', 'c5', 'c5', 'c6', 'c6', 'o6', 'c6', 'n1', 'n1', 'c2', 'c2', 'n2', 'c2', 'n3', 'n3', 'c4', 'c4', 'c5', 'c4', 'n9'],
        u   : ['p', 'op1', 'p', 'op2', 'p', "o5'", "o5'", "c5'", "c5'", "c4'", "c4'", "o4'", "c4'", "c3'", "c3'", "o3'", "c3'", "c2'", "c2'", "o2'", "c2'", "c1'", "c1'", "o4'", "c1'", 'n1', 'n1', 'c2', 'c2', 'o2', 'c2', 'n3', 'n3', 'c4', 'c4', 'o4', 'c4', 'c5', 'c5', 'c6', 'c6', 'n1'],
        dt  : ['p', 'op1', 'p', 'op2', 'p', "o5'", "o5'", "c5'", "c5'", "c4'", "c4'", "o4'", "c4'", "c3'", "c3'", "o3'", "c3'", "c2'", "c2'", "c1'", "c1'", "o4'", "c1'", 'n1', 'n1', 'c2', 'c2', 'o2', 'c2', 'n3', 'n3', 'c4', 'c4', 'o4', 'c4', 'c5', 'c5', 'c7', 'c5', 'c6', 'c6', 'n1']
    },
    bridge : {
        amino_acid : ['c', 'n'],
        nucleic_acid : ["o3'", 'p']
    },
    backbone : {
        amino_acid : ['n', 'ca', 'c'],
        nucleic_acid : ["p", "o5'", "c5'", "c4'", "c3'", "o3'"]
    },
    residue : {
        amino_acid : 'ca',
        nucleic_acid : 'p',
        nucleic_acid_5_end_replace : "o5'",
        nucleic_acid_3_end_push : "o3'"
    },
    chain : {
        amino_acid : 'n',
        nucleic_acid : "o5'"
    },
    normal : {
        amino_acid : ['c', 'o'],
        a  : ["c5'", 'n1'],
        da : ["c5'", 'n1'],
        c  : ["c5'", 'n3'],
        dc : ["c5'", 'n3'],
        g  : ["c5'", 'n1'],
        dg : ["c5'", 'n1'],
        u  : ["c5'", 'n3'],
        dt : ["c5'", 'n3']
    },
    ssbond : [ 'ca', 'sg' ],
    main_chain : {
        amino_acid : [ 'n', 'ca', 'c' ],
        nucleic_acid : [ "p", "o5'", "c5'", "c4'", "c3'", "o3'" ]
    },
    main_chain_tee : {
        ala : ['c', 'ca'],
        gly : ['c'],
        ile : ['c', 'ca'],
        leu : ['c', 'ca'],
        pro : ['c', 'ca', 'n'],
        val : ['c', 'ca'],
        phe : ['c', 'ca'],
        trp : ['c', 'ca'],
        tyr : ['c', 'ca'],
        asp : ['c', 'ca'],
        glu : ['c', 'ca'],
        arg : ['c', 'ca'],
        his : ['c', 'ca'],
        lys : ['c', 'ca'],
        ser : ['c', 'ca'],
        thr : ['c', 'ca'],
        cys : ['c', 'ca'],
        met : ['c', 'ca'],
        asn : ['c', 'ca'],
        gln : ['c', 'ca'],
        a   : ["p", "c4'", "c3'"],
        da  : ["p", "c4'", "c3'"],
        c   : ["p", "c4'", "c3'"],
        dc  : ["p", "c4'", "c3'"],
        g   : ["p", "c4'", "c3'"],
        dg  : ["p", "c4'", "c3'"],
        u   : ["p", "c4'", "c3'"],
        dt  : ["p", "c4'", "c3'"]
    },
    sub_chain : {
        ala : [],
        gly : [],
        ile : [ 'ca', 'cb', 'cg1', 'cd1' ],
        leu : [ 'ca', 'cb', 'cg', 'cd1' ],
        pro : [ 'ca', 'cb', 'cg', 'cd', 'n' ],
        val : [ 'ca', 'cb', 'cg1' ],
        phe : [ 'ca', 'cb', 'cg', 'cd1', 'ce1', 'cz', 'ce2', 'cd2', 'cg' ],
        trp : [ 'ca', 'cb', 'cg', 'cd1', 'ne1', 'ce2', 'cz2', 'ch2', 'cz3', 'ce3', 'cd2', 'cg' ],
        tyr : [ 'ca', 'cb', 'cg', 'cd1', 'ce1', 'cz', 'ce2', 'cd2', 'cg' ],
        asp : [ 'ca', 'cb', 'cg', 'od1' ],
        glu : [ 'ca', 'cb', 'cg', 'cd', 'oe1' ],
        arg : [ 'ca', 'cb', 'cg', 'cd', 'ne', 'cz', 'nh1' ],
        his : [ 'ca', 'cb', 'cg', 'nd1', 'ce1', 'ne2', 'cd2', 'cg' ],
        lys : [ 'ca', 'cb', 'cg', 'cd', 'ce', 'nz' ],
        ser : [ 'ca', 'cb', 'og' ],
        thr : [ 'ca', 'cb', 'og1' ],
        cys : [ 'ca', 'cb', 'sg' ],
        met : [ 'ca', 'cb', 'cg', 'sd', 'ce' ],
        asn : [ 'ca', 'cb', 'cg', 'od1' ],
        gln : [ 'ca', 'cb', 'cg', 'cd', 'oe1' ],
        a   : [ "c1'", 'n9', 'c4', 'n3', 'c2', 'n1', 'c6', 'c5', 'n7', 'c8', 'n9' ],
        da  : [ "c1'", 'n9', 'c4', 'n3', 'c2', 'n1', 'c6', 'c5', 'n7', 'c8', 'n9' ],
        c   : [ "c1'", 'n1', 'c2', 'n3', 'c4', 'c5', 'c6', 'n1' ],
        dc  : [ "c1'", 'n1', 'c2', 'n3', 'c4', 'c5', 'c6', 'n1' ],
        g   : [ "c1'", 'n9', 'c4', 'n3', 'c2', 'n1', 'c6', 'c5', 'n7', 'c8', 'n9' ],
        dg  : [ "c1'", 'n9', 'c4', 'n3', 'c2', 'n1', 'c6', 'c5', 'n7', 'c8', 'n9' ],
        u   : [ "c1'", 'n1', 'c2', 'n3', 'c4', 'c5', 'c6', 'n1' ],
        dt  : [ "c1'", 'n1', 'c2', 'n3', 'c4', 'c5', 'c6', 'n1' ],
        amino_acid : [],
        nucleic_acid : [ "c3'", "c2'", "c1'", "o4'", "c4'" ] // common for nucleic_acid
    },
    sub_chain_tee : {
        ala : [],
        gly : [],
        ile : ['cb'],
        leu : ['cg'],
        pro : [],
        val : ['cb'],
        phe : ['cg'],
        trp : ['cg', 'ce2', 'cd2'],
        tyr : ['cg', 'cz'],
        asp : ['cg'],
        glu : ['cd'],
        arg : ['cz'],
        his : ['cg'],
        lys : [],
        ser : [],
        thr : ['cb'],
        cys : [],
        met : [],
        asn : ['cg'],
        gln : ['cd'],
        a   : ['n9', 'c4', 'c6', 'c5'],
        da  : ['n9', 'c4', 'c6', 'c5'],
        c   : ['n1', 'c2', 'c4'],
        dc  : ['n1', 'c2', 'c4'],
        g   : ['n9', 'c4', 'c2', 'c6', 'c5'],
        dg  : ['n9', 'c4', 'c2', 'c6', 'c5'],
        u   : ['n1', 'c2', 'c4'],
        dt  : ['n1', 'c2', 'c4', 'c5'],
        amino_acid : [],
        nucleic_acid : ["c1'", "c4'"]
    },
    sub_chain_loop : ['pro', 'phe', 'trp', 'tyr', 'his', 'a', 'da', 'c', 'dc', 'g', 'dg', 'u', 'dt', 'nucleic_acid'],
    hang_link : {
        ala : [ [ 'c', 'o' ], [ 'ca', 'cb' ] ],
        gly : [ [ 'c', 'o' ] ],
        ile : [ [ 'c', 'o' ], [ 'cb', 'cg2' ] ],
        leu : [ [ 'c', 'o' ], [ 'cg', 'cd2' ] ],
        pro : [ [ 'c', 'o' ] ],
        val : [ [ 'c', 'o' ], [ 'cb', 'cg2' ] ],
        phe : [ [ 'c', 'o' ] ],
        trp : [ [ 'c', 'o' ] ],
        tyr : [ [ 'c', 'o' ], [ 'cz', 'oh' ] ],
        asp : [ [ 'c', 'o' ], [ 'cg', 'od2' ] ],
        glu : [ [ 'c', 'o' ], [ 'cd', 'oe2' ] ],
        arg : [ [ 'c', 'o' ], [ 'cz', 'nh2' ] ],
        his : [ [ 'c', 'o' ] ],
        lys : [ [ 'c', 'o' ] ],
        ser : [ [ 'c', 'o' ] ],
        thr : [ [ 'c', 'o' ], [ 'cb', 'cg2' ] ],
        cys : [ [ 'c', 'o' ] ],
        met : [ [ 'c', 'o' ] ],
        asn : [ [ 'c', 'o' ], [ 'cg', 'nd2' ] ],
        gln : [ [ 'c', 'o' ], [ 'cd', 'ne2' ] ],
        a   : [ [ 'p', 'op1' ], [ 'p', 'op2' ], [ 'c6', 'n6' ], [ "c2'", "o2'"] ],
        da  : [ [ 'p', 'op1' ], [ 'p', 'op2' ], [ 'c6', 'n6' ] ],
        c   : [ [ 'p', 'op1' ], [ 'p', 'op2' ], [ 'c2', 'o2' ], [ 'c4', 'n4' ], [ "c2'", "o2'"] ],
        dc  : [ [ 'p', 'op1' ], [ 'p', 'op2' ], [ 'c2', 'o2' ], [ 'c4', 'n4' ] ],
        g   : [ [ 'p', 'op1' ], [ 'p', 'op2' ], [ 'c2', 'n2' ], [ 'c6', 'o6' ], [ "c2'", "o2'"] ],
        dg  : [ [ 'p', 'op1' ], [ 'p', 'op2' ], [ 'c2', 'n2' ], [ 'c6', 'o6' ] ],
        u   : [ [ 'p', 'op1' ], [ 'p', 'op2' ], [ 'c2', 'o2' ], [ 'c4', 'o4' ], [ "c2'", "o2'"] ],
        dt  : [ [ 'p', 'op1' ], [ 'p', 'op2' ], [ 'c2', 'o2' ], [ 'c4', 'o4' ], [ 'c5', 'c7' ] ]
    },
    inner_link : {
        ala : [],
        gly : [],
        ile : [],
        leu : [],
        pro : [],
        val : [],
        phe : [],
        trp : [ [ 'ce2', 'cd2' ] ],
        tyr : [],
        asp : [],
        glu : [],
        arg : [],
        his : [],
        lys : [],
        ser : [],
        thr : [],
        cys : [],
        met : [],
        asn : [],
        gln : [],
        a   : [ [ 'c4', 'c5' ] ],
        da  : [ [ 'c4', 'c5' ] ],
        c   : [],
        dc  : [],
        g   : [ [ 'c4', 'c5' ] ],
        dg  : [ [ 'c4', 'c5' ] ],
        u   : [],
        dt  : []
    }
}

/* rgb */
w3m.rgb = {
     0 : [null, null, null], // hide
     1 : [0.75, 0.78, 0.79], // default
     2 : [1.00, 1.00, 0.00], // measure
    // Special
    11 : [0.79, 0.41, 0.14], // helix side
    12 : [0.75, 0.75, 0.75], // helix inner
    13 : [0.75, 0.75, 0.75], // sheet side
    14 : [0.79, 0.41, 0.14], // cube side
    15 : [0.79, 0.41, 0.14], // strip side
    16 : [0.79, 0.41, 0.14], // railway side
    17 : [0.79, 0.41, 0.14], // ribbon side
    18 : [0.79, 0.41, 0.14], // arrow side
    19 : [0.79, 0.41, 0.14], // cylinder end
    // Element
    101 : [ 0.2, 1, 0.2 ],
    102 : [ 1, 0.3, 0.3 ],
    103 : [ 0.18, 0.18, 0.93 ],
    104 : [ 1, 0.56, 0 ],
    105 : [ 0.82, 0.82, 0.82 ],
    106 : [ 0.79, 0.41, 0.14 ],
    107 : [ 1, 0.275, 0.122 ],
    108 : [ 0.086, 0.663, 0.318 ],
    109 : [ 0.02, 0.467, 0.282 ],
    110 : [ 1, 0.945, 0.263 ],
    111 : [ 0.267, 0.808, 0.965 ],
    112 : [ 0.8, 0.643, 0.89 ],
    113 : [ 0.859, 0.353, 0.4 ],
    114 : [ 0.086, 0.522, 0.663 ],
    115 : [ 0.129, 0.651, 0.459 ],
    116 : [ 0.851, 0.714, 0.067 ],
    117 : [ 0.553, 0.294, 0.733 ],
    118 : [ 0.086, 0.663, 0.318 ],
    // Residue
    201 : [ 1, 0.275, 0.122 ],
    202 : [ 1, 0.702, 0.655 ],
    203 : [ 0.859, 0.353, 0.4 ],
    204 : [ 1, 0.129, 0.129 ],
    205 : [ 1, 0.278, 0.467 ],
    206 : [ 0.749, 0.141, 0.165 ],
    207 : [ 0.267, 0.808, 0.965 ],
    208 : [ 0.439, 0.953, 1 ],
    209 : [ 0.086, 0.522, 0.663 ],
    210 : [ 0.086, 0.663, 0.318 ],
    211 : [ 0, 0.737, 0.071 ],
    212 : [ 0.129, 0.651, 0.459 ],
    213 : [ 0, 0.898, 0 ],
    214 : [ 0.588, 0.808, 0.329 ],
    215 : [ 0.02, 0.467, 0.282 ],
    216 : [ 1, 0.945, 0.263 ],
    217 : [ 1, 0.651, 0.192 ],
    218 : [ 0.8, 0.643, 0.89 ],
    219 : [ 0.298, 0.133, 0.106 ],
    220 : [ 0.553, 0.294, 0.733 ],
    221 : [ 0, 0.204, 0.447 ],
    222 : [ 0.851, 0.714, 0.067 ],
    223 : [ 0.459, 0.259, 0.4 ],
    224 : [ 0.231, 0.18, 0.494 ],
    225 : [ 0.294, 0.361, 0.769 ],
    226 : [ 0.886, 0.612, 0.271 ],
    227 : [ 0.549, 0.263, 0.337 ],
    228 : [ 0.667, 0.298, 0.561 ],
    // SS
    301 : [ 1, 0, 0 ],
    302 : [ 1, 1, 0 ],
    303 : [ 0, 1, 0 ],
    // Chain
    401 : [ 0.2, 1, 0.2 ], 402 : [ 1, 0.3, 0.3 ], 403 : [ 0.18, 0.18, 0.93 ], 404 : [ 1, 0.56, 0 ], 405 : [ 0.54, 0.36, 0.54 ], 406 : [ 0.79, 0.41, 0.14 ], 407 : [ 0.82, 0.82, 0.82 ], 408 : [ 0.086, 0.522, 0.663 ], 409 : [ 1, 0.651, 0.192 ], 410 : [ 0.298, 0.133, 0.106 ], 411 : [ 0.859, 0.353, 0.4 ], 412 : [ 0.86, 0.522, 0.663 ], 413 : [ 0.086, 0.0522, 0.663 ], 414 : [ 0.851, 0.714, 0.067 ], 415 : [ 0.00, 0.00, 0.00 ], 416 : [ 0.00, 0.00, 0.25 ], 417 : [ 0.00, 0.00, 0.50 ], 418 : [ 0.00, 0.00, 0.75 ], 419 : [ 0.00, 0.00, 1.00 ], 420 : [ 0.00, 0.25, 0.00 ], 421 : [ 0.00, 0.25, 0.25 ], 422 : [ 0.00, 0.25, 0.50 ], 423 : [ 0.00, 0.25, 0.75 ], 424 : [ 0.00, 0.25, 1.00 ], 425 : [ 0.00, 0.50, 0.00 ], 426 : [ 0.00, 0.50, 0.25 ],
    500 : [ 0.00, 0.50, 0.50 ], 501 : [ 0.00, 0.50, 0.75 ], 502 : [ 0.00, 0.50, 1.00 ], 503 : [ 0.00, 0.75, 0.00 ], 504 : [ 0.00, 0.75, 0.25 ], 505 : [ 0.00, 0.75, 0.50 ], 506 : [ 0.00, 0.75, 0.75 ], 507 : [ 0.00, 0.75, 1.00 ], 508 : [ 0.00, 1.00, 0.00 ], 509 : [ 0.00, 1.00, 0.25 ], 510 : [ 0.00, 1.00, 0.50 ], 511 : [ 0.00, 1.00, 0.75 ], 512 : [ 0.00, 1.00, 1.00 ], 513 : [ 0.25, 0.00, 0.00 ], 514 : [ 0.25, 0.00, 0.25 ], 515 : [ 0.25, 0.00, 0.50 ], 516 : [ 0.25, 0.00, 0.75 ], 517 : [ 0.25, 0.00, 1.00 ], 518 : [ 0.25, 0.25, 0.00 ], 519 : [ 0.25, 0.25, 0.25 ], 520 : [ 0.25, 0.25, 0.50 ], 521 : [ 0.25, 0.25, 0.75 ], 522 : [ 0.25, 0.25, 1.00 ], 523 : [ 0.25, 0.50, 0.00 ], 524 : [ 0.25, 0.50, 0.25 ], 525 : [ 0.25, 0.50, 0.50 ], 526 : [ 0.25, 0.50, 0.75 ], 527 : [ 0.25, 0.50, 1.00 ], 528 : [ 0.25, 0.75, 0.00 ], 529 : [ 0.25, 0.75, 0.25 ], 530 : [ 0.25, 0.75, 0.50 ], 531 : [ 0.25, 0.75, 0.75 ], 532 : [ 0.25, 0.75, 1.00 ], 533 : [ 0.25, 1.00, 0.00 ], 534 : [ 0.25, 1.00, 0.25 ], 535 : [ 0.25, 1.00, 0.50 ], 536 : [ 0.25, 1.00, 0.75 ], 537 : [ 0.25, 1.00, 1.00 ], 538 : [ 0.50, 0.00, 0.00 ], 539 : [ 0.50, 0.00, 0.25 ], 540 : [ 0.50, 0.00, 0.50 ], 541 : [ 0.50, 0.00, 0.75 ], 542 : [ 0.50, 0.00, 1.00 ], 543 : [ 0.50, 0.25, 0.00 ], 544 : [ 0.50, 0.25, 0.25 ], 545 : [ 0.50, 0.25, 0.50 ], 546 : [ 0.50, 0.25, 0.75 ], 547 : [ 0.50, 0.25, 1.00 ], 548 : [ 0.50, 0.50, 0.00 ], 549 : [ 0.50, 0.50, 0.25 ], 550 : [ 0.50, 0.50, 0.50 ], 551 : [ 0.50, 0.50, 0.75 ], 552 : [ 0.50, 0.50, 1.00 ], 553 : [ 0.50, 0.75, 0.00 ], 554 : [ 0.50, 0.75, 0.25 ], 555 : [ 0.50, 0.75, 0.50 ], 556 : [ 0.50, 0.75, 0.75 ], 557 : [ 0.50, 0.75, 1.00 ], 558 : [ 0.50, 1.00, 0.00 ], 559 : [ 0.50, 1.00, 0.25 ], 560 : [ 0.50, 1.00, 0.50 ], 561 : [ 0.50, 1.00, 0.75 ], 562 : [ 0.50, 1.00, 1.00 ], 563 : [ 0.75, 0.00, 0.00 ], 564 : [ 0.75, 0.00, 0.25 ], 565 : [ 0.75, 0.00, 0.50 ], 566 : [ 0.75, 0.00, 0.75 ], 567 : [ 0.75, 0.00, 1.00 ], 568 : [ 0.75, 0.25, 0.00 ], 569 : [ 0.75, 0.25, 0.25 ], 570 : [ 0.75, 0.25, 0.50 ], 571 : [ 0.75, 0.25, 0.75 ], 572 : [ 0.75, 0.25, 1.00 ], 573 : [ 0.75, 0.50, 0.00 ], 574 : [ 0.75, 0.50, 0.25 ], 575 : [ 0.75, 0.50, 0.50 ], 576 : [ 0.75, 0.50, 0.75 ], 577 : [ 0.75, 0.50, 1.00 ], 578 : [ 0.75, 0.75, 0.00 ], 579 : [ 0.75, 0.75, 0.25 ], 580 : [ 0.75, 0.75, 0.50 ], 581 : [ 0.75, 0.75, 0.75 ], 582 : [ 0.75, 0.75, 1.00 ], 583 : [ 0.75, 1.00, 0.00 ], 584 : [ 0.75, 1.00, 0.25 ], 585 : [ 0.75, 1.00, 0.50 ], 586 : [ 0.75, 1.00, 0.75 ], 587 : [ 0.75, 1.00, 1.00 ], 588 : [ 1.00, 0.00, 0.00 ], 589 : [ 1.00, 0.00, 0.25 ], 590 : [ 1.00, 0.00, 0.50 ], 591 : [ 1.00, 0.00, 0.75 ], 592 : [ 1.00, 0.00, 1.00 ], 593 : [ 1.00, 0.25, 0.00 ], 594 : [ 1.00, 0.25, 0.25 ], 595 : [ 1.00, 0.25, 0.50 ], 596 : [ 1.00, 0.25, 0.75 ], 597 : [ 1.00, 0.25, 1.00 ], 598 : [ 1.00, 0.50, 0.00 ], 599 : [ 1.00, 0.50, 0.25 ],
    // Hydrophobicity
    601 : [ 0.00, 0.00, 1.00 ], 602 : [ 0.07, 0.07, 1.00 ], 603 : [ 0.11, 0.11, 1.00 ], 604 : [ 0.11, 0.11, 1.00 ],
    605 : [ 0.11, 0.11, 1.00 ], 606 : [ 0.11, 0.11, 1.00 ], 607 : [ 0.14, 0.14, 1.00 ], 608 : [ 0.32, 0.32, 1.00 ],
    609 : [ 0.36, 0.36, 1.00 ], 610 : [ 0.40, 0.40, 1.00 ], 611 : [ 0.41, 0.41, 1.00 ], 612 : [ 0.42, 0.42, 1.00 ],
    613 : [ 0.46, 0.46, 1.00 ], 614 : [ 1.00, 0.30, 0.30 ], 615 : [ 1.00, 0.29, 0.29 ], 616 : [ 1.00, 0.22, 0.22 ],
    617 : [ 1.00, 0.19, 0.19 ], 618 : [ 1.00, 0.08, 0.08 ], 619 : [ 1.00, 0.03, 0.03 ], 620 : [ 1.00, 0.00, 0.00 ],
    // Rep
    701 : [ 1, 0, 0 ], 702 : [ 0, 1, 0 ], 703 : [ 0, 0, 1 ], 704 : [ 1, 1, 0 ], 705 : [ 1, 0, 1 ], 706 : [ 0, 1, 1 ], 707 : [ 1.000, 0.275, 0.122 ], 708 : [ 0.267, 0.808, 0.965 ], 709 : [ 0.086, 0.663, 0.318 ], 710 : [ 1.000, 0.945, 0.263 ], 711 : [ 0.800, 0.643, 0.890 ], 712 : [ 0.282, 0.753, 0.639 ], 713 : [ 1.000, 0.776, 0.667 ], 714 : [ 0.420, 0.482, 0.431 ], 715 : [ 0.894, 0.620, 0.380 ],
    // > 1000, Spectrum
    1000 : [ 1.000, 0.000, 1.000 ], 1001 : [ 0.940, 0.000, 1.000 ], 1002 : [ 0.880, 0.000, 1.000 ], 1003 : [ 0.820, 0.000, 1.000 ], 1004 : [ 0.760, 0.000, 1.000 ], 1005 : [ 0.701, 0.000, 1.000 ], 1006 : [ 0.641, 0.000, 1.000 ], 1007 : [ 0.581, 0.000, 1.000 ], 1008 : [ 0.521, 0.000, 1.000 ], 1009 : [ 0.461, 0.000, 1.000 ], 1010 : [ 0.401, 0.000, 1.000 ], 1011 : [ 0.341, 0.000, 1.000 ], 1012 : [ 0.281, 0.000, 1.000 ], 1013 : [ 0.222, 0.000, 1.000 ], 1014 : [ 0.162, 0.000, 1.000 ], 1015 : [ 0.102, 0.000, 1.000 ], 1016 : [ 0.042, 0.000, 1.000 ], 1017 : [ 0.000, 0.020, 1.000 ], 1018 : [ 0.000, 0.087, 1.000 ], 1019 : [ 0.000, 0.153, 1.000 ], 1020 : [ 0.000, 0.220, 1.000 ], 1021 : [ 0.000, 0.287, 1.000 ], 1022 : [ 0.000, 0.353, 1.000 ], 1023 : [ 0.000, 0.420, 1.000 ], 1024 : [ 0.000, 0.487, 1.000 ], 1025 : [ 0.000, 0.553, 1.000 ], 1026 : [ 0.000, 0.620, 1.000 ], 1027 : [ 0.000, 0.687, 1.000 ], 1028 : [ 0.000, 0.753, 1.000 ], 1029 : [ 0.000, 0.820, 1.000 ], 1030 : [ 0.000, 0.887, 1.000 ], 1031 : [ 0.000, 0.953, 1.000 ], 1032 : [ 0.000, 1.000, 0.974 ], 1033 : [ 0.000, 1.000, 0.888 ], 1034 : [ 0.000, 1.000, 0.802 ], 1035 : [ 0.000, 1.000, 0.716 ], 1036 : [ 0.000, 1.000, 0.629 ], 1037 : [ 0.000, 1.000, 0.543 ], 1038 : [ 0.000, 1.000, 0.457 ], 1039 : [ 0.000, 1.000, 0.371 ], 1040 : [ 0.000, 1.000, 0.284 ], 1041 : [ 0.000, 1.000, 0.198 ], 1042 : [ 0.000, 1.000, 0.112 ], 1043 : [ 0.000, 1.000, 0.026 ], 1044 : [ 0.052, 1.000, 0.000 ], 1045 : [ 0.127, 1.000, 0.000 ], 1046 : [ 0.201, 1.000, 0.000 ], 1047 : [ 0.276, 1.000, 0.000 ], 1048 : [ 0.351, 1.000, 0.000 ], 1049 : [ 0.425, 1.000, 0.000 ], 1050 : [ 0.500, 1.000, 0.000 ], 1051 : [ 0.575, 1.000, 0.000 ], 1052 : [ 0.649, 1.000, 0.000 ], 1053 : [ 0.724, 1.000, 0.000 ], 1054 : [ 0.799, 1.000, 0.000 ], 1055 : [ 0.873, 1.000, 0.000 ], 1056 : [ 0.948, 1.000, 0.000 ], 1057 : [ 1.000, 0.990, 0.000 ], 1058 : [ 1.000, 0.957, 0.000 ], 1059 : [ 1.000, 0.923, 0.000 ], 1060 : [ 1.000, 0.890, 0.000 ], 1061 : [ 1.000, 0.857, 0.000 ], 1062 : [ 1.000, 0.823, 0.000 ], 1063 : [ 1.000, 0.790, 0.000 ], 1064 : [ 1.000, 0.757, 0.000 ], 1065 : [ 1.000, 0.724, 0.000 ], 1066 : [ 1.000, 0.690, 0.000 ], 1067 : [ 1.000, 0.657, 0.000 ], 1068 : [ 1.000, 0.624, 0.000 ], 1069 : [ 1.000, 0.590, 0.000 ], 1070 : [ 1.000, 0.557, 0.000 ], 1071 : [ 1.000, 0.538, 0.000 ], 1072 : [ 1.000, 0.520, 0.000 ], 1073 : [ 1.000, 0.501, 0.000 ], 1074 : [ 1.000, 0.483, 0.000 ], 1075 : [ 1.000, 0.464, 0.000 ], 1076 : [ 1.000, 0.446, 0.000 ], 1077 : [ 1.000, 0.427, 0.000 ], 1078 : [ 1.000, 0.408, 0.000 ], 1079 : [ 1.000, 0.390, 0.000 ], 1080 : [ 1.000, 0.371, 0.000 ], 1081 : [ 1.000, 0.353, 0.000 ], 1082 : [ 1.000, 0.334, 0.000 ], 1083 : [ 1.000, 0.316, 0.000 ], 1084 : [ 1.000, 0.297, 0.000 ], 1085 : [ 1.000, 0.278, 0.000 ], 1086 : [ 1.000, 0.260, 0.000 ], 1087 : [ 1.000, 0.241, 0.000 ], 1088 : [ 1.000, 0.223, 0.000 ], 1089 : [ 1.000, 0.204, 0.000 ], 1090 : [ 1.000, 0.186, 0.000 ], 1091 : [ 1.000, 0.167, 0.000 ], 1092 : [ 1.000, 0.149, 0.000 ], 1093 : [ 1.000, 0.130, 0.000 ], 1094 : [ 1.000, 0.111, 0.000 ], 1095 : [ 1.000, 0.093, 0.000 ], 1096 : [ 1.000, 0.074, 0.000 ], 1097 : [ 1.000, 0.056, 0.000 ], 1098 : [ 1.000, 0.037, 0.000 ], 1099 : [ 1.000, 0.019, 0.000 ], 1100 : [ 1.000, 0.000, 0.000 ],
    // xukui add 2017-08-27
    1201 : [ 0.00, 0.00, 1.00 ], 1202 : [ 0.11, 0.11, 1.00 ], 1203 : [ 0.11, 0.11, 1.00 ], 1204 : [ 0.14, 0.14, 1.00 ],
    1205 : [ 0.36, 0.36, 1.00 ], 1206 : [ 0.41, 0.41, 1.00 ], 1207 : [ 0.46, 0.46, 1.00 ], 1208 : [ 1.00, 0.29, 0.29 ], 1209 : [ 1.00, 0.03, 0.03 ],
}

/* color */
w3m.color = {
    // By Atom
    element : {
        c  : 101, o  : 102, n  : 103, s  : 104, h  : 105,  p  : 106, 
        fe : 107, cu : 108, co : 109, zn : 110, mn : 111,  i  : 112, 
        na : 113, k  : 114, ca : 115, mg : 116, al : 117, cl  : 118
    },
    // By Residue
    residue : {
        ala : 201, gly : 202, ile : 203, leu : 204, pro : 205, 
        val : 206, phe : 207, trp : 208, tyr : 209, ser : 210, 
        thr : 211, cys : 212, met : 213, asn : 214, gln : 215, 
        asp : 216, glu : 217, arg : 218, his : 219, lys : 220, 
        a   : 221, c   : 222, g   : 223, u   : 224, 
        da  : 225, dc  : 226, dg  : 227, dt  : 228
    },
    // By Secondary Structure
    ss : {
        helix : 301, sheet : 302, loop  : 303
    },
    // By Chain
    chain : {
        a : 401, b : 402, c : 403, d : 404, e : 405, f : 406, g : 407, 
        h : 408, i : 409, j : 410, k : 411, l : 412, m : 413, n : 414,
        o : 415, p : 416, q : 417,          r : 418, s : 419, t : 420,
        u : 421, v : 422, w : 423,          x : 424, y : 425, z : 426,
        0 : 500, 1 : 501, 2 : 502, 3 : 503, 4 : 504, 5 : 505, 6 : 506, 7 : 507, 8 : 508, 9 : 509, 10 : 510, 11 : 511, 12 : 512, 13 : 513, 14 : 514, 15 : 515, 16 : 516, 17 : 517, 18 : 518, 19 : 519, 20 : 520, 21 : 521, 22 : 522, 23 : 523, 24 : 524, 25 : 525, 26 : 526, 27 : 527, 28 : 528, 29 : 529, 30 : 530, 31 : 531, 32 : 532, 33 : 533, 34 : 534, 35 : 535, 36 : 536, 37 : 537, 38 : 538, 39 : 539, 40 : 540, 41 : 541, 42 : 542, 43 : 543, 44 : 544, 45 : 545, 46 : 546, 47 : 547, 48 : 548, 49 : 549, 50 : 550, 51 : 551, 52 : 552, 53 : 553, 54 : 554, 55 : 555, 56 : 556, 57 : 557, 58 : 558, 59 : 559, 60 : 560, 61 : 561, 62 : 562, 63 : 563, 64 : 564, 65 : 565, 66 : 566, 67 : 567, 68 : 568, 69 : 569, 70 : 570, 71 : 571, 72 : 572, 73 : 573, 74 : 574, 75 : 575, 76 : 576, 77 : 577, 78 : 578, 79 : 579, 80 : 580, 81 : 581, 82 : 582, 83 : 583, 84 : 584, 85 : 585, 86 : 586, 87 : 587, 88 : 588, 89 : 589, 90 : 590, 91 : 591, 92 : 592, 93 : 593, 94 : 594, 95 : 595, 96 : 596, 97 : 597, 98 : 598, 99 : 599
    },
    // By Hydrophobicity
    hydrophobicity : {
        arg : 601, lys : 602, asn : 603, asp : 604, gln : 605,
        glu : 606, his : 607, pro : 608, tyr : 609, trp : 610,
        ser : 611, thr : 612, gly : 613, ala : 614, met : 615,
        cys : 616, phe : 617, leu : 618, val : 619, ile : 620
    },
    // By Rep
    rep : {
        hide    : 0, 
        dot     : 701, line   : 702, backbone : 703, tube  : 704, 
        cartoon : 705, putty  : 706, cube     : 707, strip : 708, railway  : 709, ribbon : 710, arrow : 711, 
        stick   : 712, sphere : 713, ball_and_rod : 714
    }
}

/* geometry */
w3m.geometry = {
    radius : {
         o : 1.52,  c : 1.70,  n : 1.55,  s : 1.80,  h : 1.20,  p : 1.80,
        cu : 1.40, zn : 1.39,  i : 1.98, na : 2.27,  k : 2.75, mg : 1.73, cl : 1.75,
        fe : 1.73
    },
    circle : {
        n : 12,
        sin : [0, 0.5, 0.866, 1, 0.866, 0.5, 0, -0.5, -0.866, -1, -0.866, -0.5, 0],
        cos : [1, 0.866, 0.5, 0, -0.5, -0.866, -1, -0.866, -0.5, 0, 0.5, 0.866, 1]
    },
    /* section */
    // [ x, y, nx, ny ] ]
    oval : [],
    sphere_vector : [
        [0.8506, 0.5257, 0], [0.8506, -0.5257, 0], [-0.8506, 0.5257, 0], [-0.8506, -0.5257, 0], [0, 0.8506, 0.5257], [0, 0.8506, -0.5257], [0, -0.8506, 0.5257], [0, -0.8506, -0.5257], [0.5257, 0, 0.8506], [-0.5257, 0, 0.8506], [0.5257, 0, -0.8506], [-0.5257, 0, -0.8506], [0.9794, 0.2017, 0], [0.8547, 0.4035, 0.3264], [0.8547, 0.4035, -0.3264], [0.6529, 0.7300, 0.2017], [0.6529, 0.7300, -0.2017], [0.9794, -0.2017, 0], [0.8547, -0.4035, 0.3264], [0.8547, -0.4035, -0.3264], [0.6529, -0.7300, 0.2017], [0.6529, -0.7300, -0.2017], [-0.9794, 0.2017, 0], [-0.8547, 0.4035, 0.3264], [-0.8547, 0.4035, -0.3264], [-0.6529, 0.7300, 0.2017], [-0.6529, 0.7300, -0.2017], [-0.9794, -0.2017, 0], [-0.8547, -0.4035, 0.3264], [-0.8547, -0.4035, -0.3264], [-0.6529, -0.7300, 0.2017], [-0.6529, -0.7300, -0.2017], [0, 0.9794, 0.2017], [0.3264, 0.8547, 0.4035], [-0.3264, 0.8547, 0.4035], [0.2017, 0.6529, 0.7300], [-0.2017, 0.6529, 0.7300], [0, 0.9794, -0.2017], [0.3264, 0.8547, -0.4035], [-0.3264, 0.8547, -0.4035], [0.2017, 0.6529, -0.7300], [-0.2017, 0.6529, -0.7300], [0, -0.9794, 0.2017], [0.3264, -0.8547, 0.4035], [-0.3264, -0.8547, 0.4035], [0.2017, -0.6529, 0.7300], [-0.2017, -0.6529, 0.7300], [0, -0.9794, -0.2017], [0.3264, -0.8547, -0.4035], [-0.3264, -0.8547, -0.4035], [0.2017, -0.6529, -0.7300], [-0.2017, -0.6529, -0.7300], [0.2017, 0, 0.9794], [0.4035, 0.3264, 0.8547], [0.4035, -0.3264, 0.8547], [0.7300, 0.2017, 0.6529], [0.7300, -0.2017, 0.6529], [-0.2017, 0, 0.9794], [-0.4035, 0.3264, 0.8547], [-0.4035, -0.3264, 0.8547], [-0.7300, 0.2017, 0.6529], [-0.7300, -0.2017, 0.6529], [0.2017, 0, -0.9794], [0.4035, 0.3264, -0.8547], [0.4035, -0.3264, -0.8547], [0.7300, 0.2017, -0.6529], [0.7300, -0.2017, -0.6529], [-0.2017, 0, -0.9794], [-0.4035, 0.3264, -0.8547], [-0.4035, -0.3264, -0.8547], [-0.7300, 0.2017, -0.6529], [-0.7300, -0.2017, -0.6529], [0.9341, 0, 0.3568], [0.9341, 0, -0.3568], [0.5773, 0.5773, 0.5773], [0.5773, 0.5773, -0.5773], [0.3568, 0.9341, 0], [0.5773, -0.5773, 0.5773], [0.5773, -0.5773, -0.5773], [0.3568, -0.9341, 0], [-0.9341, 0, 0.3568], [-0.9341, 0, -0.3568], [-0.5773, 0.5773, 0.5773], [-0.5773, 0.5773, -0.5773], [-0.3568, 0.9341, 0], [-0.5773, -0.5773, 0.5773], [-0.5773, -0.5773, -0.5773], [-0.3568, -0.9341, 0], [0, 0.3568, 0.9341], [0, 0.3568, -0.9341], [0, -0.3568, 0.9341], [0, -0.3568, -0.9341]
    ],
    sphere_link: [ 0,12,13,0,12,14,0,13,15,0,14,16,0,15,16,1,17,18,1,17,19,1,18,20,1,19,21,1,20,21,2,22,23,2,22,24,2,23,25,2,24,26,2,25,26,3,27,28,3,27,29,3,28,30,3,29,31,3,30,31,4,32,33,4,32,34,4,33,35,4,34,36,4,35,36,5,37,38,5,37,39,5,38,40,5,39,41,5,40,41,6,42,43,6,42,44,6,43,45,6,44,46,6,45,46,7,47,48,7,47,49,7,48,50,7,49,51,7,50,51,8,52,53,8,52,54,8,53,55,8,54,56,8,55,56,9,57,58,9,57,59,9,58,60,9,59,61,9,60,61,10,62,63,10,62,64,10,63,65,10,64,66,10,65,66,11,67,68,11,67,69,11,68,70,11,69,71,11,70,71,72,12,17,72,17,18,72,18,56,72,56,55,72,55,13,72,13,12,73,12,17,73,17,19,73,19,66,73,66,65,73,65,14,73,14,12,74,13,55,74,55,53,74,53,35,74,35,33,74,33,15,74,15,13,75,14,65,75,65,63,75,63,40,75,40,38,75,38,16,75,16,14,76,15,33,76,33,32,76,32,37,76,37,38,76,38,16,76,16,15,77,18,56,77,56,54,77,54,45,77,45,43,77,43,20,77,20,18,78,19,66,78,66,64,78,64,50,78,50,48,78,48,21,78,21,19,79,20,43,79,43,42,79,42,47,79,47,48,79,48,21,79,21,20,80,22,27,80,27,28,80,28,61,80,61,60,80,60,23,80,23,22,81,22,27,81,27,29,81,29,71,81,71,70,81,70,24,81,24,22,82,23,60,82,60,58,82,58,36,82,36,34,82,34,25,82,25,23,83,24,70,83,70,68,83,68,41,83,41,39,83,39,26,83,26,24,84,25,34,84,34,32,84,32,37,84,37,39,84,39,26,84,26,25,85,28,61,85,61,59,85,59,46,85,46,44,85,44,30,85,30,28,86,29,71,86,71,69,86,69,51,86,51,49,86,49,31,86,31,29,87,30,44,87,44,42,87,42,47,87,47,49,87,49,31,87,31,30,88,35,53,88,53,52,88,52,57,88,57,58,88,58,36,88,36,35,89,40,63,89,63,62,89,62,67,89,67,68,89,68,41,89,41,40,90,45,54,90,54,52,90,52,57,90,57,59,90,59,46,90,46,45,91,50,64,91,64,62,91,62,67,91,67,69,91,69,51,91,51,50 ]
}
