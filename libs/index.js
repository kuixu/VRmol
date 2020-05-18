/**
 * Created by Kui Xu on 2017/8/7.
 * mail: xukui.cs@gmail.com
 */
if (document.getElementById) {
  document.write('<style type="text/css">\n');
  document.write('.submenu{display: none;}\n');
  document.write('</style>\n');
  //switchMenu("mainStructure");
}

function switchRightMenu(obj) {
  if (document.getElementById) {
    var el = document.getElementById(obj);
    var ar = document.getElementById("rightmenu").getElementsByTagName("span"); //DynamicDrive.com change
    if (el.style.display != "block") {
      for (var i = 0; i < ar.length; i++) {
        if (ar[i].className == "rightsubmenu")
          ar[i].style.display = "none";
      }
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  }
}

function switchMenu(obj) {
  if (document.getElementById) {
    var el = document.getElementById(obj);
    var ar = document.getElementById("topmenu").getElementsByTagName("span"); //DynamicDrive.com change
    if (el.style.display != "block") {
      for (var i = 0; i < ar.length; i++) {
        if (ar[i].className == "submenu")
          ar[i].style.display = "none";
      }
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  }
}
// var worker = new Worker('libs/fileutils/export.js');
// (function(){

// })()

function show_panel(panelShow){

  if (panelShow == PDB.config.panelOpen) {
    var panels = document.getElementsByClassName("panel");
    panels.searchDiv.style.display = 'block';
    panels.topmenu.style.display = 'block';
    // panels.info.style.display = 'block';
    var small_menu = document.getElementsByClassName("small_menu");
    if (screen.width < 960 ) {
      small_menu.small_menu.style.display = 'block';
    }
    else{
      small_menu.small_menu.style.display = 'none';
    }
    
  } else if (panelShow == PDB.config.panelClose) {
    var panels = document.getElementsByClassName("panel");
    panels.searchDiv.style.display = 'none';
    panels.topmenu.style.display = 'none';
    // panels.info.style.display = 'none';
    var small_menu = document.getElementsByClassName("small_menu");
    small_menu.small_menu.style.display = 'block';
    
  }
}

var vrModelBtn = document.getElementById("vrMode");
vrModelBtn.style.display = "block";
if (PDB.mode === PDB.MODE_VR){
  vrModelBtn.style.display = "none";
}
var btn_small_menu = document.getElementById("small_menu");

btn_small_menu.addEventListener('click', function() {
  if (PDB.panelShow == PDB.config.panelOpen) {
    PDB.panelShow = PDB.config.panelClose;
    show_panel(PDB.panelShow);
  }else{
    PDB.panelShow = PDB.config.panelOpen;
    show_panel(PDB.panelShow);
  }

  
});

if (screen.width < 960) {
  PDB.panelShow = PDB.config.panelClose;
}

show_panel(PDB.panelShow);

// =====================
// parse api parameter
// =====================

var kv = {};
if (location.search) {
  var q = location.search.slice(1).split('&');
  q.forEach(function(k_v) {
    var k_v_array = k_v.split('=');
    kv[k_v_array[0]] = decodeURIComponent(k_v_array[1]);
  });
  var surfaceOpc, surfaceType, surfaceMode, showSurface, colorMode, rotation, travel, tcga, vmode,fragment;
  w3m_isset(kv.id) ? PDB.pdbId = kv.id : void(0);
  w3m_isset(kv.pdburl) ? PDB.pdburl = kv.pdburl : void(0);
  w3m_isset(kv.panelShow) ? PDB.panelShow = parseInt(kv.panelShow) : void(0);
  w3m_isset(kv.mainMode) ? PDB.config.mainMode = parseInt(kv.mainMode) : void(0);
  w3m_isset(kv.rotation) ? rotation = parseInt(kv.rotation) : void(0);


  w3m_isset(kv.showSurface) ? showSurface = parseInt(kv.showSurface) : void(0);
  w3m_isset(kv.surfaceType) ? surfaceType = parseInt(kv.surfaceType) : void(0);
  w3m_isset(kv.surfaceOpc) ? surfaceOpc = Number(kv.surfaceOpc) : void(0);

  w3m_isset(kv.colorMode) ? colorMode = parseInt(kv.colorMode) : void(0);

  w3m_isset(kv.travel) ? travel = parseInt(kv.travel) : void(0);

  w3m_isset(kv.tcga) ? tcga = parseInt(kv.tcga) : void(0);

  w3m_isset(kv.vmode) ? vmode = kv.vmode : "vr";
  w3m_isset(kv.fragment) ? fragment = kv.fragment : "nofragment";
  if(fragment){
	 //fragment = fragment.replace(/\]/g,'}');
	  //fragment = fragment.replace(/\[/g,'{');
	  fragment = eval("(["+fragment+"])");
	  //console.log(fragment); 
  }

  
  if (screen.width < 960) {
    PDB.panelShow = PDB.config.panelClose;
  }

  
  show_panel(PDB.panelShow);

  if (surfaceOpc && !isNaN(surfaceOpc)) {
    PDB.SURFACE_OPACITY = surfaceOpc;
  }
  if (surfaceType && !isNaN(surfaceType)) {
    PDB.SURFACE_TYPE = surfaceType;
  }
  if (!isNaN(showSurface)) {
    PDB.isShowSurface = showSurface;
  }


  if (rotation == 0) {
    PDB.ROTATION_DIRECTION = 0;
    PDB.ROTATION_START_FLAG = true;
  } else if (rotation == 1) {
    PDB.ROTATION_DIRECTION = 1;
    PDB.ROTATION_START_FLAG = true;
  }
  if (travel == 1) {
    PDB.TravelMode = true;
  }

  if (tcga == 1) {
    var url = PDB.MUTATION_URL + "&pdbid=" + PDB.pdbId.toUpperCase() + "&ds=tcga";
    PDB.tool.ajax.get(url, function(text) {
      PDB.controller.clear(4, undefined);
      PDB.painter.showMutation(text);
    })
  }

  
 
  switch (vmode) {
    case "desktop":
      PDB.mode = PDB.MODE_THREE;
      break;
	case "nonvr":
      PDB.mode = PDB.MODE_THREE;
      break;  
    case "vr":
      var vrModelBtn = document.getElementById("vrMode");
      vrModelBtn.style.display = "none";
      PDB.mode = PDB.MODE_VR;
      break;
    case "travel":
      PDB.mode = PDB.MODE_TRAVEL_THREE;
      PDB.TravelMode = true;
      break;
    case "travelvr":
      PDB.mode = PDB.MODE_VR;
      PDB.TravelMode = true;
      break;
  }


  /*if ( w3m_isset(kv.config) ) {
   var cf = JSON.parse(kv.config);
   for ( var i in cf ) {
   w3m.config[i] = cf[i];
   }
   }
   if ( w3m_isset(kv.color) ) {
   var rgb = JSON.parse(kv.color);
   for ( var i in rgb ) {
   w3m.rgb[i] = rgb[i];
   }
   }*/
}
//	PDB.mode=PDB.MODE_VR;
PDB.controller.init();
PDB.CHANGESTYLE = PDB.DRAWSTYLE_FRAGMENT;
PDB.CONFIG = PDB.CONFIG_HIGH;
PDB.controller.requestRemote(PDB.pdbId);

PDB.controller.switchColorBymode("607");
//PDB.trigger = PDB.TRIGGER_EVENT_DRAG;
//PDB.selection_mode= PDB.SELECTION_DRUG;
//
if (!isNaN(colorMode)) {
    PDB.controller.switchColorBymode(colorMode);
}
//set default voice language
if (voiceControl !== undefined) {
  voiceControl.language = "English";
}

var rotation_task_id = 0;

function endRecord() {
  p = endRecording();
  p.then(
    result => voiceOperation(result), // shows "done!" after 1 second
    error => alert(error) // doesn't run
  );
  // console.log(a)
}

//voice to operate structure
function voiceOperation(code) {
  switch (parseInt(code)) {
    case 11:
      window.location.href = "index.html?vmode=nonvr";
      break;
    case 12:
      window.location.href = "index.html?vmode=vr";
      var vrModelBtn = document.getElementById("vrMode");
      vrModelBtn.style.display = "none";
      break;
    case 13:
      PDB.CHANGESTYLE = 6;
      PDB.render.clearStructure();
      PDB.render.changeToThreeMode(PDB.MODE_TRAVEL_THREE, true);
      PDB.painter.showResidueByThreeTravel();
      break;
    case 20:
      PDB.render.clear(5);
      PDB.config.mainMode = PDB.LINE;
      PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
      break;
    case 21:
      PDB.render.clear(5);
      PDB.config.mainMode = PDB.DOT;
      PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
      break;
    case 22:
      PDB.render.clear(5);
      PDB.config.mainMode = PDB.BACKBONE;
      PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
      break;
    case 23:
      PDB.render.clear(5);
      PDB.config.mainMode = PDB.SPHERE;
      PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
      break;
    case 24:
      PDB.render.clear(5);
      PDB.config.mainMode = PDB.STICK;
      PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
      break;
    case 25:
      PDB.render.clear(5);
      PDB.config.mainMode = PDB.BALL_AND_ROD;
      PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
      break;
    case 26:
      PDB.render.clear(5);
      PDB.config.mainMode = PDB.TUBE;
      PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
      break;
    case 27:
      PDB.render.clear(5);
      PDB.config.mainMode = PDB.CARTOON_SSE;
      PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
      break;
    case 28:
      PDB.render.hideStructure();
      break;
    case 29:
      PDB.render.showStructure();
      break;
    case 31:
      PDB.render.clear(5);
      PDB.config.hetMode = PDB.HET_LINE;
      PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
      break;
    case 32:
      PDB.render.clear(5);
      PDB.config.hetMode = PDB.HET_SPHERE;
      PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
      break;
    case 33:
      PDB.render.clear(5);
      PDB.config.hetMode = PDB.HET_STICK;
      PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
      break;
    case 34:
      PDB.render.clear(5);
      PDB.config.hetMode = PDB.HET_BALL_ROD;
      PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
      break;
    case 35:
      PDB.GROUP[PDB.GROUP_HET].visible = false;
      break;
    case 36:
      PDB.GROUP[PDB.GROUP_HET].visible = true;
      break;
    case 41:
      PDB.isShowWater = true;
      break;
    case 42:
      PDB.isShowWater = false;
      break;
    case 43:
      PDB.render.clearGroupIndex(PDB.GROUP_BOND);
      PDB.painter.showBond(PDB.BOND_TYPE_HBOND);
      break;
    case 44:
      PDB.render.clearGroupIndex(PDB.GROUP_BOND);
      break;
    case 45:
      break;
    case 46:
      break;
    case 51:
      PDB.CHANGESTYLE = 0; 
      PDB.SURFACE_OPACITY = 0.5;
      PDB.SURFACE_WIREFRAME = false;
      PDB.controller.refreshSurface(PDB.config.surfaceMode, 2, PDB.SURFACE_OPACITY, PDB.SURFACE_WIREFRAME);
      break;
    case 52:
      PDB.CHANGESTYLE = 0; 
      PDB.SURFACE_OPACITY = 1;
      PDB.SURFACE_WIREFRAME = true;
      PDB.controller.refreshSurface(PDB.config.surfaceMode, 2, 0.5, PDB.SURFACE_WIREFRAME);
      break;
    case 53:
      PDB.render.clear(3);
      PDB.render.clear(5);
      PDB.CHANGESTYLE = 0; 
      PDB.GROUP[PDB.GROUP_SURFACE].visible = false;
      break;
    case 54:
      PDB.CHANGESTYLE = 0;
      PDB.SURFACE_OPACITY = 1;
      PDB.SURFACE_WIREFRAME = false;
      PDB.controller.refreshSurface(PDB.config.surfaceMode, 2, PDB.SURFACE_OPACITY, PDB.SURFACE_WIREFRAME);
      PDB.GROUP[PDB.GROUP_SURFACE].visible = true;
      break;
    case 61:
      PDB.controller.switchColorBymode(601);
      break;
    case 62:
      PDB.controller.switchColorBymode(602);
      break;
    case 63:
      PDB.controller.switchColorBymode(603);
      break;
    case 64:
      PDB.controller.switchColorBymode(604);
      break;
    case 65:
      PDB.controller.switchColorBymode(605);
      break;
    case 66:
      PDB.controller.switchColorBymode(606);
      break;
    case 67:
      PDB.controller.switchColorBymode(607);
      break;
    case 68:
      PDB.controller.switchColorBymode(608);
      break;
    case 69:
      PDB.controller.switchColorBymode(609);
      break;
    case 73:
      PDB.controller.startRotation(2, 1);
      break;
    case 741:
      PDB.controller.startRotation(1, PDB.ROTATION_DIRECTION);
      break;
    case 742:
      PDB.controller.startRotation(3, PDB.ROTATION_DIRECTION);
      break;
    case 743:
      PDB.controller.startRotation(2, PDB.ROTATION_DIRECTION);
    case 751:
      PDB.controller.startRotation(PDB.ROTATION_AXIS, 2);
      break;
    case 752:
      PDB.controller.startRotation(PDB.ROTATION_AXIS, 1);
      break;
    case 701:
      PDB.controller.cancelRotation();
      break;
    case 76:
      PDB.controller.startMotion(3, 1);
      break;
    case 771:
      PDB.controller.startMotion(1, PDB.MOVE_DIRECTION);
      break;
    case 772:
      PDB.controller.startMotion(2, PDB.MOVE_DIRECTION);
      break;
    case 773:
      PDB.controller.startMotion(3, PDB.MOVE_DIRECTION);
      break;
    case 781:
      PDB.controller.startMotion(PDB.MOVE_AXIS, 1);
      break;
    case 782:
      PDB.controller.startMotion(PDB.MOVE_AXIS, 2);
      break;
    case 702:
      PDB.controller.cancelMotion();
      break;
  }
}
