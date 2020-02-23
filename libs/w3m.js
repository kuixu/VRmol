var w3m_require = function(filename) {
  var type = filename.split('.').pop(),
    url;
  // find url
  for (var i = 0, l = document.scripts.length; i < l; i++) {
    var script = document.scripts[i];
    if (script.type != 'text/javascript') {
      continue;
    }
    if (script.src.indexOf('web3dmol.js') > -1) {
      url = script.src.replace('web3dmol.js', filename);
      break;
    }
  }
  // insert into document
  if (type == 'js') {
    var ele = document.createElement('script');
    ele.type = "text/javascript";
    ele.src = url;
    document.getElementsByTagName('body')[0].appendChild(ele);
  } else if (type == 'css') {
    var ele = document.createElement('link');
    ele.rel = "stylesheet";
    ele.type = "text/css";
    ele.href = url;
    document.getElementsByTagName('head')[0].appendChild(ele);
  }
};

/* Global */
var w3m, canvas, gl;

w3m = {
  mol: {},
  /* Geometry */
  // Main
  fillqueue_main: [],
  vertex_main_point: [],
  vertex_main_line: [],
  vertex_main_triangle: [],
  vertex_main_line_strip: [],
  vertex_main_triangle_strip: [],
  vertex_index: [],
  index: [],
  drawqueue_main: [],
  drawqueue_index: [],
  breakpoint_line_strip: [],
  breakpoint_triangle_strip: [],
  // Het
  fillqueue_het: [],
  vertex_het_point: [],
  vertex_het_line: [],
  vertex_het_triangle: [],
  drawqueue_het: [],
  // Extra
  vertex_ext_line: [],
  vertex_ext_triangle: [],
  drawqueue_extra: [],
  /* Label */
  fillqueue_label: [],
  vertex_label: [],
  drawqueue_label: [],

  //ranx
  CLENGTH: 0,


  /* const */
  // Switch
  OFF: 0,
  ON: 1,
  PASS: 2,
  // OPERATION
  ADD: 11,
  REMOVE: 12,
  TOGGLE: 13,
  // Graphics Mode ( gmode )
  // Fill Mode ( fmode )
  HIDE: 100,
  DOT: 101,
  LINE: 102,
  BACKBONE: 103,
  TUBE: 104,
  CARTOON: 105,
  PUTTY: 106,
  CUBE: 107,
  STRIP: 108,
  RIBBON: 109,
  RAILWAY: 110,
  ARROW: 111,
  CYLINDER: 112,
  STICK: 113,
  SPHERE: 114,
  BALL_AND_ROD: 115,
  // SS
  HELIX: 150,
  HELIX_HEAD: 1500,
  HELIX_BODY: 1501,
  HELIX_FOOT: 1502,
  SHEET: 151,
  SHEET_HEAD: 1510,
  SHEET_BODY: 1511,
  SHEET_FOOT: 1512,
  LOOP: 152,
  LOOP_HEAD: 1520,
  LOOP_BODY: 1521,
  LOOP_FOOT: 1522,
  // Chain Type
  CHAIN_AA: 301,
  CHAIN_NA: 302,
  CHAIN_UNK: 303,
  CHAIN_HET: 304,
  // Atom Type
  ATOM_MAIN: 1,
  ATOM_HET: 2,
  ATOM_UNK: 3,
  // Atom Info
  ATOM_INFO_ATOM_TYPE: 0,
  ATOM_INFO_ATOM_ID: 1,
  ATOM_INFO_ATOM_NAME: 2,
  ATOM_INFO_RESIDUE_NAME: 3,
  ATOM_INFO_CHAIN_ID: 4,
  ATOM_INFO_RESIDUE_ID: 5,
  ATOM_INFO_XYZ: 6,
  ATOM_INFO_OCCUPANCY: 7,
  ATOM_INFO_B_FACTOR: 8,
  ATOM_INFO_ELEMENT: 9,
  // END MODE
  END_XX: 500,
  END_OO: 501,
  END_SS: 502,
  END_XO: 503,
  END_OX: 504,
  END_SX: 505,
  END_XS: 506,
  END_OS: 507,
  END_SO: 508,
  // COLOR MODE
  COLOR_BY_ELEMENT: 601,
  COLOR_BY_RESIDUE: 602,
  COLOR_BY_SS: 603,
  COLOR_BY_CHAIN: 604,
  COLOR_BY_REP: 605,
  COLOR_BY_B_FACTOR: 606,
  COLOR_BY_SPECTRUM: 607,
  COLOR_BY_CHAIN_SPECTRUM: 608,
  COLOR_BY_HYDROPHOBICITY: 609,
  COLOR_BY_USER: 610,
  // FOG
  FOG_LINEAR: 1,
  FOG_EXPONENTIAL: 2,
  // LIGHT
  LIGHT_PARALLEL: 1,
  LIGHT_POINT: 2,
  // LINKAGE
  LINKAGE_MAIN: 1,
  LINKAGE_TEE: 2,
  LINKAGE_CROSS: 3,
  // CARTOON
  CARTOON_DEFAULT: 1,
  CARTOON_CUBE: 2,
  CARTOON_RIBBON: 3,
  CARTOON_RAILWAY: 4,
  // LABEL
  LABEL_AREA_NONE: 700,
  LABEL_AREA_ATOM: 701,
  LABEL_AREA_BACKBONE: 702,
  LABEL_AREA_RESIDUE: 703,
  LABEL_AREA_CHAIN: 704,
  LABEL_AREA_MOL: 705,

  LABEL_ATOM_NAME: 711,
  LABEL_ATOM_ID: 712,
  LABEL_ATOM_NAME_AND_ID: 713,
  LABEL_ELEMENT: 721,
  LABEL_ELEMENT_AND_ID: 722,
  LABEL_RESIDUE_NAME: 731,
  LABEL_RESIDUE_ID: 732,
  LABEL_RESIDUE_NAME_AND_ID: 733,
  LABEL_CHAIN_ID: 741,
  LABEL_CHAIN_AND_RESIDUE: 742,
  LABEL_CHAIN_AND_RESIDUE_ID: 743,
  LABEL_MIX: 744,
  LABEL_OCCUPANCY: 751,
  LABEL_B_FACTOR: 752,
  LABEL_VDW_RADIUS: 753,
  // UI
  UI_RADIO: 1,
  UI_CHECKBOX: 2,
  UI_FLOAT: 3,
  UI_INT: 4,
  UI_VECTOR: 5,
  UI_COLOR: 6,
  UI_COLOR_INDEX: 7,
  UI_SELECT: 8,
  UI_BANNER_START: 11,
  UI_BANNER_STOP: 12,
  UI_BUTTON: 13,
  UI_BUTTON_BLUE: 14,
  UI_BUTTON_GREEN: 15,
  UI_BUTTON_RED: 16,
  UI_REP_MODE_MAIN: 21,
  UI_REP_MODE_HET: 22,
  UI_COLOR_MODE_MAIN: 23,
  UI_COLOR_MODE_HET: 24,
  UI_LABEL_AREA_MAIN: 25,
  UI_LABEL_AREA_HET: 26,
  UI_LABEL_CONTENT_MAIN: 27,
  UI_LABEL_CONTENT_HET: 28,
  // INNERFACE
  INNERFACE_VARY: 1000,
  INNERFACE_TURNOVER: 1001,
  INNERFACE_NON_TURNOVER: 1002,
  // MEASURE
  MEASURE_DISTANCE: 1101,
  MEASURE_VECTOR_ANGLE: 1102,
  MEASURE_DIHEDRAL_ANGLE: 1103,
  MEASURE_TRIANGLE_AREA: 1104
};

/* Config */
w3m.config = {
  // rep
  rep_mode_main: w3m.TUBE,
  rep_mode_het: w3m.TUBE,
  // color
  color_mode_main: w3m.COLOR_BY_ELEMENT,
  color_mode_het: w3m.COLOR_BY_ELEMENT,
  // label
  label_area_main: w3m.LABEL_AREA_NONE,
  label_area_het: w3m.LABEL_AREA_NONE,
  label_content_main: w3m.LABEL_ATOM_NAME,
  label_content_het: w3m.LABEL_ATOM_NAME,
  label_color: [1.0, 1.0, 1.0],
  label_size: 14,
  label_font: "'Source Code Pro',Consolas,monospace",
  // light
  light_enable: w3m.ON,
  light_mode: w3m.LIGHT_PARALLEL,
  light_direction: [0.0, 0.0, -1.0],
  light_position: [10, 10, 10],
  light_ambient: [1.0, 1.0, 1.0],
  light_color: [1.0, 1.0, 1.0],
  // fog
  fog_enable: w3m.ON,
  fog_mode: w3m.FOG_LINEAR,
  fog_color: [0.0, 0.0, 0.0],
  fog_start: 5.0,
  fog_stop: 15.0,
  fog_density: 0.2,
  // material
  material_ambient: 0.4,
  material_diffuse: 0.8,
  material_specular: 1.0,
  material_shininess: 60,
  // geometry
  geom_mol_size: 5.6,
  geom_dot_size: 3.0,
  geom_dot_as_cross: 0,
  geom_cross_radius: 0.15,
  geom_dash_gap: 0.2,
  geom_backbone_as_tube: 1,
  geom_tube_smooth: 1,
  geom_tube_radius: 0.2,
  geom_tube_round_end: 1,
  geom_putty_radius_min: 0.38,
  geom_putty_radius_max: 1.2,
  geom_stick_radius: 0.25,
  geom_stick_round_end: 1,
  geom_helix_mode: w3m.CUBE,
  geom_helix_side_differ: 0,
  geom_helix_side_color: 11,
  geom_helix_inner_differ: 0,
  geom_helix_inner_color: 12,
  geom_sheet_mode: w3m.ARROW,
  geom_sheet_flat: 1,
  geom_sheet_side_differ: 0,
  geom_sheet_side_color: 13,
  geom_loop_mode: w3m.TUBE,
  geom_cube_width: 2.0,
  geom_cube_height: 0.4,
  geom_cube_side_differ: 0,
  geom_cube_side_color: 14,
  geom_strip_width: 2.0,
  geom_strip_height: 0.3,
  geom_strip_side_differ: 0,
  geom_strip_side_color: 15,
  geom_ribbon_width: 2.5,
  geom_ribbon_height: 0.42,
  geom_ribbon_side_height: 0.1,
  geom_ribbon_side_differ: 0,
  geom_ribbon_side_color: 16,
  geom_railway_width: 2.0,
  geom_railway_height: 0.24,
  geom_railway_radius: 0.16,
  geom_railway_end_close: 1,
  geom_railway_side_differ: 0,
  geom_railway_side_color: 17,
  geom_arrow_width: 2.0,
  geom_arrow_height: 0.4,
  geom_arrowhead_lower: 3.6,
  geom_arrowhead_upper: 0.4,
  geom_arrow_side_differ: 0,
  geom_arrow_side_color: 18,
  geom_cylinder_radius: 1.6,
  geom_cylinder_round_end: 0,
  geom_cylinder_end_differ: 0,
  geom_cylinder_end_color: 19,
  geom_sphere_radius: 0.25,
  geom_ball_radius: 0.25,
  geom_rod_radius: 0.08,
  // smooth
  smooth_segment: 19,
  smooth_curvature: 0.8,
  // segment ( const )
  geom_tube_segment: 12,
  geom_stick_theta: Math.PI / 12,
  geom_strip_segment: 4,
  geom_ribbon_segment: 4,
  geom_railway_segment: 4,
  geom_cylinder_segment: 20,
  // Animation
  rotate_speed: 0.01,
  pan_speed: 0.01,
  zoom_speed: 1.05,
  animation_speed: 0.15,
  // color
  color_hide: 0,
  color_default: 1,
  color_measure: 2,
  // unit
  unit_vertex_geometry: 10,
  unit_vertex_label: 7,
  // misc
  bg: [0.0, 0.0, 0.0, 1.0],
  show_measurement: 1,
  measure_line_color: 2,
  measure_angle_in_radian: 0,
  label_ball_and_rod: 1,
  show_ssbond: 0,
  show_cell_unit: 0,
  remove_water_mol: 0,
  // method
  init: function(show_widget, user_config, user_color) {
    // w3m.color
    for (var i in w3m.color) {
      for (var ii in w3m.color[i]) {
        this['color_' + i + '_' + ii] = w3m.color[i][ii];
      }
    }
    // save default
    w3m.tool.saveConfigToDefault();
    // recover from local
    localStorage.config ? w3m.tool.recoverConfigFromLocalStorage() : void(0);
    // recover from user
    w3m.tool.recoverConfigFromUser(show_widget, user_config, user_color);
    // recover from url
    w3m.tool.recoverConfigFromURL();
  }
};


w3m.ajax = (function() {
  var io = new XMLHttpRequest(),
    id = '',
    url = '',
    url_index = 0,
    callback = null;
  drug = false;
  var last = ".pdb";
  //io.timeout = 180000; // timeout ms
  io.onprogress = function(e) {
	// PDB.tool.showSegmentholder(true,'NOT FOUND : Fail to load PDF file !');	
	// if (e.lengthComputable) {
  // PDB.tool.setProgressBar(e.loaded, e.total);
  
  var loaded = PDB.tool.toHumanByte(e.loaded);
  if(drug == false){
	PDB.tool.showSegmentholder(true,"Loading file " + loaded );		
	}
  
  // PDB.tool.printProgress(type + " map: " + mapid + " loaded, size(" + loaded + "/" + total + ") " + ratio);
  // console.log(e.loaded);
// }
  };
  io.onload = function() {
    if (this.status == 200) {
		var responseText = io.responseText;
		if(last == '.cif'){
			responseText = loadCIF(responseText, 1);
		}
		
      callback(responseText);
    } else {
      if (w3m_isset(PDB.remoteUrl[++url_index])) {
        this.get(id, callback);
      } else {
        url_index = 0;
		 
        PDB.tool.printProgress('pdb file not found!');
		PDB.tool.showSegmentholder(false);		
		PDB.tool.showSegmentholder(true,'NOT FOUND : Fail to load PDF file !');		
		setTimeout(function(e) {
			PDB.tool.showSegmentholder(false);			
		},5000)
		
		
        // var info = document.getElementById('info');
        // console.log(info);
        // info.style.display = 'block';
        // info.innerText='pdb file not found';
      }
    }
  };
  io.onabort = function() {
      url_index = 0;
    },
    io.ontimeout = function() {
      if (w3m_isset(PDB.remoteUrl[++url_index])) {
        if (drug) {
          this.getDrug(id, callback);
        } else {
          this.get(id, callback);
        }
      } else {
        url_index = 0;
      }
    },
    io.onerror = function(e) {
      url_index++;
      this.get(id, callback);
    },
    io.get = function(mol_id, fn) {
		// console.log("-------------id.get()-----------------");
		// console.log("mol_id:");
		// console.log(mol_id);
      drug = false;
	  if (mol_id.indexOf("http://") != -1) {
		  //debugger;
        url = mol_id;
      } else if (mol_id.indexOf("https://") != -1) {
        url = mol_id;
		//debugger;
      } else{
		  if(url_index > 0 && last == '.pdb'){
			  url_index--;
			  last = '.cif';
		  }else{
        if (url_index > 0 && last != '.cif') {
          url_index--;
        }
			  last = '.pdb';
		  }
        url = PDB.remoteUrl[url_index] + mol_id + last;
      }
	  console.log(url);
      id = mol_id;
      callback = fn;
	  this.open('GET', url, true);
      this.send();
      
    };
  io.getResidue = function(resName, fn) {
    resName = resName.toUpperCase();
    url = SERVERURL + "/data/amino_acid/" + resName + '.pdb';
    callback = fn;
    drug = false;
    this.open('GET', url, true);
    this.send();
  };
  io.getDrug = function(mol_id, dbname, fn) {
    id = mol_id;
    url = PDB.DRUBDB_URL[dbname] + mol_id + '.pdb';
    callback = fn;
    drug = true;
    this.open('GET', url, true);
    this.send();
  };
  io.getDocking = function(path, dockingName, fn) {
    id = dockingName;
    url = path + "/" + dockingName;
    callback = fn;
    drug = true;
    this.open('GET', url, true);
    this.send();
  };
  return io;
})();




/* Global */
w3m.global = {
  container: null,
  mol: null,
  rotate_x: 0,
  rotate_y: 0,
  rotate_z: 0,
  cycle: null,
  // limit
  limit: {
    x: [],
    y: [],
    z: [],
    b_factor: [0.0, 0.0],
    b_factor_backbone: [0.0, 0.0]
  },
  drugLimit:{
	x: [],
    y: [],
    z: []  
  },
  average: {
    b_factor: [0, 0],
    b_factor_backbone: [0, 0]
  },
  default: {
    config: {},
    rgb: {}
  },
  // label
  label_letter_width: 10, // pixel
  label_letter_height: 20,
  label_letter_size_x: 0.01464, // normalized to webgl
  label_letter_size_y: 0.06289,
  // fragment
  fragment: [],
  // measure
  measure: [],
  measuring: 0,
  measuring_handle: null,
  picking: 0,
  picking_handle: null,
  picked_atom: null,
  // drop
  drop_counter: 0,
  // widget
  widget: 1
};

/* Tool */
w3m.tool = {
  /* Pipeline */
  // clear -> plugin -> fill ( main -> het -> ext -> label ) -> buffer -> adjust -> draw
  pipeline: function() {
    this.clear();
    this.plugin();
    this.fill();
    this.buffer();
    this.recycle();
  },
  pipelineInit: function() {
    this.clear();
    this.plugin();
    this.fill();
    this.buffer();
    this.recycle();
  },
  pipelineGeometry: function() {
    this.clearMain();
    this.clearHet();
    this.clearExt();
    this.plugin();
    this.fillMain();
    this.fillHet();
    this.fillExt();
    this.bufferMain();
    this.bufferHet();
    this.bufferExt();
    this.recycle();
  },
  pipelineMain: function() {
    this.clearMain();
    this.clearExt();
    this.plugin();
    this.fillMain();
    this.fillExt();
    this.bufferMain();
    this.bufferExt();
    this.recycle();
  },
  pipelineHet: function() {
    this.clearHet();
    this.clearExt();
    this.plugin();
    this.fillHet();
    this.fillExt();
    this.bufferHet();
    this.bufferExt();
    this.recycle();
  },
  pipelineLabel: function() {
    this.clearExt();
    this.clearLabel();
    this.plugin();
    this.fillExt();
    this.fillLabel();
    this.bufferExt();
    this.bufferLabel();
    this.draw();
  },
  pipelineExt: function() {
    this.clearExt();
    this.clearLabel();
    this.plugin();
    this.fillExt();
    this.fillLabel();
    this.bufferExt();
    this.bufferLabel();
    this.recycle();
  },

  clear: function() {
    this.clearMain();
    this.clearHet();
    this.clearExt();
    this.clearLabel();
  },
  clearMain: function() {
    w3m.fillqueue_main = [];
    w3m.vertex_main_point = [];
    w3m.vertex_main_line = [];
    w3m.vertex_main_triangle = [];
    w3m.vertex_main_line_strip = [];
    w3m.vertex_main_triangle_strip = [];
    w3m.vertex_index = [];
    w3m.index = [];
    w3m.drawqueue_main = [];
    w3m.drawqueue_index = [];
    w3m.breakpoint_line_strip = [];
    w3m.breakpoint_triangle_strip = [];
  },
  clearHet: function() {
    w3m.fillqueue_het = [];
    w3m.vertex_het_point = [];
    w3m.vertex_het_line = [];
    w3m.vertex_het_triangle = [];
    w3m.drawqueue_het = [];
  },
  clearExt: function() {
    w3m.vertex_ext_line = [];
    w3m.vertex_ext_triangle = [];
    w3m.drawqueue_ext = [];
  },
  clearLabel: function() {
    w3m.fillqueue_label = [];
    w3m.vertex_label = [];
    w3m.drawqueue_label = [];
  },
  /* Plugin Methods */
  plugin: function() {
    // rep -> rep_real
    // label_area -> label_area_real
    for (var i in w3m.mol) {
      var mol = w3m.mol[i],
        hide = mol.hide,
        hide_enable = false;
      for (var i in hide) {
        if (hide[i].length > 0) {
          hide_enable = true;
          break;
        }
      }
      for (var i in mol.residue) {
        if (hide_enable) {
          var rep_real = mol.rep_real[i] = [];
          label_area_real = mol.label_area_real[i] = [],
            rep = mol.rep[i],
            label_area = mol.label_area[i];
          mol.residue[i].forEach(function(residue, residue_id) {
            if (hide[i].indexOf(residue_id) >= 0) {
              rep_real[residue_id] = w3m.HIDE;
              label_area_real[residue_id] = w3m.LABEL_AREA_NONE;
            } else {
              rep_real[residue_id] = rep[residue_id];
              label_area_real[residue_id] = label_area[residue_id];
            }
          })
        } else {
          mol.rep_real[i] = mol.rep[i];
          mol.label_area_real[i] = mol.label_area[i];
        }
      }
    }
    // color -> color_real
    for (var i in w3m.mol) {
      var mol = w3m.mol[i],
        highlight = mol.highlight,
        highlight_enable = false;
      for (var i in highlight) {
        if (highlight[i].length > 0) {
          highlight_enable = true;
          break;
        }
      }
      mol.atom.main.forEach(function(atom, atom_id) {
        var chain_id = atom[4],
          residue_id = atom[5];
        mol.color_real[atom_id] = highlight_enable && highlight[chain_id].indexOf(residue_id) < 0 ?
          1 : mol.color.main[atom_id];
      });
      mol.color.het.forEach(function(color_id, atom_id) {
        mol.color_real[atom_id] = highlight_enable ? 1 : color_id;
      });
    }
  },
  /* Fill Methods */
  fill: function() {
    this.fillMain();
    this.fillHet();
    this.fillExt();
    this.fillLabel();
  },
  fillMain: function() {
    var that = this;
    if (PDB.residue && PDB.residue != "") {
      this.mol2fillqueueMain(PDB.residue);
    } else {
      // mol -> fillqueue
      for (var i in w3m.mol) {
        this.mol2fillqueueMain(i);
      }
    }
    // fillqueue -> vertex
    w3m.fillqueue_main.forEach(function(q) {
      //console.log(q);
      switch (q[1]) {
        case w3m.DOT:
          that.fillMainAsDot(q[2], q[3], q[4], q[5]);
          break;
        case w3m.LINE:
          that.fillMainAsLine(q[2], q[3], q[4], q[5]);
          break;
        case w3m.BACKBONE:
          that.fillMainAsBackbone(q[2], q[3], q[4], q[5]);
          break;
        case w3m.TUBE:
          that.fillMainAsTube(q[2], q[3], q[4], q[5]);
          break;
        case w3m.CARTOON:
          that.fillMainAsCartoon(q[2], q[3], q[4], q[5]);
          break;
        case w3m.PUTTY:
          that.fillMainAsPutty(q[2], q[3], q[4], q[5]);
          break;
        case w3m.CUBE:
          that.fillMainAsCube(q[2], q[3], q[4], q[5]);
          break;
        case w3m.STRIP:
          that.fillMainAsStrip(q[2], q[3], q[4], q[5]);
          break;
        case w3m.RIBBON:
          that.fillMainAsRibbon(q[2], q[3], q[4], q[5]);
          break;
        case w3m.RAILWAY:
          that.fillMainAsRailway(q[2], q[3], q[4], q[5]);
          break;
        case w3m.ARROW:
          that.fillMainAsArrow(q[2], q[3], q[4], q[5]);
          break;
        case w3m.STICK:
          that.fillMainAsStick(q[2], q[3], q[4], q[5]);
          break;
        case w3m.SPHERE:
          that.fillMainAsSphere(q[2], q[3], q[4], q[5]);
          break;
        case w3m.BALL_AND_ROD:
          that.fillResidueAsBallAndRod(q[2], q[3], q[4]);
          break;
        default:
          void(0);
      }
    });
    // vertex -> drawqueue
    //this.vertexMain2drawqueue();
    //this.index2drawqueue();
  },
  fillHet: function() {
    var that = this;
    // mol -> fillqueue
    for (var i in w3m.mol) {
      this.mol2fillqueueHet(i);
    }
    // fillqueue -> vertex
    w3m.fillqueue_het.forEach(function(q) {
      switch (q[1]) {
        case w3m.DOT:
          that.fillHetAsDot(q[2]);
          break;
          //case w3m.LINE         : that.fillHetAsLine       ( q[2] ); break;
        case w3m.STICK:
          that.fillHetAsStick(q[2]);
          break;
        case w3m.BALL_AND_ROD:
          that.fillHetAsBallAndRod(q[2]);
          break;
        case w3m.SPHERE:
          that.fillHetAsSphere(q[2]);
          break;
        default:
          void(0);
      }
    });
    // vertex -> drawqueue
    //this.vertexHet2drawqueue();
  },
  fillExt: function() {
    // ssbond
    if (w3m.config.show_ssbond) {
      for (var i in w3m.mol) {
        this.fillSSBond(i);
      }
    }
    // measure
    if (w3m.config.show_measurement) {
      this.fillMeasurement();
    }
    // cell unit
    if (w3m.config.show_cell_unit) {
      this.fillCellUnit();
    }
    // vertex -> drawqueue
    this.vertexExt2drawqueue();
  },
  fillLabel: function() {
    var that = this;
    // mol -> fillqueue
    for (var i in w3m.mol) {
      this.mol2fillqueueLabel(i);
    }
    // fillqueue -> vertex
    w3m.fillqueue_label.forEach(function(q) {
      if (q[0] == w3m.ATOM_MAIN) {
        switch (q[1]) {
          case w3m.LABEL_AREA_ATOM:
            that.labelMainAtom(q[3], q[4], q[5], q[6], q[2]);
            break;
          case w3m.LABEL_AREA_BACKBONE:
            that.labelMainBackbone(q[3], q[4], q[5], q[6], q[2]);
            break;
          case w3m.LABEL_AREA_RESIDUE:
            that.labelMainResidue(q[3], q[4], q[5], q[6], q[2]);
            break;
          case w3m.LABEL_AREA_RESIDUE_CENTER:
            that.labelMainResidueCenter(q[3], q[4], q[5], q[6], q[2]);
            break;
          case w3m.LABEL_AREA_CHAIN:
            that.labelMainChain(q[3], q[4], q[5], q[6], q[2]);
            break;
          case w3m.LABEL_AREA_MOL:
            that.labelMainMol(q[3]);
            break;
          default:
            void(0);
        }
      } else {
        switch (q[1]) {
          case w3m.LABEL_AREA_ATOM:
            that.labelHetAtom(q[3], q[4], q[2]);
            break;
          case w3m.LABEL_AREA_MOL:
            that.labelHetMol(q[3]);
            break;
          default:
            void(0);
        }
      }
    });
    // vertex -> drawqueue
    this.vertexLabel2drawqueue();
  },
  /* mol -> fillqueue*/
  mol2fillqueueMain: function(mol_id) {
    var mol = w3m.mol[mol_id],
      rep_default = w3m.config.rep_mode_main;
    // main
    for (var i in mol.rep_real) {
      var chain_id = i,
        part = w3m_split_by_difference(mol.rep_real[chain_id]);
      for (var ii = 0, ll = part.length; ii < ll; ii++) {
        var start = part[ii][0],
          stop = part[ii][1],
          rep = part[ii][2];
        if (rep == rep_default && [w3m.TUBE, w3m.PUTTY, w3m.CARTOON].indexOf(rep) >= 0) {
          ii != 0 && w3m.HIDE != part[ii - 1][2] && rep != part[ii - 1][2] ? start-- : void(0);
          ii != ll - 1 && w3m.HIDE != part[ii + 1][2] && rep != part[ii + 1][2] ? stop++ : void(0);
        }
        w3m.fillqueue_main.push([w3m.ATOM_MAIN, rep, mol_id, chain_id, start, stop]);
      }
    }
    // detail structure
    for (var chain_id in mol.residue_detail) {
      var residue_detail_array = mol.residue_detail[chain_id];
      residue_detail_array.forEach(function(residue_id) {
        w3m.fillqueue_main.push([w3m.ATOM_MAIN, w3m.BALL_AND_ROD, mol_id, chain_id, residue_id]);
      });
    }
  },
  mol2fillqueueHet: function(mol_id) {
    var mol = w3m.mol[mol_id];
    w3m.fillqueue_het.push([w3m.ATOM_HET, w3m.config.rep_mode_het, mol_id]);
  },
  mol2fillqueueLabel: function(mol_id) {
    var mol = w3m.mol[mol_id];
    // main
    for (var i in mol.label_area_real) {
      var chain_id = i,
        part = w3m_split_by_difference(mol.label_area_real[chain_id]);
      for (var ii in part) {
        var start = part[ii][0],
          stop = part[ii][1],
          label_area = part[ii][2],
          label_content = mol.label_content[chain_id][start];
        w3m.fillqueue_label.push([w3m.ATOM_MAIN, label_area, label_content, mol_id, chain_id, start, stop]);
      }
    }
    // detail structure
    if (w3m.config.label_ball_and_rod) {
      for (var chain_id in mol.residue_detail) {
        var residue_detail_array = mol.residue_detail[chain_id];
        residue_detail_array.forEach(function(residue_id) {
          w3m.fillqueue_label.push([w3m.ATOM_MAIN, w3m.LABEL_AREA_ATOM, w3m.LABEL_ATOM_NAME, mol_id, chain_id, residue_id, residue_id]);
          w3m.fillqueue_label.push([w3m.ATOM_MAIN, w3m.LABEL_AREA_RESIDUE_CENTER, w3m.LABEL_CHAIN_AND_RESIDUE, mol_id, chain_id, residue_id, residue_id]);
        });
      }
    }
    // het
    for (var i in mol.tree.het) {
      var chain_id = i;
      w3m.fillqueue_label.push([w3m.ATOM_HET, w3m.config.label_area_het, w3m.config.label_content_het, mol_id, chain_id]);
    }
  },
  /* point -> vertex */
  point2vertexIndex: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_index, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], pt[3] || [null, null, null])) : void(0);
  },
  point2vertexMainPoint: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_main_point, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], [null, null, null])) : void(0);
  },

  point2vertexMainLine: function(pt) {
    //w3m.vertex_main_line
    pt[2] ? Array.prototype.push.apply(w3m.vertex_main_line, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], [null, null, null])) : void(0);
  },
  point2vertexMainTriangle: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_main_triangle, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], pt[3] || [null, null, null])) : void(0);
  },
  point2vertexMainLineStrip: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_main_line_strip, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], [null, null, null])) : void(0);
  },
  point2vertexMainTriangleStrip: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_main_triangle_strip, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], pt[3] || [null, null, null])) : void(0);
  },
  point2vertexHetPoint: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_het_point, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], [null, null, null])) : void(0);
  },
  point2vertexHetLine: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_het_line, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], [null, null, null])) : void(0);
  },
  point2vertexHetTriangle: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_het_triangle, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], pt[3] || [null, null, null])) : void(0);
  },
  point2vertexExtLine: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_ext_line, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], [null, null, null])) : void(0);
  },
  point2vertexExtTriangle: function(pt) {
    pt[2] ? Array.prototype.push.apply(w3m.vertex_ext_triangle, [].concat(pt[0], pt[1], w3m.rgb[pt[2]], pt[3] || [null, null, null])) : void(0);
  },
  tripoint2ertexMainTriangle: function(p1, p2, p3) {
    w3m.tool.point2vertexMainTriangle(p1);
    w3m.tool.point2vertexMainTriangle(p2);
    w3m.tool.point2vertexMainTriangle(p3);
  },
  point2vertexLabel: function(pt) { // point : [ xyz, string ] +h$2  0 --- 1  , 2 -> 3 -> 1
    var xyz = pt[0], //                               | xyz |  , 2 -> 1 -> 0
      str = pt[1].toString(), //                         -h$2  2 --- 3
      len = str.length, //                               x    x+w
      w = w3m.global.label_letter_size_x,
      h$2 = w3m.global.label_letter_size_y / 2;
    for (var i = 0; i < len; i++) {
      var ch = str.charAt(i);
      if (ch == ' ') {
        continue;
      }
      var st_array = w3m.dict.label_st[ch],
        offset_x = (i - len / 2) * w;
      w3m.vertex_label.push(xyz[0], xyz[1], xyz[2], offset_x, -h$2, st_array[2][0], st_array[2][1]); // 0
      w3m.vertex_label.push(xyz[0], xyz[1], xyz[2], offset_x + w, -h$2, st_array[3][0], st_array[3][1]); // 1
      w3m.vertex_label.push(xyz[0], xyz[1], xyz[2], offset_x + w, h$2, st_array[1][0], st_array[1][1]); // 3
      w3m.vertex_label.push(xyz[0], xyz[1], xyz[2], offset_x, -h$2, st_array[2][0], st_array[2][1]); // 0
      w3m.vertex_label.push(xyz[0], xyz[1], xyz[2], offset_x + w, h$2, st_array[1][0], st_array[1][1]); // 3
      w3m.vertex_label.push(xyz[0], xyz[1], xyz[2], offset_x, h$2, st_array[0][0], st_array[0][1]); // 2
    }
  },
  /* vertex -> drawqueue */
  index2drawqueue: function() {
    w3m.index.length ?
      w3m.drawqueue_index.push([gl.TRIANGLES, 0, w3m.index.length]) : void(0);
  },
  vertexMain2drawqueue: function() {
    var offset = 0,
      count = 0,
      unit = w3m.config.unit_vertex_geometry;
    // Point
    count = parseInt(w3m.vertex_main_point.length / unit);
    if (count) {
      w3m.drawqueue_main.push([gl.POINTS, offset, count]);
      offset += count;
    }
    // Line
    count = parseInt(w3m.vertex_main_line.length / unit);
    if (count) {
      w3m.drawqueue_main.push([gl.LINES, offset, count]);
      offset += count;
    }
    // Triangle
    count = parseInt(w3m.vertex_main_triangle.length / unit);
    if (count) {
      w3m.drawqueue_main.push([gl.TRIANGLES, offset, count]);
      offset += count;
    }
    // Line Strip
    if (w3m.breakpoint_line_strip.length && w3m.vertex_main_line_strip.length) {
      var breakpoint = w3m_array_sort(w3m.breakpoint_line_strip),
        offset_loc = 0,
        count_loc = 0;
      breakpoint.forEach(function(bp) {
        count_loc = parseInt(bp / unit);
        if (count_loc > offset_loc) {
          w3m.drawqueue_main.push([gl.LINE_STRIP, offset + offset_loc, count_loc - offset_loc]);
          offset_loc = count_loc;
        }
      });
    }
    // Triangle Strip
    if (w3m.breakpoint_triangle_strip.length && w3m.vertex_main_triangle_strip.length) {
      var breakpoint = w3m_array_sort(w3m.breakpoint_triangle_strip),
        offset_loc = 0,
        count_loc = 0;
      breakpoint.forEach(function(bp) {
        count_loc = parseInt(bp / unit);
        if (count_loc > offset_loc) {
          w3m.drawqueue_main.push([gl.TRIANGLE_STRIP, offset + offset_loc, count_loc - offset_loc]);
          offset_loc = count_loc;
        }
      });
    }
  },
  vertexHet2drawqueue: function() {
    var offset = 0,
      count = 0,
      unit = w3m.config.unit_vertex_geometry;
    // Point
    count = parseInt(w3m.vertex_het_point.length / unit);
    if (count) {
      w3m.drawqueue_het.push([gl.POINTS, offset, count]);
      offset += count;
    }
    // Line
    count = parseInt(w3m.vertex_het_line.length / unit);
    if (count) {
      w3m.drawqueue_het.push([gl.LINES, offset, count]);
      offset += count;
    }
    // Triangle
    count = parseInt(w3m.vertex_het_triangle.length / unit);
    if (count) {
      w3m.drawqueue_het.push([gl.TRIANGLES, offset, count]);
      offset += count;
    }
  },
  vertexExt2drawqueue: function() {
    var offset = 0,
      count = 0,
      unit = w3m.config.unit_vertex_geometry;
    // Line
    count = parseInt(w3m.vertex_ext_line.length / unit);
    if (count) {
      w3m.drawqueue_ext.push([gl.LINES, offset, count]);
      offset += count;
    }
    // Triangle
    count = parseInt(w3m.vertex_ext_triangle.length / unit);
    if (count) {
      w3m.drawqueue_ext.push([gl.TRIANGLES, offset, count]);
      offset += count;
    }
  },
  vertexLabel2drawqueue: function() {
    var count = parseInt(w3m.vertex_label.length / w3m.config.unit_vertex_label);
    count ? w3m.drawqueue_label.push([gl.TRIANGLES, 0, count]) : void(0);
  },
  /* Buffer */
  buffer: function() {
    this.bufferMain();
    this.bufferHet();
    this.bufferExt();
    this.bufferLabel();
  },
  bufferMain: function() {
    w3m.vertex_main_point = [];
    w3m.vertex_main_line = [];
    w3m.vertex_main_triangle = [];
    w3m.vertex_main_line_strip = [];
    w3m.vertex_main_triangle_strip = [];
  },
  bufferHet: function() {
    w3m.vertex_het_point = [];
    w3m.vertex_het_line = [];
    w3m.vertex_het_triangle = [];
  },
  bufferExt: function() {
    w3m.vertex_ext_line = [];
    w3m.vertex_ext_triangle = [];
  },
  bufferLabel: function() {
    w3m.vertex_label = [];
  },
  breakLineStrip: function() {
    w3m.breakpoint_line_strip.push(w3m.vertex_main_line_strip.length);
  },
  breakTriangleStrip: function() {
    w3m.breakpoint_triangle_strip.push(w3m.vertex_main_triangle_strip.length);
  },
  getHLHD: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      hl = true,
      hd = true,
      hl_map = mol.highlight[chain_id],
      hd_map = mol.hide[chain_id],
      start = start || w3m_find_first(mol.residue[chain_id]),
      stop = stop || w3m_find_last(mol.residue[chain_id]);
    for (var i = start; i <= stop; i++) {
      if (!w3m_array_has(hl_map, i)) {
        hl = false;
        break;
      }
    }
    for (var i = start; i <= stop; i++) {
      if (!w3m_array_has(hd_map, i)) {
        hd = false;
        break;
      }
    }
    return [hl, hd];
  },
  savePicture: function(type) {
    var filename = 'PDB-' + w3m.global.mol.toUpperCase() + '.' + type;
    if (w3m_array_has(['png', 'jpeg', 'bmp', 'webp'], type)) {
      if (canvas.toBlob) {
        canvas.toBlob(function(blob) {
          var url = URL.createObjectURL(blob),
            a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
        }, 'image/' + type, 1);
      } else if (canvas.msToBlob) {
        navigator.msSaveBlob(canvas.msToBlob(), filename);
      } else if (canvas.toDataURL) {
        var url = canvas.toDataURL('image/' + type, 1),
          a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        a.click();
      }
    } else {
      alert('Wrong Type.');
    }
  },
  toast: function(s) {
    var node = w3m_$('w3m-toast');
    w3m_html(node, s);
    w3m_show(node);
    window.setTimeout(function() {
      w3m_hide(node);
    }, 2500);
  },
  recycle: function() {
    var rotation = w3m.global.rotate_x || w3m.global.rotate_y || w3m.global.rotate_z;
    var time_last = Date.now() - 16, // magic number, but rational.
      render = function() {
        var time_now = Date.now(),
          time_delta = (time_now - time_last) / 1000;
        time_last = time_now;
        var speed = w3m.config.animation_speed,
          model = mat4.rotate((w3m.global.rotate_x ? speed : 0) * time_delta,
            (w3m.global.rotate_y ? speed : 0) * time_delta,
            (w3m.global.rotate_z ? speed : 0) * time_delta);
        w3m.global.cycle = w3m_cycle_start(render);
      };
    if (rotation) {
      w3m.global.cycle ? void(0) : w3m.global.cycle = w3m_cycle_start(render);
    } else {
      w3m_cycle_stop(w3m.global.cycle);
      w3m.global.cycle = null;
    }
  },
  /* util */
  background: function() {
    gl.clearColor(w3m.config.bg[0], w3m.config.bg[1], w3m.config.bg[2], w3m.config.bg[3]);
  },
  saveConfigToDefault: function() {
    w3m.global.default.config = w3m_copy_object(w3m.config);
    w3m.global.default.rgb = w3m_copy_object(w3m.rgb);
  },
  recoverConfigFromDefault: function() {
    w3m.config = w3m_copy_object(w3m.global.default.config);
    w3m.rgb = w3m_copy_object(w3m.global.default.rgb);
  },
  saveConfigToLocalStorage: function() {
    localStorage.config = JSON.stringify(w3m.config);
    localStorage.rgb = JSON.stringify(w3m.rgb);
  },
  recoverConfigFromLocalStorage: function() {
    localStorage.config ? w3m.config = JSON.parse(localStorage.config) : void(0);
    localStorage.rgb ? w3m.rgb = JSON.parse(localStorage.rgb) : void(0);
  },
  clearLocalStorage: function() {
    localStorage.clear();
  },
  recoverConfigFromURL: function() {
    var kv = {};
    if (location.search) {
      var q = location.search.slice(1).split('&');
      q.forEach(function(k_v) {
        var k_v_array = k_v.split('=');
        kv[k_v_array[0]] = decodeURIComponent(k_v_array[1]);
      });
      w3m_isset(kv.id) ? w3m.global.mol = kv.id : void(0);
      w3m_isset(kv.widget) ? w3m.global.widget = parseInt(kv.widget) : void(0);
      if (w3m_isset(kv.config)) {
        var cf = JSON.parse(kv.config);
        for (var i in cf) {
          w3m.config[i] = cf[i];
        }
      }
      if (w3m_isset(kv.color)) {
        var rgb = JSON.parse(kv.color);
        for (var i in rgb) {
          w3m.rgb[i] = rgb[i];
        }
      }
    }
  },
  recoverConfigFromUser: function(widget, config, color) {
    var config = config || {},
      color = color || {};
    // widget
    w3m_isset(widget) ? w3m.global.widget = widget : void(0);
    // config
    if (!w3m_isempty(config)) {
      for (var i in config) {
        w3m.config[i] = config[i];
      }
    }
    // color
    if (!w3m_isempty(color)) {
      for (var i in color) {
        w3m.rgb[i] = color[i];
      }
    }
  },
  highlightSegment: function(mol_id, chain_id, start, stop, operation) {
    var mol = w3m.mol[mol_id],
      chain = mol.residue[chain_id],
      highlight = mol.highlight[chain_id],
      hide = mol.hide[chain_id];
    for (var residue_id = start; residue_id <= stop; residue_id++) {
      if (!chain[residue_id]) {
        continue;
      }
      switch (operation || w3m.TOGGLE) {
        case w3m.ADD:
          w3m_array_add(highlight, residue_id);
          break;
        case w3m.REMOVE:
          w3m_array_remove(highlight, residue_id);
          break;
        case w3m.TOGGLE:
          w3m_array_toggle(highlight, residue_id);
          break;
      }
      w3m_array_remove(hide, residue_id);
    }
  },
  hideSegment: function(mol_id, chain_id, start, stop, operation) {
    var mol = w3m.mol[mol_id],
      chain = mol.residue[chain_id],
      highlight = mol.highlight[chain_id],
      hide = mol.hide[chain_id];
    for (var residue_id = start; residue_id <= stop; residue_id++) {
      if (!chain[residue_id]) {
        continue;
      }
      switch (operation || w3m.TOGGLE) {
        case w3m.ADD:
          w3m_array_add(hide, residue_id);
          break;
        case w3m.REMOVE:
          w3m_array_remove(hide, residue_id);
          break;
        case w3m.TOGGLE:
          w3m_array_toggle(hide, residue_id);
          break;
      }
      w3m_array_remove(highlight, residue_id);
    }
  },
  getChainType: function(residue_name) {
    if (w3m.dict.amino_acid.indexOf(residue_name) >= 0) {
      return w3m.CHAIN_AA;
    } else if (w3m.dict.nucleic_acid.indexOf(residue_name) >= 0) {
      return w3m.CHAIN_NA;
    } else {
      return w3m.CHAIN_UNK; //unknown ChainNType
    }
  },
  updateMolRepColorLabelMap: function(mol_id) {
    if (w3m_isset(mol_id)) {
      this.updateMolRepMap(mol_id);
      this.updateMolColorMap(mol_id);
      this.updateMolLabelMap(mol_id);
    } else {
      w3m.mol.forEach(function(mol) {
        var mol_id = mol.id;
        this.updateMolRepMap(mol_id);
        this.updateMolColorMap(mol_id);
        this.updateMolLabelMap(mol_id);
      });
    }
  },
  updateFragmentRepColorLabelMap: function(fg_id) {
    if (w3m_isset(fg_id)) {
      var fg = w3m.global.fragment[fg_id];
      this.updateFragmentRepMap(fg.rep, fg.mol, fg.chain, fg.start, fg.stop);
      this.updateFragmentColorMap(fg.color, fg.mol, fg.chain, fg.start, fg.stop, fg.defined_color);
      this.updateFragmentLabelMap(fg.label_area, fg.label_content, fg.mol, fg.chain, fg.start, fg.stop);
    } else {
      w3m.global.fragment.forEach(function(fg) {
        w3m.tool.updateFragmentRepMap(fg.rep, fg.mol, fg.chain, fg.start, fg.stop);
        w3m.tool.updateFragmentColorMap(fg.color, fg.mol, fg.chain, fg.start, fg.stop, fg.defined_color);
        w3m.tool.updateFragmentLabelMap(fg.label_area, fg.label_content, fg.mol, fg.chain, fg.start, fg.stop);
      });
    }
  },
  updateMolRepMap: function(mol_id) { // main only
    var map = w3m.mol[mol_id].rep,
      rep = w3m.config.rep_mode_main;
    for (var chain_id in map) {
      for (var residue_id in map[chain_id]) {
        map[chain_id][residue_id] = rep;
      }
    }
  },
  updateFragmentRepMap: function(rep, mol_id, chain_id, start, stop) {
    var map = w3m.mol[mol_id].rep[chain_id];
    for (var residue_id = start; residue_id <= stop; residue_id++) {
      map[residue_id] ? map[residue_id] = rep : void(0);
    }
  },
  updateMolColorMap: function(mol_id) {
    this.updateMolColorMapMain(mol_id);
    this.updateMolColorMapHet(mol_id);
  },
  updateMolColorMapMain: function(mol_id) {
    var mol = w3m.mol[mol_id];
    switch (w3m.config.color_mode_main) {
      case w3m.COLOR_BY_ELEMENT:
        var array = w3m.color.element;
        mol.color.main = mol.atom.main.map(function(atom) {
          return array[atom[9]];
        });
        break;
      case w3m.COLOR_BY_RESIDUE:
        var array = w3m.color.residue;
        mol.color.main = mol.atom.main.map(function(atom) {
          return array[atom[3]];
        });
        break;
      case w3m.COLOR_BY_SS:
        var array = {};
        array[w3m.HELIX] = array[w3m.HELIX_HEAD] = array[w3m.HELIX_BODY] = array[w3m.HELIX_FOOT] = w3m.color.ss.helix;
        array[w3m.SHEET] = array[w3m.SHEET_HEAD] = array[w3m.SHEET_BODY] = array[w3m.SHEET_FOOT] = w3m.color.ss.sheet;
        array[w3m.LOOP] = array[w3m.LOOP_HEAD] = array[w3m.LOOP_BODY] = array[w3m.LOOP_FOOT] = w3m.color.ss.loop;
        mol.color.main = mol.atom.main.map(function(atom) {
          return array[mol.ss[atom[4]][atom[5]][0]];
        });
        break;
      case w3m.COLOR_BY_CHAIN:
        var array = w3m.color.chain;
        mol.color.main = mol.atom.main.map(function(atom) {
          return array[atom[4]];
        });
        break;
      case w3m.COLOR_BY_REP:
        var array_raw = w3m.color.rep,
          array = [];
        array[w3m.HIDE] = array_raw.hide;
        array[w3m.DOT] = array_raw.dot;
        array[w3m.LINE] = array_raw.line;
        array[w3m.BACKBONE] = array_raw.backbone;
        array[w3m.STICK] = array_raw.stick;
        array[w3m.TUBE] = array_raw.tube;
        array[w3m.CARTOON] = array_raw.cartoon;
        array[w3m.CUBE] = array_raw.cube;
        array[w3m.STRIP] = array_raw.strip;
        array[w3m.RAILWAY] = array_raw.railway;
        array[w3m.RIBBON] = array_raw.ribbon;
        array[w3m.ARROW] = array_raw.arrow;
        array[w3m.SPHERE] = array_raw.sphere;
        mol.color.main = mol.atom.main.map(function(atom) {
          return array[mol.rep[atom[4]][atom[5]]]; // depends on rep
        });
        break;
      case w3m.COLOR_BY_B_FACTOR:
        var range = w3m.global.limit.b_factor[1] - w3m.global.limit.b_factor[0],
          smallest = w3m.global.limit.b_factor[0];
        if (range) {
          mol.color.main = mol.atom.main.map(function(atom) {
            return 1000 + Math.round((atom[8] - smallest) / range * 100);
          });
        } else {
          mol.color.main = mol.atom.main.map(function(atom) {
            return 1050;
          });
        }
        break;
      case w3m.COLOR_BY_SPECTRUM:
        var len = w3m_find_last(mol.atom.main),
          token = 100 / len;
        mol.color.main = mol.atom.main.map(function(atom, i) {
          return 1100 - Math.round(i * token);
        });
        break;
      case w3m.COLOR_BY_CHAIN_SPECTRUM:
        var tmp = {
          id: null
        };
        mol.color.main = mol.atom.main.map(function(atom, i) {
          if (tmp.id == atom[4]) {
            var atom_id_start = tmp.start,
              atom_id_stop = tmp.stop,
              len = atom_id_stop - atom_id_start;
          } else {
            var chain = mol.tree.main[atom[4]],
              atom_id_start = w3m_find_object_first(w3m_find_first(chain, true), true),
              atom_id_stop = w3m_find_object_last(w3m_find_last(chain, true), true),
              len = atom_id_stop - atom_id_start;
            tmp = {
              id: atom[4],
              start: atom_id_start,
              stop: atom_id_stop
            };
          }
          return 1100 - Math.round((i - atom_id_start) * 100 / len);
        });
        break;
      case w3m.COLOR_BY_HYDROPHOBICITY:
        var array = w3m.color.hydrophobicity;
        mol.color.main = mol.atom.main.map(function(atom) {
          return array[atom[3]];
        });
        break;
      default:
        var array = w3m.color.element;
        mol.color.main = mol.atom.main.map(function(atom) {
          return array[atom[9]];
        });
        break;
    }
  },
  updateMolColorMapHet: function(mol_id) {
    var mol = w3m.mol[mol_id];
    switch (w3m.config.color_mode_het) {
      case w3m.COLOR_BY_ELEMENT:
        var array = w3m.color.element;
        mol.color.het = mol.atom.het.map(function(atom) {
          return array[atom[9]];
        });
        break;
      case w3m.COLOR_BY_CHAIN:
        var array = w3m.color.chain;
        mol.color.het = mol.atom.het.map(function(atom) {
          return array[atom[4]];
        });
        break;
      case w3m.COLOR_BY_REP:
        switch (w3m.config.rep_mode_het) {
          case w3m.HIDE:
            var color = w3m.color.rep.hide;
            break;
          case w3m.DOT:
            var color = w3m.color.rep.dot;
            break;
          case w3m.LINE:
            var color = w3m.color.rep.line;
            break;
          case w3m.STICK:
            var color = w3m.color.rep.stick;
            break;
          case w3m.BALL_AND_ROD:
            var color = w3m.color.rep.ball_and_rod;
            break;
          case w3m.SPHERE:
            var color = w3m.color.rep.sphere;
            break;
        }
        mol.color.het = mol.atom.het.map(function(atom) {
          return color;
        });
        break;
      case w3m.COLOR_BY_B_FACTOR:
        var range = w3m.global.limit.b_factor[1] - w3m.global.limit.b_factor[0],
          smallest = w3m.global.limit.b_factor[0];
        if (range) {
          mol.color.het = mol.atom.het.map(function(atom) {
            return 1000 + Math.round((atom[8] - smallest) / range * 100);
          });
        } else {
          mol.color.het = mol.atom.het.map(function(atom) {
            return 1050;
          });
        }
        break;
      default:
        var array = w3m.color.element;
        mol.color.het = mol.atom.het.map(function(atom) {
          return array[atom[9]];
        });
        break;
    }
  },
  updateFragmentColorMap: function(color_mode, mol_id, chain_id, start, stop, defined_color) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      atom_map = mol.atom.main,
      color_map = mol.color.main;
    switch (color_mode) {
      case w3m.COLOR_BY_ELEMENT:
        var array = w3m.color.element;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name];
            color_map[atom_id] = array[atom_map[atom_id][9]];
          }
        }
        break;
      case w3m.COLOR_BY_RESIDUE:
        var array = w3m.color.residue;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name];
            color_map[atom_id] = array[atom_map[atom_id][3]];
          }
        }
        break;
      case w3m.COLOR_BY_SS:
        var array = {};
        array[w3m.HELIX] = array[w3m.HELIX_HEAD] = array[w3m.HELIX_BODY] = array[w3m.HELIX_FOOT] = w3m.color.ss.helix;
        array[w3m.SHEET] = array[w3m.SHEET_HEAD] = array[w3m.SHEET_BODY] = array[w3m.SHEET_FOOT] = w3m.color.ss.sheet;
        array[w3m.LOOP] = array[w3m.LOOP_HEAD] = array[w3m.LOOP_BODY] = array[w3m.LOOP_FOOT] = w3m.color.ss.loop;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name],
              atom = atom_map[atom_id];
            color_map[atom_id] = array[mol.ss[atom[4]][atom[5]][0]];
          }
        }
        break;
      case w3m.COLOR_BY_CHAIN:
        var color = w3m.color.chain[chain_id];
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name];
            color_map[atom_id] = color;
          }
        }
        break;
      case w3m.COLOR_BY_REP:
        var array_raw = w3m.color.rep,
          array = [];
        array[w3m.HIDE] = array_raw.hide;
        array[w3m.DOT] = array_raw.dot;
        array[w3m.LINE] = array_raw.line;
        array[w3m.BACKBONE] = array_raw.backbone;
        array[w3m.STICK] = array_raw.stick;
        array[w3m.TUBE] = array_raw.tube;
        array[w3m.CARTOON] = array_raw.cartoon;
        array[w3m.CUBE] = array_raw.cube;
        array[w3m.STRIP] = array_raw.strip;
        array[w3m.RAILWAY] = array_raw.railway;
        array[w3m.RIBBON] = array_raw.ribbon;
        array[w3m.ARROW] = array_raw.arrow;
        array[w3m.SPHERE] = array_raw.sphere;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name],
              atom = atom_map[atom_id];
            color_map[atom_id] = array[mol.rep[atom[4]][atom[5]]];
          }
        }
        break;
      case w3m.COLOR_BY_B_FACTOR:
        var range = w3m.global.limit.b_factor[1] - w3m.global.limit.b_factor[0],
          smallest = w3m.global.limit.b_factor[0];
        if (range) {
          for (var residue_id = start; residue_id <= stop; residue_id++) {
            var residue = chain[residue_id];
            for (var atom_name in residue) {
              var atom_id = residue[atom_name];
              color_map[atom_id] = 1000 + Math.round((atom_map[atom_id][8] - smallest) / range * 100);
            }
          }
        } else {
          for (var residue_id = start; residue_id <= stop; residue_id++) {
            var residue = chain[residue_id];
            for (var atom_name in residue) {
              var atom_id = residue[atom_name];
              color_map[atom_id] = 1050;
            }
          }
        }
        break;
      case w3m.COLOR_BY_SPECTRUM:
        var len = w3m_find_last(mol.atom.main),
          token = 100 / len;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name];
            color_map[atom_id] = 1100 - Math.round(atom_id * token);
          }
        }
        break;
      case w3m.COLOR_BY_CHAIN_SPECTRUM:
        var atom_id_start = w3m_find_object_first(w3m_find_first(chain, true), true),
          atom_id_stop = w3m_find_object_last(w3m_find_last(chain, true), true),
          len = atom_id_stop - atom_id_start,
          token = 100 / len;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name];
            color_map[atom_id] = 1100 - Math.round((atom_id - atom_id_start) * token);
          }
        }
        break;
      case w3m.COLOR_BY_HYDROPHOBICITY:
        var array = w3m.color.hydrophobicity;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name];
            color_map[atom_id] = array[atom_map[atom_id][3]];
          }
        }
        break;
      case w3m.COLOR_BY_USER:
        var color = defined_color;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name];
            color_map[atom_id] = color;
          }
        }
        break;
      default:
        var array = w3m.color.element;
        for (var residue_id = start; residue_id <= stop; residue_id++) {
          var residue = chain[residue_id];
          for (var atom_name in residue) {
            var atom_id = residue[atom_name];
            color_map[atom_id] = array[atom_map[atom_id][9]];
          }
        }
        break;
    }
  },
  updateMolLabelMap: function(mol_id) {
    this.updateMolLabelAreaMap(mol_id);
    this.updateMolLabelContentMap(mol_id);
  },
  updateMolLabelAreaMap: function(mol_id) {
    var map = w3m.mol[mol_id].label_area,
      label_area = w3m.config.label_area_main;
    for (var chain_id in map) {
      for (var residue_id in map[chain_id]) {
        map[chain_id][residue_id] = label_area;
      }
    }
  },
  updateMolLabelContentMap: function(mol_id) {
    var map = w3m.mol[mol_id].label_content,
      label_content = w3m.config.label_content_main;
    for (var chain_id in map) {
      for (var residue_id in map[chain_id]) {
        map[chain_id][residue_id] = label_content;
      }
    }
  },
  updateFragmentLabelMap: function(label_area, label_content, mol_id, chain_id, start, stop) {
    var label_area_map = w3m.mol[mol_id].label_area[chain_id],
      label_content_map = w3m.mol[mol_id].label_content[chain_id];
    for (var residue_id = start; residue_id <= stop; residue_id++) {
      label_area_map[residue_id] = label_area;
      label_content_map[residue_id] = label_content;
    }
  },
  addFragment: function(mol_id, chain_id, start, stop) {
    var mol_id = mol_id || w3m.global.mol,
      mol = w3m.mol[mol_id],
      fg_id = w3m.global.fragment.length;
    chain_id = chain_id || w3m_find_object_first(mol.residue),
      residue_start = start || w3m_find_first(mol.residue[chain_id]),
      residue_stop = stop || w3m_find_last(mol.residue[chain_id]),
      rep_mode = mol.rep[chain_id][residue_start] || w3m.config.rep_mode_main,
      color_mode = w3m.config.color_mode_main,
      label_area = mol.label_area[chain_id][residue_start] || w3m.config.label_area_main,
      label_content = mol.label_content[chain_id][residue_start] || w3m.config.label_content_main,
      defined_color = 1300 + fg_id,
      HLHD = this.getHLHD(mol_id, chain_id, residue_start, residue_stop);
    w3m.global.fragment[fg_id] = {
      id: fg_id,
      mol: mol_id,
      chain: chain_id,
      start: residue_start,
      stop: residue_stop,
      rep: rep_mode,
      color: color_mode,
      label_area: label_area,
      label_content: label_content,
      defined_color: defined_color,
      highlight: HLHD[0],
      hide: HLHD[1]
    };
    w3m.rgb[defined_color] = w3m_copy(w3m.rgb[1]);
    return fg_id;
  },
  updateFragment: function(fg_id) {
    var fg = w3m.global.fragment[fg_id];
    this.updateFragmentRepColorLabelMap(fg_id);
  },
  resetFragment: function(fg_id) {
    var fg = w3m.global.fragment[fg_id];
    fg.rep = w3m.config.rep_mode_main,
      fg.color = w3m.config.color_mode_main,
      fg.label_area = w3m.config.label_area_main,
      fg.label_content = w3m.config.label_content_main;
    fg.highlight ? this.highlightSegment(fg.mol, fg.chain, fg.start, fg.stop, w3m.REMOVE) : void(0);
    fg.hide ? this.hideSegment(fg.mol, fg.chain, fg.start, fg.stop, w3m.REMOVE) : void(0);
    w3m.rgb[defined_color] = w3m_copy(w3m.rgb[1]);
    this.updateFragment(fg_id);
  },
  deleteFragment: function(fg_id) {
    this.resetFragment(fg_id);
    w3m.global.fragment[fg_id] = undefined; // do not splice
  },
  /* fill function */
  // Frame
  // [ id, xyz, color, (normal) ] --> [ 0 : id, 1 : xyz, 2 : color, 3 : tan, (4 : normal, 5 : binormal) ]. B = T x N
  compute_NB_by_rotation: function(frame) {
    // seed.
    var tan = frame[0][3],
      tan_x = Math.abs(tan[0]),
      tan_y = Math.abs(tan[1]),
      tan_z = Math.abs(tan[2]),
      seed;
    tan_x < tan_y ? (tan_z < tan_x ? seed = [0, 0, 1] : seed = [1, 0, 0]) :
      (tan_z < tan_y ? seed = [0, 0, 1] : seed = [0, 1, 0]);
    seed = vec3.cross(frame[0][3], seed);
    // normal & binormal
    frame[0][4] = vec3.unit(vec3.cross(frame[0][3], seed));
    frame[0][5] = vec3.cross(frame[0][3], frame[0][4]);
    for (var i = 1, l = frame.length; i < l; i++) {
      var axis = vec3.cross(frame[i - 1][3], frame[i][3]);
      if (vec3.len(axis) > Number.EPSILON) {
        var theta = vec3.rad(frame[i - 1][3], frame[i][3], true);
        frame[i][4] = vec3.unit(mat4.xvec3(mat4.orbit(vec3.unit(axis), theta), frame[i - 1][4]));
      } else {
        frame[i][4] = w3m_copy(frame[i - 1][4]);
      }
      frame[i][5] = vec3.cross(frame[i][3], frame[i][4]);
    }
  },
  compute_NB_for_stick: function(frame, link_map, ref_tnb) {
    if (ref_tnb) {
      // ref
      var ref_fm = [frame[0][0], frame[0][1], frame[0][2]].concat(ref_tnb);
      frame.unshift(ref_fm);
    } else {
      // seed.
      var tan = frame[0][3],
        tan_x = Math.abs(tan[0]),
        tan_y = Math.abs(tan[1]),
        tan_z = Math.abs(tan[2]),
        seed;
      tan_x < tan_y ? (tan_z < tan_x ? seed = [0, 0, 1] : seed = [1, 0, 0]) :
        (tan_z < tan_y ? seed = [0, 0, 1] : seed = [0, 1, 0]);
      seed = vec3.cross(frame[0][3], seed);
      // first
      frame[0][4] = vec3.unit(vec3.cross(frame[0][3], seed));
      frame[0][5] = vec3.cross(frame[0][3], frame[0][4]);
    }
    // n & b
    for (var i = 1, l = frame.length; i < l; i++) {
      var msg = frame[i][6] || {
          cross_link: false,
          residue_id: null,
          atom_name: null
        },
        axis = vec3.cross(frame[i - 1][3], frame[i][3]);
      if (vec3.len(axis) > Number.EPSILON) {
        var theta = vec3.rad(frame[i - 1][3], frame[i][3], true);
        frame[i][4] = vec3.unit(mat4.xvec3(mat4.orbit(vec3.unit(axis), theta), frame[i - 1][4]));
      } else {
        frame[i][4] = w3m_copy(frame[i - 1][4]);
      }
      frame[i][5] = vec3.cross(frame[i][3], frame[i][4]);
      // link_map
      if (msg.cross_link) {
        w3m_isset(link_map[msg.residue_id]) ? void(0) : link_map[msg.residue_id] = {};
        link_map[msg.residue_id][msg.atom_name] = [vec3.negate(frame[i][3]), frame[i][4], frame[i][5]];
      }
      // delete the msg in frame
      frame[i].splice(6, 1);
    }
    if (ref_tnb) {
      frame.shift();
    }
  },
  simpleFrame: function(path, frame, compute_NB) {
    //console.log("simpleFrame:" + frame);
    var compute_NB = w3m_isset(compute_NB) ? compute_NB : true;
    for (var i = 0, l = path.length; i < l; i++) {
      // mid
      if (i) {
        var xyz_mid = vec3.mid(path[i - 1][1], path[i][1]),
          tan_mid = vec3.unit(vec3.point(path[i - 1][1], path[i][1]));
        frame.push([path[i - 1][0], xyz_mid, path[i - 1][2], tan_mid]);
        frame.push([path[i][0], xyz_mid, path[i][2], tan_mid]);
      }
      // tan
      var tan = vec3.unit(vec3.point((path[i - 1] || path[i])[1], (path[i + 1] || path[i])[1]));
      frame.push([path[i][0], path[i][1], path[i][2], tan]);
    }
    compute_NB ? this.compute_NB_by_rotation(frame) : void(0);
  },
  smoothFrame: function(path, frame, compute_NB) {
    //console.log("smoothFrame:");
    var offset = PDB.GeoCenterOffset;
    var compute_NB = w3m_isset(compute_NB) ? compute_NB : true,
      n = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment,
      k = w3m.config.smooth_curvature,
      len = path.length;
	  if(len==0){
		  return;
	  }
    /* xyz, color & tan */
    // 0
    path[0][3] = math.polysum([k, -k / 4], [vec3.point(path[0][1], path[1][1]), vec3.point(path[0][1], path[2][1])]);
    frame[0] = [path[0][0], path[0][1], path[0][2], vec3.unit(path[0][3])];
    // 1 -> len-1
    for (var i = 1; i < len; i++) {
      // tan
      if (i == len - 1) {
        path[i][3] = math.polysum([k, -k / 4], [vec3.point(path[i - 1][1], path[i][1]), vec3.point(path[i - 2][1], path[i][1])]);
      } else {
        path[i][3] = vec3.scalar(k, vec3.point(path[i - 1][1], path[i + 1][1]));
      }
      // curve
      var curve = math.hermiteFit(n, path[i - 1][1], path[i][1], path[i - 1][3], path[i][3]),
        id = path[i - 1][0],
        color = path[i - 1][2];
      for (var ii = 1; ii <= n; ii++) {
        var xyz = curve[ii][0],
          tan = vec3.unit(curve[ii][1]);
        frame.push([id, xyz, color, tan]);
        if (ii == n / 2) {
          id = path[i][0]; // switch id
          color = path[i][2]; // switch color
          frame.push([id, xyz, color, tan]);
        }
        if (w3m.CLENGTH == 2) {
          var atom = w3m.tool.getMainAtomById(w3m.global.mol, id);
          if (PDB.residue && PDB.residue != "") {
            atom = w3m.tool.getMainAtomById(PDB.residue, id);
          }
		  
			
          if (atom) {			  
             w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].path.push(new THREE.Vector3(xyz[0] + offset.x, xyz[1] + offset.y, xyz[2] + offset.z)); 
          }

        }
      }
    }
    compute_NB ? this.compute_NB_by_rotation(frame) : void(0);

  },
  naturalFrame: function(path, frame) {
	//console.log("naturalFrame: ");
    var offset = PDB.GeoCenterOffset;
    // var tempPathArray  = [],
    // // tempIdArray		   = [],
    // tempBinormalsArray = [],
    // tempNormalsArray   = [],
    // tempTangentsArray  = [];
    // natural means that the normal is decided by mol it self.
    // [ id, xyz, color, tan, 4:normal, 5:binormal, 6:turnover ]
    var n = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment,
      k = w3m.config.smooth_curvature,
      len = path.length;
    /* xyz, color & tan */
    // 0
    path[0][3] = math.polysum([k, -k / 4], [vec3.point(path[0][1], path[1][1]), vec3.point(path[0][1], path[2][1])]);
    var tan = vec3.unit(path[0][3]),
      binormal = vec3.unit(vec3.cross(tan, path[0][4]));
    normal = vec3.cross(binormal, tan);
    path[0][4] = vec3.cross(binormal, tan);
    var atom = w3m.tool.getMainAtomById(w3m.global.mol, path[0][0]);
    if (PDB.residue && PDB.residue != "") {
      atom = w3m.tool.getMainAtomById(PDB.residue, path[0][0]);
    }
    frame[0] = [path[0][0], path[0][1], path[0][2], tan, path[0][4], binormal, path[0][6]];

    // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].path.push(new THREE.Vector3(path[0][1][0]+offset.x,path[0][1][1]+offset.y,path[0][1][2]+offset.z));

    // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].binormals.push(new THREE.Vector3(binormal[0],binormal[1],binormal[2]));
    // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].normals.push(new THREE.Vector3(normal[0],normal[1],normal[2]));
    // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].tangents.push(new THREE.Vector3(tan[0],tan[1],tan[2]));
    // 1 -> len-1
    // var prep,pretan,prenormal,prebinormal;
    for (var i = 1; i < len; i++) {
      // tan
      if (i == len - 1) {
        path[i][3] = math.polysum([k, -k / 4], [vec3.point(path[i - 1][1], path[i][1]), vec3.point(path[i - 2][1], path[i][1])]);
      } else {
        path[i][3] = vec3.scalar(k, vec3.point(path[i - 1][1], path[i + 1][1]));
      }
      // curve
      var curve = math.hermiteFit(n, path[i - 1][1], path[i][1], path[i - 1][3], path[i][3]),
        id = path[i - 1][0],
        color = path[i - 1][2],
        turnover = path[i - 1][6],
        tan = vec3.unit(path[i][3]),
        binormal = vec3.unit(vec3.cross(tan, path[i][4]));
      path[i][4] = vec3.cross(binormal, tan);

      for (var ii = 1; ii <= n; ii++) {
        var t = ii / n,
          xyz = curve[ii][0],
          tan = vec3.unit(curve[ii][1]),
          normal_tmp = vec3.step(t, path[i - 1][4], path[i][4]),
          binormal = vec3.unit(vec3.cross(tan, normal_tmp)),
          normal = vec3.cross(binormal, tan);
        frame.push([id, xyz, color, tan, normal, binormal, turnover]);

        if (ii == n / 2) {

          id = path[i][0]; // switch id, color, turnover
          color = path[i][2];
          turnover = path[i][6];
          frame.push([id, xyz, color, tan, normal, binormal, turnover]);
          // if(w3m.CLENGTH>0){
          // var atom = w3m.tool.getMainAtomById(w3m.global.mol,id);
          // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].path.push(new THREE.Vector3(xyz[0]+offset.x,xyz[1]+offset.y,xyz[2]+offset.z));
          // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].binormals.push(new THREE.Vector3(binormal[0],binormal[1],binormal[2]));
          // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].normals.push(new THREE.Vector3(normal[0],normal[1],normal[2]));
          // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].tangents.push(new THREE.Vector3(tan[0],tan[1],tan[2]));

          // }
        }
        //get all data
        if (w3m.CLENGTH == 1) {
          var atom = w3m.tool.getMainAtomById(w3m.global.mol, id);

          if (PDB.residue && PDB.residue != "") {
            atom = w3m.tool.getMainAtomById(PDB.residue, id);
          }
          if (atom) {
				if(w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].path.length == ( w3m.config.smooth_segment+1)){
					continue;
				}
				w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].path.push(new THREE.Vector3(xyz[0] + offset.x, xyz[1] + offset.y, xyz[2] + offset.z));
				w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].binormals.push(new THREE.Vector3(binormal[0], binormal[1], binormal[2]));
				w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].normals.push(new THREE.Vector3(normal[0], normal[1], normal[2]));
				w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].tangents.push(new THREE.Vector3(tan[0], tan[1], tan[2])); 
            
          }


        }


      }

    }
    w3m.CLENGTH = 0;
  },
  puttyFrame: function(path, frame, compute_NB) {
    //console.log("puttyFrame:" + frame);
    // path : [ id, xyz, color, , , , b_factor(6) ] => frame : [ id, xyz, color, , , , r(6) ]
    var compute_NB = w3m_isset(compute_NB) ? compute_NB : true,
      n = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment,
      k = w3m.config.smooth_curvature,
      len = path.length;
    // Fit y = ax^2 + bx + c => r = a*b_facotr^2 + b*b_factor + c
    var x0 = w3m.global.limit.b_factor_backbone[0],
      y0 = w3m.config.geom_putty_radius_min,
      x1 = w3m.global.average.b_factor_backbone[0],
      y1 = w3m.config.geom_tube_radius,
      x2 = w3m.global.limit.b_factor_backbone[1],
      y2 = w3m.config.geom_putty_radius_max,
      abc = math.linear_equation_3([x0 * x0, x1 * x1, x2 * x2], [x0, x1, x2], [1, 1, 1], [y0, y1, y2]),
      r = function(b_factor) {
        return abc[0] * b_factor * b_factor + abc[1] * b_factor + abc[2];
      };
    /* xyz, color & tan */
    // 0
    path[0][3] = math.polysum([k, -k / 4], [vec3.point(path[0][1], path[1][1]), vec3.point(path[0][1], path[2][1])]);
    frame[0] = [path[0][0], path[0][1], path[0][2], vec3.unit(path[0][3]), , , r(path[0][6])];
    // 1 -> len-1
    for (var i = 1; i < len; i++) {
      // tan, do not normalize here
      if (i == len - 1) {
        path[i][3] = math.polysum([k, -k / 4], [vec3.point(path[i - 1][1], path[i][1]), vec3.point(path[i - 2][1], path[i][1])]);
      } else {
        path[i][3] = vec3.scalar(k, vec3.point(path[i - 1][1], path[i + 1][1]));
      }
      // curve
      var curve = math.hermiteFit(n, path[i - 1][1], path[i][1], path[i - 1][3], path[i][3]),
        id = path[i - 1][0],
        color = path[i - 1][2];
      for (var ii = 1; ii <= n; ii++) {
        var t = ii / n,
          xyz = curve[ii][0],
          tan = vec3.unit(curve[ii][1]),
          b_factor = math.step(t, path[i - 1][6], path[i][6]);
        frame.push([id, xyz, color, tan, , , r(b_factor)]);
        if (ii == n / 2) {
          id = path[i][0];
          color = path[i][2];
          frame.push([id, xyz, color, tan, , , r(b_factor)]);
        }
      }
    }
    compute_NB ? this.compute_NB_by_rotation(frame) : void(0);
  },
  stickFrame: function(path, frame, link_map, ref_tnb) {
    // path : [ id, xyz, color, msg ]
    // ranx
    // for(var i in path){
    // 	var xyz = path[i][1];
    // 	PDB.backboneArray.push({x:xyz[0],y:xyz[1],z:xyz[2]});
    // }

    var len = path.length;
	if(len==0){
		return;
	}
    // 0
    var tan = vec3.unit(vec3.point(path[0][1], path[1][1]));
    frame.push([path[0][0], path[0][1], path[0][2], tan]);
    // 1 -> len - 2
    for (var i = 1; i < len - 1; i++) {
      var msg = path[i][3] || {
        cross_link: false,
        residue_name: null,
        atom_name: null
      };
      // mid
      var xyz_mid = vec3.mid(path[i - 1][1], path[i][1]),
        tan_mid = vec3.unit(vec3.point(path[i - 1][1], path[i][1]));
      frame.push([path[i - 1][0], xyz_mid, path[i - 1][2], tan_mid]);
      frame.push([path[i][0], xyz_mid, path[i][2], tan_mid]);
      // tan
      var tan_1 = vec3.unit(vec3.point(path[i - 1][1], path[i][1])),
        tan_2 = vec3.unit(vec3.point(path[i][1], path[i + 1][1]));
      if (msg.cross_link) {
        frame.push([path[i][0], path[i][1], path[i][2], tan_1]); // record the tnb to the link_map
        frame.push([path[i][0], path[i][1], path[i][2], tan_2, , , msg]);
      } else {
        var rad = vec3.rad(tan_1, tan_2, true),
          seg = Math.round(rad / w3m.config.geom_stick_theta);
        for (var ii = 0; ii <= seg; ii++) {
          var tan = vec3.unit(vec3.step(ii / seg, tan_1, tan_2));
          frame.push([path[i][0], path[i][1], path[i][2], tan]);
        }
      }
    }
    // len - 1, the last atom should not be recorded in link_map
    var tan = vec3.unit(vec3.point(path[len - 2][1], path[len - 1][1])),
      xyz_mid = vec3.mid(path[len - 2][1], path[len - 1][1]);
    frame.push([path[len - 2][0], xyz_mid, path[len - 2][2], tan]);
    frame.push([path[len - 1][0], xyz_mid, path[len - 1][2], tan]);
    frame.push([path[len - 1][0], path[len - 1][1], path[len - 1][2], tan]);
    // ref tnb
    w3m_isset(ref_tnb) ? this.compute_NB_for_stick(frame, link_map, ref_tnb) :
      this.compute_NB_for_stick(frame, link_map);
  },
  // Fix
  beelineFix: function(path) {
    var len = path.length,
      n = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment;
    // dig out ori path
    var ori = [],
      ori_len = (len - 1) / (n + 1) + 1;
    for (var i = 0; i < ori_len; i++) {
      w3m_isset(path[i * (n + 1)]) ? ori[i] = w3m_copy(path[i * (n + 1)]) : void(0);
    }
    // curve
    var curve_len = (ori_len - 1) * n + 1;
    curve_xyz = math.lineFit(curve_len - 1, ori[0][1], ori[ori_len - 1][1]),
      curve_normal = math.lineFit(curve_len - 1, ori[0][4], ori[ori_len - 1][4]);
    // fixed point
    var fixed = [];
    for (var i = 0; i < curve_len; i++) {
      var offset = fixed.length,
        id = path[offset][0];
      xyz = curve_xyz[i][0],
        color = path[offset][2],
        tan = vec3.unit(curve_xyz[i][1]),
        normal = vec3.unit(curve_normal[i][0]), // fix normal, more flat
        binormal = vec3.cross(tan, normal);
      fixed.push([id, xyz, color, tan, normal, binormal]);
      if ((i - n / 2) % n == 0) {
        id = path[offset + 1][0];
        color = path[offset + 1][2];
        fixed.push([id, xyz, color, tan, normal, binormal]);
      }
    }
    return fixed;
  },
  twistFix: function(frame) {
    // seed.
    var tan_0 = frame[0][3],
      tan_0x = Math.abs(tan_0[0]),
      tan_0y = Math.abs(tan_0[1]),
      tan_0z = Math.abs(tan_0[2]),
      seed;
    tan_0x < tan_0y ? (tan_0z < tan_0x ? seed = [0, 0, 1] : seed = [1, 0, 0]) :
      (tan_0z < tan_0y ? seed = [0, 0, 1] : seed = [0, 1, 0]);
    seed = vec3.cross(frame[0][3], seed);
    // normal & binormal
    var len = frame.length,
      first_fm = w3m_copy(frame[0]),
      last_fm = w3m_copy(frame[len - 1]);
    frame[0][4] = vec3.unit(vec3.cross(frame[0][3], seed));
    frame[0][5] = vec3.cross(frame[0][3], frame[0][4]);
    for (var i = 1; i < len; i++) {
      var axis = vec3.cross(frame[i - 1][3], frame[i][3]);
      if (vec3.len(axis) > Number.EPSILON) {
        var theta = vec3.rad(frame[i - 1][3], frame[i][3], true);
        frame[i][4] = vec3.unit(mat4.xvec3(mat4.orbit(vec3.unit(axis), theta), frame[i - 1][4]));
      } else {
        frame[i][4] = w3m_copy(frame[i - 1][4]);
      }
      frame[i][5] = vec3.cross(frame[i][3], frame[i][4]);
    }
  },
  zigzagFix: function(path) {
    var len = path.length,
      n = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment;
    // dig out ori path
    var ori = [],
      ori_len = (len - 1) / (n + 1) + 1;
    for (var i = 0; i < ori_len; i++) {
      w3m_isset(path[i * (n + 1)]) ? ori[i] = w3m_copy(path[i * (n + 1)]) : void(0);
    }
    // curve
    var curve_xyz = [],
      curve_len = (ori_len - 1) * n + 1;
    if (ori_len < 5) {
      /* Line */
      curve_xyz = math.lineFit(curve_len - 1, ori[0][1], ori[ori_len - 1][1]);
      curve_normal = math.lineFit(curve_len - 1, ori[0][4], ori[ori_len - 1][4]);
    } else if (ori_len < 8) {
      /* Quad */
      // sample
      var sample_xyz = ori_len % 2 ? ori[(ori_len - 1) / 2][1] : vec3.mid(ori[ori_len / 2 - 1][1], ori[ori_len / 2][1]);
      sample_normal = ori_len % 2 ? ori[(ori_len - 1) / 2][4] : vec3.mid(ori[ori_len / 2 - 1][4], ori[ori_len / 2][4]);
      // curve
      curve_xyz = math.quadFit(curve_len - 1, ori[0][1], sample_xyz, ori[ori_len - 1][1]);
      curve_normal = math.quadFit(curve_len - 1, ori[0][4], sample_normal, ori[ori_len - 1][4]);
    } else {
      /* Cube */
      // sample
      var sample_xyz = [ori[Math.floor(0.25 * ori_len)][1], ori[Math.floor(0.75 * ori_len)][1]],
        sample_normal = [ori[Math.floor(0.25 * ori_len)][4], ori[Math.floor(0.75 * ori_len)][4]];
      // curve
      curve_xyz = math.cubeFit4parts(curve_len - 1, ori[0][1], sample_xyz[0], sample_xyz[1], ori[ori_len - 1][1]);
      curve_normal = math.cubeFit4parts(curve_len - 1, ori[0][4], sample_normal[0], sample_normal[1], ori[ori_len - 1][4]);
    }
    // fixed point
    var fixed = [];
    for (var i = 0; i < curve_len; i++) {
      var offset = fixed.length,
        id = path[offset][0];
      xyz = curve_xyz[i][0],
        color = path[offset][2],
        tan = vec3.unit(curve_xyz[i][1]),
        normal = vec3.unit(curve_normal[i][0]), // fix normal, more flat
        binormal = vec3.cross(tan, normal);
      fixed.push([id, xyz, color, tan, normal, binormal]);
      if ((i - n / 2) % n == 0) {
        id = path[offset + 1][0];
        color = path[offset + 1][2];
        fixed.push([id, xyz, color, tan, normal, binormal]);
      }
    }
    return fixed;
  },
  // Shell
  tubeShell: function(frame, shell, msg) {

    var msg = msg || {},
      seg = w3m_isset(msg.segment) ? msg.segment : w3m.config.geom_tube_segment,
      radius = w3m_isset(msg.radius) ? msg.radius : w3m.config.geom_tube_radius;
    // sin cos
    var n = seg;
    if (n != w3m.geometry.circle.n) { // update cache data in w3m.geometry
      w3m.geometry.circle.n = n;
      w3m.geometry.circle.sin = [];
      w3m.geometry.circle.cos = [];
      var theta = 2 * Math.PI / n;
      for (var i = 0; i <= n; i++) {
        w3m.geometry.circle.sin[i] = Math.sin(i * theta);
        w3m.geometry.circle.cos[i] = Math.cos(i * theta);
      }
    }
    var sin = w3m.geometry.circle.sin,
      cos = w3m.geometry.circle.cos;
    // shell
    for (var i = 0, l = frame.length; i < l; i++) {
      shell[i] = [];
      var id = frame[i][0],
        o = frame[i][1],
        color = frame[i][2],
        e1 = frame[i][4],
        e2 = frame[i][5];
      for (var ii = 0; ii < n; ii++) {
        var radius_vector = vec3.plus(vec3.scalar(radius * cos[ii], e1), vec3.scalar(radius * sin[ii], e2));
        shell[i][ii] = [id, vec3.plus(o, radius_vector), color, vec3.unit(radius_vector)];
      }
    }
  },
  puttyShell: function(frame, shell) {
    // sin cos
    var n = w3m.config.geom_tube_segment;
    if (n != w3m.geometry.circle.n) { // update cache data in w3m.geometry
      w3m.geometry.circle.n = n;
      w3m.geometry.circle.sin = [];
      w3m.geometry.circle.cos = [];
      var theta = 2 * Math.PI / n;
      for (var i = 0; i <= n; i++) {
        w3m.geometry.circle.sin[i] = Math.sin(i * theta);
        w3m.geometry.circle.cos[i] = Math.cos(i * theta);
      }
    }
    var sin = w3m.geometry.circle.sin,
      cos = w3m.geometry.circle.cos;
    // shell
    for (var i = 0, l = frame.length; i < l; i++) {
      shell[i] = [];
      var id = frame[i][0],
        o = frame[i][1],
        color = frame[i][2],
        e1 = frame[i][4],
        e2 = frame[i][5],
        radius = frame[i][6];
      for (var ii = 0; ii < n; ii++) {
        var radius_vector = vec3.plus(vec3.scalar(radius * cos[ii], e1), vec3.scalar(radius * sin[ii], e2));
        shell[i][ii] = [id, vec3.plus(o, radius_vector), color, vec3.unit(radius_vector)];
      }
    }
  },
  cubeShell: function(frame, shell, msg) {
    var msg = msg || {},
      width = msg.width || w3m.config.geom_cube_width,
      w$2 = width / 2,
      height = msg.height || w3m.config.geom_cube_height,
      h$2 = height / 2,
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_cube_side_differ,
      side_color = msg.side_color || w3m.config.geom_cube_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_color = msg.inner_color || w3m.config.geom_helix_inner_color,
      inner_face = w3m_isset(msg.inner_face) ? msg.inner_face : w3m.INNERFACE_VARY;
    // shell
    for (var i = 0, l = frame.length; i < l; i++) {
      var id = frame[i][0],
        o = frame[i][1],
        color = frame[i][2],
        e1 = frame[i][4],
        _e1 = vec3.negate(e1),
        e2 = frame[i][5],
        _e2 = vec3.negate(e2),
        e1_p_e2 = math.polysum([w$2, h$2], [e1, e2]),
        e1_m_e2 = math.polysum([w$2, h$2], [e1, _e2]);
      var color_side = side_differ ? side_color : color;
      if (inner_differ) {
        if (inner_face == w3m.INNERFACE_VARY) {
          var color_upper = frame[i][6] ? inner_color : color,
            color_lower = !frame[i][6] ? inner_color : color;
        } else {
          var color_upper = inner_face == w3m.INNERFACE_TURNOVER ? inner_color : color,
            color_lower = inner_face == w3m.INNERFACE_NON_TURNOVER ? inner_color : color;
        }
      } else {
        var color_upper = color_lower = color;
      }
      shell[i] = [
        [id, vec3.plus(o, e1_p_e2), color_side, e1],
        [id, vec3.plus(o, e1_p_e2), color_upper, e2],
        [id, vec3.minus(o, e1_m_e2), color_upper, e2],
        [id, vec3.minus(o, e1_m_e2), color_side, _e1],
        [id, vec3.minus(o, e1_p_e2), color_side, _e1],
        [id, vec3.minus(o, e1_p_e2), color_lower, _e2],
        [id, vec3.plus(o, e1_m_e2), color_lower, _e2],
        [id, vec3.plus(o, e1_m_e2), color_side, e1]
      ];
    }
  },
  stripShell: function(frame, shell, msg) {
    var msg = msg || {},
      width = msg.width || w3m.config.geom_strip_width,
      height = msg.height || w3m.config.geom_strip_height,
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_strip_side_differ,
      side_color = msg.side_color || w3m.config.geom_strip_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_color = msg.inner_color || w3m.config.geom_helix_inner_color,
      inner_face = w3m_isset(msg.inner_face) ? msg.inner_face : w3m.INNERFACE_VARY;
    // shell
    var radius = height / 2,
      seg = w3m.config.geom_strip_segment,
      dtheta = Math.PI / 2 / seg;
    // sample
    var sample = [],
      width$2 = width / 2;
    for (var i = 0; i <= seg; i++) {
      var x = radius * Math.cos(i * dtheta),
        y = radius * Math.sin(i * dtheta);
      sample[i] = [
        [width$2 + x, y],
        [x, y]
      ];
    }
    // shell
    for (var i = 0, l = frame.length; i < l; i++) {
      var id = frame[i][0],
        o = frame[i][1],
        color = frame[i][2],
        e1 = frame[i][4],
        _e1 = vec3.negate(e1),
        e2 = frame[i][5],
        _e2 = vec3.negate(e2);
      var color_side = side_differ ? side_color : color;
      if (inner_differ) {
        if (inner_face == w3m.INNERFACE_VARY) {
          var color_upper = frame[i][6] ? inner_color : color,
            color_lower = !frame[i][6] ? inner_color : color;
        } else {
          var color_upper = inner_face == w3m.INNERFACE_TURNOVER ? inner_color : color,
            color_lower = inner_face == w3m.INNERFACE_NON_TURNOVER ? inner_color : color;
        }
      } else {
        var color_upper = color_lower = color;
      }
      // sample_vector
      var sample_vector = [];
      for (var ii = 0; ii <= seg; ii++) {
        var e1_p_e2_xyz = math.polysum(sample[ii][0], [e1, e2]),
          e1_p_e2_normal = math.polysum(sample[ii][1], [e1, e2]),
          e1_m_e2_xyz = math.polysum(sample[ii][0], [e1, _e2]),
          e1_m_e2_normal = math.polysum(sample[ii][1], [e1, _e2]);
        sample_vector[ii] = [e1_p_e2_xyz, e1_p_e2_normal, e1_m_e2_xyz, e1_m_e2_normal];
      }
      // shell
      shell[i] = [];
      // Quadrant II
      shell[i].push([id, vec3.minus(o, sample_vector[seg][2]), color_upper, e2]);
      for (var ii = seg; ii >= 0; ii--) {
        shell[i].push([id, vec3.minus(o, sample_vector[ii][2]), color_side, vec3.negate(sample_vector[ii][3])]);
      }
      // Quadrant III
      for (var ii = 1; ii <= seg; ii++) {
        shell[i].push([id, vec3.minus(o, sample_vector[ii][0]), color_side, vec3.negate(sample_vector[ii][1])]);
      }
      shell[i].push([id, vec3.minus(o, sample_vector[seg][0]), color_lower, _e2]);
      // Quadrant IV
      shell[i].push([id, vec3.plus(o, sample_vector[seg][2]), color_lower, _e2]);
      for (var ii = seg; ii >= 0; ii--) {
        shell[i].push([id, vec3.plus(o, sample_vector[ii][2]), color_side, sample_vector[ii][3]]);
      }
      // Quadrant I
      for (var ii = 1; ii <= seg; ii++) {
        shell[i].push([id, vec3.plus(o, sample_vector[ii][0]), color_side, sample_vector[ii][1]]);
      }
      shell[i].push([id, vec3.plus(o, sample_vector[seg][0]), color_upper, e2]);
    }
  },
  railwayShell: function(frame, shell, msg) {
    var msg = msg || {},
      width = msg.width || w3m.config.geom_railway_width,
      height = msg.height || w3m.config.geom_railway_height,
      radius = msg.radius ? Math.max(msg.radius, height / 2) :
      Math.max(w3m.config.geom_railway_radius, height / 2),
      end_mode = msg.end_mode || w3m.END_XX;
    side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_railway_side_differ,
      side_color = msg.side_color || w3m.config.geom_railway_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_color = msg.inner_color || w3m.config.geom_helix_inner_color,
      inner_face = msg.inner_face || w3m.INNERFACE_VARY;
    var seg = w3m.config.geom_railway_segment,
      dw = Math.sqrt(radius * radius - height * height / 4),
      theta = Math.acos(-dw / radius),
      dtheta = theta / seg,
      smooth_seg = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment,
      ww = width / 2 / smooth_seg;
    // sample
    var sample = [],
      width$2 = width / 2;
    for (var i = 0; i <= seg; i++) {
      var x = radius * Math.cos(i * dtheta),
        y = radius * Math.sin(i * dtheta),
        n = vec2.unit([x, y]);
      sample[i] = [
        [width$2 + x, y], n
      ];
    }
    // fill
    for (var i = 0, l = frame.length; i < l; i++) {
      var id = frame[i][0],
        o = frame[i][1],
        color = frame[i][2],
        e1 = frame[i][4],
        _e1 = vec3.negate(e1),
        e2 = frame[i][5],
        _e2 = vec3.negate(e2);
      var color_side = side_differ ? side_color : color;
      if (inner_differ) {
        if (inner_face == w3m.INNERFACE_VARY) {
          var color_upper = frame[i][6] ? inner_color : color,
            color_lower = !frame[i][6] ? inner_color : color;
        } else {
          var color_upper = inner_face == w3m.INNERFACE_TURNOVER ? inner_color : color,
            color_lower = inner_face == w3m.INNERFACE_NON_TURNOVER ? inner_color : color;
        }
      } else {
        var color_upper = color_lower = color;
      }
      // sample_vector
      var sample_vector = [],
        sp = sample[ii];
      if (i <= (smooth_seg + 1) && [w3m.END_XX, w3m.END_XO].indexOf(end_mode) >= 0) {
        var t = i * 2 > smooth_seg ? i - 1 : i,
          w_minus = ww * (smooth_seg - t);
      } else if (l - 1 - i <= (smooth_seg + 1) && [w3m.END_XX, w3m.END_OX].indexOf(end_mode) >= 0) {
        var j = l - 1 - i,
          t = j * 2 > smooth_seg ? j - 1 : j,
          w_minus = ww * (smooth_seg - t);
      } else {
        var w_minus = 0;
      }
      for (var ii = 0; ii <= seg; ii++) {
        var sp = sample[ii],
          e1_p_e2_xyz = math.polysum([sp[0][0] - w_minus, sp[0][1]], [e1, e2]),
          e1_p_e2_normal = math.polysum(sp[1], [e1, e2]),
          e1_m_e2_xyz = math.polysum([sp[0][0] - w_minus, sp[0][1]], [e1, _e2]),
          e1_m_e2_normal = math.polysum(sp[1], [e1, _e2]);
        sample_vector[ii] = [e1_p_e2_xyz, e1_p_e2_normal, e1_m_e2_xyz, e1_m_e2_normal];
      }
      // shell
      shell[i] = [];
      // Quadrant II
      shell[i].push([id, vec3.minus(o, sample_vector[seg][2]), color_upper, e2]);
      for (var ii = seg; ii >= 0; ii--) {
        shell[i].push([id, vec3.minus(o, sample_vector[ii][2]), color_side, vec3.negate(sample_vector[ii][3])]);
      }
      // Quadrant III
      for (var ii = 1; ii <= seg; ii++) {
        shell[i].push([id, vec3.minus(o, sample_vector[ii][0]), color_side, vec3.negate(sample_vector[ii][1])]);
      }
      shell[i].push([id, vec3.minus(o, sample_vector[seg][0]), color_lower, _e2]);
      // Quadrant IV
      shell[i].push([id, vec3.plus(o, sample_vector[seg][2]), color_lower, _e2]);
      for (var ii = seg; ii >= 0; ii--) {
        shell[i].push([id, vec3.plus(o, sample_vector[ii][2]), color_side, sample_vector[ii][3]]);
      }
      // Quadrant I
      for (var ii = 1; ii <= seg; ii++) {
        shell[i].push([id, vec3.plus(o, sample_vector[ii][0]), color_side, sample_vector[ii][1]]);
      }
      shell[i].push([id, vec3.plus(o, sample_vector[seg][0]), color_upper, e2]);
    }
  },
  ribbonShell: function(frame, shell, msg) {
    var msg = msg || {},
      width = w3m_isset(msg.width) ? msg.width : w3m.config.geom_ribbon_width,
      height = w3m_isset(msg.height) ? msg.height : w3m.config.geom_ribbon_height,
      side_height = w3m_isset(msg.side_height) ? msg.side_height : w3m.config.geom_ribbon_side_height,
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_ribbon_side_differ,
      side_color = msg.side_color || w3m.config.geom_ribbon_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_color = msg.inner_color || w3m.config.geom_helix_inner_color,
      inner_face = msg.inner_face || w3m.INNERFACE_VARY;
    side_height > height ? side_height = height : void(0);
    var seg = w3m.config.geom_ribbon_segment,
      dh = (height - side_height) / 2 / seg,
      a = width / 2,
      aa = a * a,
      b = height / 2,
      bb = b * b;
    // sample
    var sample = [];
    for (var i = 0; i <= seg; i++) {
      var y = b - (seg - i) * dh,
        x = a * Math.sqrt(1 - y * y / bb),
        n = vec2.unit([bb * x, aa * y]);
      sample[i] = [
        [x, y], n
      ];
    }
    // fill
    for (var i = 0, l = frame.length; i < l; i++) {
      var id = frame[i][0],
        o = frame[i][1],
        color = frame[i][2],
        e1 = frame[i][4],
        _e1 = vec3.negate(e1),
        e2 = frame[i][5],
        _e2 = vec3.negate(e2);
      var color_side = side_differ ? side_color : color;
      if (inner_differ) {
        if (inner_face == w3m.INNERFACE_VARY) {
          var color_upper = frame[i][6] ? inner_color : color,
            color_lower = !frame[i][6] ? inner_color : color;
        } else {
          var color_upper = inner_face == w3m.INNERFACE_TURNOVER ? inner_color : color,
            color_lower = inner_face == w3m.INNERFACE_NON_TURNOVER ? inner_color : color;
        }
      } else {
        var color_upper = color_lower = color;
      }
      // sample_vector
      var sample_vector = [];
      for (var ii = 0; ii <= seg; ii++) {
        var e1_p_e2_xyz = math.polysum(sample[ii][0], [e1, e2]),
          e1_p_e2_normal = math.polysum(sample[ii][1], [e1, e2]),
          e1_m_e2_xyz = math.polysum(sample[ii][0], [e1, _e2]),
          e1_m_e2_normal = math.polysum(sample[ii][1], [e1, _e2]);
        sample_vector[ii] = [e1_p_e2_xyz, e1_p_e2_normal, e1_m_e2_xyz, e1_m_e2_normal];
      }
      // shell
      shell[i] = [];
      // Quadrant I
      shell[i].push([id, vec3.plus(o, sample_vector[0][0]), color_side, e1]);
      for (var ii = 0; ii <= seg; ii++) {
        shell[i].push([id, vec3.plus(o, sample_vector[ii][0]), color_upper, sample_vector[ii][1]]);
      }
      // Quadrant II
      for (var ii = seg - 1; ii >= 0; ii--) {
        shell[i].push([id, vec3.minus(o, sample_vector[ii][2]), color_upper, vec3.negate(sample_vector[ii][3])]);
      }
      shell[i].push([id, vec3.minus(o, sample_vector[0][2]), color_side, _e1]);
      // Quadrant III
      shell[i].push([id, vec3.minus(o, sample_vector[0][0]), color_side, _e1]);
      for (var ii = 0; ii <= seg; ii++) {
        shell[i].push([id, vec3.minus(o, sample_vector[ii][0]), color_lower, vec3.negate(sample_vector[ii][1])]);
      }
      // Quadrant IV
      for (var ii = seg - 1; ii >= 0; ii--) {
        shell[i].push([id, vec3.plus(o, sample_vector[ii][2]), color_lower, sample_vector[ii][3]]);
      }
      shell[i].push([id, vec3.plus(o, sample_vector[0][2]), color_side, e1]);
    }
  },
  arrowheadShell: function(frame, shell, msg) {
    var msg = msg || {},
      width_max = w3m_isset(msg.width_max) ? msg.width_max : w3m.config.geom_arrowhead_lower,
      width_min = w3m_isset(msg.width_min) ? msg.width_min : w3m.config.geom_arrowhead_upper,
      height = w3m_isset(msg.height) ? msg.height : w3m.config.geom_arrow_height,
      h$2 = height / 2,
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_arrow_side_differ,
      side_color = msg.side_color || w3m.config.geom_arrow_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_color = msg.inner_color || w3m.config.geom_helix_inner_color,
      inner_face = msg.inner_face || w3m.INNERFACE_VARY;
    // shell
    for (var i = 0, l = frame.length; i < l; i++) {
      var t = i * 2 > l - 1 ? (i - 1) / (l - 2) : i / (l - 2),
        id = frame[i][0],
        o = frame[i][1],
        color = frame[i][2],
        e1 = frame[i][4],
        _e1 = vec3.negate(e1),
        e2 = frame[i][5],
        _e2 = vec3.negate(e2);
      var color_side = side_differ ? side_color : color,
        w_h = [((1 - t) * width_max + width_min) / 2, h$2],
        e1_p_e2 = math.polysum(w_h, [e1, e2]),
        e1_m_e2 = math.polysum(w_h, [e1, _e2]);
      if (inner_differ) {
        if (inner_face == w3m.INNERFACE_VARY) {
          var color_upper = frame[i][6] ? inner_color : color,
            color_lower = !frame[i][6] ? inner_color : color;
        } else {
          var color_upper = inner_face == w3m.INNERFACE_TURNOVER ? inner_color : color,
            color_lower = inner_face == w3m.INNERFACE_NON_TURNOVER ? inner_color : color;
        }
      } else {
        var color_upper = color_lower = color;
      }
      shell[i] = [
        [id, vec3.plus(o, e1_p_e2), color_side, e1],
        [id, vec3.plus(o, e1_p_e2), color_upper, e2],
        [id, vec3.minus(o, e1_m_e2), color_upper, e2],
        [id, vec3.minus(o, e1_m_e2), color_side, _e1],
        [id, vec3.minus(o, e1_p_e2), color_side, _e1],
        [id, vec3.minus(o, e1_p_e2), color_lower, _e2],
        [id, vec3.plus(o, e1_m_e2), color_lower, _e2],
        [id, vec3.plus(o, e1_m_e2), color_side, e1]
      ];
    }
  },
  // Filler
  // atom : [ id, xyz, color ]
  // path : [ [ id, xyz, color ], ... ]
  shell2face: function(shell, link, msg) {
    var msg = msg || {},
      saving = w3m_isset(msg.saving) ? msg.saving : true, // save point, using TRI_STRIP; otherwise, using TRI
      het = w3m_isset(msg.het) ? msg.het : false,
      ext = w3m_isset(msg.ext) ? msg.ext : false,
      len = shell.length;
    if (saving && !het && !ext) {
      var pt2vrtx = this.point2vertexMainTriangleStrip;
      for (var i = 0, l = link.length; i < l; i++) {
        var lk_a = link[i][0],
          lk_b = link[i][1];
        if (i % 2) {
          for (var ii = len; ii;) {
            pt2vrtx(shell[--ii][lk_a]);
            pt2vrtx(shell[ii][lk_b]);
          }
        } else {
          for (var ii = 0; ii < len;) {
            pt2vrtx(shell[ii][lk_a]);
            pt2vrtx(shell[ii++][lk_b]);
          }
        }
      }
      this.breakTriangleStrip();
    } else {
      var pt2vrtx = (!het && !ext) ? w3m.tool.point2vertexMainTriangle : (het ? w3m.tool.point2vertexHetTriangle : w3m.tool.point2vertexExtTriangle);
      for (var i = 0, l = link.length; i < l; i++) {
        var lk_a = link[i][0],
          lk_b = link[i][1];
        for (var ii = 0; ii < len - 1; ii++) {
          pt2vrtx(shell[ii][lk_a]);
          pt2vrtx(shell[ii + 1][lk_a]);
          pt2vrtx(shell[ii + 1][lk_b]);
          pt2vrtx(shell[ii][lk_a]);
          pt2vrtx(shell[ii + 1][lk_b]);
          pt2vrtx(shell[ii][lk_b]);
        }
      }
    }
  },
  dotFiller: function(atom, msg) {
    if (!atom) {
      return false;
    }
    var msg = msg || {},
      het = w3m_isset(msg.het) ? msg.het : false,
      ext = w3m_isset(msg.ext) ? msg.ext : false;
    var pt2vrtx = (!het && !ext) ? w3m.tool.point2vertexMainPoint : (het ? w3m.tool.point2vertexHetPoint : w3m.tool.point2vertexExtPoint);
    pt2vrtx(atom);
  },
  crossFiller: function(atom, msg) {
    if (!atom) {
      return false;
    }
    var msg = msg || {},
      het = w3m_isset(msg.het) ? msg.het : false,
      ext = w3m_isset(msg.ext) ? msg.ext : false;
    var pt2vrtx = (!het && !ext) ? w3m.tool.point2vertexMainLine : (het ? w3m.tool.point2vertexHetLine : w3m.tool.point2vertexExtLine);
    var id = atom[0],
      x = atom[1][0],
      y = atom[1][1],
      z = atom[1][2],
      color = atom[2],
      r = w3m.config.geom_cross_radius;
    pt2vrtx([id, [x + r, y, z], color]);
    pt2vrtx([id, [x - r, y, z], color]);
    pt2vrtx([id, [x, y + r, z], color]);
    pt2vrtx([id, [x, y - r, z], color]);
    pt2vrtx([id, [x, y, z + r], color]);
    pt2vrtx([id, [x, y, z - r], color]);
  },
  lineFiller: function(atom_1, atom_2, msg) {
    if (!atom_1 || !atom_2) {
      return false;
    }
    var msg = msg || {},
      het = w3m_isset(msg.het) ? msg.het : false,
      ext = w3m_isset(msg.ext) ? msg.ext : false;
    var pt2vrtx = (!het && !ext) ? w3m.tool.point2vertexMainLine : (het ? w3m.tool.point2vertexHetLine : w3m.tool.point2vertexExtLine);
    var xyz_mid = vec3.mid(atom_1[1], atom_2[1]);
    pt2vrtx(atom_1);
    pt2vrtx([atom_1[0], xyz_mid, atom_1[2]]);
    pt2vrtx([atom_2[0], xyz_mid, atom_2[2]]);
    pt2vrtx(atom_2);
  },
  dashFiller: function(atom_1, atom_2, msg) {
    if (!atom_1 || !atom_2) {
      return false;
    }
    var msg = msg || {},
      het = w3m_isset(msg.het) ? msg.het : false,
      ext = w3m_isset(msg.ext) ? msg.ext : false;
    var pt2vrtx = (!het && !ext) ? w3m.tool.point2vertexMainLine : (het ? w3m.tool.point2vertexHetLine : w3m.tool.point2vertexExtLine);
    var id_1 = atom_1[0],
      xyz_1 = atom_1[1],
      color_1 = atom_1[2],
      id_2 = atom_2[0],
      xyz_2 = atom_2[1],
      color_2 = atom_2[2],
      len = Math.ceil(vec3.dist(xyz_1, xyz_2) / w3m.config.geom_dash_gap);
    len % 2 ? len-- : void(0);
    pt2vrtx(atom_1);
    for (var i = 0; i < len; i++) {
      var xyz = vec3.step(i / len, xyz_1, xyz_2);
      if (2 * i < len) {
        pt2vrtx([id_1, xyz, color_1]);
      } else {
        pt2vrtx([id_2, xyz, color_2]);
      }
    }
    pt2vrtx(atom_2);
  },
  sphereFiller: function(atom, msg) {
    if (!atom) {
      return false;
    }
    var msg = msg || {},
      radius = w3m_isset(msg.radius) ? msg.radius : w3m.config.geom_sphere_radius,
      het = w3m_isset(msg.het) ? msg.het : false,
      ext = w3m_isset(msg.ext) ? msg.ext : false;
    var id = atom[0],
      xyz = atom[1],
      color = atom[2],
      vector = w3m.geometry.sphere_vector,
      link = w3m.geometry.sphere_link;
    var offset = parseInt(w3m.vertex_index.length / w3m.config.unit_vertex_geometry);
    if (!het && !ext && (offset < (65536 - 92))) {
      vector.forEach(function(v) {
        w3m.tool.point2vertexIndex([id, math.polysum([1, radius], [xyz, v]), color, v]);
      });
      link.forEach(function(n) {
        w3m.index.push(offset + n);
      });
    } else {
      var pt2vrtx = (!het && !ext) ? w3m.tool.point2vertexMainTriangle : (het ? w3m.tool.point2vertexHetTriangle : w3m.tool.point2vertexExtTriangle);
      link.forEach(function(n) {
        pt2vrtx([id, math.polysum([1, radius], [xyz, vector[n]]), color, vector[n]]);
      });
    }
  },
  traceFiller: function(path) {
    for (var i = 0, l = path.length; i < l; i++) {
      this.point2vertexMainLineStrip([path[i][0], path[i][1], path[i][2]]);
    }
    this.breakLineStrip();
  },
  stickFiller: function(atom_1, atom_2, msg) {
    if (!atom_1 || !atom_2) {
      return false;
    }
    var msg = msg || {},
      seg = msg.segment || w3m.config.geom_tube_segment,
      radius = msg.radius || w3m.config.geom_stick_radius,
      end_mode = msg.end_mode || w3m.END_XX,
      ref_tnb = msg.ref_tnb || null,
      het = w3m_isset(msg.het) ? msg.het : false,
      ext = w3m_isset(msg.ext) ? msg.ext : false;
    // frame
    var frame = [],
      tnb = [],
      xyz_mid = vec3.mid(atom_1[1], atom_2[1]);
    tnb[0] = vec3.unit(vec3.point(atom_1[1], atom_2[1]));
    if (ref_tnb) {
      var axis = vec3.cross(ref_tnb[0], tnb[0]);
      if (vec3.len(axis) > Number.EPSILON) {
        var theta = vec3.rad(ref_tnb[0], tnb[0], true);
        tnb[1] = vec3.unit(mat4.xvec3(mat4.orbit(vec3.unit(axis), theta), ref_tnb[1]));
      } else {
        tnb[1] = w3m_copy(ref_tnb[1]);
      }
      tnb[2] = vec3.cross(tnb[0], tnb[1]);
    } else {
      var tan_x = Math.abs(tnb[0][0]),
        tan_y = Math.abs(tnb[0][1]),
        tan_z = Math.abs(tnb[0][2]),
        seed;
      tan_x < tan_y ? (tan_z < tan_x ? seed = [0, 0, 1] : seed = [1, 0, 0]) :
        (tan_z < tan_y ? seed = [0, 0, 1] : seed = [0, 1, 0]);
      seed = vec3.cross(tnb[0], seed);
      tnb[1] = vec3.unit(vec3.cross(tnb[0], seed)),
        tnb[2] = vec3.cross(tnb[0], tnb[1]);
    }
    frame[0] = [atom_1[0], atom_1[1], atom_1[2]].concat(tnb);
    frame[1] = [atom_1[0], xyz_mid, atom_1[2]].concat(tnb);
    frame[2] = [atom_2[0], xyz_mid, atom_2[2]].concat(tnb);
    frame[3] = [atom_2[0], atom_2[1], atom_2[2]].concat(tnb);
    // shell
    var shell = [];
    this.tubeShell(frame, shell, {
      radius: radius
    });
    // fill
    var len = frame.length;
    // link
    var link = [];
    for (var i = 0; i < seg - 1; i++) {
      link.push([i, i + 1]);
    }
    link.push([seg - 1, 0]);
    // method
    var pt2vrtx = (!het && !ext) ? w3m.tool.point2vertexMainTriangle : (het ? w3m.tool.point2vertexHetTriangle : w3m.tool.point2vertexExtTriangle);
    // head
    if ([w3m.END_XX, w3m.END_XO, w3m.END_XS].indexOf(end_mode) >= 0) {
      var fm = frame[0],
        id = fm[0],
        o = fm[1],
        color = fm[2],
        normal = vec3.negate(fm[3]),
        sh = shell[0];
      link.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    } else if ([w3m.END_SS, w3m.END_SO, w3m.END_SX].indexOf(end_mode) >= 0) {
      this.sphereFiller(frame[0].slice(0, 3), {
        radius: radius,
        het: het,
        ext: ext
      });
    }
    // body
    this.shell2face(shell, link, {
      saving: false,
      het: het,
      ext: ext
    }); // false is important.
    // tail
    if ([w3m.END_XX, w3m.END_OX, w3m.END_SX].indexOf(end_mode) >= 0) {
      var fm = frame[len - 1],
        id = fm[0],
        o = fm[1],
        color = fm[2],
        normal = fm[3],
        sh = shell[len - 1];
      link.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    } else if ([w3m.END_SS, w3m.END_OS, w3m.END_XS].indexOf(end_mode) >= 0) {
      this.sphereFiller(frame[len - 1].slice(0, 3), {
        radius: radius,
        het: het,
        ext: ext
      });
    }
  },
  tubeFiller: function(frame, msg) {
    var msg = msg || {},
      seg = msg.segment || w3m.config.geom_tube_segment,
      radius = msg.radius || w3m.config.geom_tube_radius,
      end_mode = msg.end_mode || (w3m.config.geom_tube_round_end ? w3m.END_SS : w3m.END_XX),
      end_differ = w3m_isset(msg.end_differ) ? msg.end_differ : false,
      end_color = msg.end_color || null;
    // shell
    var shell = [];
    this.tubeShell(frame, shell, {
      radius: radius,
      segment: seg
    });
    // fill
    var len = frame.length;
	if(len==0){
		return;
	}
    // link
    var link = [];
    for (var i = 0; i < seg - 1; i++) {
      link.push([i, i + 1]);
    }
    link.push([seg - 1, 0]);
    // handle
    var pt2vrtx = this.point2vertexMainTriangle;
    // head
    if ([w3m.END_XX, w3m.END_XO, w3m.END_XS].indexOf(end_mode) >= 0) {
      var fm = frame[0],
        id = fm[0],
        o = fm[1],
        color = end_differ ? end_color : fm[2],
        normal = vec3.negate(fm[3]),
        sh = shell[0];
      link.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    } else if ([w3m.END_SS, w3m.END_SO, w3m.END_SX].indexOf(end_mode) >= 0) {
      var fm = frame[0],
        id = fm[0],
        o = fm[1],
        color = end_differ ? end_color : fm[2];
      this.sphereFiller([id, o, color], {
        radius: radius
      });
    }
    // body
    this.shell2face(shell, link);
    // tail
    if ([w3m.END_XX, w3m.END_OX, w3m.END_SX].indexOf(end_mode) >= 0) {
      var fm = frame[len - 1],
        id = fm[0],
        o = fm[1],
        color = end_differ ? end_color : fm[2],
        normal = fm[3],
        sh = shell[len - 1];
      link.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    } else if ([w3m.END_SS, w3m.END_XS, w3m.END_OS].indexOf(end_mode) >= 0) {
      var fm = frame[len - 1],
        id = fm[0],
        o = fm[1],
        color = end_differ ? end_color : fm[2];
      this.sphereFiller([id, o, color], {
        radius: radius
      });
    }

  },
  puttyFiller: function(frame) {
    // shell
    var shell = [];
    this.puttyShell(frame, shell);
    // fill
    var len = frame.length,
      seg = w3m.config.geom_tube_segment;
    // link
    var link = [];
    for (var i = 0; i < seg - 1; i++) {
      link.push([i, i + 1]);
    }
    link.push([seg - 1, 0]);
    // handle
    var pt2vrtx = this.point2vertexMainTriangle;
    // head
    var fm = frame[0],
      id = fm[0],
      o = fm[1],
      color = fm[2],
      normal = vec3.negate(fm[3]),
      sh = shell[0];
    link.forEach(function(lk) {
      pt2vrtx([id, o, color, normal]);
      pt2vrtx([id, sh[lk[0]][1], color, normal]);
      pt2vrtx([id, sh[lk[1]][1], color, normal]);
    });
    // body
    this.shell2face(shell, link);
    // tail
    var fm = frame[len - 1],
      id = fm[0],
      o = fm[1],
      color = fm[2],
      normal = fm[3],
      sh = shell[len - 1];
    link.forEach(function(lk) {
      pt2vrtx([id, o, color, normal]);
      pt2vrtx([id, sh[lk[0]][1], color, normal]);
      pt2vrtx([id, sh[lk[1]][1], color, normal]);
    });
  },
  cubeFiller: function(frame, msg) {
    var msg = msg || {},
      end_mode = msg.end_mode || w3m.END_XX,
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_cube_side_differ,
      side_color = msg.side_color || w3m.config.geom_cube_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_face = w3m_isset(msg.inner_face) ? msg.inner_face : false;
    // shell
    var shell = [];
    this.cubeShell(frame, shell, {
      side_differ: side_differ,
      side_color: side_color,
      inner_differ: inner_differ,
      inner_face: inner_face
    });
    return shell;
    //xukui commit start
    // // fill
    // var len = frame.length;
    //   // link
    // var lin  //k = [ [1,2], [3,4], [5,6], [7,0] ];
    //   // handle
    // var pt2vrtx = w3m.tool.point2vertexMainTriangle;
    //   // head
    // if ( [w3m.END_XX, w3m.END_XO].indexOf(end_mode) >= 0 ) {
    //     var fm     = frame[0],
    //         id     = fm[0],
    //         o      = fm[1],
    //         color  = side_differ ? side_color : fm[2],
    //         normal = vec3.negate(fm[3]),
    //         sh     = shell[0];
    //     link.forEach(function(lk) {
    //          //pt2vrtx( [ id, o,            color, normal ] );
    //         pt2vrtx( [ id, sh[lk[0]][1], color, normal ] );
    //         pt2vrtx( [ id, sh[lk[1]][1], color, normal ] );
    //     });
    // }
    //   // body
    // this.shell2face(shell, link);
    //   // tail
    // if ( [w3m.END_XX, w3m.END_OX].indexOf(end_mode) >= 0 ) {
    //     var fm     = frame[len-1],
    //         id     = fm[0],
    //         o      = fm[1],
    //         color  = side_differ ? side_color : fm[2],
    //         normal = fm[3],
    //         sh     = shell[len-1];
    //     link.forEach(function(lk) {
    //         pt2vrtx( [ id, o,            color, normal ] );
    //         pt2vrtx( [ id, sh[lk[0]][1], color, normal ] );
    //         pt2vrtx( [ id, sh[lk[1]][1], color, normal ] );
    //     });
    // }
    //xukui commit end
  },
  stripFiller: function(frame, msg) {
    var msg = msg || {},
      end_mode = msg.end_mode || w3m.END_XX,
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_strip_side_differ,
      side_color = msg.side_color || w3m.config.geom_strip_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_face = w3m_isset(msg.inner_face) ? msg.inner_face : false;
    // shell
    var shell = [];
    this.stripShell(frame, shell, {
      side_differ: side_differ,
      side_color: side_color,
      inner_differ: inner_differ,
      inner_face: inner_face
    });
    // fill
    var len = frame.length,
      seg = w3m.config.geom_strip_segment;
    // link
    var link = [];
    for (var a = 1, b = 2 * seg; a <= b; a++) {
      link.push([a, a + 1]);
    }
    link.push([2 * seg + 2, 2 * seg + 3]);
    for (var a = 2 * seg + 4, b = 4 * seg + 3; a <= b; a++) {
      link.push([a, a + 1]);
    }
    link.push([4 * seg + 5, 0]);
    // handle
    var pt2vrtx = w3m.tool.point2vertexMainTriangle;
    // head
    if ([w3m.END_XX, w3m.END_XO].indexOf(end_mode) >= 0) {
      var fm = frame[0],
        sh = shell[0];
      id = fm[0],
        o = fm[1],
        color = side_differ ? side_color : fm[2],
        normal = vec3.negate(fm[3]);
      link.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    }
    // body
    this.shell2face(shell, link);
    // tail
    if ([w3m.END_XX, w3m.END_OX].indexOf(end_mode) >= 0) {
      var fm = frame[len - 1],
        sh = shell[len - 1];
      id = fm[0],
        o = fm[1],
        color = side_differ ? side_color : fm[2],
        normal = fm[3];
      link.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    }
  },
  ribbonFiller: function(frame, msg) {
    var msg = msg || {},
      end_mode = msg.end_mode || w3m.END_XX,
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_ribbon_side_differ,
      side_color = msg.side_color || w3m.config.geom_ribbon_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_face = w3m_isset(msg.inner_face) ? msg.inner_face : false;
    // shell
    var shell = [];
    this.ribbonShell(frame, shell, {
      side_differ: side_differ,
      side_color: side_color,
      inner_differ: inner_differ,
      inner_face: inner_face
    });
    // fill
    var len = frame.length,
      seg = w3m.config.geom_ribbon_segment;
    // link
    var link = [];
    for (var i = 1, l = 2 * seg; i <= l; i++) {
      link.push([i, i + 1]);
    }
    link.push([2 * seg + 2, 2 * seg + 3]);
    for (var a = 2 * seg + 4, b = 4 * seg + 3; a <= b; a++) {
      link.push([a, a + 1]);
    }
    link.push([4 * seg + 5, 0]);
    // handle
    var pt2vrtx = w3m.tool.point2vertexMainTriangle;
    // head
    if ([w3m.END_XX, w3m.END_XO].indexOf(end_mode) >= 0) {
      var fm = frame[0],
        sh = shell[0];
      id = fm[0],
        o = fm[1],
        color = side_differ ? side_color : fm[2],
        normal = vec3.negate(fm[3]);
      link.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    }
    // body
    this.shell2face(shell, link);
    // tail
    if ([w3m.END_XX, w3m.END_OX].indexOf(end_mode) >= 0) {
      var fm = frame[len - 1],
        sh = shell[len - 1];
      id = fm[0],
        o = fm[1],
        color = side_differ ? side_color : fm[2],
        normal = fm[3];
      link.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    }
  },
  railwayFiller: function(frame, msg) {
    var msg = msg || {},
      end_mode = msg.end_mode || (w3m.config.geom_railway_end_close ? w3m.END_XX : w3m.END_OO),
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_railway_side_differ,
      side_color = msg.side_color || w3m.config.geom_railway_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_face = w3m_isset(msg.inner_face) ? msg.inner_face : false;
    // shell
    var shell = [];
    this.railwayShell(frame, shell, {
      end_mode: end_mode,
      side_differ: side_differ,
      side_color: side_color,
      inner_differ: inner_differ,
      inner_face: inner_face
    });
    // fill
    var len = frame.length,
      seg = w3m.config.geom_railway_segment;
    // link
    var link = [],
      link_circle_o1 = [],
      link_circle_o2 = [],
      link_rectangle = [];
    for (var a = 1, b = 2 * seg; a <= b; a++) {
      link.push([a, a + 1]);
      link_circle_o1.push([a, a + 1]);
    }
    link.push([2 * seg + 2, 2 * seg + 3]);
    link_circle_o1.push([2 * seg + 1, 1]);
    link_rectangle.push([0, 2 * seg + 2], [2 * seg + 2, 2 * seg + 3]);
    for (var a = 2 * seg + 4, b = 4 * seg + 3; a <= b; a++) {
      link.push([a, a + 1]);
      link_circle_o2.push([a, a + 1]);
    }
    link.push([4 * seg + 5, 0]);
    link_circle_o2.push([4 * seg + 4, 2 * seg + 4]);
    link_rectangle.push([2 * seg + 3, 4 * seg + 5], [4 * seg + 5, 0]);
    // handle
    var pt2vrtx = w3m.tool.point2vertexMainTriangle;
    // head
    var sh = shell[0],
      fm = frame[0],
      id = fm[0],
      o = fm[1],
      color = side_differ ? side_color : fm[2],
      normal = vec3.negate(fm[3]),
      w = w3m.config.geom_railway_width,
      o1 = vec3.minus(o, vec3.scalar(w / 2, fm[4])),
      o2 = vec3.plus(o, vec3.scalar(w / 2, fm[4]));
    if ([w3m.END_OO, w3m.END_OX].indexOf(end_mode) >= 0) {
      link_circle_o1.forEach(function(lk) {
        pt2vrtx([id, o1, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
      link_circle_o2.forEach(function(lk) {
        pt2vrtx([id, o2, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
      link_rectangle.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    } else {
      link_circle_o1.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
      link_circle_o2.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    }
    // body
    this.shell2face(shell, link);
    // tail
    var sh = shell[len - 1],
      fm = frame[len - 1],
      id = fm[0],
      o = fm[1],
      color = side_differ ? side_color : fm[2],
      normal = fm[3],
      w = w3m.config.geom_railway_width,
      o1 = vec3.minus(o, vec3.scalar(w / 2, fm[4])),
      o2 = vec3.plus(o, vec3.scalar(w / 2, fm[4]));
    if ([w3m.END_OO, w3m.END_OX].indexOf(end_mode) >= 0) {
      link_circle_o1.forEach(function(lk) {
        pt2vrtx([id, o1, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
      link_circle_o2.forEach(function(lk) {
        pt2vrtx([id, o2, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
      link_rectangle.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    } else {
      link_circle_o1.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
      link_circle_o2.forEach(function(lk) {
        pt2vrtx([id, o, color, normal]);
        pt2vrtx([id, sh[lk[0]][1], color, normal]);
        pt2vrtx([id, sh[lk[1]][1], color, normal]);
      });
    }
  },
  arrowheadFiller: function(frame, msg) {
    var msg = msg || {},
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : false,
      side_color = msg.side_color || w3m.config.geom_arrow_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_face = w3m_isset(msg.inner_face) ? msg.inner_face : false;
    // shell
    var shell = [];
    this.arrowheadShell(frame, shell, {
      side_differ: side_differ,
      side_color: side_color,
      inner_differ: inner_differ,
      inner_face: inner_face
    });
    return shell;
    // xukui comment start
    // // fill
    // var len = frame.length;
    //   // handle
    // var pt2vrtx = this.point2vertexMainTriangle,
    //     tript2vrtx = this.tripoint2ertexMainTriangle;
    //   // head end
    // var id     = frame[0][0],
    //     normal = vec3.negate(frame[0][3]),
    //     sh     = shell[0];
    // pt2vrtx( [ id, sh[0][1], sh[0][2], normal ] );
    // pt2vrtx( [ id, sh[3][1], sh[3][2], normal ] );
    // pt2vrtx( [ id, sh[4][1], sh[4][2], normal ] );
    // pt2vrtx( [ id, sh[0][1], sh[0][2], normal ] );
    // pt2vrtx( [ id, sh[4][1], sh[4][2], normal ] );
    // pt2vrtx( [ id, sh[7][1], sh[7][2], normal ] );
    // xukui comment end

    // head body

    // for ( var i = 0; i < len-1; i++ ) {
    //     tript2vrtx(shell[i][1], shell[i+1][1], shell[i+1][2]);
    //     tript2vrtx(shell[i][1], shell[i+1][2], shell[i  ][2]);
    //     tript2vrtx(shell[i][3], shell[i+1][3], shell[i+1][4]);
    //     tript2vrtx(shell[i][3], shell[i+1][4], shell[i  ][4]);
    //     tript2vrtx(shell[i][5], shell[i+1][5], shell[i+1][6]);
    //     tript2vrtx(shell[i][5], shell[i+1][6], shell[i  ][6]);
    //     tript2vrtx(shell[i][7], shell[i+1][7], shell[i+1][0]);
    //     tript2vrtx(shell[i][7], shell[i+1][0], shell[i  ][0]);
    // }
  },
  arrowFiller: function(frame, msg) {
    var msg = msg || {},
      side_differ = w3m_isset(msg.side_differ) ? msg.side_differ : w3m.config.geom_arrow_side_differ,
      side_color = msg.side_color || w3m.config.geom_arrow_side_color,
      inner_differ = w3m_isset(msg.inner_differ) ? msg.inner_differ : false,
      inner_face = w3m_isset(msg.inner_face) ? msg.inner_face : false;
    var len = frame.length,
      seg = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment;
    // body
    // ranx xukui add 2017-07-09
    var arrowPots = [];
    offset = PDB.GeoCenterOffset;
    //PDB.cartoonsheet=1;
    var shell = this.cubeFiller(frame.slice(0, len - (seg + 1)), {
      end_mode: w3m.END_XO,
      side_differ: side_differ,
      side_color: side_color,
      inner_differ: inner_differ,
      inner_face: inner_face
    });
    // var sheetPots =[],sheetColors=[],sheetIDs=[];
    if (PDB.config.selectedDrug !== w3m.global.mol) {
      for (var i = 0; i < shell.length; i++) {
        for (var j = 0; j < 4; j++) {
          var k = j * 2 + 1;
          var pos = new THREE.Vector3(shell[i][k][1][0] + offset.x, shell[i][k][1][1] + offset.y, shell[i][k][1][2] + offset.z);
          var atom = w3m.tool.getMainAtomById(w3m.global.mol, shell[i][k][0]);
          // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].sse = 11;
          if (atom && atom.resid) {
            w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].arrow.push(pos);
          }

          // sheetPots.push(pos);
          // sheetColors.push(shell[i][k][2]);
          // sheetIDs.push(shell[i][k][0]);
        }
      }
    }
    // PDB.cartoonSheetArray.push(sheetPots);
    // var obj = {
    // paths  : sheetPots,
    // colors : sheetColors,
    // ids    : sheetIDs
    // }
    // PDB.cartoonSheetArray.tail.push(obj);
    // arrowhead
    var shell = this.arrowheadFiller(frame.slice(len - (seg + 2)), {
      side_differ: side_differ,
      side_color: side_color,
      inner_differ: inner_differ,
      inner_face: inner_face
    });
    //xukui
    // var arrowPots =[];
    //ranx update
    // sheetPots =[],sheetColors=[],sheetIDs=[];
    var prepp = [],
      p_ = [];
    if (PDB.config.selectedDrug !== w3m.global.mol) {
      for (var i = 0; i < shell.length; i++) {
        for (var j = 0; j < 4; j++) {
          var k = j * 2 + 1;
          var pos = new THREE.Vector3(shell[i][k][1][0] + offset.x, shell[i][k][1][1] + offset.y, shell[i][k][1][2] + offset.z);
          // sheetPots.push(pos);
          // sheetColors.push(shell[i][k][2]);
          // sheetIDs.push(shell[i][k][0]);
          var atom = w3m.tool.getMainAtomById(w3m.global.mol, shell[i][k][0]);
          // w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].sse = 11;
          if (atom && atom.resid) {
			  //console.log(atom.resid);
            w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].arrow.push(pos);
          }

          // if(i==shell.length-2){
          // prepp.push([shell[i][k][1][0]+offset.x,shell[i][k][1][1]+offset.y,shell[i][k][1][2]+offset.z]);
          // }else if(i==shell.length-1){
          // p_.push([shell[i][k][1][0]+offset.x,shell[i][k][1][1]+offset.y,shell[i][k][1][2]+offset.z]);
          // color_= shell[i][k][1][2];
          // ids_  = shell[i][k][1][0];
          // }
        }
      }
    }


    // prepp = [(prepp[0][0]+prepp[1][0]+prepp[2][0]+prepp[3][0])/4,(prepp[0][1]+prepp[1][1]+prepp[2][1]+prepp[3][1])/4,(prepp[0][2]+prepp[1][2]+prepp[2][2]+prepp[3][2])/4];
    // p_ = [(p_[0][0]+p_[1][0]+p_[2][0]+p_[3][0])/4,(p_[0][1]+p_[1][1]+p_[2][1]+p_[3][1])/4,(p_[0][2]+p_[1][2]+p_[2][2]+p_[3][2])/4];
    // var ppoint = new THREE.Vector3(2*p_[0]-prepp[0],2*p_[1]-prepp[1],2*p_[2]-prepp[2]);
    // sheetPots.push(ppoint);
    // ppoint = new THREE.Vector3(4*p_[0]-3*prepp[0],4*p_[1]-3*prepp[1],4*p_[2]-3*prepp[2]);
    // sheetPots.push(ppoint);
    // var obj = {
    // paths  : sheetPots,
    // colors : sheetColors,
    // ids    : sheetIDs
    // }
    // PDB.cartoonSheetArray.head.push(obj);
  },
  cylinderFiller: function(frame, msg) {
    var msg = msg || {},
      radius = msg.radius || w3m.config.geom_cylinder_radius,
      seg = msg.segment || w3m.config.geom_cylinder_segment,
      end_mode = msg.end_mode || (w3m.config.geom_cylinder_round_end ? w3m.END_SS : w3m.END_XX),
      end_differ = w3m_isset(msg.end_differ) ? msg.end_differ : w3m.config.geom_cylinder_end_differ,
      end_color = msg.side_color || w3m.config.geom_cylinder_end_color;
    // dig out ori
    var len = frame.length,
      n = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment;
    // dig out oriframe from frame
    var oriframe = [],
      oriframe_len = (len - 1) / (n + 1) + 1;
    for (var i = 0; i < oriframe_len; i++) {
      w3m_isset(frame[i * (n + 1)]) ? oriframe[i] = w3m_copy(frame[i * (n + 1)]) : void(0);
    }
    // beeline
    var xyz_start = oriframe[0][1],
      xyz_stop = oriframe[oriframe.length - 1][1];
    tnb = [];
    tnb[0] = vec3.unit(vec3.point(xyz_start, xyz_stop));
    var seed,
      tan_x = Math.abs(tnb[0][0]),
      tan_y = Math.abs(tnb[0][1]),
      tan_z = Math.abs(tnb[0][2]);
    tan_x < tan_y ? (tan_z < tan_x ? seed = [0, 0, 1] : seed = [1, 0, 0]) :
      (tan_z < tan_y ? seed = [0, 0, 1] : seed = [0, 1, 0]);
    seed = vec3.cross(tnb[0], seed);
    tnb[1] = vec3.unit(vec3.cross(tnb[0], seed)),
      tnb[2] = vec3.cross(tnb[0], tnb[1]);
    var frame = [];
    frame[0] = oriframe[0].slice(0, 3).concat(tnb);
    for (var i = 1, l = oriframe.length; i < l; i++) {
      var t = i / (l - 1),
        xyz = vec3.step(t, xyz_start, xyz_stop),
        t_mid = (i - 0.5) / (l - 1),
        xyz_mid = vec3.step(t_mid, xyz_start, xyz_stop);
      frame.push([oriframe[i - 1][0], xyz_mid, oriframe[i - 1][2]].concat(tnb));
      frame.push([oriframe[i][0], xyz_mid, oriframe[i][2]].concat(tnb));
      frame.push([oriframe[i][0], xyz, oriframe[i][2]].concat(tnb));
    }
    // tube
    this.tubeFiller(frame, {
      end_mode: end_mode,
      end_differ: end_differ,
      end_color: end_color,
      radius: radius,
      segment: seg
    });
  },
  /* Fill Function */
  fillMainAsDot: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id],
      filler = w3m.config.geom_dot_as_cross ? w3m.tool.crossFiller : w3m.tool.dotFiller;
    for (var i = start; i <= stop; i++) {
      if (!w3m_isset(chain[i])) {
        continue;
      }
      var residue = chain[i],
        residue_name = mol.residue[chain_id][i],
        structure = w3m.structure.enum[residue_name];
      for (var ii = 0, ll = structure.length; ii < ll; ii++) {
        if (!w3m_isset(residue[structure[ii]])) {
          continue;
        }
        var atom_id = residue[structure[ii]];
        filler(mol.getMain(atom_id));
      }
    }
  },
  fillMainAsLine: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id];
    var chain_first = w3m_find_first(chain),
      bridge = chain_type == w3m.CHAIN_AA ? w3m.structure.bridge.amino_acid : w3m.structure.bridge.nucleic_acid;
    for (var i = start; i <= stop; i++) {
      if (!w3m_isset(chain[i])) {
        continue;
      }
      var residue = chain[i];
      // bridge link
      if (w3m_isset(chain[i - 1]) && i != chain_first) {
        var atom_id_pre, atom_id_cur;
        if (w3m_isset(atom_id_pre = chain[i - 1][bridge[0]]) && w3m_isset(atom_id_cur = residue[bridge[1]])) {
          //this.lineFiller( mol.getMain(atom_id_pre), mol.getMain(atom_id_cur) );
          // xukui
          var atom = w3m.tool.getMainAtomById(w3m.global.mol, atom_id_cur);
          if (PDB.residue && PDB.residue != "") {
            atom = w3m.tool.getMainAtomById(PDB.residue, atom_id_cur);
          }
          if (atom) {
            w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].lines.push([atom_id_pre, atom_id_cur]);
          }
          // PDB.linkedAtomIdArray.push([atom_id_pre, atom_id_cur]);
        }
      }
      // inner link
      var residue_name = mol.residue[chain_id][i],
        structure = w3m.structure.pair[residue_name];
      for (var ii = 0, ll = structure.length; ii < ll; ii += 2) {
        var atom_id_1, atom_id_2;
        if (w3m_isset(atom_id_1 = residue[structure[ii]]) && w3m_isset(atom_id_2 = residue[structure[ii + 1]])) {

          //this.lineFiller( mol.getMain(atom_id_1), mol.getMain(atom_id_2) );
          // xukui

          var atom = w3m.tool.getMainAtomById(w3m.global.mol, atom_id_2);
          if (PDB.residue && PDB.residue != "") {
            atom = w3m.tool.getMainAtomById(PDB.residue, atom_id_2);
          }
          if (atom) {
            w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].lines.push([atom_id_1, atom_id_2]);
          }


          // PDB.linkedAtomIdArray.push([atom_id_1, atom_id_2]);
        } else {
          atom_id_1 ? this.crossFiller(mol.getMain(atom_id_1)) : void(0);
          atom_id_2 ? this.crossFiller(mol.getMain(atom_id_2)) : void(0);
        }
      }
    }
  },
  fillMainAsBackbone: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id];
    var structure = chain_type == w3m.CHAIN_AA ? w3m.structure.backbone.amino_acid :
      w3m.structure.backbone.nucleic_acid;
    // part
    var part = w3m_split_by_undefined(chain, start, stop),
      chain_first = w3m_find_first(chain),
      chain_last = w3m_find_last(chain);
    for (var i in part) {
      // xukui
      // var backboneAtomID   = [];
      var path = [],
        part_start = part[i][0],
        part_stop = part[i][1];
      // isolation
      if (part_start == part_stop) {
        var residue = chain[part_start],
          represent = chain_type == w3m.CHAIN_AA ?
          w3m.structure.residue.amino_acid :
          (part_start == chain_first ? w3m.structure.residue.nucleic_acid_5_end_replace :
            w3m.structure.residue.nucleic_acid);
        if (!w3m_isset(residue[represent])) {
          continue;
        }
        this.crossFiller(mol.getMain(residue[represent]));
        continue;
      }
      // continuous
      for (var ii = part_start; ii <= part_stop; ii++) {
        var residue = chain[ii];
        for (var iii = 0, lll = structure.length; iii < lll; iii++) {
          if (!w3m_isset(residue[structure[iii]])) {
            continue;
          }
          var atom_id = residue[structure[iii]];
          path.push(mol.getMain(atom_id));
          //xukui
          // backboneAtomID.push(atom_id);
          var atom = w3m.tool.getMainAtomById(w3m.global.mol, atom_id);
          if (atom) {
            w3m.mol[w3m.global.mol].residueData[atom.chainname][atom.resid].bbond.push(atom_id);
          }

        }
      }

      // PDB.backboneAtomIdArray.push(backboneAtomID);
      // frame
      var frame = [];
      // fill
      if (w3m.config.geom_backbone_as_tube) {
        this.stickFrame(path, frame);
        //this.tubeFiller(frame);
        /* xk add frame data */

        // for(var i in path){
        //     var xyz = path[i][1];
        //     PDB.backboneArray.push({x:xyz[0],y:xyz[1],z:xyz[2]});
        // }
      } else {
        this.simpleFrame(path, frame, false);
        //this.traceFiller(frame);
      }
    }
  },
  fillMainAsStick: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id],
      radius = w3m.config.geom_stick_radius;
    var main_chain = chain_type == w3m.CHAIN_AA ? w3m.structure.main_chain.amino_acid :
      w3m.structure.main_chain.nucleic_acid;
    /* part */
    var part = w3m_split_by_undefined(chain, start, stop),
      chain_first = w3m_find_first(chain),
      chain_last = w3m_find_last(chain);
    for (var i in part) {
      var part_start = part[i][0],
        part_stop = part[i][1],
        link_map = [];
      /* main chain */
      var path = [],
        path_array = [];
      for (var ii = part_start; ii <= part_stop; ii++) {
        var residue = chain[ii],
          residue_name = mol.residue[chain_id][ii],
          main_chain_tee = w3m_copy(w3m.structure.main_chain_tee[residue_name]);
        for (var iii = 0, lll = main_chain.length; iii < lll; iii++) {
          if (!w3m_isset(residue[main_chain[iii]])) {
            path.length ? path_array.push(path) : void(0);
            path = [];
            continue;
          }
          var atom_name = main_chain[iii],
            atom_id = residue[atom_name],
            atom_info = mol.getMain(atom_id);
          main_chain_tee.indexOf(atom_name) >= 0 ?
            atom_info[3] = {
              cross_link: 1,
              residue_id: ii,
              atom_name: atom_name
            } :
            void(0);
          path.push(atom_info);
        }
      }
      path_array.push(path);
      for (var ipath = 0, lpath = path_array.length; ipath < lpath; ipath++) {
        var path = path_array[ipath];
        if (path.length >= 2) {
          // frame
          var frame = [];
          this.stickFrame(path, frame, link_map);
          // fill
          var end_mode = w3m['END_' + (part_start == part_start && w3m.config.geom_stick_round_end ? 'S' : 'X') +
            (part_stop == part_stop && w3m.config.geom_stick_round_end ? 'S' : 'X')];
          this.tubeFiller(frame, {
            end_mode: end_mode,
            radius: radius
          });
        } else if (path.length == 1) {
          this.crossFiller(path[0], {
            radius: radius
          });
        }
      }
      // sub chain
      for (var ii = part_start; ii <= part_stop; ii++) {
        var residue = chain[ii],
          residue_name = mol.residue[chain_id][ii];
        // sub_chain_common for nucleic_acid
        if (chain_type == w3m.CHAIN_NA) {
          var sub_chain_common = w3m.structure.sub_chain.nucleic_acid,
            sub_chain_common_tee = w3m.structure.sub_chain_tee.nucleic_acid,
            ref_tnb = (link_map[ii] && link_map[ii][sub_chain_common[0]]) || null,
            path = [],
            path_array = [];
          for (var iii = 0, lll = sub_chain_common.length; iii < lll; iii++) {
            if (!w3m_isset(residue[sub_chain_common[iii]])) {
              //w3m_isset(residue[sub_chain_common[iii-1]])
              //    ? this.sphereFiller(mol.getMain(residue[sub_chain_common[iii-1]]), { radius : radius })
              //    : void(0);
              path.length ? path_array.push(path) : void(0);
              path = [];
              continue;
            }
            var atom_name = sub_chain_common[iii],
              atom_id = residue[atom_name],
              atom_info = mol.getMain(atom_id);
            sub_chain_common_tee.indexOf(atom_name) >= 0 ?
              atom_info[3] = {
                cross_link: 1,
                residue_id: ii,
                atom_name: atom_name
              } :
              void(0);
            path.push(atom_info);
          }
          path_array.push(path);
          for (var ipath = 0, lpath = path_array.length; ipath < lpath; ipath++) {
            var path = path_array[ipath];
            if (path.length >= 2) {
              var frame = [];
              this.stickFrame(path, frame, link_map, ref_tnb);
              this.tubeFiller(frame, {
                end_mode: w3m.END_OO,
                radius: radius
              });
            } else if (path.length == 1) {
              this.crossFiller(path[0], {
                radius: radius
              });
            }
          }
        }
        // sub_chain
        var sub_chain = w3m.structure.sub_chain[residue_name],
          sub_chain_tee = w3m.structure.sub_chain_tee[residue_name],
          sub_chain_loop = w3m.structure.sub_chain_loop;
        ref_tnb = w3m_isset(link_map[ii]) && sub_chain.length ? link_map[ii][sub_chain[0]] : null,
          path = [], path_array = [];
        for (var iii = 0, lll = sub_chain.length; iii < lll; iii++) {
          if (!w3m_isset(residue[sub_chain[iii]])) {
            // w3m_isset(residue[sub_chain[iii-1]])
            //     ? this.sphereFiller(mol.getMain(residue[sub_chain[iii-1]]), { radius : radius })
            //     : void(0);
            path.length ? path_array.push(path) : void(0);
            path = [];
            continue;
          }
          var atom_name = sub_chain[iii],
            atom_id = residue[atom_name],
            atom_info = mol.getMain(atom_id);
          sub_chain_tee.indexOf(atom_name) >= 0 ?
            atom_info[3] = {
              cross_link: 1,
              residue_id: ii,
              atom_name: atom_name
            } :
            void(0);
          path.push(atom_info);
        }
        path_array.push(path);
        for (var ipath = 0, lpath = path_array.length; ipath < lpath; ipath++) {
          var path = path_array[ipath];
          if (path.length >= 2) {
            var frame = [];
            this.stickFrame(path, frame, link_map, ref_tnb);
            var end_mode = w3m['END_O' +
              (sub_chain_loop.indexOf(residue_name) >= 0 ? 'O' : (w3m.config.geom_stick_round_end ? 'S' : 'X'))];
            this.tubeFiller(frame, {
              end_mode: end_mode,
              radius: radius
            });
          } else if (path.length == 1) {
            this.crossFiller(path[0], {
              radius: radius
            });
          }
        }
        // hang link
        var hang_link = w3m_copy(w3m.structure.hang_link[residue_name]);
        for (var iii = 0, lll = hang_link.length; iii < lll; iii++) {
          var atom_name_1 = hang_link[iii][0],
            atom_name_2 = hang_link[iii][1];
          if (!w3m_isset(residue[atom_name_2])) {
            continue;
          }
          if (!w3m_isset(residue[atom_name_1])) {
            this.sphereFiller(mol.getMain(residue[atom_name_2]), {
              radius: radius
            });
            continue;
          }
          var atom_info_1 = mol.getMain(residue[atom_name_1]),
            atom_info_2 = mol.getMain(residue[atom_name_2]),
            ref_tnb = w3m_isset(link_map[ii]) ? link_map[ii][atom_name_1] : null,
            end_mode = w3m['END_O' + (w3m.config.geom_stick_round_end ? 'S' : 'X')];
          this.stickFiller(atom_info_1, atom_info_2, {
            end_mode: end_mode,
            radius: radius,
            ref_tnb: ref_tnb
          });
        }
        // inner link
        var inner_link = w3m.structure.inner_link[residue_name];
        for (var iii = 0, lll = inner_link.length; iii < lll; iii++) {
          var atom_name_1 = inner_link[iii][0],
            atom_name_2 = inner_link[iii][1];
          if (!w3m_isset(residue[atom_name_2])) {
            continue;
          }
          if (!w3m_isset(residue[atom_name_1])) {
            this.crossFiller(mol.getMain(residue[atom_name_2]), {
              radius: radius
            });
            continue;
          }
          var atom_info_1 = mol.getMain(residue[atom_name_1]),
            atom_info_2 = mol.getMain(residue[atom_name_2]),
            ref_tnb = w3m_isset(link_map[ii]) ? link_map[ii][atom_name_1] : null;
          this.stickFiller(atom_info_1, atom_info_2, {
            end_mode: w3m.END_OO,
            radius: radius,
            ref_tnb: ref_tnb
          });
        }
      }
    }
  },
  fillMainAsTube: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id];
    // part
    var part = w3m_split_by_undefined(chain, start, stop);
    for (var i in part) {
      var path = [],
        part_start = part[i][0],
        part_stop = part[i][1];
      if (chain_type == w3m.CHAIN_AA) {
        var structure = w3m.structure.residue.amino_acid;
        // isolation
        if (part_start == part_stop) {
          var residue = chain[part_start];
          if (!w3m_isset(residue[structure])) {
            continue;
          }
          this.sphereFiller(mol.getMain(residue[structure]), {
            radius: w3m.config.geom_tube_radius
          });
          continue;
        }
        // continuous
        for (var ii = part_start; ii <= part_stop; ii++) {
          var residue = chain[ii];
          if (!w3m_isset(residue[structure])) {
            continue;
          }
          var atom_info = mol.getMain(residue[structure]);
          if (w3m.config.fill_tube_putty &&
            w3m.global.average.b_factor_backbone[1] != 0 &&
            !w3m_isempty(w3m.global.limit.b_factor_backbone)) {
            var b_factor = mol.atom.main[residue[structure]][8];
            if (b_factor) {
              atom_info[6] = b_factor;
            }
          }
          path.push(atom_info);
        }
      } else {
        var chain_first = w3m_find_first(chain),
          chain_last = w3m_find_last(chain);
        // isolated
        if (part_start == part_stop) {
          var residue = chain[part_start],
            represent = part_start == chain_first ? w3m.structure.residue.nucleic_acid_5_end_replace :
            w3m.structure.residue.nucleic_acid;
          if (!w3m_isset(residue[represent])) {
            continue;
          }
          this.sphereFiller(mol.getMain(residue[represent]), {
            radius: w3m.config.geom_tube_radius
          });
          continue;
        }
        // continuous
        for (var ii = part_start; ii <= part_stop; ii++) {
          var residue = chain[ii],
            structure = ii == chain_first ? w3m.structure.residue.nucleic_acid_5_end_replace :
            w3m.structure.residue.nucleic_acid;
          if (!w3m_isset(residue[structure])) {
            continue;
          }
          var atom_info = mol.getMain(residue[structure]);
          if (w3m.config.fill_tube_putty &&
            w3m.global.average.b_factor_backbone[1] != 0 &&
            !w3m_isempty(w3m.global.limit.b_factor_backbone)) {
            var b_factor = mol.atom.main[residue[structure]][8];
            if (b_factor) {
              atom_info[6] = b_factor;
            }
          }
          path.push(atom_info);
          ii == chain_last && w3m_isset(residue[w3m.structure.residue.nucleic_acid_3_end_push]) ?
            path.push(mol.getMain(residue[w3m.structure.residue.nucleic_acid_3_end_push])) :
            void(0);
        }
      }
      /* frame */
      var frame = [];
      w3m.config.geom_tube_smooth ? this.smoothFrame(path, frame) : this.simpleFrame(path, frame);


      /* ranx frame data */
      // var arrayTube       = new Array();
      // //================================
      // //========== SSE xukui ===========
      // //================================
      // var tubeSSEPath     = new Array();
      // //var tubeResiduePath = new Array();
      // var preResdue   ={id:""};
      // var prepp ;
      // // var preResid = "",
      // //     preSSE   = "",
      // //     preChain = "", ;
      // var id          = frame[0][0];
      // var atom        = this.getMainAtom(id);
      // var chain       = atom.chainname;
      // // var helixAreas  = w3m.mol[w3m.global.mol].helix[chain];
      // // var sheetAreas  = w3m.mol[w3m.global.mol].sheet[chain];
      // var ss          = w3m.mol[w3m.global.mol].ss[chain];
      // var ssetype     = 2;// 0:helix, 1:sheet, 2:loop
      // var ihArea      = 0;
      // var isArea      = 0;
      // for(var i in frame){
      // var x     = frame[i][1][0];
      // var y     = frame[i][1][1];
      // var z     = frame[i][1][2];
      // var id    = frame[i][0];
      // var color = frame[i][2];
      // if(i>1){
      // var xyz_obj = {x:frame[i-1][1][0],y:frame[i-1][1][1],z:frame[i-1][1][2]};
      // if(x ==xyz_obj.x&&y ==xyz_obj.y&&z ==xyz_obj.z ){
      // continue;
      // }
      // }
      // var c_x = x + PDB.GeoCenterOffset.x;
      // var c_y = y + PDB.GeoCenterOffset.y;
      // var c_z = z + PDB.GeoCenterOffset.z;
      // var p = new THREE.Vector3( c_x, c_y, c_z);
      // atom = this.getMainAtom(id);
      // chain = atom.chainname;
      // if(atom.resid !=preResdue.id){
      // // if(helixAreas!=undefined){
      // //     r=helixAreas[ihArea];
      // //     if(r!=undefined && atom.resid>=r[0] && atom.resid<=r[1]){ssetype = 0;}
      // //     if(r!=undefined && atom.resid>r[1]) {ihArea++};
      // // }
      // // if(sheetAreas!=undefined){
      // //     r=sheetAreas[isArea];
      // //     if(r!=undefined && atom.resid>=r[0] && atom.resid<=r[1]){ssetype = 1;}
      // //     if(r!=undefined && atom.resid>r[1]) {isArea++};
      // // }
      // ssetype = Math.floor((ss[atom.resid][0]-1500)/10);
      // // arrow
      // if(ss[atom.resid][0] == 1512){ssetype =2;}
      // // SSE parts connection
      // if(preResdue.sse != ssetype && tubeSSEPath.length!=0){
      // // PDB.tubeSSE.push({path:tubeSSEPath, id:id, c:color, resid: preResid, sse:preSSE, chain:preChain});
      // //var prepp = preResdue.pp;
      // midpp = new THREE.Vector3((prepp.x+p.x)/2, (prepp.y+p.y)/2, (prepp.z+p.z)/2);
      // // add the mid path point into the pre SSE path
      // tubeSSEPath.push(midpp);
      // PDB.tubeSSE.push({path:tubeSSEPath, residue:preResdue});
      // tubeSSEPath = new Array();

      // // add mid point into the next SSE path
      // tubeSSEPath.push(midpp);

      // }

      // // if(tubeResiduePath.length!=0){
      // //     PDB.tubeResidue.push({path:tubeResiduePath, id:id, c:color, resid: preResid, sse:preSSE, chain:preChain});
      // //     tubeResiduePath = new Array();
      // // }
      // // pp : path point
      // preResdue = {id: atom.resid, name:atom.resname, sse: ssetype, chain:chain};

      // // preResid = atom.resid;
      // // preSSE   = ssetype;
      // // preChain = chain;
      // // return to the default value
      // ssetype  = 2;
      // }
      // // chain head x0 = (3*x1 - x2)
      // if(i==0){
      // var x1     = frame[1][1][0];
      // var y1     = frame[1][1][1];
      // var z1     = frame[1][1][2];
      // var c_x1   = x1 + PDB.GeoCenterOffset.x;
      // var c_y1   = y1 + PDB.GeoCenterOffset.y;
      // var c_z1   = z1 + PDB.GeoCenterOffset.z;
      // var _x = (3*c_x - c_x1)/2,
      // _y = (3*c_y - c_y1)/2,
      // _z = (3*c_z - c_z1)/2;
      // var p = new THREE.Vector3( _x, _y,  _z);
      // tubeSSEPath.push(p);
      // arrayTube.push(p);
      // }

      // tubeSSEPath.push(p);
      // arrayTube.push(p);
      // // tubeResiduePath.push( new THREE.Vector3( x+ PDB.GeoCenterOffset.x,
      // //             y+PDB.GeoCenterOffset.y,z+PDB.GeoCenterOffset.z));
      // //arrayTube.push({x:c_x,y:c_y,z:c_z,id:id,c:color});

      // // chain tail  x_(n+1) = (3*x_(n) - x_(n-1))
      // if(i==frame.length - 1){
      // var x1 = frame[i-1][1][0];
      // var y1 = frame[i-1][1][1];
      // var z1 = frame[i-1][1][2];
      // var c_x1   = x1 + PDB.GeoCenterOffset.x;
      // var c_y1   = y1 + PDB.GeoCenterOffset.y;
      // var c_z1   = z1 + PDB.GeoCenterOffset.z;
      // var _x = (3*c_x - c_x1)/2,
      // _y = (3*c_y - c_y1)/2,
      // _z = (3*c_z - c_z1)/2;
      // var p = new THREE.Vector3( _x, _y,  _z);
      // tubeSSEPath.push(p);
      // arrayTube.push(p);
      // //arrayTube.push({x:_x, y:_y, z:_z, id:id, c:color});

      // }
      // prepp = p;
      // }
      // //if(tubeResiduePath.length!=0){
      // PDB.tubeSSE.push({path:tubeSSEPath, residue:preResdue});
      // // PDB.tubeSSE.push({path:tubeSSEPath, id:id, c:color, resid: preResid, sse:preSSE, chain:preChain});
      // // PDB.tubeResidue.push({path:tubeResiduePath, id:id, c:color, resid: preResid, sse:preSSE, chain:preChain});
      // //PDB.tubeResidue.push(tubeResiduePath);
      // //}
      // // id, xyz, color, tan
      // PDB.tubeArray.push(arrayTube);
      // console.log(frame);
      //this.tubeFiller(frame);
    }
  },
  getMainAtom: function(id) {
    atom = w3m.mol[w3m.global.mol].atom.main[id];
    return this.getAtomById(atom, 'main');
  },
  getAtomById: function(atom, structure) {
    //atom = w3m.mol[molid].atom.main[id];

    var atomID = atom[1];
    var atomName = atom[2];
    var residueName = atom[3];
    var chainName = atom[4];
    var residueID = atom[5];
    var xyz = atom[6];
    var b_factor = atom[7];
    var coe = atom[8];
    var atomType = atom[9];

    var radius = w3m.geometry["radius"][atomType];

    var pos = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
    // Center the geometry
    offset = PDB.GeoCenterOffset;
    var pos_centered = new THREE.Vector3(
      xyz[0] + offset.x,
      xyz[1] + offset.y,
      xyz[2] + offset.z);

    //var color_index = w3m.mol[w3m.global.mol].color_real[atomID];//取得{r:*g:*,b:*}格式的颜�?
    var color = PDB.tool.getColorByIndex(atomID, structure);

    var atomObj = {
      id: atomID,
      name: atomName,
      resname: residueName,
      chainname: chainName,
      resid: residueID,
      pos: pos,
      pos_centered: pos_centered,
      bfactor: b_factor,
      coe: coe,
      type: atomType,
      radius: radius,
      color: color
    };
    return atomObj;
  },
  fillMainAsPutty: function(mol_id, chain_id, start, stop) {
    if (w3m.global.average.b_factor_backbone[1] == 0 || w3m_isempty(w3m.global.limit.b_factor_backbone)) {
      this.fillMainAsTube(mol_id, chain_id, start, stop);
      return;
    }
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id];
    // part
    var part = w3m_split_by_undefined(chain, start, stop);
    for (var i in part) {
      var path = [],
        part_start = part[i][0],
        part_stop = part[i][1];
      if (chain_type == w3m.CHAIN_AA) {
        var structure = w3m.structure.residue.amino_acid;
        // isolation
        if (part_start == part_stop) {
          var residue = chain[part_start];
          if (!w3m_isset(residue[structure])) {
            continue;
          }
          this.sphereFiller(mol.getMain(residue[structure]), {
            radius: w3m.config.geom_tube_radius
          });
          continue;
        }
        // continuous
        for (var ii = part_start; ii <= part_stop; ii++) {
          var residue = chain[ii];
          if (!w3m_isset(residue[structure])) {
            continue;
          }
          var atom_info = mol.getMain(residue[structure]),
            b_factor = mol.atom.main[residue[structure]][8];
          if (b_factor) {
            atom_info[6] = b_factor;
          }
          path.push(atom_info);
        }
      } else {
        var chain_first = w3m_find_first(chain),
          chain_last = w3m_find_last(chain);
        // isolated
        if (part_start == part_stop) {
          var residue = chain[part_start],
            represent = part_start == chain_first ? w3m.structure.residue.nucleic_acid_5_end_replace :
            w3m.structure.residue.nucleic_acid;
          if (!w3m_isset(residue[represent])) {
            continue;
          }
          this.sphereFiller(mol.getMain(residue[represent]), {
            radius: w3m.config.geom_tube_radius
          });
          continue;
        }
        // continuous
        for (var ii = part_start; ii <= part_stop; ii++) {
          var residue = chain[ii],
            structure = ii == chain_first ? w3m.structure.residue.nucleic_acid_5_end_replace :
            w3m.structure.residue.nucleic_acid;
          if (!w3m_isset(residue[structure])) {
            continue;
          }
          var atom_info = mol.getMain(residue[structure]),
            b_factor = mol.atom.main[residue[structure]][8];
          if (b_factor) {
            atom_info[6] = b_factor;
          }
          path.push(atom_info);
          ii == chain_last && w3m_isset(residue[w3m.structure.residue.nucleic_acid_3_end_push]) ?
            path.push(mol.getMain(residue[w3m.structure.residue.nucleic_acid_3_end_push])) :
            void(0);
        }
      }
      /* frame */
      var frame = [];
      this.puttyFrame(path, frame);
      this.puttyFiller(frame);
    }
  },
  fillMainAsCubeStripRibbonRailwayArrow: function(rep, mol_id, chain_id, start, stop) {
	  //console.log("fillMainAsCubeStripRibbonRailwayArrow:");
    var mol = w3m.mol[mol_id];
    if (mol.chain[chain_id] != w3m.CHAIN_AA) {
      this.fillNucleicAcid(mol_id, chain_id, start, stop);
      return;
    }
    var chain = mol.tree.main[chain_id],
      chain_first = w3m_find_first(chain),
      chain_last = w3m_find_last(chain),
      guide = w3m.structure.residue.amino_acid,
      normal_token = w3m.structure.normal.amino_acid;
    // part
    var part = w3m_split_by_undefined(chain, start, stop);
    w3m.CLENGTH = 1;
    for (var i = 0, l = part.length; i < l; i++) {
      var path = [],
        part_start = part[i][0],
        part_stop = part[i][1],
        last_normal = [];
      // isolated
      if (part_start == part_stop) {
        var residue = chain[part_start];
        if (!w3m_isset(residue[guide])) {
          continue;
        }
        this.sphereFiller(mol.getMain(residue[guide]), {
          radius: w3m.config.geom_tube_radius
        });
        continue;
      }
      // continuous
      for (var ii = part_start; ii <= part_stop; ii++) {
        var residue = chain[ii],
          atom_id;
        if (!w3m_isset(atom_id = residue[guide])) {
          continue;
        }
        // atom_info
        var atom_info = mol.getMain(atom_id);
        // normal is decided by two atoms' position.
        if (w3m_isset(residue[normal_token[0]]) && w3m_isset(residue[normal_token[1]])) {
          var normal = vec3.point(mol.atom.main[residue[normal_token[0]]][6],
            mol.atom.main[residue[normal_token[1]]][6]);
          // normal fix! Necessary! Important!
          var turnover = ii > part_start && vec3.dot(last_normal, normal) < 0 ? true : false;
          turnover ? normal = vec3.negate(normal) : void(0);
        } else {
          var normal = [0, 0, 0],
            turnover = [0, 0, 0];
        }
        atom_info[4] = normal;
        atom_info[6] = turnover;
        path.push(atom_info);
        last_normal = w3m_copy(normal);
      }
      /* Frame */
      var frame = [];
      path.length > 2 ? this.naturalFrame(path, frame, false) : this.simpleFrame(path, frame);
      /* Fill */
      switch (rep) {
        case w3m.CUBE:
          this.cubeFiller(frame);
          break;
        case w3m.STRIP:
          this.stripFiller(frame);
          break;
        case w3m.RIBBON:
          this.ribbonFiller(frame);
          break;
        case w3m.RAILWAY:
          this.railwayFiller(frame);
          break;
        case w3m.ARROW:
          this.arrowFiller(frame);
          break;
      }
    }
  },
  fillMainAsCube: function(mol_id, chain_id, start, stop) {
    this.fillMainAsCubeStripRibbonRailwayArrow(w3m.CUBE, mol_id, chain_id, start, stop);
  },
  fillMainAsStrip: function(mol_id, chain_id, start, stop) {
    this.fillMainAsCubeStripRibbonRailwayArrow(w3m.STRIP, mol_id, chain_id, start, stop);
  },
  fillMainAsRibbon: function(mol_id, chain_id, start, stop) {
    this.fillMainAsCubeStripRibbonRailwayArrow(w3m.RIBBON, mol_id, chain_id, start, stop);
  },
  fillMainAsRailway: function(mol_id, chain_id, start, stop) {
    this.fillMainAsCubeStripRibbonRailwayArrow(w3m.RAILWAY, mol_id, chain_id, start, stop);
  },
  fillMainAsArrow: function(mol_id, chain_id, start, stop) {
    this.fillMainAsCubeStripRibbonRailwayArrow(w3m.ARROW, mol_id, chain_id, start, stop);
  },
  fillMainAsCartoon: function(mol_id, chain_id, start, stop) {
	//console.log("fillMainAsCartoon:");
    var offset = PDB.GeoCenterOffset;
    var mol = w3m.mol[mol_id];
    if (mol.chain[chain_id] != w3m.CHAIN_AA) {
      w3m.CLENGTH = 2;
      this.fillNucleicAcid(mol_id, chain_id, start, stop);
      w3m.CLENGTH = 0;
      return;
    }
    var chain = mol.tree.main[chain_id],
      chain_first = w3m_find_first(chain),
      chain_last = w3m_find_last(chain);
    var helix_info = mol.helix[chain_id] || [],
      sheet_info = mol.sheet[chain_id] || [];
    // part
    var part = w3m_split_by_undefined(chain, start, stop),
      structure = w3m.structure.residue.amino_acid,
      normal_token = w3m.structure.normal.amino_acid;

    for (var i = 0, l = part.length; i < l; i++) {
      var path = [],
        part_start = part[i][0],
        part_stop = part[i][1],
        last_normal = [];
      // isolated
      if (part_start == part_stop) {
        var residue = chain[part_start];
        if (!w3m_isset(residue[structure])) {
          continue;
        }
        this.sphereFiller(mol.getMain(residue[structure]), {
          radius: w3m.config.geom_tube_radius
        });
        continue;
      }
      // continuous
      for (var ii = part_start; ii <= part_stop; ii++) {
        var residue = chain[ii];
        if (!w3m_isset(residue[structure])) {
          continue;
        }
        // atom_info
        var atom_info = mol.getMain(residue[structure]);
        // normal is decided by two atoms' position.
        if (w3m_isset(residue[normal_token[0]]) && w3m_isset(residue[normal_token[1]])) {
          var normal = vec3.point(mol.atom.main[residue[normal_token[0]]][6],
            mol.atom.main[residue[normal_token[1]]][6]);
          // normal fix! Necessary! Important! for beta-sheel
          var turnover = ii > part_start && vec3.dot(last_normal, normal) < 0 ? true : false;
          turnover ? normal = vec3.negate(normal) : void(0);
        } else {
          var normal = [0, 0, 0],
            turnover = [0, 0, 0];
        }
        atom_info[4] = normal;
        atom_info[6] = turnover;
        path.push(atom_info);
        last_normal = w3m_copy(normal);
      }
      /* Frame */
      var frame = [];
      if (path.length > 2) {
        this.naturalFrame(path, frame);
      } else if (path.length == 2) {
        this.simpleFrame(path, frame);
      } else {
        continue;
      }

      /* Fill */
      // SS
      var ss_map = mol.ss[chain_id],
        ss_array = [];
      for (var ii = part_start; ii <= part_stop; ii++) {
        switch (ss_map[ii][0]) {
          case w3m.HELIX:
          case w3m.HELIX_HEAD:
          case w3m.HELIX_BODY:
          case w3m.HELIX_FOOT:
            ss_array[ii] = w3m.HELIX;
            break;
          case w3m.SHEET:
          case w3m.SHEET_HEAD:
          case w3m.SHEET_BODY:
          case w3m.SHEET_FOOT:
            ss_array[ii] = w3m.SHEET;
            break;
          case w3m.LOOP:
          case w3m.LOOP_HEAD:
          case w3m.LOOP_BODY:
          case w3m.LOOP_FOOT:
            ss_array[ii] = w3m.LOOP;
            break;
        }
      }
      var ss_split = w3m_split_by_difference(ss_array);
      var ss = {
        loop: [],
        helix: [],
        sheet: []
      };
      //console.log(ss_split);
      for (var ii in ss_split) {
        var ss_split_array = ss_split[ii],
          ss_start = ss_split_array[0],
          ss_stop = ss_split_array[1],
          ss_type = ss_split_array[2];
        if ([w3m.HELIX, w3m.SHEET].indexOf(ss_type) >= 0 && w3m_isset(ss_split[ii - 1])) {
          if ([w3m.HELIX, w3m.SHEET].indexOf(ss_split[ii - 1][2]) >= 0) {
            ss.loop.push([ss_split[ii - 1][1], ss_start]);
          }
        }
        switch (ss_type) {
          case w3m.HELIX:
            ss.helix.push([ss_start, ss_stop]);
            break;
          case w3m.SHEET:
            ss.sheet.push([ss_start, ss_stop]);
            break;
          case w3m.LOOP:
            ss.loop.push([ss_start == part_start ? ss_start : ss_start - 1,
              ss_stop == part_stop ? ss_stop : ss_stop + 1
            ]);
            break;
        }
      }
      // Fill
      var seg = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment;
      for (var ii in ss.helix) {
        var ss_start = ss.helix[ii][0],
          ss_stop = ss.helix[ii][1];
        // isolation
        if (ss_start == ss_stop) {
          var residue = chain[ss_start];
          if (!w3m_isset(residue[w3m.structure.residue.amino_acid])) {
            continue;
          }
          this.sphereFiller(mol.getMain(residue[w3m.structure.residue.amino_acid]), {
            radius: w3m.config.geom_tube_radius
          });
          continue;
        }
        // normal
        var geom_start = (ss_start - part_start) * (seg + 1),
          geom_stop = (ss_stop - part_start) * (seg + 1),
          geom_frame = frame.slice(geom_start, geom_stop + 1);

        //ranx
        //get all cartoonHLObj data -->helix
        // var tempa = [0,0,0];
        // var pathss = [],colors = [], ids = [],tangents  = [],normals = [],binormals = [];
        // for(var t in geom_frame){
        // var xyza = geom_frame[t][1];
        // if(tempa[0]!=xyza[0]&&tempa[1]!=xyza[1]&&tempa[2]!=xyza[2]){//delete the replicated spots
        // var colorId = geom_frame[t][2];
        // var id = geom_frame[t][0];
        // var xyz3 = new THREE.Vector3(xyza[0]+offset.x,xyza[1]+offset.y,xyza[2]+offset.z);
        // tempa[0] = xyza[0];
        // tempa[1] = xyza[1];
        // tempa[2] = xyza[2];
        // //add the tangent&normal&binormal information
        // var tangent = new THREE.Vector3( geom_frame[t][3][0],geom_frame[t][3][1],geom_frame[t][3][2]);
        // var normal = new THREE.Vector3( geom_frame[t][4][0],geom_frame[t][4][1],geom_frame[t][4][2]);
        // var binormal = new THREE.Vector3( geom_frame[t][5][0],geom_frame[t][5][1],geom_frame[t][5][2]);
        // ids.push(id);
        // pathss.push(xyz3);
        // colors.push(colorId);
        // tangents.push(tangent);
        // normals.push(normal);
        // binormals.push(binormal);
        // // pathss.push({id:id,color:colorId,xyz:xyz3,tangent:tangent,normal:normal,binormal:binormal});
        // }

        // }
        // PDB.cartoonHLObj.helix.push([ids,pathss,colors,tangents,normals,binormals]);
        if (w3m.config.geom_helix_mode == w3m.HIDE) {} else if (w3m.config.geom_helix_mode == w3m.TUBE) {
          var end_mode = w3m['END_' +
            (ss_start == part_start && w3m.config.geom_tube_round_end ? 'S' : 'X') +
            (ss_stop == part_stop && w3m.config.geom_tube_round_end ? 'S' : 'X')];
          this.tubeFiller(geom_frame, {
            end_mode: end_mode
          });
        } else if (w3m.config.geom_helix_mode == w3m.CYLINDER) {
          this.cylinderFiller(geom_frame);
        } else {
          // judge the inner face
          var inner_face_turnover_count = 0;
          geom_frame.forEach(function(item) {
            item[6] ? inner_face_turnover_count++ : void(0)
          });
          var inner_face = inner_face_turnover_count / geom_frame.length > 0.5 ?
            w3m.INNERFACE_TURNOVER : w3m.INNERFACE_NON_TURNOVER;
          var inner_differ = w3m.config.geom_helix_inner_differ ? true : false,
            side_differ = w3m.config.geom_helix_side_differ ? true : false,
            side_color = side_differ ? w3m.config.geom_helix_side_color : null;
          msg = {
            inner_differ: inner_differ,
            inner_face: inner_face,
            side_differ: side_differ,
            side_color: side_color
          };
          switch (w3m.config.geom_helix_mode) {
            case w3m.CUBE:
              this.cubeFiller(geom_frame, msg);
              break;
            case w3m.STRIP:
              this.stripFiller(geom_frame, msg);
              break;
            case w3m.RAILWAY:
              this.railwayFiller(geom_frame, msg);
              break;
            case w3m.RIBBON:
              this.ribbonFiller(geom_frame, msg);
              break;
            case w3m.ARROW:
              this.arrowFiller(geom_frame, msg);
              break;
            default:
              this.cubeFiller(geom_frame, msg);
          }
        }
      }
      for (var ii in ss.sheet) {
        var ss_start = ss.sheet[ii][0],
          ss_stop = ss.sheet[ii][1];
        // isolation
        if (ss_start == ss_stop) {
          var residue = chain[ss_start];
          if (!w3m_isset(residue[w3m.structure.residue.amino_acid])) {
            continue;
          }
          this.sphereFiller(mol.getMain(residue[w3m.structure.residue.amino_acid]), {
            radius: w3m.config.geom_tube_radius
          });
          continue;
        }
        // normal
        var geom_start = (ss_start - part_start) * (seg + 1),
          geom_stop = (ss_stop - part_start) * (seg + 1),
          geom_frame = frame.slice(geom_start, geom_stop + 1);
        w3m.config.geom_sheet_flat ? geom_frame = this.zigzagFix(geom_frame) : void(0); // flat sheet
        if (w3m.config.geom_sheet_mode == w3m.HIDE) {} else if (w3m.config.geom_sheet_mode == w3m.TUBE) {
          var end_mode = w3m['END_' +
            (ss_start == part_start && w3m.config.geom_tube_round_end ? 'S' : 'X') +
            (ss_stop == part_stop && w3m.config.geom_tube_round_end ? 'S' : 'X')];
          this.tubeFiller(geom_frame, {
            end_mode: end_mode
          });
        } else {
          var side_differ = w3m.config.geom_sheet_side_differ ? true : false,
            side_color = side_differ ? w3m.config.geom_sheet_side_color : null,
            msg = {
              side_differ: side_differ,
              side_color: side_color
            };
          switch (w3m.config.geom_sheet_mode) {
            case w3m.CUBE:
              this.cubeFiller(geom_frame, msg);
              break;
            case w3m.STRIP:
              this.stripFiller(geom_frame, msg);
              break;
            case w3m.RAILWAY:
              this.railwayFiller(geom_frame, msg);
              break;
            case w3m.RIBBON:
              this.ribbonFiller(geom_frame, msg);
              break;
            case w3m.ARROW:
              this.arrowFiller(geom_frame, msg);
              break;
            default:
              this.arrowFiller(geom_frame, msg);
          }
        }
      }
      for (var ii in ss.loop) {
        var ss_start = ss.loop[ii][0],
          ss_stop = ss.loop[ii][1];
        // isolation
        if (ss_start == ss_stop) {
          var residue = chain[ss_start];
          if (!w3m_isset(residue[w3m.structure.residue.amino_acid])) {
            continue;
          }
          this.sphereFiller(mol.getMain(residue[w3m.structure.residue.amino_acid]), {
            radius: w3m.config.geom_tube_radius
          });
          continue;
        }
        // normal
        var geom_start = (ss_start - part_start) * (seg + 1),
          geom_stop = (ss_stop - part_start) * (seg + 1),
          geom_frame = frame.slice(geom_start, geom_stop + 1);
        //ranx
        //get all cartoonHLObj data -->loop
        // var tempa = [0,0,0];
        // var pathss = [],colors = [],ids = [];
        // for(var t in geom_frame){
        // var xyza = geom_frame[t][1];
        // if(tempa[0]!=xyza[0]&&tempa[1]!=xyza[1]&&tempa[2]!=xyza[2]){
        // var colorId = geom_frame[t][2];
        // var id = geom_frame[t][0];
        // var xyz3 = new THREE.Vector3(xyza[0]+offset.x,xyza[1]+offset.y,xyza[2]+offset.z);
        // tempa[0] = xyza[0];
        // tempa[1] = xyza[1];
        // tempa[2] = xyza[2];
        // pathss.push(xyz3);
        // colors.push(colorId);
        // ids.push(id);
        // }
        // }
        // PDB.cartoonHLObj.loop.push([ids,pathss,colors]);
        // if ( w3m.config.geom_loop_mode == w3m.HIDE ) {
        // } else {
        // this.twistFix(geom_frame); // anti-twisting. Necessary!
        // var end_mode = w3m[ 'END_'
        // + ( ss_start == part_start && w3m.config.geom_tube_round_end ? 'S' : 'X' )
        // + ( ss_stop  == part_stop  && w3m.config.geom_tube_round_end ? 'S' : 'X' ) ];
        // this.tubeFiller(geom_frame, { end_mode : end_mode });
        // }
      }
    }
  },
  fillMainAsSphere: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id];
    /* chain */
    for (var i = start; i <= stop; i++) {
      if (!w3m_isset(chain[i])) {
        continue;
      }
      var residue = chain[i],
        residue_name = mol.residue[chain_id][i],
        structure = w3m.structure.enum[residue_name];
      /* fill */
      for (var ii = 0, ll = structure.length; ii < ll; ii++) {
        if (!w3m_isset(residue[structure[ii]])) {
          continue;
        }
        var atom_id = residue[structure[ii]];
        //PDB.sphereArray.push({atom:mol.getMain(atom_id),radius:w3m.geometry.radius[mol.atom.main[atom_id][9]]});
        //this.sphereFiller(mol.getMain(atom_id), { radius : w3m.geometry.radius[mol.atom.main[atom_id][9]] });
      }
    }
  },
  fillResidueAsBallAndRod: function(mol_id, chain_id, residue_id) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id];
    if (!w3m_isset(chain[residue_id])) {
      return;
    }
    var residue = chain[residue_id],
      residue_name = mol.residue[chain_id][residue_id],
      structure = w3m.structure.pair[residue_name];
    for (var ii = 0, ll = structure.length; ii < ll; ii += 2) {
      var atom_id_1, atom_id_2;
      if (!w3m_isset(atom_id_1 = residue[structure[ii]]) || !w3m_isset(atom_id_2 = residue[structure[ii + 1]])) {
        continue;
      }
      var atom_info_1 = mol.getMain(atom_id_1),
        atom_info_2 = mol.getMain(atom_id_2);
      this.stickFiller(atom_info_1, atom_info_2, {
        end_mode: w3m.END_OO,
        radius: w3m.config.geom_rod_radius
      });
      this.sphereFiller(atom_info_1, {
        radius: w3m.config.geom_ball_radius
      });
      this.sphereFiller(atom_info_2, {
        radius: w3m.config.geom_ball_radius
      });
    }
  },
  fillNucleicAcid: function(mol_id, chain_id, start, stop) {
    var pdboffset = PDB.GeoCenterOffset;
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id],
      chain_first = w3m_find_first(chain),
      chain_last = w3m_find_last(chain);
    // part
    var part = w3m_split_by_undefined(chain, start, stop),
      chain_first = w3m_find_first(chain),
      chain_last = w3m_find_last(chain);
    for (var i = 0, l = part.length; i < l; i++) {
      var path = [],
        frame = [],
        part_start = part[i][0],
        part_stop = part[i][1];
      // isolated
      if (part_start == part_stop) {
        var residue = chain[part_start],
          represent = part_start == chain_first ? w3m.structure.residue.nucleic_acid_5_end_replace :
          w3m.structure.residue.nucleic_acid;
        if (!w3m_isset(residue[represent])) {
          continue;
        }
        this.sphereFiller(mol.getMain(residue[represent]), {
          radius: w3m.config.geom_tube_radius
        });
        continue;
      }
      // continuous
      for (var ii = part_start; ii <= part_stop; ii++) {
        var structure = ii == chain_first ? w3m.structure.residue.nucleic_acid_5_end_replace :
          w3m.structure.residue.nucleic_acid;
        var residue = chain[ii];
        w3m_isset(residue[structure]) ? path.push(mol.getMain(residue[structure])) : void(0);
        ii == chain_last && w3m_isset(residue[w3m.structure.residue.nucleic_acid_3_end_push]) ?
          path.push(mol.getMain(residue[w3m.structure.residue.nucleic_acid_3_end_push])) :
          void(0);
      }

      this.smoothFrame(path, frame);
      this.tubeFiller(frame);
      /* base */
      var seg = w3m.config.smooth_segment % 2 ? w3m.config.smooth_segment + 1 : w3m.config.smooth_segment,
        offset = 0;
      for (var ii = part_start; ii <= part_stop; ii++) {
		  if(!w3m.structure.normal[mol.residue[chain_id][ii]]){
			 continue;
		  }
        var residue = chain[ii],
          residue_name = mol.residue[chain_id][ii],
          normal_index = seg * offset + seg / 2,
          normal_token_1 = residue[w3m.structure.normal[residue_name][0]],
          normal_token_2 = residue[w3m.structure.normal[residue_name][1]];
        // var atom = w3m.tool.getMainAtomById(w3m.global.mol,id);


        if (normal_token_1 && normal_token_2) {
          // normal
          var normal_info_1 = mol.getMain(normal_token_1),
            normal_info_2 = mol.getMain(normal_token_2),
            end_mode = w3m.config.geom_tube_round_end ? w3m.END_OS : w3m.END_OX;
          // fix
		  if(frame[normal_index]){
			  normal_info_1[0] = frame[normal_index][0];
			  normal_info_1[1] = frame[normal_index][1];
			  if (w3m.CLENGTH == 2) {
				var residueData = w3m.mol[w3m.global.mol].residueData[chain_id][ii];
				if (residueData.dnaStick == undefined) {
				  residueData.dnaStick = [];
				}
				var startPoint = {
				  id: normal_token_1,
				  xyz: new THREE.Vector3(pdboffset.x + normal_info_1[1][0], pdboffset.y + normal_info_1[1][1], pdboffset.z + normal_info_1[1][2]),
				};
				var endPoint = {
				  id: normal_token_2,
				  xyz: new THREE.Vector3(pdboffset.x + normal_info_2[1][0], pdboffset.y + normal_info_2[1][1], pdboffset.z + normal_info_2[1][2]),
				};
				residueData.dnaStick.push([startPoint, endPoint]);
			  }
			  // fill
			  this.stickFiller(normal_info_1, normal_info_2, {
				radius: w3m.config.geom_tube_radius,
				end_mode: end_mode
			  });
		  }

        }
        offset++;
      }
    }
  },
  fillSSBond: function(mol_id) {
    var mol = w3m.mol[mol_id],
      ssbond_map = mol.ssbond,
      rep_map = mol.rep;
    for (var i in ssbond_map) {
      var bond = ssbond_map[i],
        chain_id_1 = bond[0],
        residue_id_1 = bond[1],
        chain_id_2 = bond[2],
        residue_id_2 = bond[3],
        residue_1 = mol.tree.main[chain_id_1][residue_id_1],
        residue_2 = mol.tree.main[chain_id_2][residue_id_2],
        p1ca = p1cb = p1sg = p2sg = p2cb = p2ca = null;
      switch (rep_map[chain_id_1][residue_id_1]) {
        case w3m.DOT:
        case w3m.LINE:
        case w3m.STICK:
        case w3m.SPHERE:
          p1sg = residue_1.sg;
          break;
        case w3m.BACKBONE:
        case w3m.TUBE:
        case w3m.CARTOON:
        case w3m.PUTTY:
        case w3m.CUBE:
        case w3m.STRIP:
        case w3m.RIBBON:
        case w3m.RAILWAY:
        case w3m.ARROW:
          p1ca = residue_1.ca;
          p1cb = residue_1.cb;
          p1sg = residue_1.sg;
          break;
      }
      switch (rep_map[chain_id_2][residue_id_2]) {
        case w3m.DOT:
        case w3m.LINE:
        case w3m.STICK:
        case w3m.SPHERE:
          p2sg = residue_2.sg;
          break;
        case w3m.BACKBONE:
        case w3m.TUBE:
        case w3m.CARTOON:
        case w3m.PUTTY:
        case w3m.CUBE:
        case w3m.STRIP:
        case w3m.RIBBON:
        case w3m.RAILWAY:
        case w3m.ARROW:
          p2ca = residue_2.ca;
          p2cb = residue_2.cb;
          p2sg = residue_2.sg;
          break;
      }
      var S_color = w3m.color.element.s;
      p1ca && p1cb ? this.dashFiller(mol.getMain(p1ca), mol.getMain(p1cb), {
        ext: true
      }) : void(0);
      p1cb && p1sg ? this.dashFiller(mol.getMain(p1cb), mol.getMain(p1sg), {
        ext: true
      }) : void(0);
      p2ca && p2cb ? this.dashFiller(mol.getMain(p2ca), mol.getMain(p2cb), {
        ext: true
      }) : void(0);
      p2cb && p2sg ? this.dashFiller(mol.getMain(p2cb), mol.getMain(p2sg), {
        ext: true
      }) : void(0);
      if (p1sg && p2sg) {
        var atom_info_p1sg = mol.getMain(p1sg),
          atom_info_p2sg = mol.getMain(p2sg);
        // this.rodFiller( atom_info_p1sg, atom_info_p2sg, { ext : true } );
        this.stickFiller(atom_info_p1sg, atom_info_p2sg, {
          end_mode: w3m.END_OO,
          radius: w3m.config.geom_rod_radius,
          ext: true
        });
        this.point2vertexLabel([atom_info_p1sg[1], 'S']);
        this.point2vertexLabel([atom_info_p2sg[1], 'S']);
      }
    }
  },
  fillMeasurement: function() {
    for (var i in w3m.global.measure) {
      var ms = w3m.global.measure[i],
        mol = w3m.mol[w3m.global.mol],
        line_color = w3m.config.measure_line_color;
      if (ms && ms.show) {
        if (ms.type == w3m.MEASURE_DISTANCE) {
          var atom_A = ms.point.a ? mol.getAtom(ms.point.a).slice(0, 2).concat([line_color]) : null,
            atom_B = ms.point.b ? mol.getAtom(ms.point.b).slice(0, 2).concat([line_color]) : null;
          atom_A && atom_B ? this.lineFiller(atom_A, atom_B, {
            ext: true
          }) : void(0);
          ms.label_xyz ? this.point2vertexLabel([ms.label_xyz, ms.result]) : void(0);
        } else if (ms.type == w3m.MEASURE_VECTOR_ANGLE) {
          var atom_A = ms.point.a ? mol.getAtom(ms.point.a).slice(0, 2).concat([line_color]) : null,
            atom_B = ms.point.b ? mol.getAtom(ms.point.b).slice(0, 2).concat([line_color]) : null,
            atom_C = ms.point.c ? mol.getAtom(ms.point.c).slice(0, 2).concat([line_color]) : null;
          atom_A && atom_B ? this.lineFiller(atom_A, atom_B, {
            ext: true
          }) : void(0);
          atom_A && atom_C ? this.lineFiller(atom_A, atom_C, {
            ext: true
          }) : void(0);
          ms.label_xyz ? this.point2vertexLabel([ms.label_xyz, ms.result]) : void(0);
        } else if (ms.type == w3m.MEASURE_DIHEDRAL_ANGLE) {
          var atom_A = ms.point.a ? mol.getAtom(ms.point.a).slice(0, 2).concat([line_color]) : null,
            atom_B = ms.point.b ? mol.getAtom(ms.point.b).slice(0, 2).concat([line_color]) : null,
            atom_C = ms.point.c ? mol.getAtom(ms.point.c).slice(0, 2).concat([line_color]) : null,
            atom_D = ms.point.d ? mol.getAtom(ms.point.d).slice(0, 2).concat([line_color]) : null;
          atom_A && atom_B ? this.dashFiller(atom_A, atom_B, {
            ext: true
          }) : void(0);
          atom_A && atom_C ? this.lineFiller(atom_A, atom_C, {
            ext: true
          }) : void(0);
          atom_B && atom_C ? this.lineFiller(atom_B, atom_C, {
            ext: true
          }) : void(0);
          atom_A && atom_D ? this.lineFiller(atom_A, atom_D, {
            ext: true
          }) : void(0);
          atom_B && atom_D ? this.lineFiller(atom_B, atom_D, {
            ext: true
          }) : void(0);
          ms.label_xyz ? this.point2vertexLabel([ms.label_xyz, ms.result]) : void(0);
        } else if (ms.type == w3m.MEASURE_TRIANGLE_AREA) {
          var atom_A = ms.point.a ? mol.getAtom(ms.point.a).slice(0, 2).concat([line_color]) : null,
            atom_B = ms.point.b ? mol.getAtom(ms.point.b).slice(0, 2).concat([line_color]) : null,
            atom_C = ms.point.c ? mol.getAtom(ms.point.c).slice(0, 2).concat([line_color]) : null;
          atom_A && atom_B ? this.dashFiller(atom_A, atom_B, {
            ext: true
          }) : void(0);
          atom_A && atom_C ? this.dashFiller(atom_A, atom_C, {
            ext: true
          }) : void(0);
          atom_B && atom_C ? this.dashFiller(atom_B, atom_C, {
            ext: true
          }) : void(0);
          ms.label_xyz ? this.point2vertexLabel([ms.label_xyz, ms.result]) : void(0);
        }
      }
    }
  },
  fillCellUnit: function() {
    var mol = w3m.mol[w3m.global.mol];
    if (mol.info.cell.len && mol.info.cell.angle) {
      var a = mol.info.cell.len[0],
        b = mol.info.cell.len[1],
        c = mol.info.cell.len[2],
        A = math.degree2rad(mol.info.cell.angle[0]),
        sinA = Math.sin(A),
        cosA = Math.cos(A),
        B = math.degree2rad(mol.info.cell.angle[1]),
        sinB = Math.sin(B),
        cosB = Math.cos(B),
        C = math.degree2rad(mol.info.cell.angle[2]),
        sinC = Math.sin(C),
        cosC = Math.cos(C);
      var uX = [1, 0, 0],
        uY = [cosC, sinC, 0],
        uZ = [cosB, (cosA - cosB * cosC) / sinC, 0];
      uZ[2] = Math.sqrt(1 - uZ[0] * uZ[0] - uZ[1] * uZ[1]);
      var X = vec3.setlen(a, uX),
        Y = vec3.setlen(b, uY),
        Z = vec3.setlen(c, uZ);
      var atom_1 = [0, [0, 0, 0], 1],
        atom_2 = [0, X, 1],
        atom_3 = [0, Y, 1],
        atom_4 = [0, vec3.plus(X, Y), 1],
        atom_5 = [0, Z, 1],
        atom_6 = [0, vec3.plus(X, Z), 1],
        atom_7 = [0, vec3.plus(Y, Z), 1],
        atom_8 = [0, vec3.plus(X, vec3.plus(Y, Z)), 1];
      this.lineFiller(atom_1, atom_2, {
        ext: true
      });
      this.lineFiller(atom_1, atom_3, {
        ext: true
      });
      this.lineFiller(atom_2, atom_4, {
        ext: true
      });
      this.lineFiller(atom_3, atom_4, {
        ext: true
      });
      this.lineFiller(atom_1, atom_5, {
        ext: true
      });
      this.lineFiller(atom_2, atom_6, {
        ext: true
      });
      this.lineFiller(atom_3, atom_7, {
        ext: true
      });
      this.lineFiller(atom_4, atom_8, {
        ext: true
      });
      this.lineFiller(atom_5, atom_6, {
        ext: true
      });
      this.lineFiller(atom_5, atom_7, {
        ext: true
      });
      this.lineFiller(atom_6, atom_8, {
        ext: true
      });
      this.lineFiller(atom_7, atom_8, {
        ext: true
      });
    }
  },
  fillHetAsDot: function(mol_id) {
    var mol = w3m.mol[mol_id],
      remove_hoh = w3m.config.remove_water_mol,
      filler = w3m.config.geom_dot_as_cross ? w3m.tool.crossFiller : w3m.tool.dotFiller;
    for (var i in mol.tree.het) {
      var chain = mol.tree.het[i];
      chain.forEach(function(atom_id) {
        remove_hoh && mol.atom.het[atom_id][3] == 'hoh' ? void(0) : filler(mol.getHet(atom_id), {
          het: true
        });
      });
    }
  },
  fillHetAsLine: function(mol_id) {
    var that = this;
    var mol = w3m.mol[mol_id];
    // o.connect
    for (var i in mol.connect) {
      var connect = mol.connect[i];
      if (!connect.length) {

      }
      // var atom_id_1 = i;
      //connect.forEach(function(ii) {
      //    var atom_id_2 = ii;
      //  xukui
      //PDB.linkedHetAtomIdArray.push([atom_id_1,atom_id_2 ]);
      //that.lineFiller( mol.getAtom(atom_id_1), mol.getAtom(atom_id_2), { het : true } );
      //});
    }
    // o.single
    var remove_hoh = w3m.config.remove_water_mol;
    for (var i in mol.single) {
      remove_hoh && mol.atom.het[i][3] == 'hoh' ? void(0) : this.crossFiller(mol.getHet(i), {
        het: true
      });
    }
  },
  fillHetAsStick: function(mol_id) {
    var that = this;
    var mol = w3m.mol[mol_id];
    var sphere_atom = {};
    // o.connect
    for (var i in mol.connect) {
      var connect = mol.connect[i];
      if (!connect.length) {
        continue;
      }
      var atom_id_1 = i;
      sphere_atom[atom_id_1] = 0;
      connect.forEach(function(ii) {
        var atom_id_2 = ii;
        sphere_atom[atom_id_2] = 0;
        that.stickFiller(mol.getAtom(atom_id_1), mol.getAtom(atom_id_2), {
          end_mode: w3m.END_OO,
          het: true
        });
      });
    }
    // sphere_atom
    for (var i in sphere_atom) {
      this.sphereFiller(mol.getAtom(i), {
        radius: w3m.config.geom_stick_radius,
        het: true
      });
    }
    // o.single
    var remove_hoh = w3m.config.remove_water_mol;
    for (var i in mol.single) {
      remove_hoh && mol.atom.het[i][3] == 'hoh' ?
        void(0) : this.crossFiller(mol.getHet(i), {
          radius: w3m.config.geom_stick_radius,
          het: true
        });
    }
  },
  fillHetAsBallAndRod: function(mol_id) {
    var that = this;
    var mol = w3m.mol[mol_id];
    // sphere
    var radius = w3m.config.geom_ball_radius,
      remove_hoh = w3m.config.remove_water_mol;
    for (var i in mol.tree.het) {
      var chain = mol.tree.het[i];
      chain.forEach(function(atom_id) {
        if (mol.atom.het[atom_id][3] == 'hoh') {
          remove_hoh ? void(0) : that.crossFiller(mol.getHet(atom_id), {
            het: true
          });
        } else {
          that.sphereFiller(mol.getHet(atom_id), {
            radius: radius,
            het: true
          });
        }
      });
    }
    // rod
    var radius = w3m.config.geom_rod_radius;
    for (var i in mol.connect) {
      var connect = mol.connect[i];
      if (!connect.length) {
        continue;
      }
      var atom_id_1 = i;
      connect.forEach(function(ii) {
        var atom_id_2 = ii;
        that.stickFiller(mol.getAtom(atom_id_1), mol.getAtom(atom_id_2), {
          end_mode: w3m.END_OO,
          radius: radius,
          het: true
        });
      });
    }
  },
  fillHetAsSphere: function(mol_id) {
    var that = this;
    var mol = w3m.mol[mol_id];
    var remove_hoh = w3m.config.remove_water_mol;
    for (var i in mol.tree.het) {
      var chain = mol.tree.het[i];
      chain.forEach(function(atom_id) {
        if (mol.atom.het[atom_id][3] == 'hoh') {
          remove_hoh ? void(0) : that.crossFiller(mol.getHet(atom_id), {
            het: true
          });
        } else {
          that.sphereFiller(mol.getHet(atom_id), {
            radius: w3m.geometry.radius[mol.atom.het[atom_id][9]],
            het: true
          });
        }
      });
    }
  },
  // Label
  labeler: function(atom_info, label_content) {
    var atom_xyz = atom_info[6],
      atom_id = atom_info[1],
      chain_id = atom_info[4].toUpperCase(),
      atom_name = w3m_capfirst(atom_info[2]),
      residue_id = atom_info[5],
      residue_name = w3m_array_has(w3m.dict.cap_last, atom_info[3]) ? w3m_caplast(atom_info[3]) : w3m_capfirst(atom_info[3]),
      element = w3m_capfirst(atom_info[9]);
    switch (label_content) {
      // Atom
      case w3m.LABEL_ATOM_NAME:
        this.point2vertexLabel([atom_xyz, atom_name]);
        break;
      case w3m.LABEL_ATOM_ID:
        this.point2vertexLabel([atom_xyz, atom_id]);
        break;
      case w3m.LABEL_ATOM_NAME_AND_ID:
        this.point2vertexLabel([atom_xyz, atom_name + '-' + atom_id]);
        break;
        // Element
      case w3m.LABEL_ELEMENT:
        this.point2vertexLabel([atom_xyz, element]);
        break;
      case w3m.LABEL_ELEMENT_AND_ID:
        this.point2vertexLabel([atom_xyz, element + '-' + atom_id]);
        break;
        // Residue
      case w3m.LABEL_RESIDUE_NAME:
        this.point2vertexLabel([atom_xyz, residue_name]);
        break;
      case w3m.LABEL_RESIDUE_ID:
        this.point2vertexLabel([atom_xyz, residue_id]);
        break;
      case w3m.LABEL_RESIDUE_NAME_AND_ID:
        this.point2vertexLabel([atom_xyz, residue_name + residue_id]);
        break;
        // Chain
      case w3m.LABEL_CHAIN_ID:
        this.point2vertexLabel([atom_xyz, chain_id]);
        break;
      case w3m.LABEL_CHAIN_AND_RESIDUE:
        this.point2vertexLabel([atom_xyz, chain_id + '.' + residue_name + residue_id]);
        break;
      case w3m.LABEL_CHAIN_AND_RESIDUE_ID:
        this.point2vertexLabel([atom_xyz, chain_id + '.' + residue_id]);
        break;
        // Mix
      case w3m.LABEL_MIX:
        this.point2vertexLabel([atom_xyz, chain_id + '.' + residue_name + residue_id + '-' + atom_name]);
        break;
        // Other
      case w3m.LABEL_B_FACTOR:
        this.point2vertexLabel([atom_xyz, atom_info[8]]);
        break;
      case w3m.LABEL_OCCUPANCY:
        this.point2vertexLabel([atom_xyz, atom_info[7]]);
        break;
      case w3m.LABEL_VDW_RADIUS:
        this.point2vertexLabel([atom_xyz, w3m.geometry.radius[atom_info[9]].toFixed(2)]);
        break;
    }
  },
  labelMainAtom: function(mol_id, chain_id, start, stop, label_content) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id];
    /* chain */
    for (var i = start; i <= stop; i++) {
      if (!w3m_isset(chain[i])) {
        continue;
      }
      var residue = chain[i],
        residue_name = mol.residue[chain_id][i],
        structure = w3m_copy(w3m.structure.enum[residue_name]); // copy it because it may be modified
      /* fill */
      for (var ii = 0, ll = structure.length; ii < ll; ii++) {
        if (!w3m_isset(residue[structure[ii]])) {
          continue;
        }
        var atom_id = residue[structure[ii]],
          atom_info = w3m.mol[mol_id].atom.main[atom_id];
        this.labeler(atom_info, label_content);
      }
    }
  },
  labelMainBackbone: function(mol_id, chain_id, start, stop, label_content) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id],
      structure = chain_type == w3m.CHAIN_AA ? w3m_copy(w3m.structure.backbone.amino_acid) :
      w3m_copy(w3m.structure.backbone.nucleic_acid);
    /* chain */
    for (var i = start; i <= stop; i++) {
      if (!w3m_isset(chain[i])) {
        continue;
      }
      var residue = chain[i];
      for (var ii = 0, ll = structure.length; ii < ll; ii++) {
        if (!w3m_isset(residue[structure[ii]])) {
          continue;
        }
        var atom_id = residue[structure[ii]],
          atom_info = w3m.mol[mol_id].atom.main[atom_id];
        this.labeler(atom_info, label_content);
      }
    }
  },
  labelMainResidue: function(mol_id, chain_id, start, stop, label_content) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id],
      structure = chain_type == w3m.CHAIN_AA ? w3m_copy(w3m.structure.residue.amino_acid) :
      w3m_copy(w3m.structure.residue.nucleic_acid);
    for (var i = start; i <= stop; i++) {
      if (!w3m_isset(chain[i])) {
        continue;
      }
      var residue = chain[i];
      if (!w3m_isset(residue[structure])) {
        continue;
      }
      var atom_id = residue[structure],
        atom_info = w3m.mol[mol_id].atom.main[atom_id];
      this.labeler(atom_info, label_content);
    }
  },
  labelMainResidueCenter: function(mol_id, chain_id, start, stop, label_content) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id],
      structure = chain_type == w3m.CHAIN_AA ? w3m_copy(w3m.structure.residue.amino_acid) :
      w3m_copy(w3m.structure.residue.nucleic_acid);
    for (var i = start; i <= stop; i++) {
      if (!w3m_isset(chain[i])) {
        continue;
      }
      var residue = chain[i];
      if (!w3m_isset(residue[structure])) {
        continue;
      }
      var atom_id = residue[structure],
        atom_info = w3m_copy(w3m.mol[mol_id].atom.main[atom_id]),
        atom_xyz_array = [];
      for (var residue_name in residue) {
        atom_xyz_array.push(mol.atom.main[residue[residue_name]][6]);
      }
      atom_info[6] = vec3.average(atom_xyz_array);
      this.labeler(atom_info, label_content);
    }
  },
  labelMainChain: function(mol_id, chain_id, start, stop, label_content) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.main[chain_id],
      chain_type = mol.chain[chain_id],
      structure = chain_type == w3m.CHAIN_AA ? w3m_copy(w3m.structure.chain.amino_acid) :
      w3m_copy(w3m.structure.chain.nucleic_acid);
    for (var i = start; i <= stop; i++) {
      if (!w3m_isset(chain[i])) {
        continue;
      }
      var residue = chain[i];
      if (!w3m_isset(residue[structure])) {
        continue;
      }
      var atom_id = residue[structure],
        atom_info = w3m.mol[mol_id].atom.main[atom_id];
      this.labeler(atom_info, label_content);
      break;
    }
  },
  labelMainMol: function(mol_id) {
    var first = w3m_find_first(w3m.mol[mol_id].atom.main);
    this.point2vertexLabel([w3m.mol[mol_id].atom.main[first][6], 'PDB-' + mol_id.toUpperCase()]);
  },
  labelHetAtom: function(mol_id, chain_id, label_content) {
    var mol = w3m.mol[mol_id],
      chain = mol.tree.het[chain_id],
      remove_water = w3m.config.remove_water_mol;
    for (var i in chain) {
      var atom_id = chain[i],
        atom_info = w3m.mol[mol_id].atom.het[atom_id];
      remove_water && atom_info[3] == 'hoh' ? void(0) : this.labeler(atom_info, label_content);
    }
  },
  labelHetMol: function(mol_id) {
    var first = w3m_find_first(w3m.mol[mol_id].atom.het);
    this.point2vertexLabel([w3m.mol[mol_id].atom.het[first][6], 'PDB-' + mol_id.toUpperCase()]);
  },
  //ranx add
  getMainAtomById: function(mol_id, id) {
    var atom = w3m.mol[mol_id].atom.main[id];
    if (atom !== undefined) {
      return {
        id: atom[1],
        resid: atom[5],
        chainname: atom[4]
      };
    }
    return undefined;
  },


};

/* Mol */
w3m.pdb = function(text, drugname) {
  var o = {
    type: 'pdb',
    id: '',
    //xukui add
    drug: false,
    //ranx add
    res: false,
    info: {},
    journal: [],
    atom: {
      main: [],
      het: []
    },
    tree: {
      main: {},
      het: {}
    },
    residue: {},
    chain: {},
    anisou: {},
    single: {},
    connect: {},
    ssbond: [],
    ss: {},
    helix: {},
    sheet: {},
    rep: {},
    rep_real: {},
    label_area: {},
    label_content: {},
    label_area_real: {},
    color: {
      main: [],
      het: []
    },
    color_real: [],
    highlight: {},
    hide: {},
    residue_detail: {},
    //ranx add
    residueData: {},
    residueTypeList: {},
    getMain: function(id) {
      return [id, o.atom.main[id][6], o.color_real[id]];
    },
    getHet: function(id) {
      return [id, o.atom.het[id][6], o.color_real[id]];
    },
    getAtom: function(id) {
      return o.atom.main[id] ? this.getMain(id) : (o.atom.het[id] ? this.getHet(id) : null);
    },
    getAtomEx: function(id) {
      return o.atom.main[id] || (o.atom.het[id] || null);
    }
	
  };
  if (drugname && w3m.mol[drugname] !== undefined && w3m.mol[drugname].res) {
    o.id = drugname;
  }

  var parse = function(text) {
	
	//init drug limit
	w3m.global.drugLimit = {
		x:[],
		y:[],
		z:[]
	}
	  
    text = text.split('\n');
    // var preResidueID,nextResidueID;
    if (PDB.exportPdb) {
      console.log('Starting exporting PDB.');
      var afterText = '';
      for (var i = 0, l = text.length; i < l; i++) {

        var s = text[i].toLowerCase();
        switch (w3m_sub(s, 0, 6)) {
          case 'atom':

            s = doEditAtom(s);

            if (s) {
              s = s.toUpperCase();
              afterText = afterText + s + "\n";
            } else {
              //afterText = afterText + s+"\n";
            }
            break;
          case 'hetatm':
            s = doeEitHet(s);
            s = s.toUpperCase();
            if (s) {
              afterText = afterText + s + "\n";
            } else {
              afterText = afterText + s + "\n";
            }
            break;
          default:
            s = s.toUpperCase();
            afterText = afterText + s + "\n";
            break;
        }
      }

      PDB.tool.saveString(afterText, PDB.pdbId + '.pdb');
      PDB.exportPdb = false;
      return;
    } else {
		
      for (var i = 0, l = text.length; i < l; i++) {
        var s = text[i].toLowerCase();

        switch (w3m_sub(s, 0, 6)) {
          case 'atom':
            doAtom(s);
            break;
          case 'hetatm':
            doHet(s);
            break;
          case 'conect':
            doConnect(s);
            break;
          case 'ssbond':
            doSSBond(s);
            break;
          case 'helix':
            doHelix(s);
            break;
          case 'sheet':
            doSheet(s);
            break;
          case 'header':
            doHeader(s);
            break;
          case 'title':
            doTitle(s);
            break;
          case 'source':
            doSource(s);
            break;
          case 'author':
            doAuthor(s);
            break;
          case 'expdta':
            doExpdata(s);
            break;
          case 'jrnl':
            doJrnl(s);
            break;
          case 'remark':
            doRemark(s);
            break;
          case 'cryst1':
            doCryst(s);
            break;
          case 'link':
            doLink(s);
            break;
        }
      }
    }


    text = null;
    doLaterWork();

    var chain_idArray = Object.keys(o.residueData);
    // xukui added 2017-08-27 start
    if (chain_idArray.length !== 0) {
      var lchainName = chain_idArray[chain_idArray.length - 1];
      var residueArray = Object.keys(o.residueData[lchainName]);
      var lresidueId = residueArray[residueArray.length - 1];
      o.residueData[lchainName][lresidueId].laid = o.atom.main[o.atom.main.length - 1][1];
      o.residueTypeList = Object.keys(o.residueTypeList);
    }
    // xukui added 2017-08-27 end

    w3m.mol[o.id] = o;
    w3m.global.mol = o.id;
    // Color
    w3m.tool.updateMolColorMap(o.id);
    //Data Flow
    w3m.tool.pipelineInit();
  };

  //ranx add 20200222
  var doLink = function(s){    
    if (!o.linkData) {
      o.linkData = {};
    }
    var randomAtom = {};
    randomAtom.atom_name    = w3m_sub(s, 13, 16);
    randomAtom.residue_name = w3m_sub(s, 18, 20) || 'xxx';    
    randomAtom.chain_id     = w3m_sub(s, 22) || 'x';
    randomAtom.residue_id   = parseInt(w3m_sub(s, 23, 26)) || 0;
    var normalAtom = {};
    normalAtom.atom_name    = w3m_sub(s, 43, 46);
    normalAtom.residue_name = w3m_sub(s, 48, 50) || 'xxx';    
    normalAtom.chain_id     = w3m_sub(s, 52) || 'x';
    normalAtom.residue_id   = parseInt(w3m_sub(s, 53, 56)) || 0;
    var linkData = {
      randomAtom:randomAtom,
      normalAtom:normalAtom
    }
    var rid = normalAtom.residue_id;
    if(!o.linkData[normalAtom.chain_id]){
      
      o.linkData[normalAtom.chain_id] = {};
      o.linkData[normalAtom.chain_id][rid] = linkData;
    }else{
      o.linkData[normalAtom.chain_id][rid] = linkData;
    }
    
  }
  var doHeader = function(s) {
    o.id = w3m_sub(s, 63, 66);
    o.info.id = w3m_sub(s, 63, 66).toUpperCase();
    if (o.id === "none") {
      o.id = drugname;
      o.info.id = drugname;
    }
    o.info.classification = w3m_capword(w3m_sub(s, 11, 50));
  };
  var doTitle = function(s) {
    w3m_isset(o.info.title) ? void(0) : o.info.title = '';
    o.info.title += (w3m_sub(s, 9, 10) && o.info.title[o.info.title.length - 1] == '-') ? ' ' + w3m_capword(w3m_sub(s, 12, 80)) : w3m_capword(w3m_sub(s, 11, 80));
  };
  var doSource = function(s) {
    if (!w3m_isset(o.info.source)) {
      var sub = w3m_sub(s, 11, 79);
      if (w3m_start_with(sub, 'organism_common')) {
        var source = sub.split(' ').slice(1).join(' ');
        source[source.length - 1] == ';' ? source = source.slice(0, source.length - 1) : void(0);
        o.info.source = w3m_capword(source);
      }
    }
  };
  var doExpdata = function(s) {
    o.info.expdata = w3m_capword(w3m_sub(s, 11, 79));
  };
  var doAuthor = function(s) {
    var author_list = w3m_sub(s, 11, 79).split(',');
    o.info.author = w3m_capword(author_list.join(', '));
  };
  var doJrnl = function(s) {
    switch (w3m_sub(s, 13, 16).toLowerCase()) {
      case 'ref':
        o.info.journal = w3m_capword(w3m_sub(s, 20, 47));
        o.info.volume = w3m_sub(s, 52, 55);
        o.info.page = w3m_sub(s, 57, 61);
        break;
      case 'pmid':
        o.info.pmid = w3m_sub(s, 20, 79);
        break;
      case 'doi':
        o.info.doi = w3m_sub(s, 20, 79);
        break;
    }
  };
  var doRemark = function(s) {
    var remark_id = w3m_sub(s, 8, 10);
    switch (remark_id) {
      case '2':
        o.info.resolution = w3m_sub(s, 24, 30);
        break;
    }
  };
  var doCryst = function(s) {
    o.info.cell = {},
      o.info.cell.len = [parseFloat(w3m_sub(s, 7, 15)), parseFloat(w3m_sub(s, 16, 24)), parseFloat(w3m_sub(s, 25, 33))];
    o.info.cell.angle = [parseFloat(w3m_sub(s, 34, 40)), parseFloat(w3m_sub(s, 41, 47)), parseFloat(w3m_sub(s, 48, 54))];
    o.info.cell.space_group = w3m_trim(w3m_sub(s, 56, 66));
  };
  var doEditAtom = function(s) {
    var atom_alt = w3m_sub(s, 17);
    if (atom_alt != '' && atom_alt != 'a') {
      return;
    }
    // if this is not AA or NA
    var chain_type = w3m.tool.getChainType(w3m_sub(s, 18, 20));
    if (chain_type == w3m.CHAIN_UNK) {
      s = doeEitHet(s);
      return s;
    }
    var atom_id = parseInt(w3m_sub(s, 7, 11)),
      atom_name = w3m_sub(s, 13, 16),
      residue_name = w3m_sub(s, 18, 20) || 'xxx',
      chain_id = w3m_sub(s, 22) || 'x',
      residue_id = parseInt(w3m_sub(s, 23, 26)) || 0,
      xyz = [parseFloat(w3m_sub(s, 31, 38)), parseFloat(w3m_sub(s, 39, 46)), parseFloat(w3m_sub(s, 47, 54))],
      occupancy = parseFloat(w3m_sub(s, 55, 60)),
      b_factor = parseFloat(w3m_sub(s, 61, 66)) || 0.0,
      element = w3m_sub(s, 77, 78);
    if (residue_id < 0) return;
    math.limit(xyz[0], w3m.global.limit.x);
    math.limit(xyz[1], w3m.global.limit.y);
    math.limit(xyz[2], w3m.global.limit.z);
    if (PDB.residueGroupObject[chain_id][residue_id].moveVec) {
      var v = PDB.residueGroupObject[chain_id][residue_id].moveVec;
      math.limit(v.x, w3m.global.limit.x);
      math.limit(v.y, w3m.global.limit.y);
      math.limit(v.z, w3m.global.limit.z);
      xyz[0] = xyz[0] + v.x;
      xyz[1] = xyz[1] + v.y;
      xyz[2] = xyz[2] + v.z;
      s = s.replace(w3m_sub(s, 31, 38), Math.floor(xyz[0] * 1000) / 1000);
      s = s.replace(w3m_sub(s, 39, 46), Math.floor(xyz[1] * 1000) / 1000);
      s = s.replace(w3m_sub(s, 47, 54), Math.floor(xyz[2] * 1000) / 1000);
    }

    if (PDB.allMainToms && PDB.allMainToms[chain_id][residue_id]) {
      var state = PDB.allMainToms[chain_id][residue_id]['state'];
      if (state == 'editRes') {
        var nowEndID = w3m.structure.enum[residue_name].length + PDB.allMainToms[chain_id][residue_id].startAtomID - 1;
        if (!PDB.allMainToms[chain_id][residue_id].tempID) {
          PDB.allMainToms[chain_id][residue_id].tempID = PDB.allMainToms[chain_id][residue_id].startAtomID;
        } else if (PDB.allMainToms[chain_id][residue_id].tempID < nowEndID) {
          PDB.allMainToms[chain_id][residue_id].tempID++;
        }
        if (PDB.allMainToms[chain_id][residue_id].tempID == nowEndID) {
          var _t_ = "";
          var atoms = PDB.allMainToms[chain_id][residue_id].atoms;
          var sss_ = new Array(atoms.length);


          for (var i = 0; i < sss_.length; i++) {
            sss_[i] = s;
          }

          for (var i in atoms) {
            var atom_ = atoms[i];
            var startAtomID = PDB.allMainToms[chain_id][residue_id].startAtomID;
            var endAtomID = PDB.allMainToms[chain_id][residue_id].endAtomID;
            atom_id = startAtomID + Number(i);
            atom_id = (atom_id + "").length < 4 ? PDB.tool.fillSpace(atom_id, 4) : atom_id;
            atom_name = atom_[2];
            atom_name = atom_name.length < 3 ? PDB.tool.fillSpace(atom_name, 3, 'hou') : atom_name;
            residue_name = atom_[3];
            chain_id = atom_[4];
            residue_id_ = residue_id + "";
            residue_id_ = residue_id_.length < 3 ? PDB.tool.fillSpace(residue_id_, 3) : residue_id_;
            var _x_ = Number(atom_[6][0]).toFixed(3);
            var _y_ = Number(atom_[6][1]).toFixed(3);
            var _z_ = Number(atom_[6][2]).toFixed(3);
            var _o_ = Number(atom_[7]).toFixed(2);
            var _b_ = Number(atom_[8]).toFixed(2);
            //xyz          	= [x,y,z];
            occupancy = _o_;
            b_factor = _b_;
            element = atom_[9];
            //element = element.length<2?PDB.tool.fillSpace(element,1):element;
            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 7, 11, atom_id);
            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 13, 16, atom_name);
            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 17, 20, residue_name);


            sss_[i] = PDB.tool.replacePos(sss_[i], 22, chain_id);
            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 23, 26, residue_id_);

            _x_ = (_x_ + "").length < 7 ? PDB.tool.fillSpace((_x_ + ""), 7) : (_x_ + "");
            _y_ = (_y_ + "").length < 7 ? PDB.tool.fillSpace((_y_ + ""), 7) : (_y_ + "");
            _z_ = (_z_ + "").length < 7 ? PDB.tool.fillSpace((_z_ + ""), 7) : (_z_ + "");

            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 31, 38, _x_);
            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 39, 46, _y_);
            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 47, 54, _z_);

            occupancy = (occupancy + "").length < 5 ? PDB.tool.fillSpace((occupancy + ""), 5) : (occupancy + "");
            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 55, 60, occupancy);

            b_factor = (b_factor + "").length < 5 ? PDB.tool.fillSpace((b_factor + ""), 5) : (b_factor + "");
            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 61, 66, b_factor);

            sss_[i] = PDB.tool.replacePosByStartEnd(sss_[i], 77, 78, element);

          }

          for (var i in sss_) {
            _t_ = _t_ + sss_[i] + "\n";;

          }
          _t_ = _t_.substring(0, _t_.length - 1);
          //console.log(_t_);
          PDB.allMainToms[chain_id][residue_id].tempID = undefined;
          return _t_;

        } else {
          return null;
        }

      } else if (state == 'justID') {
        if (!PDB.allMainToms[chain_id][residue_id].tempID) {
          PDB.allMainToms[chain_id][residue_id].tempID = PDB.allMainToms[chain_id][residue_id].startAtomID;
        } else if (PDB.allMainToms[chain_id][residue_id].tempID < PDB.allMainToms[chain_id][residue_id].endAtomID) {
          PDB.allMainToms[chain_id][residue_id].tempID++;
        }
        var tempID = PDB.allMainToms[chain_id][residue_id].tempID;
        tempID = PDB.tool.fillSpace(tempID, 4);
        s = PDB.tool.replacePosByStartEnd(s, 7, 11, tempID);

        //s = s.replace(w3m_sub(s, 7, 11),PDB.allMainToms[chain_id][residue_id].tempID);
      }
    }

    return s;

  }
  var doAtom = function(s) {

    // omit alternate location
    var atom_alt = w3m_sub(s, 17);
    if (atom_alt != '' && atom_alt != 'a') {
      return;
    }
    // if this is not AA or NA
    var chain_type = w3m.tool.getChainType(w3m_sub(s, 18, 20));
    if (chain_type == w3m.CHAIN_UNK) {
      doHet(s);
      return;
    }
    // data
    var atom_id = parseInt(w3m_sub(s, 7, 11)),
      atom_name = w3m_sub(s, 13, 16),
      residue_name = w3m_sub(s, 18, 20) || 'xxx',
      chain_id = w3m_sub(s, 22) || 'x',
      residue_id = parseInt(w3m_sub(s, 23, 26)) || 0,
      xyz = [parseFloat(w3m_sub(s, 31, 38)), parseFloat(w3m_sub(s, 39, 46)), parseFloat(w3m_sub(s, 47, 54))],
      occupancy = parseFloat(w3m_sub(s, 55, 60)),
      b_factor = parseFloat(w3m_sub(s, 61, 66)) || 0.0,
      element = w3m_sub(s, 77, 78);
    if (residue_id < 0) return;
    math.limit(xyz[0], w3m.global.limit.x);
    math.limit(xyz[1], w3m.global.limit.y);
    math.limit(xyz[2], w3m.global.limit.z);


    //get Residue types
    if (o.residueTypeList.residue_name == undefined) {
      o.residueTypeList[residue_name] = residue_name;
    }
    if (b_factor) {
      math.average(b_factor, w3m.global.average.b_factor);
      math.limit(b_factor, w3m.global.limit.b_factor);
      if (chain_type == w3m.CHAIN_AA && w3m.structure.backbone.amino_acid.indexOf(atom_name) >= 0) {
        math.average(b_factor, w3m.global.average.b_factor_backbone);
        math.limit(b_factor, w3m.global.limit.b_factor_backbone);
      } else if ((chain_type == w3m.CHAIN_NA && w3m.structure.backbone.nucleic_acid.indexOf(atom_name) >= 0)) {
        math.average(b_factor, w3m.global.average.b_factor_backbone);
        math.limit(b_factor, w3m.global.limit.b_factor_backbone);
      }
    }
    // o.mol
    w3m_isset(o.tree.main[chain_id]) ? void(0) : o.tree.main[chain_id] = [];
    w3m_isset(o.tree.main[chain_id][residue_id]) ? void(0) : o.tree.main[chain_id][residue_id] = {};
    o.tree.main[chain_id][residue_id][atom_name] = atom_id;
    // o.chain
    w3m_isset(o.chain[chain_id]) ? void(0) : o.chain[chain_id] = chain_type;
    // o.residue
    w3m_isset(o.residue[chain_id]) ? void(0) : o.residue[chain_id] = [];
    w3m_isset(o.residue[chain_id][residue_id]) ? void(0) : o.residue[chain_id][residue_id] = residue_name;
    // o.ss
    w3m_isset(o.ss[chain_id]) ? void(0) : o.ss[chain_id] = [];
    w3m_isset(o.ss[chain_id][residue_id]) ? void(0) : o.ss[chain_id][residue_id] = w3m.LOOP;
    // o.rep
    w3m_isset(o.rep[chain_id]) ? void(0) : o.rep[chain_id] = [];
    w3m_isset(o.rep[chain_id][residue_id]) ? void(0) : o.rep[chain_id][residue_id] = w3m.config.rep_mode_main;
    // o.label
    w3m_isset(o.label_area[chain_id]) ? void(0) : o.label_area[chain_id] = [];
    w3m_isset(o.label_area[chain_id][residue_id]) ?
      void(0) : o.label_area[chain_id][residue_id] = w3m.config.label_area_main;
    w3m_isset(o.label_content[chain_id]) ? void(0) : o.label_content[chain_id] = [];
    w3m_isset(o.label_content[chain_id][residue_id]) ?
      void(0) : o.label_content[chain_id][residue_id] = w3m.config.label_content_main;
    // o.atom
    o.atom.main[atom_id] = [w3m.ATOM_MAIN, atom_id, atom_name, residue_name, chain_id, residue_id, xyz, occupancy, b_factor, element];

    //console.log(chain_id+"|"+residue_id+"|"+sse);
    if (o.residueData[chain_id] == undefined) {
      o.residueData[chain_id] = {};
    }

    if (o.residueData[chain_id][residue_id] == undefined) {
      // if(preResidueID){
      // o.residueData[chain_id][residue_id].preResidueID = preResidueID;
      // preResidueID = 	residue_id;
      // }
      var residueArray = Object.keys(o.residueData[chain_id]);
      if (residueArray.length > 0) {
        o.residueData[chain_id][residueArray[residueArray.length - 1]].laid = atom_id - 1;
      }

      var sse = o.ss[chain_id][residue_id];
      o.residueData[chain_id][residue_id] = {
        id: residue_id,
        name: residue_name,
        chain: chain_id,
        sse: sse,
        faid: atom_id, //first atom id
        //laid	:   //last atom id
        //caid	:   //Ca atom id
        bbond: [], //Backbone id arrays
        lines: [], //paired id arrays
        path: [], //path to draw TUBE-style
        tangents: [],
        normals: [],
        binormals: [],
        arrow: [], //if sse is arrow
        issel: false
      }


    }
    if (atom_name == 'ca') {
      o.residueData[chain_id][residue_id].caid = atom_id;
    } else if (o.residueData[chain_id][residue_id].caid == undefined) {
      o.residueData[chain_id][residue_id].caid = atom_id;
    }

  };

  var doeEitHet = function(s) {
    //console.log(s);
    var atom_id = parseInt(w3m_sub(s, 7, 11)),
      atom_name = w3m_sub(s, 13, 16),
      residue_name = w3m_sub(s, 18, 20) || 'xxx',
      chain_id = w3m_sub(s, 22) || 'x',
      residue_id = parseInt(w3m_sub(s, 23, 26)) || 0,
      xyz = [parseFloat(w3m_sub(s, 31, 38)), parseFloat(w3m_sub(s, 39, 46)), parseFloat(w3m_sub(s, 47, 54))],
      occupancy = parseFloat(w3m_sub(s, 55, 60)),
      b_factor = parseFloat(w3m_sub(s, 61, 66)) || 0.0,
      element = w3m_sub(s, 77, 78);
    if (residue_id < 0) return;
    math.limit(xyz[0], w3m.global.limit.x);
    math.limit(xyz[1], w3m.global.limit.y);
    math.limit(xyz[2], w3m.global.limit.z);
    return s;

  }
  var doHet = function(s) {
    var atom_id = parseInt(w3m_sub(s, 7, 11)),
      atom_name = w3m_sub(s, 13, 16),
      residue_name = w3m_sub(s, 18, 20) || 'xxx',
      chain_id = w3m_sub(s, 22) || 'x',
      residue_id = parseInt(w3m_sub(s, 23, 26)) || 0,
      xyz = [parseFloat(w3m_sub(s, 31, 38)), parseFloat(w3m_sub(s, 39, 46)), parseFloat(w3m_sub(s, 47, 54))],
      occupancy = parseFloat(w3m_sub(s, 55, 60)),
      b_factor = parseFloat(w3m_sub(s, 61, 66)) || 0.0,
      element = w3m_sub(s, 77, 78);
    if (residue_id < 0) return;
    math.limit(xyz[0], w3m.global.limit.x);
    math.limit(xyz[1], w3m.global.limit.y);
    math.limit(xyz[2], w3m.global.limit.z);
	
	math.limit(xyz[0], w3m.global.drugLimit.x);
    math.limit(xyz[1], w3m.global.drugLimit.y);
    math.limit(xyz[2], w3m.global.drugLimit.z);
	
    if (b_factor) {
      math.average(b_factor, w3m.global.average.b_factor);
      math.limit(b_factor, w3m.global.limit.b_factor);
    }
    // o.tree.het
    w3m_isset(o.tree.het[chain_id]) ? void(0) : o.tree.het[chain_id] = [];
    o.tree.het[chain_id].push(atom_id);
    // o.atom
    o.atom.het[atom_id] = [w3m.ATOM_HET, atom_id, atom_name, residue_name, chain_id, residue_id, xyz, occupancy, b_factor, element];

    // o.single
    o.single[atom_id] = element;

  };
  var doConnect = function(s) {
    var atom_id_main = parseInt(w3m_sub(s, 7, 11));
    w3m_isset(o.connect[atom_id_main]) ? void(0) : o.connect[atom_id_main] = [];
    var other = function(start, stop) {
      var atom_id_other = parseInt(w3m_sub(s, start, stop));
      if (atom_id_other && o.getAtom(atom_id_other)) {
        w3m_isset(o.connect[atom_id_other]) && o.connect[atom_id_other].indexOf(atom_id_main) >= 0 ?
          void(0) :
          o.connect[atom_id_main].push(atom_id_other);
        delete o.single[atom_id_other];
      }
    };
    other(12, 16);
    other(17, 21);
    other(22, 26);
    other(27, 31);
    delete o.single[atom_id_main];
  };
  var doSSBond = function(s) {
    var chain_id_1 = w3m_sub(s, 16),
      residue_id_1 = w3m_sub(s, 18, 21),
      chain_id_2 = w3m_sub(s, 30),
      residue_id_2 = w3m_sub(s, 32, 35);
    o.ssbond.push([chain_id_1, residue_id_1, chain_id_2, residue_id_2]);
  };
  var doHelix = function(s) {
    var chain_id = w3m_sub(s, 20),
      helix_start = parseInt(w3m_sub(s, 22, 25)),
      helix_stop = parseInt(w3m_sub(s, 34, 37));
    w3m_isset(o.helix[chain_id]) ? void(0) : o.helix[chain_id] = [];
    o.helix[chain_id].push([helix_start, helix_stop]);
  };
  var doSheet = function(s) {
    var chain_id = w3m_sub(s, 22),
      sheet_id = w3m_sub(s, 12, 14),
      strand_start = parseInt(w3m_sub(s, 23, 26)),
      strand_stop = parseInt(w3m_sub(s, 34, 37));
    w3m_isset(o.sheet[chain_id]) ? void(0) : o.sheet[chain_id] = {};
    w3m_isset(o.sheet[chain_id][sheet_id]) ? void(0) : o.sheet[chain_id][sheet_id] = [];
    o.sheet[chain_id][sheet_id].push([strand_start, strand_stop]);
  };
  var doLaterWork = function() {
    // quality adjust
    var main_atom_total = o.atom.main.length;
    if (main_atom_total > 30000) {
      w3m.config.geom_tube_segment = 6;
      w3m.config.geom_stick_round_end = false;
    } else if (main_atom_total > 20000) {
      w3m.config.geom_tube_segment = 8;
      w3m.config.geom_stick_round_end = false;
    } else if (main_atom_total > 10000) {
      w3m.config.geom_tube_segment = 10;
    }
    // highlight & hide
    for (var i in o.chain) {
      o.highlight[i] = [];
      o.hide[i] = [];
    }
    // SSBond
    for (var i = 0, l = o.ssbond.length; i < l; i++) {
      var bond = o.ssbond[i],
        atom_id_1 ,
        atom_id_2 ;
		
		
		if(o.tree.main[bond[0]]){
			atom_id_1 = o.atom.main[o.tree.main[bond[0]][bond[1]].sg][1];
		}
		if(o.tree.main[bond[2]]){
			atom_id_2 = o.atom.main[o.tree.main[bond[2]][bond[3]].sg][1];
		}
		
		
		
      if (atom_id_1 && w3m_isset(o.connect[atom_id_1])) {
        var index = o.connect[atom_id_1].indexOf(atom_id_2);
        index >= 0 ? o.connect[atom_id_1].splice(index, 1) : void(0);
      }
      if (atom_id_1 && w3m_isset(o.connect[atom_id_2])) {
        var index = o.connect[atom_id_2].indexOf(atom_id_1);
        index >= 0 ? o.connect[atom_id_2].splice(index, 1) : void(0);
      }
    }
    // Connect
    for (var i in o.connect) {
      if (!o.connect[i].length) {
        delete(o.connect[i]);
      }
    }
    // Split helix and sheet
    for (var i in o.chain) {
      if (o.chain[i] != w3m.CHAIN_AA) {
        continue;
      }
      // helix
      if (w3m_isset(o.helix[i])) {
        for (var ii = 0, ll = o.helix[i].length; ii < ll; ii++) {
          var helix = o.helix[i][ii];
          for (var iii = helix[0]; iii <= helix[1]; iii++) {
            o.ss[i][iii] = w3m.HELIX;
            if (o.residueData[i][iii]) {
              o.residueData[i][iii].sse = w3m.HELIX;
            }

          }
        }
      }
      // sheet
      if (w3m_isset(o.sheet[i])) {
        for (var j in o.sheet[i]) {
          var sheet = o.sheet[i][j];
          for (var ii = 0, ll = sheet.length; ii < ll; ii++) {
            var strand = sheet[ii];
            for (var iii = strand[0]; iii <= strand[1]; iii++) {
              o.ss[i][iii] = w3m.SHEET;
              if (o.residueData[i][iii]) {
                o.residueData[i][iii].sse = w3m.SHEET;
              }

            }
          }
        }
      }
      // merge
      var ss_fragment = w3m_split_by_difference(o.ss[i]);
      ss_fragment.forEach(function(fg) {
        var fg_start = fg[0],
          fg_stop = fg[1],
          fg_range = [fg[0], fg[1]];
        switch (fg[2]) {
          case w3m.HELIX:
            var head = w3m.HELIX_HEAD,
              body = w3m.HELIX_BODY,
              foot = w3m.HELIX_FOOT;
            break;
          case w3m.SHEET:
            var head = w3m.SHEET_HEAD,
              body = w3m.SHEET_BODY,
              foot = w3m.SHEET_FOOT;
            break;
          case w3m.LOOP:
            var head = w3m.LOOP_HEAD,
              body = w3m.LOOP_BODY,
              foot = w3m.LOOP_FOOT;
            break;
        }
        o.ss[i][fg_start] = [head, fg_range];
        if (o.residueData[i][fg_start]) {
          o.residueData[i][fg_start].sse = head;
        }

        for (var ii = fg[0] + 1; ii <= fg[1] - 1; ii++) {
          o.ss[i][ii] = [body, fg_range];
          if (o.residueData[i][ii]) {
            o.residueData[i][ii].sse = body;
          }

        }
        o.ss[i][fg_stop] = [foot, fg_range];
        if (o.residueData[i][fg_stop]) {
          o.residueData[i][fg_stop].sse = foot;
        }

      });
    }
  };
  switch (typeof text) {
    case 'string':
      parse(text);
      break;
    default:
      return false;
  }
  return o;
};

/* File */
w3m.file = (function() {
  var io = new FileReader(),
    callback = null;
  io.onload = function(event) {
    var e = event || window.event;
    var file_cont = e.target.result;
    if(file_cont.includes("mmcif_pdbx")){
      cont = loadCIF(file_cont, 1);
      callback(cont);
    }else{
      callback(e.target.result);
    }
  }
  io.get = function(file, fn) {
    callback = fn;
    io.readAsText(file);
  }
  io.getArrayBuffer = function(file, fn) {
    callback = fn;
    io.readAsArrayBuffer(file);
  }
  return io;
})();

/* API */
w3m.api = {

  init: function(div_id, pdb_id, show_widget, user_config, user_color) {
    var show_widget = typeof(show_widget) != 'undefined' ? show_widget : w3m.global.widget,
      user_config = user_config || {},
      user_color = user_color || {};
    // must wait until all the files are loaded!
    window.onload = function() {
      // id
      w3m.global.mol = "pdb";
      w3m.config.init(show_widget, user_config, user_color);
    }
  },
  update: function(source) {
    // clear
    w3m.tool.clear();
    // reset
    w3m.global.limit = {
      x: [],
      y: [],
      z: [],
      b_factor: [0.0, 0.0],
      b_factor_backbone: [0.0, 0.0]
    };
    w3m.global.average = {
      b_factor: [0, 0],
      b_factor_backbone: [0, 0]
    };
    w3m.global.fragment = [];
    // mol
    w3m.mol = {};
    w3m.pdb(source);
  },
  refreshBackground: function() {
    w3m.tool.background();
  },
  refreshGeometry: function() {
    w3m.tool.pipelineGeometry();
  },
  refreshMain: function() {
    w3m.tool.pipelineMain();
  },
  refreshHet: function() {
    w3m.tool.pipelineHet();
  },
  refreshExt: function() {
    w3m.tool.pipelineExt();
  },
  refreshLabel: function() {
    w3m.tool.pipelineLabel();
  },
  switchRepModeMain: function(rep_mode, residue) {
    w3m.config.rep_mode_main = rep_mode;
    if (residue) {
      w3m.tool.updateMolRepMap(residue);
      w3m.config.color_mode_main == w3m.COLOR_BY_REP ? w3m.tool.updateMolColorMapMain(residue) : void(0);
    } else {
      for (var i in w3m.mol) {
        w3m.tool.updateMolRepMap(i);
        w3m.config.color_mode_main == w3m.COLOR_BY_REP ? w3m.tool.updateMolColorMapMain(i) : void(0);
      }
    }
    this.refreshMain();
  },
  switchRepModeHet: function(rep_mode) {
    w3m.config.rep_mode_het = rep_mode;
    if (w3m.config.color_mode_het == w3m.COLOR_BY_REP) {
      for (var i in w3m.mol) {
        w3m.tool.updateMolColorMapHet(i);
      }
    }
    this.refreshHet();
  },
  switchColorModeMain: function(color_mode) {
    w3m.config.color_mode_main = color_mode;
    for (var i in w3m.mol) {
      w3m.tool.updateMolColorMapMain(i);
    }
    this.refreshMain();
  },
  switchColorModeHet: function(color_mode) {
    w3m.config.color_mode_het = color_mode;
    for (var i in w3m.mol) {
      w3m.tool.updateMolColorMapHet(i);
    }
    this.refreshHet();
  },
  switchLabelAreaMain: function(label_area) {
    w3m.config.label_area_main = label_area;
    for (var i in w3m.mol) {
      w3m.tool.updateMolLabelAreaMap(i);
    }
    this.refreshLabel();
  },
  switchLabelAreaHet: function(label_area) {
    w3m.config.label_area_het = label_area;
    this.refreshLabel();
  },
  switchLabelContentMain: function(label_content) {
    w3m.config.label_content_main = label_content;
    for (var i in w3m.mol) {
      w3m.tool.updateMolLabelContentMap(i);
    }
    this.refreshLabel();
  },
  switchLabelContentHet: function(label_content) {
    w3m.config.label_content_het = label_content;
    this.refreshLabel();
  },
  refreshGeometryByMode: function(rep_mode) {
    if (rep_mode) {
      var should_refresh_main = false,
        should_refresh_het = false;
      // Main
      check:
        for (var i in w3m.mol) {
          var mol = w3m.mol[i];
          for (var ii in mol.rep) {
            var token = mol.rep[ii].some(function(n) {
              if (Array.isArray(rep_mode)) {
                return rep_mode.indexOf(n) >= 0 ? true : false;
              } else {
                return rep_mode == n ? true : false;
              }
            });
            if (token) {
              should_refresh_main = true;
              break check;
            }
          }
        }
      should_refresh_main ? this.refreshMain() : void(0);
      // Het
      if (Array.isArray(rep_mode)) {
        rep_mode.indexOf(w3m.config.rep_mode_het) >= 0 ? should_refresh_het = true : void(0);
      } else {
        w3m.config.rep_mode_het == rep_mode ? should_refresh_het = true : void(0);
      }
      // Refresh
      if (should_refresh_main && should_refresh_het) {
        this.refresh();
      } else {
        should_refresh_main ? this.refreshMain() : void(0);
        should_refresh_het ? this.refreshHet() : void(0);
      }
    } else {
      this.refresh();
    }
  },
  refreshColorByMode: function(key) {
    var color_id = w3m.config[key];
    if (color_id) {
      // Main
      var should_refresh_main = false,
        should_refresh_het = false;
      for (var i in w3m.mol) {
        var mol = w3m.mol[i];
        if (mol.color.main.some(function(n) {
            return n == color_id
          })) {
          should_refresh_main = true;
          break;
        }
      }
      // Het
      var should_refresh_het = false;
      for (var i in w3m.mol) {
        var mol = w3m.mol[i];
        if (mol.color.het.some(function(n) {
            return n == color_id
          })) {
          should_refresh_het = true;
          break;
        }
      }
      // Refresh
      if (should_refresh_main && should_refresh_het) {
        this.refresh();
      } else {
        should_refresh_main ? this.refreshMain() : void(0);
        should_refresh_het ? this.refreshHet() : void(0);
      }
    } else {
      this.refresh();
    }
  },
  relabel: function() {
    w3m.texture.switchLabel();
    this.refreshLabel();
  },
  saveConfigToLocalStorage: function() {
    w3m.tool.saveConfigToLocalStorage();
    if (localStorage.length) {
      w3m.tool.toast('Saved !');
    }
  },
  recoverConfigFromLocalStorage: function() {
    w3m.tool.recoverConfigFromLocalStorage();
    // ui
    this.refreshSidebox();
    // map
    for (var i in w3m.mol) {
      w3m.tool.updateMolRepMap(i);
      w3m.tool.updateMolColorMapMain(i);
      w3m.tool.updateMolColorMapHet(i);
      w3m.tool.updateMolLabelAreaMap(i);
      w3m.tool.updateMolLabelContentMap(i)
    }
    // shader
    this.reshade();
    // refresh
    this.refresh();
  },
  clearLocalStorage: function() {
    w3m.tool.clearLocalStorage();
    w3m.tool.toast('Cleared !');
  },
  recoverDefaultConfig: function() {
    // config
    w3m.tool.recoverConfigFromDefault();
    // ui
    this.refreshSidebox();
    // map
    for (var i in w3m.mol) {
      w3m.tool.updateMolRepMap(i);
      w3m.tool.updateMolColorMapMain(i);
      w3m.tool.updateMolColorMapHet(i);
      w3m.tool.updateMolLabelAreaMap(i);
      w3m.tool.updateMolLabelContentMap(i)
    }
    // shader
    this.reshade();
    // refresh
    this.refresh();
  },
  highlight: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      start = start || w3m_find_first(mol.residue[chain_id]),
      stop = stop || w3m_find_last(mol.residue[chain_id]);
    w3m.tool.highlightSegment(mol_id, chain_id, start, stop, w3m.ADD);
    this.refreshGeometry();
  },
  highlightRemove: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      start = start || w3m_find_first(mol.residue[chain_id]),
      stop = stop || w3m_find_last(mol.residue[chain_id]);
    w3m.tool.highlightSegment(mol_id, chain_id, start, stop, w3m.REMOVE);
    this.refreshGeometry();
  },
  highlightToggle: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      start = start || w3m_find_first(mol.residue[chain_id]),
      stop = stop || w3m_find_last(mol.residue[chain_id]);
    w3m.tool.highlightSegment(mol_id, chain_id, start, stop, w3m.TOGGLE);
    this.refreshGeometry();
  },
  hide: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      start = start || w3m_find_first(mol.residue[chain_id]),
      stop = stop || w3m_find_last(mol.residue[chain_id]);
    w3m.tool.hideSegment(mol_id, chain_id, start, stop, w3m.ADD);
    this.refresh();
  },
  hideRemove: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      start = start || w3m_find_first(mol.residue[chain_id]),
      stop = stop || w3m_find_last(mol.residue[chain_id]);
    w3m.tool.hideSegment(mol_id, chain_id, start, stop, w3m.REMOVE);
    this.refresh();
  },
  hideToggle: function(mol_id, chain_id, start, stop) {
    var mol = w3m.mol[mol_id],
      start = start || w3m_find_first(mol.residue[chain_id]),
      stop = stop || w3m_find_last(mol.residue[chain_id]);
    w3m.tool.hideSegment(mol_id, chain_id, start, stop, w3m.TOGGLE);
    this.refresh();
  },
  addFragment: function(mol_id, chain_id, start, stop) {
    var fg_id = w3m.tool.addFragment(mol_id || null, chain_id || null, start || null, stop || null);
    return fg_id;
  },
  updateFragment: function(fg_id) {
    w3m.tool.updateFragment(fg_id);
    this.refresh();
  },
  resetFragment: function(fg_id) {
    w3m.tool.resetFragment(fg_id);
    this.refresh();
  },
  deleteFragment: function(fg_id) {
    w3m.tool.deleteFragment(fg_id);
    this.refresh();
  },
  showResidueDetail: function(mol_id, chain_id, residue_id) {
    var mol = w3m.mol[mol_id];
    w3m_isset(mol.residue_detail[chain_id]) ? void(0) : mol.residue_detail[chain_id] = [];
    var index_token;
    (index_token = mol.residue_detail[chain_id].indexOf(residue_id)) >= 0
      ?
      mol.residue_detail[chain_id].splice(index_token, 1, 0) :
      mol.residue_detail[chain_id].push(residue_id);
    w3m.config.label_ball_and_rod ? this.refresh() : this.refreshGeometry();
  },
  loadPDB: function(pdb_id) {
    pdb_id.length == 4 ? this.update(pdb_id) : void(0);
  },
  loadPDBFromFile: function(file) {
    this.update(file);
  },
  toggleFullscreen: function() {
    if (!w3m_check_fullscreen()) {
      var ele = document.documentElement;
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  },
  toggleRotate: function(axis) {
    if (w3m_array_has(['x', 'y', 'z'], axis)) {
      var key = 'rotate_' + axis;
      w3m.global[key] = w3m.global[key] ? false : true;
      w3m.tool.recycle();
    }
  },
  help: function(department) {
    var department = w3m_isset(department) ? '#' + department : '';
    window.open(w3m_official + 'help.html' + department);
  },
  /* open api */
  config: function(key, value) {
    return w3m_isset(value) ? w3m.config[key] = value : w3m.config[key];
  },
  rgb: function(index, value) {
    return w3m_isset(value) ? w3m.rgb[index] = value : w3m.rgb[index];
  },
  refresh: function() {
    w3m.tool.background();
    w3m.tool.pipeline();
  },
  pdb: function(source) {
    this.update(source);
  },
  representation: function(structure, mode) {
    switch (structure) {
      case w3m.ATOM_MAIN:
        w3m.api.switchRepModeMain(mode);
        break;
      case w3m.ATOM_HET:
        w3m.api.switchRepModeHet(mode);
        break;
    }
  },
  color: function(structure, mode) {
    switch (structure) {
      case w3m.ATOM_MAIN:
        w3m.api.switchColorModeMain(mode);
        break;
      case w3m.ATOM_HET:
        w3m.api.switchColorModeHet(mode);
        break;
    }
  },
  label_area: function(structure, area) {
    switch (structure) {
      case w3m.ATOM_MAIN:
        w3m.api.switchLabelAreaMain(area);
        break;
      case w3m.ATOM_HET:
        w3m.api.switchLabelAreaHet(area);
        break;
    }
  },
  label_content: function(structure, content) {
    switch (structure) {
      case w3m.ATOM_MAIN:
        w3m.api.switchLabelContentMain(content);
        break;
      case w3m.ATOM_HET:
        w3m.api.switchLabelContentHet(content);
        break;
    }
  },
  fragment_add: function(chain_id, start, stop) {
    var fg_id = w3m.tool.addFragment(w3m.global.mol, chain_id || null, start || null, stop || null);
    w3m.ui.fragment.sidebox();
    this.refresh();
    return fg_id;
  },
  fragment_set: function(fg_id, rep_mode, color_mode, label_area, label_content, color_defined) {
    var fg = w3m.global.fragment[fg_id];
    fg.rep = rep_mode;
    fg.color = color_mode;
    fg.label_area = label_area;
    fg.label_content = label_content;
    this.color(1300 + fg_id, color_defined || w3m.rgb[1]);
    w3m.ui.fragment.update(fg_id);
  },
  fragment_remove: function(fg_id) {
    w3m.tool.deleteFragment(fg_id);
    w3m.ui.fragment.sidebox();
    this.refresh();
  },
  highlight_add: function(chain_id, start, stop) {
    this.highlight(w3m.global.mol, chain_id, start, stop);
  },
  highlight_remove: function(chain_id, start, stop) {
    this.highlightRemove(w3m.global.mol, chain_id, start, stop);
  },
  hide_add: function(chain_id, start, stop) {
    this.hide(w3m.global.mol, chain_id, start, stop);
  },
  hide_remove: function(chain_id, start, stop) {
    this.hideRemove(w3m.global.mol, chain_id, start, stop);
  },
  picked: function() {
    var atom_id = w3m.global.picked_atom;
    w3m.global.picked_atom = null;
    return atom_id;
  },
  atom: function(atom_id) {
    return w3m.mol[w3m.global.mol].getAtomEx(atom_id);
  }
};
