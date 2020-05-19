/**
 * Created by Kui Xu on 2017/7/15.
 * mail: xukui.cs@gmail.com
 */
PDB.tool = {

  getValue: function(param, defaultVal) {
    if (param !== undefined && param !== null && param !== "") {
      return param;
    } else {
      return defaultVal;
    }
  },

  midPoint: function(point1, point2) {
    return new THREE.Vector3((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.z + point2.z) / 2);
  },

  MaxEdge: function() {
    var limit = w3m.global.limit;
    var xedge = limit.x[1] - limit.x[0];
    var yedge = limit.y[1] - limit.y[0];
    var zedge = limit.z[1] - limit.z[0];
    var medge = xedge > yedge ? xedge : yedge;
    return medge > zedge ? medge : zedge;
  },

  getMainAtom: function(molid, id) {
    var scope = this;
    var atom = w3m.mol[molid].atom.main[id];
    if (atom !== undefined) {
      return scope.getAtomById(molid, atom, 'main');
    }
    return undefined;
  },

  // before sphere visualization 2018-08-16
  rotation0: function(groupIndexs, type) {
    if (type === 0) {
      groupIndexs.forEach(function(index) {
        var group = PDB.GROUP[index];
        if (group !== undefined) {
          // var time = Date.now() * 0.0004;
          // group.rotation.y = -time;
          group.rotation.y = group.rotation.y - 0.005;
        }
      })
    } else if (type === 1) {
      groupIndexs.forEach(function(index) {
        var group = PDB.GROUP[index];
        if (group !== undefined) {
          // var time = Date.now() * 0.0004;
          // group.rotation.y = time;
          group.rotation.y = group.rotation.y + 0.005;
        }
      })
    }
  },

  getMainResAtomsByAtom: function(atom) {
    var key = atom.chainname + "_" + atom.resid;
    var molid = PDB.pdbId;
    var scope = this;
    var atoms = new Array();
    var id = atom.id;
    while (id-- && id > 0) {
      var newAtom = scope.getMainAtom(molid, id);
      if (newAtom === undefined) {
        break;
      }
      var newKey = newAtom.chainname + "_" + newAtom.resid;
      if (key === newKey) {
        atoms.push(newAtom);
      } else {
        break;
      }
    }
    id = atom.id;
    atoms.push(atom);
    while (id++ && id < w3m.mol[molid].atom.main.length) {
      var newAtom = scope.getMainAtom(molid, id);
      if (newAtom === undefined) {
        break;
      }
      var newKey = newAtom.chainname + "_" + newAtom.resid;
      if (key === newKey) {
        atoms.push(newAtom);
      } else {
        break;
      }
    }
    return atoms;
  },

  getMainChainAtomsByAtom: function(atom) {
    var key = atom.chainname;
    var molid = PDB.pdbId;
    var scope = this;
    var atoms = new Array();
    var id = atom.id;
    while (id-- && id > 0) {
      var newAtom = scope.getMainAtom(molid, id);
      if (newAtom === undefined) {
        break;
      }
      var newKey = newAtom.chainname;
      if (key === newKey) {
        atoms.push(newAtom);
      } else {
        break;
      }
    }
    id = atom.id;
    atoms.push(atom);
    while (id++ && id < w3m.mol[molid].atom.main.length) {
      var newAtom = scope.getMainAtom(molid, id);
      if (newAtom === undefined) {
        break;
      }
      var newKey = newAtom.chainname;
      if (key === newKey) {
        atoms.push(newAtom);
      } else {
        break;
      }
    }
    return atoms;
  },

  getHetAtom: function(molid, id) {
    var scope = this;
    var atom = w3m.mol[molid].atom.het[id];
    if (atom !== undefined) {
      return scope.getAtomById(molid, atom, 'het');
    } else {
      return scope.getMainAtom(molid, id);
    }
    return undefined;
  },

  getAtomById: function(molid, atom, structure) {
    var scope = this;
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
    var offset = PDB.GeoCenterOffset;
    var pos_centered = new THREE.Vector3(
      xyz[0] + offset.x,
      xyz[1] + offset.y,
      xyz[2] + offset.z);
    //var color_index = w3m.mol[PDB.pdbId].color_real[atomID];//取得{r:*g:*,b:*}格式的颜色
    var color = scope.getColorByIndex(molid, atomID, structure);

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

  equalAtom: function(atom1, atom2) {
    if (atom1.id === atom2.id) {
      return true;
    }
    return false;
  },

  getColorByAtomType: function(atomType) {
    var X_color_index = w3m.color['element'][atomType];
    var X_color = w3m.rgb[X_color_index];
    var color = new THREE.Color(X_color[0], X_color[1], X_color[2]);
    return color;
  },

  getColorByIndex: function(molid, id, structure) {
    var rId = w3m.mol[molid].color[structure][id];
    if (rId) {
      var C_color = w3m.rgb[rId][0],
        N_color = w3m.rgb[rId][1],
        O_color = w3m.rgb[rId][2];
      return new THREE.Color(C_color, N_color, O_color);
    } else {
      return new THREE.Color("#ccc");
    }

  },

  getColorByColorIndex: function(colorIndex) {
    var X_color = w3m.rgb[colorIndex];
    var color = new THREE.Color(X_color[0], X_color[1], X_color[2]);
    return color;
  },

  getMaterialsByAtomId: function(id) {
    var colorId = w3m.mol[PDB.pdbId].color['main'][id];
    //if(materialsId[colorId]==undefined){
    var tc = PDB.tool.getColorByIndex(id, 'main');
    return new THREE.MeshPhongMaterial({
      color: tc
    });

    //}
  },

  writeTextFile: function(afilename, output) {
    var outfile = new debugout();
    outfile.logFilename = afilename;
    outfile.log(output);
    //outfile.log("By xukui from ZhangLab in Tsinghua Univ.");
    outfile.downloadLog();
    // var txtFile =new File(["foo"],afilename);
    // txtFile.writeln(output);
    // txtFile.close();
  },

  showMask: function() {
    var scope = this;
    var height = document.body.scrollHeight;
    var width = document.body.scrollWidth;
    var weChatMask = document.getElementById("weChatMask");
    weChatMask.style.display = "block";
    weChatMask.style.position = "absolute";
    weChatMask.style.display = "block";
    weChatMask.style.zIndex = "8888";
    weChatMask.style.width = width + "px";
    weChatMask.style.height = height + "px";
    weChatMask.style.background = "white";
    weChatMask.style.opacity = "0.5";
    var evt = event || window.event;
    var event = scope.getMousePos(evt);
    var weChatPop = document.getElementById("weChatPop");
    weChatPop.style.top = (event.y - 400) + "px";
    weChatPop.style.left = (event.x + 200) + "px";
    weChatPop.style.display = "block";
    weChatPop.style.zIndex = "9999";
    weChatPop.style.opacity = "1";
  },

  hideMask: function() {
    var weChatMask = document.getElementById("weChatMask");
    var weChatPop = document.getElementById("weChatPop");
    weChatMask.style.display = "none";
    weChatPop.style.display = "none";
  },

  getFirstAtomIdByChain: function(chainName) {
    var first_resid = Object.keys(w3m.mol[PDB.pdbId].rep[chainName])[0];
    return this.getFirstAtomByResidueId(first_resid, chainName)[0];

  },

  getFirstAtomByResidueId: function(residueId, chainName) {
    var atoms = w3m.mol[PDB.pdbId].atom.main;
    var atom = [];
    for (var atomId in atoms) {
      if (atoms[atomId][4] == chainName) {
        var p_residueId = atoms[atomId][5];
        if (residueId == p_residueId) {
          atom = atoms[atomId];
          break;
        }
      }
    }
    return atom;
  },

  getLastAtomByResidueId: function(residueId, chainName) {
    var atoms = w3m.mol[PDB.pdbId].atom.main;
    var atom = [];
    var pre_residueId = -1;
    var p_residueId = -1;
    for (var atomId in atoms) {
      if (atoms[atomId][4] == chainName) {
        p_residueId = atoms[atomId][5];
        // if(atoms[atomId][5] == residueId){
        if (pre_residueId != -1) {
          if (residueId == pre_residueId && pre_residueId != p_residueId) {
            atom = atoms[atomId - 1];
            break;
          }
        }
        pre_residueId = atoms[atomId][5];
        // }
      }
    }
    return atom;
  },

  getCAAtomByLastAtomId: function(atomId) { // Ca
    var atoms = w3m.mol[PDB.pdbId].atom.main;
    var atom = atoms[atomId];
    if (atom[2] === 'ca') {
      return atom;
    }
    while (atomId-- && atomId > 0) {
      atom = atoms[atomId];
      if (atom === undefined) continue;
      if (atom[2] == 'ca') break;
    }
    return atom;
  },

  getCAAtomByStartAtomId: function(atomId) { // Ca
    var atoms = w3m.mol[PDB.pdbId].atom.main;
    var atom = atoms[atomId];
    if (atom[2] === 'ca') {
      return atom;
    }
    while (atomId++ && atomId < Object.keys(atoms).length - 1) {
      atom = atoms[atomId];
      if (atom === undefined) continue;
      if (atom[2] == 'ca') break;
    }
    return atom;
  },

  getCAAtomByResidueId: function(residueId, chainName) {
    var scope = this;
    var atoms = w3m.mol[PDB.pdbId].atom.main;
    var atom = [];
    for (var atomId in atoms) {
      if (atoms[atomId][4] == chainName.toLowerCase() || atoms[atomId][4] == chainName.toUpperCase()) {
        var p_residueId = atoms[atomId][5];
        if (residueId == p_residueId && atoms[atomId][2] === "ca") {
          atom = atoms[atomId];
          break;
        }
      }
    }
    var atomObj = scope.getMainAtom(PDB.pdbId, atom[1]);
    return atomObj;
  },

  getMousePos: function(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return {
      'x': x,
      'y': y
    };
  },

  getAngleMeasurement: function(pointAngle, pointEdge1, pointEdge2) {
    var ms = {};
    var uAB = vec3.unit(vec3.point(pointAngle, pointEdge1)),
      uAC = vec3.unit(vec3.point(pointAngle, pointEdge2)),
      rad = vec3.rad(uAB, uAC, true),
      xyz = vec3.plus(pointAngle, vec3.plus(uAB, uAC));
    ms.result = math.rad2degree(rad);
    ms.label_xyz = xyz;
    return ms;
  },

  getMidPoint: function(molid, preAtomId, nextAtomId) {
    var offset = PDB.GeoCenterOffset;
    var preAtom = w3m.mol[molid].atom.main[preAtomId];
    var nextAtom = w3m.mol[molid].atom.main[nextAtomId];
    if (preAtom != undefined && nextAtom != undefined) {
      var pre = preAtom[6];
      var next = nextAtom[6];
      return new THREE.Vector3((pre[0] + next[0]) / 2 + offset.x, (pre[1] + next[1]) / 2 + offset.y, (pre[2] + next[2]) / 2 + offset.z);
    } else return undefined;

  },

  getColorForPercentage: function(pct) {
    var percentColors = [{
        pct: 0.0,
        color: {
          r: 0xff,
          g: 0x00,
          b: 0
        }
      },
      {
        pct: 0.5,
        color: {
          r: 0xff,
          g: 0xff,
          b: 0
        }
      },
      {
        pct: 1.0,
        color: {
          r: 0x00,
          g: 0xff,
          b: 0
        }
      }
    ];
    for (var i = 1; i < percentColors.length - 1; i++) {
      if (pct < percentColors[i].pct) {
        break;
      }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    //return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    return new THREE.Color(color.r, color.g, color.b);
    // or output as hex if preferred
  },

  colorIntersectObjectRed: function(obj, value) {
    if (obj.type === "Group") {
      for (var child in obj.children) {
        PDB.tool.colorIntersectObjectRed(obj.children[child], value);
      }
    } else if (obj != undefined && obj.material != undefined) {
      if (typeof(obj.material) === "object" && obj.material.emissive != undefined) {
        obj.material.emissive.r = value;
      } else if (obj.material.length !== undefined && obj.material.length >= 0 && obj.material[0].emissive != undefined) {
        obj.material[0].emissive.r = value;
      }
    }
  },

  colorIntersectObjectBlue: function(obj, value) {
    if (obj.type === "Group") {
      for (var child in obj.children) {
        PDB.tool.colorIntersectObjectBlue(obj.children[child], value);
      }
    } else if (obj != undefined && obj.material != undefined) {
      if (typeof(obj.material) === "object" && obj.material.emissive != undefined) {
        obj.material.emissive.b = value;
      } else if (obj.material.length !== undefined && obj.material.length >= 0 && obj.material[0].emissive != undefined) {
        obj.material[0].emissive.b = value;
      }
    }
  },

  colorIntersectObjectRed0: function(obj, value) {
    if (obj.type === "Group") {
      for (var child in obj.children) {
        PDB.tool.colorIntersectObjectRed(obj.children[child], value);
      }
    } else if (obj != undefined && obj.material != undefined &&
      obj.material.emissive != undefined) {
      obj.material.emissive.r = value;
    }
  },

  colorIntersectObjectBlue0: function(obj, value) {
    if (obj.type === "Group") {
      for (var child in obj.children) {
        PDB.tool.colorIntersectObjectBlue(obj.children[child], value);
      }
    } else if (obj != undefined && obj.material != undefined &&
      obj.material.emissive != undefined) {
      obj.material.emissive.b = value;
    }
  },

  ajax: (function() {
    var io = new XMLHttpRequest(),
      id = '',
      url = '',
      url_index = 0,
      callback = null;
	  io.timeout = 180000; // timeout ms
    io.onprogress = function() {

    }
    io.onload = function() {
      if (this.status == 200) {
        callback(io.responseText);
      } else {
        if (w3m_isset(PDB.remoteUrl[++url_index])) {
          this.get(id, callback);
        } else {
			PDB.tool.showSegmentholder(false);
          url_index = 0;
        }
      }
    }
    io.onabort = function() {
        url_index = 0;
      },
      io.ontimeout = function() {
		
        if (w3m_isset(PDB.remoteUrl[++url_index])) {
          this.get(id, callback);
        } else {
          url_index = 0;
		  PDB.tool.showSegmentholder(false);
        }

      },
      io.onerror = function() {
        url_index = 0;
		console.log(url_index);
      },
      io.get = function(url, fn) {
        callback = fn;
        this.open('GET', url, true);
        this.send();
      }
    return io;
  })(),

  checkPointOfSpecialPlane: function(point) {
    var plane = PDB.PLANE;
    var result = plane.a * point.x + plane.a * point.x + plane.b * point.y + plane.c * point.z + plane.d;
    if (result === 0) {
      return true;
    }
    return false;
  },

  generatePlane: function(point1, point2, point3) {
    var a, b, c, d;
    a = ((point2.y - point1.y) * (point3.z - point1.z) - (point2.z - point1.z) * (point3.y - point1.y));
    b = ((point2.z - point1.z) * (point3.x - point1.x) - (point2.x - point1.x) * (point3.z - point1.z));
    c = ((point2.x - point1.x) * (point3.y - point1.y) - (point2.y - point1.y) * (point3.x - point1.x));
    d = (0 - (a * point1.x + b * point1.y + c * point1.z));
    PDB.PLANE = {
      a: a,
      b: b,
      c: c,
      d: d
    };
  },

  isBonded: function(at1, at2) {
    var minlength2 = 0.5 * 0.5;
    var maxlength2 = 1.9 * 1.9;
    var maxlength_sbond2 = 2.2 * 2.2;
    var maxlength_hbond2 = 3.5 * 3.5;
    var d2 = (at2.pos.x - at1.pos.x) * (at2.pos.x - at1.pos.x) + (at2.pos.y - at1.pos.y) * (at2.pos.y - at1.pos.y) + (at2.pos.z - at1.pos.z) * (at2.pos.z - at1.pos.z);

    if (at1.name === 'sg' && at2.name === 'sg' && d2 < maxlength_sbond2) {
      return PDB.BOND_TYPE_SSBOND;
    } else if (minlength2 < d2 && d2 < maxlength2) {
      return PDB.BOND_TYPE_COVALENT;
    } else if ((at1.name === 'o' && at2.name === 'n' && d2 < maxlength_hbond2) ||
      (at1.name === 'n' && at2.name === 'o' && d2 < maxlength_hbond2) ||
      (at1.name === 'o' && at2.name === 'o' && d2 < maxlength_hbond2) ||
      (at1.name === 'n' && at2.name === 'n' && d2 < maxlength_hbond2)) {
      return PDB.BOND_TYPE_HBOND;
    } else {
      return PDB.BOND_TYPE_NONE;
    }
  },

  backToInitialPositionForVr: function() {
    for (var i in PDB.GROUP_STRUCTURE_INDEX) {
      PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.copy(new THREE.Vector3(0, 0, 0));
      PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].rotation.set(0, 0, 0);
    }
    var offset = camera.position;
    for (var chain in PDB.residueGroupObject) {
      for (var resid in PDB.residueGroupObject[chain]) {
        var caid = w3m.mol[PDB.pdbId].residueData[chain][resid].caid;
        var pos = PDB.tool.getMainAtom(PDB.pdbId, caid).pos_centered;
        PDB.residueGroupObject[chain][resid].vector = {
          x: pos.x - offset.x,
          y: pos.y - offset.y,
          z: pos.z - offset.z
        };
      }
    }
    for (var resid in w3m.mol[PDB.pdbId].residueData) {
      PDB.GROUP['chain_' + resid].position.copy(new THREE.Vector3(0, 0, 0));
      PDB.GROUP['chain_' + resid].rotation.set(0, 0, 0);
    }
    PDB.painter.repeatPainter();
  },

  matchSurfaceAndMainGroupLocationForVR: function(surfaceGroup, mainGroup) {
    if (surfaceGroup instanceof THREE.Group && mainGroup instanceof THREE.Group) {
      surfaceGroup.position.copy(mainGroup.position);
      surfaceGroup.rotation.copy(mainGroup.rotation);
    }
  },

  generateButton: function(parent, text, value, className) {
    var b_ = document.createElement("button");
    b_.innerHTML = text;
    b_.value = value;
    b_.className = className;
    parent.appendChild(b_);
    return b_;
  },

  generateColorPanel: function(parent) {
    var input = document.createElement("input");
    input.className = "simple_color";
    input.value = "#3366cc";
    parent.appendChild(input);
  },

  generateLabel: function(parent, text, className) {
    var b_ = document.createElement("label");
    b_.innerHTML = text;
    b_.className = className;
    parent.appendChild(b_);
    parent.appendChild(document.createElement("br"));
  },
  generateLabel_nobr: function(parent, text, className) {
    var b_ = document.createElement("label");
    b_.innerHTML = text;
    b_.className = className;
    parent.appendChild(b_);
  },
  generateTextBox: function(parent, id, text, className) {
    var tb = document.createElement("input");
    tb.id = id;
    tb.setAttribute("value", text);
    tb.className = className;
    parent.appendChild(tb);
  },

  generateSpan: function(parent, id, className) {
    var span = document.createElement("span");
    span.className = className;
    span.id = id;
    parent.appendChild(span);
    parent.appendChild(document.createElement("br"));
    return span;
  },

  generateALink: function(parent, id, text, link, className) {
    var aLink = document.createElement("a");
    var node = document.createTextNode(text);
    aLink.appendChild(node);
    aLink.setAttribute("href", link);
    aLink.setAttribute("target", "_blank");
    aLink.className = className;
    aLink.id = id;
    parent.appendChild(aLink);
    // parent.appendChild(document.createElement("br"));
    return aLink;
  },

  generateDocklingLink: function(parent, id, text, link, dbname) {
    var aLink = document.createElement("a");
    var node = document.createTextNode(text);

    aLink.appendChild(node);
    aLink.id = id;
    aLink.addEventListener('click', function() {
      //add holder
      PDB.tool.showSegmentholder(true);
      var modelSpan = document.getElementById("modelSpan");
      if(modelSpan){
        modelSpan.innerHTML = "";
      }
      //docking move
      PDB.DRUGMOVE = true;
      PDB.drugMoveTime = new Date();
      var x_c = w3m.global.limit.x[0] + (w3m.global.limit.x[1] - w3m.global.limit.x[0]) / 2;
      var y_c = w3m.global.limit.y[0] + (w3m.global.limit.y[1] - w3m.global.limit.y[0]) / 2;
      var z_c = w3m.global.limit.z[0] + (w3m.global.limit.z[1] - w3m.global.limit.z[0]) / 2;
      var x_s = w3m.global.limit.x[1] - w3m.global.limit.x[0];
      var y_s = w3m.global.limit.y[1] - w3m.global.limit.y[0];
      var z_s = w3m.global.limit.z[1] - w3m.global.limit.z[0];
      PDB.DRUG_MODE_CONFIG.x_c = x_c;
      PDB.DRUG_MODE_CONFIG.y_c = y_c;
      PDB.DRUG_MODE_CONFIG.z_c = z_c;
      PDB.DRUG_MODE_CONFIG.x_s = x_s;
      PDB.DRUG_MODE_CONFIG.y_s = y_s;
      PDB.DRUG_MODE_CONFIG.z_s = z_s;
      var url = PDB.DOCKING_URL + "?pdbid=" + PDB.pdbId.toUpperCase() + "&smolid=" + link.toUpperCase() +
        "&x_c=" + PDB.DRUG_MODE_CONFIG.x_c +
        "&y_c=" + PDB.DRUG_MODE_CONFIG.y_c +
        "&z_c=" + PDB.DRUG_MODE_CONFIG.z_c +
        "&x_s=" + PDB.DRUG_MODE_CONFIG.x_s +
        "&y_s=" + PDB.DRUG_MODE_CONFIG.y_s +
        "&z_s=" + PDB.DRUG_MODE_CONFIG.z_s;
      if (ServerType !== 2) {
        url = SERVERURL + "/data/autodock.json";
      }
      PDB.tool.ajax.get(url, function(text) {

        PDB.tool.showSegmentholder(false);
        var jsonObj = JSON.parse(text);
        if (jsonObj.model_list != undefined && jsonObj.model_list.length > 0) {
          var menuSpan = document.getElementById("menuSpan");

          if (modelSpan == undefined) {
            modelSpan = PDB.tool.generateSpan(menuSpan, "modelSpan", "rightsubmenu");
          } else {
            modelSpan.innerHTML = "";
          }

          //stop move drug
          PDB.DRUGMOVE = false;
          result_list_title = "<br>Model List &nbsp;&nbsp;Score&nbsp;&nbsp;Download";
          PDB.tool.generateLabel(modelSpan, result_list_title, "");
          for (var i in jsonObj.model_list) {
            if (jsonObj.model_list[i] === "") {
              continue;
            }
            //var text = jsonObj.model_list[i] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + jsonObj.scores[i];
            var text = jsonObj.model_list[i] ; //+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + jsonObj.scores[i];
            var text = jsonObj.smolid+"_"+(parseInt(i)+1);
            PDB.tool.generateButton(modelSpan, text, jsonObj.model_list[i], "rightLabelPDB").addEventListener('click', function() {

              var drugId = this.value.replace(".pdb", "");
              PDB.config.selectedDrug = drugId;
              PDB.DRUBDB_URL.docking = jsonObj.outdir + "/";
              PDB.loader.loadDrug(drugId, "docking", function() {
                w3m.mol[drugId].drug = true;
                PDB.render.clearGroupIndex(PDB.GROUP_DOCKING);
                var docking = true;
                PDB.painter.showHet(drugId, docking);
              });

            });
            PDB.tool.generateLabel_nobr(modelSpan, jsonObj.scores[i], "docking_score");
            PDB.tool.generateALink(modelSpan, "link" + i, "Link", jsonObj.outdir + "/" + jsonObj.model_list[i], "");

            //add BR
            modelSpan.appendChild(document.createElement("br"));
          }
        }
      //clear
      PDB.render.clearGroupIndex(PDB.GROUP_DRUG);

      });
    });
    parent.appendChild(aLink);
    return aLink;
  },

  setFaceColor: function(geometry, posObj) {
    var f0 = (posObj.x * posObj.width + posObj.y) * 2;
    var f1 = f0 + 1;
	if(geometry.faces[f0]){
		geometry.faces[f0].materialIndex = posObj.colorIndex;
	}
    if(geometry.faces[f1]){
		geometry.faces[f1].materialIndex = posObj.colorIndex;
	}
    
  },

  toHumanByte: function(limit) {
    var size = "";
    if (limit < 0.1 * 1024) { //to B
      size = limit.toFixed(2) + "B";
    } else if (limit < 0.1 * 1024 * 1024) { //to KB
      size = (limit / 1024).toFixed(2) + "KB";
    } else if (limit < 0.1 * 1024 * 1024 * 1024) { //to MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    } else { //to GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
    var sizestr = size + "";
    var len = sizestr.indexOf("\.");
    var dec = sizestr.substr(len + 1, 2);
    if (dec == "00") { //remove 00
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
  },

  setProgressBar: function(value, max) {
    var progress = document.getElementById("progress");
    if (progress.style.display == "none"){
      progress.style.display = "inline-block";
    }
    progress.value = value;
    progress.max = max;

  },

  printProgress: function(msg) {
    var progmsg = document.getElementById("tip");
    progmsg.innerHTML = msg;
  },

  getValueByPercent: function(min, max, percent) {
    return ((max - min) / 100) * percent + min;
  },

  getPercentByValue: function(min, max, curr) {
    var perValue = (max - min) / 100;
    return Math.floor((curr - min) / perValue);
  },

  backToInitialPositonForDesktop: function() {
    camera.position.set(PDB.cameraPosition.x, PDB.cameraPosition.y, PDB.cameraPosition.z);
  },

  getAtomInfoPosition: function(formPos, toPos) {
    var x = (3 * formPos.x + toPos.x) / 4;
    var y = (3 * formPos.y + toPos.y) / 4;
    var z = (3 * formPos.z + toPos.z) / 4;
    return new THREE.Vector3(x, y, z);
  },

  isJsonString: function(str) {
    try {
      if (typeof JSON.parse(str) == "object") {
        return true;
      }
    } catch (e) {}
    return false;
  },

  createDensityMapMenuForVR: function(jsonObj) {
    var color = 0xa345;
    limit = w3m.global.limit;
    var x = limit.x[1] + PDB.GeoCenterOffset.x;
    var y = 2;
    var z = limit.z[1] + PDB.GeoCenterOffset.z;
    x = x * 0.02;
    z = z * 0.02;

    if (jsonObj.code === 1 && jsonObj.data !== undefined) {

      var data = jsonObj.data;

      if (PDB.EMMAP.FIRST_ID === 0 && data.length > 0) {
        PDB.EMMAP.FIRST_ID = data[0];
      }

    } else {
      PDB.drawer.drawTextKB(PDB.GROUP_MENU_DENSITYMAP, new THREE.Vector3(x, y - 3 * 0.2, z), jsonObj.message, jsonObj.message, color, 135);
    }
  },

  createDensityMapPanel: function(jsonObj) {
    if (jsonObj.code === 1 && jsonObj.data !== undefined) {
      var scope = this;
      var rightMenuDiv = document.getElementById("rightmenu");
      rightMenuDiv.innerHTML = "";
      var titleLab = PDB.tool.generateLabel(rightMenuDiv, "Map List", "");
      var menuSpan = PDB.tool.generateSpan(rightMenuDiv, "menuSpan", "rightsubmenu");
      var menuSpan1 = PDB.tool.generateSpan(rightMenuDiv, "menuSpan1", "rightsubmenu");
      var data = jsonObj.data;
      var method = jsonObj.method
      if (PDB.EMMAP.FIRST_ID === 0 && data.length > 0) {
        PDB.EMMAP.FIRST_ID = data[0];
      }
      var color = PDB.tool.generateColorPanel(rightMenuDiv);
      $('.simple_color').simpleColor({
        onSelect: function(hex, element) {
          var mapSurfaceGroup = PDB.GROUP[PDB.GROUP_MAP];
          if (mapSurfaceGroup !== undefined && mapSurfaceGroup.children.length > 0 &&
            mapSurfaceGroup.children[0] instanceof THREE.Mesh && PDB.EMMAP.TYPE !== 0) {
            var mesh = PDB.GROUP[PDB.GROUP_MAP].children[0];
            if (mesh.material !== undefined) {
              mesh.material.color = new THREE.Color("#" + hex);
            }
          }
        }
      });
      for (var i in data) {
        PDB.tool.generateButton(menuSpan, method+": "+data[i], data[i], "rightLabelPDB").addEventListener('click', function() {
          var mapId = this.value;
          //PDB.render.clear(2);
          var mapserver = method;
          if (PDB.DEBUG_MODE == 1) {
            mapserver = "map-local";
          }
          // console.log('-----------------' + mapId);
          PDB.controller.emmapLoad(mapId, mapserver, function(emmap) {
            PDB.render.clearGroupIndex(PDB.GROUP_MAP);
            var dimension = document.getElementById("dimension");
            if (dimension != undefined) {
              PDB.DIMENSION = Number(dimension.value);
              switch (PDB.DIMENSION) {
                case PDB.DIMENSION_X:
                  PDB.EMMAP.MAX_SLICE = Number(emmap.header.NX);
                  break;
                case PDB.DIMENSION_Y:
                  PDB.EMMAP.MAX_SLICE = Number(emmap.header.NY);
                  break;
                case PDB.DIMENSION_Z:
                  PDB.EMMAP.MAX_SLICE = Number(emmap.header.NZ);
                  break;
              }
            }

            if (emmap) {
              switch (PDB.EMMAP.TYPE) {
                case 0:
                  PDB.painter.showMapSolid(emmap, emmap.threshold);
                  break;
                case 1:
                  PDB.painter.showMapSurface(emmap, emmap.threshold, false);
                  break;
                case 2:
                  PDB.painter.showMapSurface(emmap, emmap.threshold, true);
              }
              //PDB.painter.showMapSlices(PDB.EMMAP,PDB.EMMAP.threshold,PDB.EMMAP.MIN_SLICE,PDB.DIMENSION_X);
              scope.changeDensityMapRangeValue(emmap);
            }
          });
        });
        var map_link = EmMapParser.getURLByType(data[i], method+"-desc");
        // PDB.LINK_CONFIG.EMMAP + data[i]
        PDB.tool.generateALink(menuSpan, "mapLink" + i, "Detail", map_link, "");
        menuSpan.appendChild(document.createElement("br"));
      }
      menuSpan1.innerHTML = '<input class="labelPDB" id="solidMap" name="mapType" checked="checked"   type="radio" title="Map Type"/>  <label class="label"  for="solidMap"> Solid </label>   <BR/>' +
        '<input class="labelPDB" id="surfaceMap" name="mapType"  type="radio" title="Map Type"/>  <label class="label"  for="surfaceMap"> Surface </label>   <BR/>' +
        '<input class="labelPDB" id="meshMap" name="mapType"  type="radio" title="Map Type"/>  <label class="label"   for="meshMap"> Mesh </label>   <BR/>' +
        '<input class="labelPDB" type="checkbox" id="showSlice"><label class="label" for="showSlice"  > Show/Hide Slice </label> <BR/>' +
        '<input class="labelPDB" type="checkbox" checked id="showMap"><label class="label" for="showMap" > Show/Hide Map </label> <BR/><BR/>' +
        '<label class="label"> Step Size </label><BR/>' +
        '<input class="labelPDB" id="step1" name="stepOption"  type="radio" title="Map Type"/>  <label class="label" for="threeMode"> 1.x </label>' +
        '<input class="labelPDB" id="step2" name="stepOption"  checked="checked" type="radio" title="Map Type"/>  <label class="label" for="threeMode"> 2.x </label>' +
        '<input class="labelPDB" id="step4" name="stepOption"  type="radio" title="Map Type"/>  <label class="label" for="threeMode"> 4.x </label> <BR/><BR/>' +
        '<label class="label"> Level </label><BR/> <input type="range" id="thresholdRange" title="Change the value of threshold" style="width: 180px;" name="" min="1" max="100" /><BR/>' +
        '<label class="label" id="minThresHold"  style="width: 60px;text-align: left;float: left;"> </label>'+
        '<label class="label" id="currThresHold" style="width: 60px;text-align: center"> </label>'+
        '<label class="label" id="maxThresHold"  style="width: 60px;text-align: right;float: right;"> </label><BR/>' +
        '<label class="label"> Slice Range </label><BR/> '+
        '<input type="range" id="sliceRange" title="Change the value of slice" style="width: 180px;" name="" /><BR/> ' +
        '<label class="label" id="minSlice"  style="width: 60px;text-align: left;float: left;"></label>'+
        '<label class="label" id="currSlice" style="width: 60px;text-align: center"></label>'+
        '<label class="label" id="maxSlice"  style="width: 60px;text-align: right; float: right" ></label><BR/>' +
        '<label class="label"> Slice Axis </label><BR/> '+
        '<select id="dimension"> <option value="0" checked>x</option> <option value="1" checked>y</option> <option value="2" checked>z</option> </select> <BR/>'+
        '<label class="label"> Surface Color </label>';

      var solidMap = document.getElementById("solidMap");
      solidMap.addEventListener('click', function(e) {
		PDB.tool.showSegmentholder(true);
		setTimeout(function() {
			PDB.render.clearGroupIndex(PDB.GROUP_MAP);
			PDB.EMMAP.TYPE = 0;
			PDB.map_surface_show = 0;
			if (PDB.EMMAP.DATA) {
			  var thresholdObj = document.getElementById("currThresHold");
			  PDB.painter.showMapSolid(PDB.EMMAP.DATA, Number(thresholdObj.innerHTML));
			}
		PDB.tool.showSegmentholder(false, false);
		}, PDB.HOLDERTIME);
      });
      var surfaceMap = document.getElementById("surfaceMap");
      surfaceMap.addEventListener('click', function(e) {
		PDB.tool.showSegmentholder(true);
		setTimeout(function() {
			PDB.EMMAP.TYPE = 1;
			if (PDB.map_surface_show === 0) {
			  PDB.render.clearGroupIndex(PDB.GROUP_MAP);
			  if (PDB.EMMAP.DATA) {
				var thresholdObj = document.getElementById("currThresHold");
				PDB.painter.showMapSurface(PDB.EMMAP.DATA, Number(thresholdObj.innerHTML), false);
			  }
			} else {
			  var surfaceGroup = PDB.GROUP[PDB.GROUP_MAP];
			  if (surfaceGroup !== undefined && surfaceGroup.children.length > 0 && surfaceGroup.children[0] instanceof THREE.Mesh) {
				var mesh = PDB.GROUP[PDB.GROUP_MAP].children[0];
				if (mesh.material !== undefined) {
				  mesh.material.wireframe = false;
				}
			  }
			}
			PDB.map_surface_show = 1;
			PDB.tool.showSegmentholder(false, false);
		}, PDB.HOLDERTIME);
      });

      var meshMap = document.getElementById("meshMap");
      meshMap.addEventListener('click', function(e) {
		PDB.tool.showSegmentholder(true);
		setTimeout(function() {
			PDB.EMMAP.TYPE = 2;
			if (PDB.map_surface_show === 0) {
			  PDB.render.clearGroupIndex(PDB.GROUP_MAP);
			  if (PDB.EMMAP.DATA) {
				var thresholdObj = document.getElementById("currThresHold");
				PDB.painter.showMapSurface(PDB.EMMAP.DATA, Number(thresholdObj.innerHTML), true);
			  }
			} else {
			  var surfaceGroup = PDB.GROUP[PDB.GROUP_MAP];
			  if (surfaceGroup !== undefined && surfaceGroup.children.length > 0 && surfaceGroup.children[0] instanceof THREE.Mesh) {
				var mesh = PDB.GROUP[PDB.GROUP_MAP].children[0];
				if (mesh.material !== undefined) {
				  mesh.material.wireframe = true;
				}
			  }
			}
			PDB.map_surface_show = 1;
		PDB.tool.showSegmentholder(false, false);
		}, PDB.HOLDERTIME);
      });

      //add step
      var step1 = document.getElementById("step1");
      step1.addEventListener('click', function(e) {
        PDB.map_step = 1;
        PDB.tool.showDestinyMap();
      });
      var step2 = document.getElementById("step2");
      step2.addEventListener('click', function(e) {
        PDB.map_step = 2;
        PDB.tool.showDestinyMap();
      });

      var step4 = document.getElementById("step4");
      step4.addEventListener('click', function(e) {
        PDB.map_step = 4;
        PDB.tool.showDestinyMap();
      });

      //show or hide slice
      var showSlice = document.getElementById("showSlice");
      showSlice.addEventListener('click', function(e) {
		PDB.tool.showSegmentholder(true);
		setTimeout(function() {
			PDB.render.clearGroupIndex(PDB.GROUP_SLICE);
			if (e.target.checked && PDB.EMMAP.DATA !== undefined && Object.keys(PDB.EMMAP.DATA).length > 0) {
			  PDB.EMMAP.SHOW_SLICE = true;
			  var value = Number(document.getElementById("sliceRange").value);
			  var currSlice = document.getElementById("currSlice");
			  currSlice.innerHTML = value;
			  var thresholdObj = document.getElementById("currThresHold");
			  var tvalue = Number(thresholdObj.innerHTML);
			  PDB.painter.showMapSlices(PDB.EMMAP.DATA, tvalue, value, PDB.DIMENSION);
			} else {
			  PDB.EMMAP.SHOW_SLICE = false;
			}
		PDB.tool.showSegmentholder(false, false);
		}, PDB.HOLDERTIME);
      });

      //show or hide slice
      var showMap = document.getElementById("showMap");
      showMap.addEventListener('click', function(e) {
		PDB.tool.showSegmentholder(true);
		setTimeout(function() {
			if (e.target.checked && PDB.EMMAP.DATA !== undefined) {
			  PDB.EMMAP.SHOW_MAP = true;
			  var emmap = PDB.EMMAP.DATA;
			  var thresholdObj = document.getElementById("currThresHold");
			  var tvalue = Number(thresholdObj.innerHTML);
			  switch (PDB.EMMAP.TYPE) {
				case 0:
				  PDB.painter.showMapSolid(emmap, tvalue);
				  break;
				case 1:
				  PDB.painter.showMapSurface(emmap, tvalue, false);
				  break;
				case 2:
				  PDB.painter.showMapSurface(emmap, tvalue, true);
			  }
			} else {
			  PDB.render.clearGroupIndex(PDB.GROUP_MAP);
			  PDB.EMMAP.SHOW_MAP = false;
			}
		PDB.tool.showSegmentholder(false, false);
		}, PDB.HOLDERTIME);	
      });

      //bar slice
      var sliceRange = document.getElementById("sliceRange");
      sliceRange.addEventListener('change', function(e) {
		PDB.tool.showSegmentholder(true);
		setTimeout(function() {
			var emmap = PDB.EMMAP.DATA;
			var value = Number(e.target.value);
			PDB.render.clearGroupIndex(PDB.GROUP_SLICE);
			var currSlice = document.getElementById("currSlice");
			currSlice.innerHTML = value;
			if (PDB.EMMAP.SHOW_SLICE) {
			  PDB.painter.showMapSlices(emmap, emmap.threshold, value, PDB.DIMENSION);
			}
		PDB.tool.showSegmentholder(false, false);
		}, PDB.HOLDERTIME);
      });
      var thresholdRange = document.getElementById("thresholdRange");
      thresholdRange.addEventListener('change', function(e) {
		PDB.tool.showSegmentholder(true);
		setTimeout(function() {
			var emmap = PDB.EMMAP.DATA;
			if (emmap && emmap.header) {
			  var value = Number(e.target.value);
			  var perValue = PDB.tool.getValueByPercent(emmap.header.min, emmap.header.max, value);
			  var currThresHold = document.getElementById("currThresHold");
			  currThresHold.innerHTML = perValue.toFixed(3);
			  if (PDB.EMMAP.SHOW_MAP) {
				PDB.render.clearGroupIndex(PDB.GROUP_MAP);
				switch (PDB.EMMAP.TYPE) {
				  case 0:
					PDB.painter.showMapSolid(emmap, perValue);
					break;
				  case 1:
					PDB.painter.showMapSurface(emmap, perValue, false);
					break;
				  case 2:
					PDB.painter.showMapSurface(emmap, perValue, true);
				}
			  }
			}
		PDB.tool.showSegmentholder(false, false);
		}, PDB.HOLDERTIME);
      });

      var dimension = document.getElementById("dimension");
      dimension.addEventListener('change', function(e) {
		PDB.tool.showSegmentholder(true);
		setTimeout(function() {
			var v = e.target.value;
			if (v) {
			  v = Number(v);
			}
			PDB.DIMENSION = v;
			var emmap = PDB.EMMAP.DATA;
			if (emmap && PDB.EMMAP.SHOW_SLICE) {
			  PDB.render.clearGroupIndex(PDB.GROUP_SLICE);
			  var sliceRange = document.getElementById("sliceRange");
			  sliceRange.min = 1;
			  switch (PDB.DIMENSION) {
				case PDB.DIMENSION_X:
				  sliceRange.max = Number(emmap.header.NX);
				  break;
				case PDB.DIMENSION_Y:
				  sliceRange.max = Number(emmap.header.NY);
				  break;
				case PDB.DIMENSION_Z:
				  sliceRange.max = Number(emmap.header.NZ);
				  break;
			  }
			  var sliceRange = document.getElementById("sliceRange");
			  sliceRange.value = 1;
			  var minSlice = document.getElementById("minSlice");
			  minSlice.innerHTML = sliceRange.min;
			  var maxSlice = document.getElementById("maxSlice");
			  maxSlice.innerHTML = sliceRange.max;
			  var currSlice = document.getElementById("currSlice");
			  currSlice.innerHTML = sliceRange.value;
			  PDB.painter.showMapSlices(emmap, emmap.threshold, 0, PDB.DIMENSION);
			}
		PDB.tool.showSegmentholder(false, false);
		}, PDB.HOLDERTIME);
        
      });
    }
  },

  showDestinyMap: function() {
    if (PDB.EMMAP.TYPE === 0) {
      PDB.render.clearGroupIndex(PDB.GROUP_MAP);
      PDB.map_surface_show = 0;
      if (PDB.EMMAP.DATA) {
        var thresholdObj = document.getElementById("currThresHold");
        PDB.painter.showMapSolid(PDB.EMMAP.DATA, Number(thresholdObj.innerHTML));
      }
    } else if (PDB.EMMAP.TYPE === 1) {
      PDB.render.clearGroupIndex(PDB.GROUP_MAP);
      if (PDB.EMMAP.DATA) {
        var thresholdObj = document.getElementById("currThresHold");
        PDB.painter.showMapSurface(PDB.EMMAP.DATA, Number(thresholdObj.innerHTML), false);
      }
      PDB.map_surface_show = 1;
    } else if (PDB.EMMAP.TYPE === 2) {
      PDB.render.clearGroupIndex(PDB.GROUP_MAP);
      if (PDB.EMMAP.DATA) {
        var thresholdObj = document.getElementById("currThresHold");
        PDB.painter.showMapSurface(PDB.EMMAP.DATA, Number(thresholdObj.innerHTML), true);
      }
      PDB.map_surface_show = 1;
    }
  },

  changeDensityMapRangeValue: function(emmap) {
    //threshold
    var thresholdRange = document.getElementById("thresholdRange");
    thresholdRange.value = PDB.tool.getPercentByValue(emmap.header.min, emmap.header.max, emmap.threshold);
    var minThresHold = document.getElementById("minThresHold");
    minThresHold.innerHTML = emmap.header.min.toFixed(3);
    var maxThresHold = document.getElementById("maxThresHold");
    maxThresHold.innerHTML = emmap.header.max.toFixed(3);
    var currThresHold = document.getElementById("currThresHold");
    currThresHold.innerHTML = emmap.threshold.toFixed(3);
    //slice
    var sliceRange = document.getElementById("sliceRange");

    sliceRange.min = PDB.EMMAP.MIN_SLICE;
    sliceRange.max = PDB.EMMAP.MAX_SLICE;
    sliceRange.value = PDB.EMMAP.MIN_SLICE;
    var minSlice = document.getElementById("minSlice");
    minSlice.innerHTML = PDB.EMMAP.MIN_SLICE;
    var maxSlice = document.getElementById("maxSlice");
    maxSlice.innerHTML = PDB.EMMAP.MAX_SLICE;
    var currSlice = document.getElementById("currSlice");
    currSlice.innerHTML = PDB.EMMAP.MIN_SLICE;

    //default map
    var solidMap = document.getElementById("solidMap");
    var surfaceMap = document.getElementById("surfaceMap");
    var meshMap = document.getElementById("meshMap");
    switch (PDB.EMMAP.TYPE){
        case 0:
          solidMap.checked = "checked";
          break;
        case 1:
            surfaceMap.checked = "checked";
            break;
        case 2:
            meshMap.checked = "checked";
            break;
    }
  },

  initChainNameFlag: function(chainName, isNomal, chainNum) {
    // console.log(chainNum);
    //$("#chainNumThreshold").append("<button class=\"labelPDB chainBtn"+(isNomal?" chainSelected":"")+"\" name=\"chainName\" id=\"chain_"+chainName+"\">"+chainNum+":"+chainName+"</button>&nbsp;");
  },

  clearChainNameFlag: function() {
    //$("#chainNumThreshold").html("");
  },

  bindAllChainEvent: function(type, allChainNum) {
    $(".chainBtn").bind('click', function(e) {
      var chainInfo = $("#" + e.target.id).html().split(":");
      var chainNum = Number(chainInfo[0]);
      var chainName = chainInfo[1];
      if (chainNum > PDB.initChainNumThreshold) {
        for (var i = 0; i < chainNum; i++) {
          if ($($(".chainBtn")[i]).hasClass('chainSelected')) {
            continue;
          } else {
            //re-draw
            var chain_ = $(".chainBtn")[i].id;
            var chain = chain_.split("_")[1];
            PDB.render.clearGroupIndex(chain_);
            for (var resid in w3m.mol[PDB.pdbId].residueData[chain]) {
              PDB.painter.showResidue(chain, resid, type, true);
            }
            $($(".chainBtn")[i]).addClass('chainSelected');
          }
        }
      } else if (chainNum < PDB.initChainNumThreshold) {
        for (var i = PDB.initChainNumThreshold - 1; i > chainNum - 1; i--) {
          if ($($(".chainBtn")[i]).hasClass('chainSelected')) {
            //re-draw
            var chain_ = $(".chainBtn")[i].id;
            var chain = chain_.split("_")[1];
            PDB.render.clearGroupIndex(chain_);
            for (var resid in w3m.mol[PDB.pdbId].residueData[chain]) {
              PDB.painter.showResidue(chain, resid, PDB.LINE, true);
            }
            $($(".chainBtn")[i]).removeClass('chainSelected');
          } else {
            continue;
          }
        }
      }

      PDB.initChainNumThreshold = chainNum;
    })
  },

  getRealVectorForRepeatPainter: function(vec) {
    for (var chain in PDB.residueGroupObject) {
      for (var resid in PDB.residueGroupObject[chain]) {
        PDB.residueGroupObject[chain][resid].vector.x -= vec.x;
        PDB.residueGroupObject[chain][resid].vector.y -= vec.y;
        PDB.residueGroupObject[chain][resid].vector.z -= vec.z;
      }
    }
    PDB.painter.repeatPainter();
  },

  rotateAboutWorldAxis: function(vec, axis, angle) {
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), angle);
    var currentPos = new THREE.Vector4(vec.x, vec.y, vec.z, 1);
    var newPos = currentPos.applyMatrix4(rotationMatrix);
    return new THREE.Vector3(newPos.x, newPos.y, newPos.z);
  },

  freshAllResidueGroupObject: function(angle) {
    PDB.nowRotateAngle = PDB.nowRotateAngle + angle;
    if (Math.abs(PDB.nowRotateAngle) >= PDB.rotateAngleThreshold) {
      var scope = this;
      var axis;
      switch (PDB.ROTATION_AXIS) {
        case 1:
          PDB.rotateAxisAngle.x += angle;
          axis = new THREE.Vector3(1, 0, 0);
          break;
        case 2:
          PDB.rotateAxisAngle.y += angle;
          axis = new THREE.Vector3(0, 1, 0);
          break;
        case 3:
          PDB.rotateAxisAngle.z += angle;
          axis = new THREE.Vector3(0, 0, 1);
          break;
      }
      for (var chain in PDB.residueGroupObject) {
        for (var resid in PDB.residueGroupObject[chain]) {
          var pos = camera.position;
          var obj = PDB.residueGroupObject[chain][resid].vector;
          // var vec = {
          // x:pos.x+obj.x,
          // y:pos.y+obj.y,
          // z:pos.z+obj.z
          // }
          var vec = {
            x: pos.x + obj.x - PDB.rotateAxis.x,
            y: pos.y + obj.y - PDB.rotateAxis.y,
            z: pos.z + obj.z - PDB.rotateAxis.z
          }
          var nowp = scope.rotateAboutWorldAxis(vec, axis, PDB.nowRotateAngle);

          // PDB.residueGroupObject[chain][resid].vector.x = nowp.x;
          // PDB.residueGroupObject[chain][resid].vector.y = nowp.y;
          // PDB.residueGroupObject[chain][resid].vector.z = nowp.z;

          PDB.residueGroupObject[chain][resid].vector.x = (nowp.x - pos.x + PDB.rotateAxis.x);
          PDB.residueGroupObject[chain][resid].vector.y = (nowp.y - pos.y + PDB.rotateAxis.y);
          PDB.residueGroupObject[chain][resid].vector.z = (nowp.z - pos.z + PDB.rotateAxis.z);
        }
      }

      PDB.painter.repeatPainter();
      PDB.nowRotateAngle = 0;
    }

  },

  freshOneVector: function(vector, angle) {

    if (angle.x && angle.x != 0) {
      var axis = new THREE.Vector3(1, 0, 0);
      vector = PDB.tool.rotateAboutWorldAxis(vector, axis, angle.x);
    }

    if (angle.y && angle.y != 0) {
      var axis = new THREE.Vector3(0, 1, 0);
      vector = PDB.tool.rotateAboutWorldAxis(vector, axis, angle.y);
    }

    if (angle.z && angle.z != 0) {
      var axis = new THREE.Vector3(0, 0, 1);
      vector = PDB.tool.rotateAboutWorldAxis(vector, axis, angle.z);
    }
    return vector;

  },

  getVectorLength: function(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2));
  },

  rotation: function(groupIndexs, type) {
    PDB.tool.rotation_y(groupIndexs, type);
  },
  rotation_x: function(groupIndexs, type) {
    var scope = this;
    if (type === 0) {
      groupIndexs.forEach(function(index) {
        var group = PDB.GROUP[index];
        if (group !== undefined) {
          group.rotation.x = group.rotation.x - PDB.ROTATION_STEP;
        }
      });
      scope.freshAllResidueGroupObject(-PDB.ROTATION_STEP); //-0.005<-------------
    } else if (type === 1) {
      groupIndexs.forEach(function(index) {
        var group = PDB.GROUP[index];
        if (group !== undefined) {
          group.rotation.x = group.rotation.x + PDB.ROTATION_STEP;
        }
      });
      scope.freshAllResidueGroupObject(PDB.ROTATION_STEP); //0.005<---------------
    }
  },

  rotation_y: function(groupIndexs, type) {
    var scope = this;
    if (type === 0) {
      groupIndexs.forEach(function(index) {
        var group = PDB.GROUP[index];
        if (group !== undefined) {
          group.rotation.y = group.rotation.y - PDB.ROTATION_STEP;
        }
      });
      scope.freshAllResidueGroupObject(-PDB.ROTATION_STEP); //-0.005<-------------
    } else if (type === 1) {
      groupIndexs.forEach(function(index) {
        var group = PDB.GROUP[index];
        if (group !== undefined) {
          group.rotation.y = group.rotation.y + PDB.ROTATION_STEP;
        }
      });
      scope.freshAllResidueGroupObject(PDB.ROTATION_STEP); //0.005<---------------
    }
  },

  rotation_z: function(groupIndexs, type) {
    var scope = this;
    if (type === 0) {
      groupIndexs.forEach(function(index) {
        var group = PDB.GROUP[index];
        if (group !== undefined) {
          group.rotation.z = group.rotation.z - PDB.ROTATION_STEP;
        }
      });
      scope.freshAllResidueGroupObject(-PDB.ROTATION_STEP);
    } else if (type === 1) {
      groupIndexs.forEach(function(index) {
        var group = PDB.GROUP[index];
        if (group !== undefined) {
          group.rotation.z = group.rotation.z + PDB.ROTATION_STEP;
        }
      });
      scope.freshAllResidueGroupObject(PDB.ROTATION_STEP);
    }
  },

  saveString: function(text, filename) {
    var blob = new Blob([text], {
      type: 'text/plain'
    });
    var link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.obj';
    link.click();
  },

  generateDrugMigrationPath: function(limit) {
    var offset = "";
    if (!limit) {
      limit = {
        x: PDB.limit.x,
        y: PDB.limit.y,
        z: PDB.limit.z
      };
      offset = PDB.DrugCenterOffset;
    } else {
      var x = -(limit.x[0] + limit.x[1]) / 2;
      var y = -(limit.y[0] + limit.y[1]) / 2;
      var z = -(limit.z[0] + limit.z[1]) / 2;
      offset = new THREE.Vector3(x, y, z);
    }
    var pathScopex = limit.x[1] - limit.x[0];
    var pathScopey = limit.y[1] - limit.y[0];
    var pathScopez = limit.z[1] - limit.z[0];
	
	var dLength = {x:0,y:0,z:0};
	if(w3m.global.drugLimit){
		dLength.x = w3m.global.drugLimit.x[1] - w3m.global.drugLimit.x[0];
		dLength.y = w3m.global.drugLimit.y[1] - w3m.global.drugLimit.y[0];
		dLength.z = w3m.global.drugLimit.z[1] - w3m.global.drugLimit.z[0];
	}
	
	if(pathScopex > dLength.x){		
		pathScopex = pathScopex - dLength.x/2;
	}
	if(pathScopey > dLength.y){		
		pathScopey = pathScopey - dLength.y/2;
	}
	if(pathScopez > dLength.z){		
		pathScopez = pathScopez - dLength.z/2;
	}
    PDB.DRUGMigrationPaths = [];
    for (var i = 0; i < 50; i++) {
      var pos = new THREE.Vector3(Math.random() * pathScopex + limit.x[0]+ offset.x, Math.random() * pathScopey + limit.y[0] + offset.y, Math.random() * pathScopez + limit.z[0]+ offset.z);
      pos.len = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2) + Math.pow(pos.z, 2));
      PDB.DRUGMigrationPaths.push(pos);
    }

    function sortPos(posA, posB) {
      return posB.len - posA.len;
    }
    PDB.DRUGMigrationPaths.sort(sortPos);
    var po = PDB.GROUP[PDB.GROUP_DRUG].position;
    var t = new THREE.Vector3(offset.x - PDB.GeoCenterOffset.x + PDB.rotateAxis.x, offset.y - PDB.GeoCenterOffset.y + PDB.rotateAxis.y,  offset.z - PDB.GeoCenterOffset.z + PDB.rotateAxis.z);
	
	t = PDB.tool.freshOneVector(t, PDB.rotateAxisAngle);
    PDB.GROUP[PDB.GROUP_DRUG].position.copy(t);
  },

  migrationDrug: function() {
    if (PDB.GROUP[PDB.GROUP_DRUG] && PDB.GROUP[PDB.GROUP_DRUG].children.length > 0) {
      if (!PDB.PathCount) {
        PDB.PathCount = 0;
      }
      var i = PDB.PathCount % (PDB.DRUGMigrationPaths.length);
	  var rota = {};
	  rota.x = Math.random()*2*Math.PI - Math.PI;
	  rota.y = Math.random()*2*Math.PI - Math.PI;
	  rota.z = Math.random()*2*Math.PI - Math.PI;
      if (PDB.DRUGMigrationPaths.length > 0) {
		  
		//PDB.GROUP[PDB.GROUP_DRUG].position.copy(new THREE.Vector3(PDB.DrugCenterOffset.x - PDB.GeoCenterOffset.x, PDB.DrugCenterOffset.y - PDB.GeoCenterOffset.y,  PDB.DrugCenterOffset.z - PDB.GeoCenterOffset.z));
        // PDB.GROUP[PDB.GROUP_DRUG].rotation.x = PDB.GROUP[PDB.GROUP_DRUG].rotation.x - rota.x ;
		// PDB.GROUP[PDB.GROUP_DRUG].rotation.y = PDB.GROUP[PDB.GROUP_DRUG].rotation.y - rota.y ;
		// PDB.GROUP[PDB.GROUP_DRUG].rotation.z = PDB.GROUP[PDB.GROUP_DRUG].rotation.z - rota.z ;
		// PDB.GROUP[PDB.GROUP_DRUG].position.x = PDB.GROUP[PDB.GROUP_DRUG].position.x - PDB.DrugCenterOffset.x;
		// PDB.GROUP[PDB.GROUP_DRUG].position.y = PDB.GROUP[PDB.GROUP_DRUG].position.y - PDB.DrugCenterOffset.y;
		// PDB.GROUP[PDB.GROUP_DRUG].position.z = PDB.GROUP[PDB.GROUP_DRUG].position.z - PDB.DrugCenterOffset.z;
		
		// PDB.GROUP[PDB.GROUP_DRUG].rotation.x = PDB.GROUP[PDB.GROUP_DRUG].rotation.x - rota.x;
		// PDB.GROUP[PDB.GROUP_DRUG].rotation.y = PDB.GROUP[PDB.GROUP_DRUG].rotation.y - rota.y;
		// PDB.GROUP[PDB.GROUP_DRUG].rotation.z = PDB.GROUP[PDB.GROUP_DRUG].rotation.z - rota.z;
		
		
		// // rotate it the right way for lookAt to work
		// var x_4 = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(rota.x*180));
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(x_4);
		// // new THREE.Matrix4()..makeRotationY(THREE.Math.degToRad(rota.y*180)).makeRotationZ(THREE.Math.degToRad(rota.z*180));
		// var y_4 = new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(rota.y*180));
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(y_4);
		// var z_4 = new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(rota.z*180));
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(z_4);
		
		
		
		
		
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(new THREE.Matrix4().makeRotationX(rota.x));
		// // PDB.GROUP[PDB.GROUP_DRUG].position.copy(t);
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(new THREE.Matrix4().makeRotationY(rota.y));
		// // PDB.GROUP[PDB.GROUP_DRUG].position.copy(t);
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(new THREE.Matrix4().makeRotationZ(rota.z));
		// PDB.GROUP[PDB.GROUP_DRUG].position.x = PDB.GROUP[PDB.GROUP_DRUG].position.x + PDB.DrugCenterOffset.x;
		// PDB.GROUP[PDB.GROUP_DRUG].position.y = PDB.GROUP[PDB.GROUP_DRUG].position.y + PDB.DrugCenterOffset.y;
		// PDB.GROUP[PDB.GROUP_DRUG].position.z = PDB.GROUP[PDB.GROUP_DRUG].position.z + PDB.DrugCenterOffset.z;
		//debugger;
		var pos = new THREE.Vector3(PDB.DRUGMigrationPaths[i].x + PDB.rotateAxis.x, PDB.DRUGMigrationPaths[i].y + PDB.rotateAxis.y, PDB.DRUGMigrationPaths[i].z + PDB.rotateAxis.z );
        
		pos = PDB.tool.freshOneVector(pos, PDB.rotateAxisAngle);
		// var tt = {
			// x:-rota.x,
			// y:-rota.y,
			// z:-rota.z
		// }
		// pos = PDB.tool.freshOneVector(pos, tt);
		
		debugger;
		// var currentPos = new THREE.Vector4(pos.x, pos.y, pos.z, 1);
		//var newPos = currentPos.applyMatrix4(x_4);
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(new THREE.Matrix4().makeTranslation(0,0,0));
		// PDB.GROUP[PDB.GROUP_DRUG].position.copy(new THREE.Vector3(PDB.DrugCenterOffset.x - PDB.GeoCenterOffset.x, PDB.DrugCenterOffset.y - PDB.GeoCenterOffset.y,  PDB.DrugCenterOffset.z - PDB.GeoCenterOffset.z));
        
		
		
        PDB.GROUP[PDB.GROUP_DRUG].position.copy(pos);
		
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(x_4);
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(y_4);
		// PDB.GROUP[PDB.GROUP_DRUG].applyMatrix(z_4);
      }
	  
	  // PDB.GROUP[PDB.GROUP_DRUG].position.x = PDB.GROUP[PDB.GROUP_DRUG].position.x + PDB.GeoCenterOffset.x;
	  // PDB.GROUP[PDB.GROUP_DRUG].position.y = PDB.GROUP[PDB.GROUP_DRUG].position.y + PDB.GeoCenterOffset.y;
	  // PDB.GROUP[PDB.GROUP_DRUG].position.z = PDB.GROUP[PDB.GROUP_DRUG].position.z + PDB.GeoCenterOffset.z;
	  
      //drug
      if (PDB.GROUP[PDB.GROUP_SURFACE_HET] != undefined) {
        var po = PDB.GROUP[PDB.GROUP_DRUG].position;
        PDB.GROUP[PDB.GROUP_SURFACE_HET].position.copy(po);
      }
      PDB.PathCount++;
    }
  },

  showMutationTable: function(flag, text) {
    var rightMenuDiv = document.getElementById("rightmenu");
    rightMenuDiv.innerHTML = "";
    rightMenuDiv.style.overflowY = "auto";
    rightMenuDiv.style.height=(document.body.clientHeight - 110)+"px";
    if (flag) {
      rightMenuDiv.hidden = false;
    } else {
      rightMenuDiv.hidden = true;
    }
    var jsonObj = JSON.parse(text);
    if (jsonObj.code === 1 && jsonObj.data !== undefined) {
      var titleLab = PDB.tool.generateLabel(rightMenuDiv, "Mutation info table", "");

      var data = jsonObj.data.mutations;
      var table = document.createElement("table");
      var tr = document.createElement('tr');
      var titles = ["pos", "p_change", "v_class", "v_type", "disease"];
      for (var i = 0; i < titles.length; i++) {
        var td = document.createElement('td');
        td.innerHTML = titles[i];
        tr.appendChild(td);
      }
      table.appendChild(tr);
      table.style.color = '#FFFFFF';
      table.style.borderColor = "#FFFFFF";

      for (var i = 0; i < data.length; i++) {
        var newRow = table.insertRow();
        newRow.id=data[i].pos+data[i].p_change;

        var pos = newRow.insertCell(0);
        pos.innerHTML = data[i].pos;

        var p_change = newRow.insertCell(1);
        p_change.innerHTML = data[i].p_change;

        var v_class = newRow.insertCell(2);
        v_class.innerHTML = data[i].v_class

        var v_type = newRow.insertCell(3);
        v_type.innerHTML = data[i].v_type

        var disease = newRow.insertCell(4);
		if(data[i].disease){
			disease.innerHTML = data[i].disease
		}

      }
      var span = PDB.tool.generateSpan(rightMenuDiv, "span", "rightsubmenu");
      span.appendChild(table);
    }
  },

  showAxis: function(showFlag) {
    if (PDB.GROUP[PDB.GROUP_AXIS] !== undefined && PDB.GROUP[PDB.GROUP_AXIS].children.length === 0) {
      var size = Math.max(PDB.limit.x[1], PDB.limit.y[1], PDB.limit.z[1])
      var axisHelper = new THREE.AxisHelper(size);
      PDB.GROUP[PDB.GROUP_AXIS].add(axisHelper);
    } else if (PDB.GROUP[PDB.GROUP_AXIS] !== undefined && PDB.GROUP[PDB.GROUP_AXIS].children.length > 0) {
      PDB.GROUP[PDB.GROUP_AXIS].visible = showFlag;
    }
  },

  editingReplace: function(chainReplae, residueId, pos, allResidue) {
    PDB.GROUP_ONE_RES = PDB.GROUP_COUNT + 1;
    if (!PDB.GROUP[PDB.GROUP_ONE_RES]) {
      PDB.GROUP[PDB.GROUP_ONE_RES] = new THREE.Group();
    } else {
      for (var i in PDB.GROUP[PDB.GROUP_ONE_RES].children) {
        PDB.GROUP[PDB.GROUP_ONE_RES].remove(PDB.GROUP[PDB.GROUP_ONE_RES].children[i]);
      }
      PDB.GROUP[PDB.GROUP_ONE_RES].position.copy(new THREE.Vector3(0, 0, 0));
    }

    var representation = PDB.SPHERE;

    representation = Number(representation);
    if (isNaN(representation)) {
      representation = PDB.SPHERE;
    }

    var groupa = "chain_" + chainReplae;
    var groupb;
    if (PDB.GROUP[groupa + "_low"]) {
      groupb = groupa + "_low";
    }

    var resName = allResidue;
    if (w3m.mol[resName]) {

      PDB.painter.showOneRes(representation, resName);
      var resid = residueId;
      var xyz = pos;
      var t = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
      PDB.GROUP[PDB.GROUP_ONE_RES].position.copy(t);
      var caidpo = new THREE.Vector3(0, 0, 0);
      var reReplaceAtom = {};
      if (PDB.GROUP[groupa]) {
        var m = 0;
        for (var i in PDB.GROUP[groupa].children) {
          if (PDB.GROUP[groupa].children[i].userData && PDB.GROUP[groupa].children[i].userData.presentAtom) {
            var _resid_ = PDB.GROUP[groupa].children[i].userData.presentAtom.resid;
            if (_resid_ == resid) {
              m++;
              caidpo.copy(PDB.GROUP[groupa].children[i].userData.presentAtom.pos_centered);
              if (m == 1) {
                $.extend(reReplaceAtom, PDB.GROUP[groupa].children[i].userData.presentAtom, true);
              }
              PDB.GROUP[groupa].remove(PDB.GROUP[groupa].children[i]);
              //break;
              if (m > 7) {
                break;
              }
            }
          }

        }
      }
      var t_group = new THREE.Group();
      t_group.copy(PDB.GROUP[PDB.GROUP_ONE_RES]);
      var _0po = new THREE.Vector3(0, 0, 0);
      for (var i in t_group.children) {
        if (t_group.children[i].userData.presentAtom.name == 'ca') {
          if (t_group.children[i].type = 'Line') {
            var p = t_group.children[i].userData.presentAtom.pos_centered;
            _0po.copy(new THREE.Vector3(p.x, p.y, p.z));
          } else {
            _0po.copy(t_group.children[i].position);
          }
        }
      }

      for (var i in t_group.children) {
        var obj = t_group.children[i];
        obj.position.x = obj.position.x - _0po.x;
        obj.position.y = obj.position.y - _0po.y;
        obj.position.z = obj.position.z - _0po.z;
      }
      t_group.userData = {
        group: groupa,
        presentAtom: reReplaceAtom
      };
      PDB.GROUP[groupa].add(t_group);
      t_group.position.copy(caidpo);
      if (groupb && PDB.GROUP[groupb]) {
        var m = 0;
        for (var i in PDB.GROUP[groupb].children) {
          if (PDB.GROUP[groupb].children[i].userData && PDB.GROUP[groupb].children[i].userData.presentAtom) {
            var _resid_ = PDB.GROUP[groupb].children[i].userData.presentAtom.resid;
            if (_resid_ == resid) {
              m++;
              PDB.GROUP[groupb].remove(PDB.GROUP[groupb].children[i]);
              //break;
              if (m > 7) {
                break;
              }
            }
          }

        }
        var t_group_b = new THREE.Group();
        t_group_b.copy(t_group);
        t_group_b.userData = {
          group: groupa,
          presentAtom: reReplaceAtom
        };
        PDB.GROUP[groupb].add(t_group_b);
      }
      PDB.GROUP[PDB.GROUP_ONE_RES].children = [];
    } else {
      PDB.loader.loadResidue(resName, function() {
        PDB.painter.showOneRes(representation, resName);
        var resid = residueId;
        var xyz = pos;
        var t = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
        PDB.GROUP[PDB.GROUP_ONE_RES].position.copy(t);
        var caidpo = new THREE.Vector3(0, 0, 0);
        var reReplaceAtom = {};
        if (PDB.GROUP[groupa]) {
          var m = 0;
          for (var i in PDB.GROUP[groupa].children) {
            if (PDB.GROUP[groupa].children[i].userData && PDB.GROUP[groupa].children[i].userData.presentAtom) {
              var _resid_ = PDB.GROUP[groupa].children[i].userData.presentAtom.resid;
              if (_resid_ == resid) {
                m++;
                caidpo.copy(PDB.GROUP[groupa].children[i].userData.presentAtom.pos_centered);
                if (m == 1) {
                  $.extend(reReplaceAtom, PDB.GROUP[groupa].children[i].userData.presentAtom, true);
                }

                PDB.GROUP[groupa].remove(PDB.GROUP[groupa].children[i]);
                if (m > 7) {
                  break;
                }
              }
            }

          }
        }

        reReplaceAtom.resname = resName;
        var t_group = new THREE.Group();
        t_group.copy(PDB.GROUP[PDB.GROUP_ONE_RES]);
        var _0po = new THREE.Vector3(0, 0, 0);
        for (var i in t_group.children) {
          if (t_group.children[i].userData.presentAtom.name == 'ca') {

            if (t_group.children[i].type = 'Line') {
              var p = t_group.children[i].userData.presentAtom.pos_centered;
              _0po.copy(new THREE.Vector3(p.x, p.y, p.z));
            } else {
              _0po.copy(t_group.children[i].position);
            }
          }
        }

        for (var i in t_group.children) {
          var obj = t_group.children[i];
          obj.position.x = obj.position.x - _0po.x;
          obj.position.y = obj.position.y - _0po.y;
          obj.position.z = obj.position.z - _0po.z;
        }

        t_group.userData = {
          group: groupa,
          presentAtom: reReplaceAtom
        };
        PDB.GROUP[groupa].add(t_group);
        t_group.position.copy(caidpo);
        if (groupb && PDB.GROUP[groupb]) {
          var m = 0;
          for (var i in PDB.GROUP[groupb].children) {
            if (PDB.GROUP[groupb].children[i].userData && PDB.GROUP[groupb].children[i].userData.presentAtom) {
              var _resid_ = PDB.GROUP[groupb].children[i].userData.presentAtom.resid;
              if (_resid_ == resid) {
                m++;
                PDB.GROUP[groupb].remove(PDB.GROUP[groupb].children[i]);
                //break;
                if (m > 7) {
                  break;
                }
              }
            }

          }
          var t_group_b = new THREE.Group();
          t_group_b.copy(t_group);
          t_group_b.userData = {
            group: groupa,
            presentAtom: reReplaceAtom
          };
          PDB.GROUP[groupb].add(t_group_b);
        }
        PDB.GROUP[PDB.GROUP_ONE_RES].children = [];
      });
    }
  },

  getResidueId: function(selectAtom) {
    var selectResidueId = 0;
    var chain = "a";
    var atoms = w3m.mol[PDB.pdbId].atom.main;
    for (var atomId in atoms) {
      var atom = atoms[atomId];
      var atomName = atom[2];
      var residueName = atom[3];
      var chainName = atom[4];
      var residueID = atom[5];
      if (chain == chainName && atomName == 'ca' && selectAtom.id == atom[1]) {
        selectResidueId = residueID;
      }
    }
    return selectResidueId;
  },

  updateAllEditResInfo: function(reReplaceAtom, _0po, resName, resid, chain_name) {
    if (!PDB.allMainToms) {
      PDB.allMainToms = {};
      var resN = "-";
      var tempChainID = "-";
      var atomNum = {};
      for (var i in w3m.mol[PDB.pdbId].atom['main']) {
        var atom = w3m.mol[PDB.pdbId].atom['main'][i];
        if (!PDB.allMainToms[atom[4]]) {
          PDB.allMainToms[atom[4]] = {};
        }
        if (!PDB.allMainToms[atom[4]][atom[5]]) {
          PDB.allMainToms[atom[4]][atom[5]] = {
            startAtomID: Number(i)
          };
        } else {
          tempChainID = atom[4];
        }
        if (resN != atom[5] && resN != "-") {
          PDB.allMainToms[tempChainID][resN].endAtomID = Number(i) - 1;
          atomNum[atom[4]] = 1;
        } else {
          atomNum[atom[4]]++;
        }
        resN = atom[5];
      }
      for (var i in PDB.allMainToms) {
        var keys = Object.keys(PDB.allMainToms[i]);
        PDB.allMainToms[i][keys[keys.length - 1]].endAtomID = PDB.allMainToms[i][keys[keys.length - 1]].startAtomID + atomNum[i] - 1;
      }

    }
    var editStartState = '-';
    var nowresID = "-";
    for (var i in w3m.mol[PDB.pdbId].atom['main']) {
      var atom = w3m.mol[PDB.pdbId].atom['main'][i];
      if (chain_name == atom[4]) {
        if (atom[5] == resid) {
          if (editStartState == "-") {
            editStartState = w3m.structure.enum[resName].length - w3m.structure.enum[atom[3]].length;
            //editStartState = true;
            PDB.allMainToms[atom[4]][atom[5]]['state'] = 'editRes';
            PDB.allMainToms[atom[4]][atom[5]]['atoms'] = [];
            var offset = PDB.GeoCenterOffset;

            var xc = {
              x: reReplaceAtom.pos.x - _0po.x,
              y: reReplaceAtom.pos.y - _0po.y,
              z: reReplaceAtom.pos.z - _0po.z
            };

            var a = PDB.allMainToms[atom[4]][atom[5]].startAtomID;
            for (var jj in w3m.mol[resName].atom['main']) {
              var editato = w3m.mol[resName].atom['main'][jj];
              var tempAtom = {};
              $.extend(tempAtom, editato, true);
              tempAtom[6][0] = tempAtom[6][0] + xc.x;
              tempAtom[6][1] = tempAtom[6][1] + xc.y;
              tempAtom[6][2] = tempAtom[6][2] + xc.z;
              tempAtom[4] = chain_name;
              tempAtom[1] = a;
              PDB.allMainToms[atom[4]][atom[5]]['atoms'].push(tempAtom);
              a++;
            }
            PDB.allMainToms[atom[4]][atom[5]].endAtomID = a - 1;
          } else {

            continue;
          }
          nowresID = atom[5];
        } else {
          if (editStartState != "-") {
            if (nowresID && nowresID != atom[5] && nowresID != "-") {
              if (!PDB.allMainToms[atom[4]][atom[5]]['state']) {
                PDB.allMainToms[atom[4]][atom[5]]['state'] = 'justID';
              }
              PDB.allMainToms[atom[4]][atom[5]].endAtomID = PDB.allMainToms[atom[4]][atom[5]].endAtomID + Number(editStartState);
              PDB.allMainToms[atom[4]][atom[5]].startAtomID = PDB.allMainToms[atom[4]][atom[5]].startAtomID + Number(editStartState);
            } else {
              continue;
            }
          }
        }
        nowresID = atom[5];
      } else {
        if (editStartState != "-") {
          if (nowresID && nowresID != atom[5] && nowresID != "-") {
            if (!PDB.allMainToms[atom[4]][atom[5]]['state']) {
              PDB.allMainToms[atom[4]][atom[5]]['state'] = 'justID';
            }
            PDB.allMainToms[atom[4]][atom[5]].endAtomID = PDB.allMainToms[atom[4]][atom[5]].endAtomID + Number(editStartState);
            PDB.allMainToms[atom[4]][atom[5]].startAtomID = PDB.allMainToms[atom[4]][atom[5]].startAtomID + Number(editStartState);
          }
        }
        nowresID = atom[5];
      }
    }
  },

  clearTempAtomId: function() {
    for (var chain_id in PDB.allMainToms) {
      for (var residue_id in PDB.allMainToms[chain_id]) {
        PDB.allMainToms[chain_id][residue_id].tempID = undefined;
      }
    }

  },

  replacePos: function(strObj, pos, replacetext) {
    var str = strObj.substr(0, pos - 1) + replacetext + strObj.substring(pos, strObj.length - 1);
    return str;
  },

  replacePosByStartEnd: function(strObj, start, end, replacetext) {
    var len = end - strObj.length;
    if (strObj.length < end) {
      for (var i = 0; i < len; i++) {
        strObj = strObj + " ";
      }
    }
    var str = strObj.substr(0, start) + replacetext + strObj.substring(end, strObj.length - 1);
    return str;
  },

  fillSpace: function(str, length, dir) {
    dir = dir ? dir : "qian"
    str = str + "";
    if (str.length > length) {
      return "";
    } else {
      var t_len = str.length;
      for (var i = 0; i < length - t_len; i++) {
        if (dir == 'hou') {
          str = str + " ";
        } else {
          str = " " + str;
        }
      }
      return str;
    }
  },

  initFragmentInfo:function(){
	  PDB.fragmentList = {};
	  var ii = 0;
	  if(fragment){
		  for(var i in fragment){
			  var frag = fragment[i];
			  if(frag.length<2){
				  continue;
			  }
			  if(frag.length==2){
				  continue;
			  }
			  var start,end,reptype;
			  if(frag.length==4&&frag[1]!=frag[2]){
				  if(frag[2]<frag[1]){
					  var te = frag[2];
					  frag[2] = frag[1];
					  frag[1] = te;
				  }
				  start   = w3m.mol[PDB.pdbId].residueData[frag[0]][frag[1]];
				  end     = w3m.mol[PDB.pdbId].residueData[frag[0]][frag[2]];
				  reptype = frag[3];
			  }else if(frag.length==3){

				  start   = w3m.mol[PDB.pdbId].residueData[frag[0]][frag[1]];
				  end     = w3m.mol[PDB.pdbId].residueData[frag[0]][frag[1]];
				  reptype = frag[2];

			  }

			  var obj = {
				  start: start,
				  end: end,
				  issel: true,
				  reptype: reptype
				};
				PDB.fragmentList[ii] = obj;
				ii++;
		  }
		  //console.log(PDB.fragmentList[ii]);
	  }

  },
  
  showDrugMenuForVr: function(url){
	  PDB.tool.ajax.get(url, function(text) {
        var jsonObj = JSON.parse(text);
        if (jsonObj.code === 1 && jsonObj.data !== undefined) {
		  var group = PDB.GROUP_VR_MENU_DRUG;
		  var parentGroup = PDB.GROUP[group];
		  var color = 0x1f43;
		  var titleColor = 0x37bd3f;
		  var limit = w3m.global.limit;
          var x = limit.x[1] + PDB.GeoCenterOffset.x;
          var y = 1.5;
          var z = limit.z[1] + PDB.GeoCenterOffset.z;
          x = x * 0.02-2;
		  z = z * 0.022 - 2.5;
          var pos = new THREE.Vector3(x,y,z);
          parentGroup.position.copy(pos);
		  var posStart = pos.clone();
		  var switchPos_on = posStart.clone();
		  var switchPos_off = posStart.clone();
		  switchPos_on.y = switchPos_on.y + 0.3;
		  switchPos_off.y = switchPos_off.y + 0.3;
		  switchPos_off.x = switchPos_off.x + 2.4;
		  PDB.drawer.drawTextKB(PDB.GROUP_VR_MENU_SWITCH, switchPos_on, "Drug Panel On", "menuOn", 0xfe3f12, 135);
		  PDB.drawer.drawTextKB(PDB.GROUP_VR_MENU_SWITCH, switchPos_off, "Drug Panel Off", "menuOff", 0xfe3f12, 135);
		  PDB.GROUP[PDB.GROUP_VR_MENU_SWITCH].position.copy(posStart);

          var reptype = "drugListMenu";
		  PDB.drawer.drawTextKB(group, posStart, "Drug List", "", 0x37bd3f, 135);

          var bindingdb = jsonObj.data[0].bindingdb;
		  if (bindingdb !== undefined && bindingdb !== "" && bindingdb !== "null") {
			  var posStart = new THREE.Vector3(posStart.x, posStart.y - 0.2, posStart.z);
			  PDB.drawer.drawTextKB(group, posStart, "bindingdb", "", titleColor, 135);
			  posStart = PDB.tool.addDrugMenuForVr(group,posStart, PDB.DRUG_MODE_CONFIG.BINDING_DB, bindingdb,color,reptype+","+PDB.DRUG_MODE_CONFIG.BINDING_DB);
		  }


          var chembl = jsonObj.data[0].chembl;
		  if (chembl !== undefined && chembl !== "" && chembl !== "null") {
			var posStart = new THREE.Vector3(posStart.x, posStart.y -  0.2, posStart.z);
			PDB.drawer.drawTextKB(group, posStart, "chembl", "", titleColor, 135);
            posStart = PDB.tool.addDrugMenuForVr(group, posStart,PDB.DRUG_MODE_CONFIG.CHEMBL, chembl,color,reptype+","+PDB.DRUG_MODE_CONFIG.CHEMBL);
		  }


          var swisslipids = jsonObj.data[0].swisslipids;
		  if (swisslipids !== undefined && swisslipids !== "" && swisslipids !== "null") {
			var posStart = new THREE.Vector3(posStart.x, posStart.y -  0.2, posStart.z);
			PDB.drawer.drawTextKB(group, posStart, "swisslip", "", titleColor, 135);
            posStart = PDB.tool.addDrugMenuForVr(group,posStart, PDB.DRUG_MODE_CONFIG.SWISSLIPIDS, swisslipids,color,reptype+","+PDB.DRUG_MODE_CONFIG.SWISSLIPIDS);
		  }

          var guidetopharmacology = jsonObj.data[0].guidetopharmacology;
		  if (guidetopharmacology !== undefined && guidetopharmacology !== "" && guidetopharmacology !== "null") {
			var posStart = new THREE.Vector3(posStart.x, posStart.y -  0.2, posStart.z);
			PDB.drawer.drawTextKB(group, posStart, "guidetopharmacology", "", titleColor, 135);
            posStart = PDB.tool.addDrugMenuForVr(group,posStart,PDB.DRUG_MODE_CONFIG.GUIDETOPHARMACOLOGY, guidetopharmacology,color,reptype+","+PDB.DRUG_MODE_CONFIG.GUIDETOPHARMACOLOGY);
		  }

          var drugbank = jsonObj.data[0].drugbank;
		  if (drugbank !== undefined && drugbank !== "" && drugbank !== "null") {
			var posStart = new THREE.Vector3(posStart.x, posStart.y -  0.2, posStart.z);
			PDB.drawer.drawTextKB(group, posStart, "drugbank", "", titleColor, 135);
            posStart = PDB.tool.addDrugMenuForVr(group,posStart, PDB.DRUG_MODE_CONFIG.DRUG_BANK, drugbank,color,reptype+","+PDB.DRUG_MODE_CONFIG.DRUG_BANK);
		  }
        } else {
          PDB.tool.printProgress(jsonObj.message);
        }

      });
  },
  
  addDrugMenuForVr: function(parentGroup,posStart,dbname, dbjson,color,reptype){
	  if (dbjson !== undefined && dbjson !== "" && dbjson !== "null") {
		  var drugids = dbjson.split(';');
		  for (var i in drugids) {
			if (drugids[i] === "") {
			  continue;
			}
			var posStart = new THREE.Vector3(posStart.x, posStart.y - 0.2, posStart.z);
			var pos = new THREE.Vector3(posStart.x + 2.5, posStart.y, posStart.z);
			PDB.drawer.drawTextKB(parentGroup, posStart, drugids[i], reptype, color, 135);
			if(dbname === PDB.DRUG_MODE_CONFIG.DRUG_BANK){
				PDB.drawer.drawTextKB(parentGroup, pos, "Docking", "Docking,"+drugids[i], color, 135);
			}
		  }
	  }
	  return posStart;
  },
  
  
  showDockingMenuForVr: function(drugId){
	  PDB.DRUGMOVE = true;
      PDB.drugMoveTime = new Date();
      var x_c = w3m.global.limit.x[0] + (w3m.global.limit.x[1] - w3m.global.limit.x[0]) / 2;
      var y_c = w3m.global.limit.y[0] + (w3m.global.limit.y[1] - w3m.global.limit.y[0]) / 2;
      var z_c = w3m.global.limit.z[0] + (w3m.global.limit.z[1] - w3m.global.limit.z[0]) / 2;
      var x_s = w3m.global.limit.x[1] - w3m.global.limit.x[0];
      var y_s = w3m.global.limit.y[1] - w3m.global.limit.y[0];
      var z_s = w3m.global.limit.z[1] - w3m.global.limit.z[0];
      PDB.DRUG_MODE_CONFIG.x_c = x_c;
      PDB.DRUG_MODE_CONFIG.y_c = y_c;
      PDB.DRUG_MODE_CONFIG.z_c = z_c;
      PDB.DRUG_MODE_CONFIG.x_s = x_s;
      PDB.DRUG_MODE_CONFIG.y_s = y_s;
      PDB.DRUG_MODE_CONFIG.z_s = z_s;
      var url = PDB.DOCKING_URL + "?pdbid=" + PDB.pdbId.toUpperCase() + "&smolid=" + drugId +
        "&x_c=" + PDB.DRUG_MODE_CONFIG.x_c +
        "&y_c=" + PDB.DRUG_MODE_CONFIG.y_c +
        "&z_c=" + PDB.DRUG_MODE_CONFIG.z_c +
        "&x_s=" + PDB.DRUG_MODE_CONFIG.x_s +
        "&y_s=" + PDB.DRUG_MODE_CONFIG.y_s +
        "&z_s=" + PDB.DRUG_MODE_CONFIG.z_s;
      if (ServerType !== 2) {
        url = SERVERURL + "/data/autodock.json";
      }
	  PDB.tool.ajax.get(url, function(text) {
        var jsonObj = JSON.parse(text);
        if (jsonObj.model_list != undefined && jsonObj.model_list.length > 0) {
          //stop move drug
          PDB.DRUGMOVE = false;
		  var parentGroup = PDB.GROUP[PDB.GROUP_VR_MENU_DOCKING];
		  var color = 0x1f43;
		  var limit = w3m.global.limit;
          var x = limit.x[1] + PDB.GeoCenterOffset.x;
         var y = 1.5;
          var z = limit.z[1] + PDB.GeoCenterOffset.z;
          x = x * 0.02;
		  z = z * 0.022 - 2.5;
          var pos = new THREE.Vector3(x,y,z);
          parentGroup.position.copy(pos);
		  var posStart = pos.clone();

          var reptype = "";
		  PDB.drawer.drawTextKB(PDB.GROUP_VR_MENU_DOCKING, posStart, "Model List", reptype, color, 135);

          for (var i in jsonObj.model_list) {
            if (jsonObj.model_list[i] === "") {
              continue;
            }
		    posStart = new THREE.Vector3(posStart.x, posStart.y - 0.2, posStart.z);
			reptype = "dockingMenu,"+jsonObj.model_list[i]+","+jsonObj.outdir;
			PDB.drawer.drawTextKB(PDB.GROUP_VR_MENU_DOCKING, posStart, jsonObj.model_list[i]+"   "+jsonObj.scores[i], reptype, color, 135);
			var pos = new THREE.Vector3(posStart.x + 3.8, posStart.y, posStart.z);
			reptype = "DockingResultLink,"+jsonObj.outdir + "/" + jsonObj.model_list[i];
			PDB.drawer.drawTextKB(PDB.GROUP_VR_MENU_DOCKING, pos, "Link", reptype, color, 135);
          }
        }
      });
  },showSegmentholder: function(show,titleMessage){
	  var segmentholder = document.getElementById("segmentholder");
	  if(show){
		segmentholder.style.display = "table";
		if(titleMessage){
			segmentholder.innerHTML = "<div class=\"holderClass\">"+titleMessage+"</div>";
		  }else{
			segmentholder.innerHTML = "<div class=\"holderClass\">Just a moment, please.</div>";
		  }
	  }else{
		segmentholder.style.display = "none";
	  }
	  
  },hideGroup: function (group) {
        if(PDB.GROUP[group] !== undefined && PDB.GROUP[group].length > 0){
            PDB.GROUP[group].visible = false;
        }
  },showGroup: function (group) {
        if(PDB.GROUP[group] !== undefined && PDB.GROUP[group].length > 0){
            PDB.GROUP[group].visible = true;
        }
    },
	showInfoPanel: function (isShow,msg) {
		var labelContent = document.getElementById("labelContent");
		if(isShow){
			labelContent.innerHTML = msg;
		}else{
			labelContent.innerHTML = "";
		}
	},
	showInfoMeaPanel: function (isShow,msg) {
		var labelContent_measure = document.getElementById("labelContent_measure");
		if(isShow){
			labelContent_measure.innerHTML = msg;
		}else{
			labelContent_measure.innerHTML = "";
		}
	},
	hideInfoMeaPanel: function (ishide) {
		if(ishide == true){
			labelContent_measure.style.display="none";
		}else if(ishide == false){
			labelContent_measure.style.display="block";
		}
	}
}
