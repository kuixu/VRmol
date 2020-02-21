/**
 * Created by Kui Xu on 2017/5/25.
 * mail: xukui.cs@gmail.com
 */
PDB.loader = {
  load: function(name, callBack) {
    var scope = this;
    w3m.ajax.get(name, function(text) {
      w3m.tool.clear();
      w3m.config.rep_mode_main = PDB.config.mainMode;
      w3m.config.rep_mode_het = PDB.config.hetMode;
      w3m.pdb(text);
      PDB.pdbId = w3m.global.mol;
      scope.dealwithBigPDB();
      scope.getCenterOffset();
      w3m.api.switchRepModeMain(w3m.LINE);
      w3m.api.switchRepModeMain(w3m.BACKBONE);
      w3m.api.switchRepModeMain(w3m.CUBE);
      w3m.api.switchRepModeMain(w3m.CARTOON);
      w3m.api.switchRepModeHet(w3m.LINE);

      PDB.GROUP_STRUCTURE_INDEX = [];
      PDB.GROUP_MAIN_INDEX = [];
      PDB.GROUP_HET_INDEX = [];

      for (var chain in w3m.mol[PDB.pdbId].chain) {
        var gindex = "chain_" + chain;
        var first_atomid = PDB.tool.getFirstAtomIdByChain(chain);
        PDB.GROUP[gindex] = new THREE.Group();
        PDB.GROUP[gindex].name = chain;
        PDB.GROUP[gindex].userData["group"] = gindex;
        if (PDB.structureSizeLevel > 1) {
          PDB.GROUP[gindex].userData["type"] = 'normal';
        }

        PDB.GROUP[gindex].userData["presentAtom"] = PDB.tool.getMainAtom(PDB.pdbId, first_atomid);
        if (!PDB.pptShow) {
          scene.add(PDB.GROUP[gindex]);
        }
        PDB.GROUP_MAIN_INDEX.push(gindex);
        PDB.GROUP_STRUCTURE_INDEX.push(gindex);

        if (PDB.structureSizeLevel > 1) {
          var gindex_low = "chain_" + chain + "_low";
          //var first_atomid = PDB.tool.getFirstAtomIdByChain(chain);
          PDB.GROUP[gindex_low] = new THREE.Group();
          PDB.GROUP[gindex_low].name = chain;
          PDB.GROUP[gindex_low].userData["group"] = gindex_low;
          PDB.GROUP[gindex_low].userData["type"] = 'low';
          PDB.GROUP[gindex_low].userData["presentAtom"] = PDB.tool.getMainAtom(PDB.pdbId, first_atomid);
          if (!PDB.pptShow) {
            scene.add(PDB.GROUP[gindex_low]);
          }
          PDB.GROUP_MAIN_INDEX.push(gindex_low);
          PDB.GROUP_STRUCTURE_INDEX.push(gindex_low);
        }
      }

      //Structure
      PDB.GROUP_MAIN_INDEX.push(PDB.GROUP_MAIN);
      PDB.GROUP_HET_INDEX.push(PDB.GROUP_HET);
      PDB.GROUP_HET_INDEX.push(PDB.GROUP_WATER);
      PDB.GROUP_HET_INDEX.push(PDB.GROUP_AXIS);
      PDB.GROUP_SURFACE_INDEX.push(PDB.GROUP_SURFACE);
      PDB.GROUP_MUTATION_INDEX.push(PDB.GROUP_MUTATION);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MAIN);
      // PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_AXIS);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_BOX_HELPER);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_DOCKING);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_WATER);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_HET);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_INFO);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_SURFACE);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MUTATION);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_DRUG);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_SLICE);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_BOND);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MAP);
      callBack();
    });
  },
  loadFromDisk: function(file, callBack) {
    var scope = this;
    w3m.tool.clear();
    w3m.config.rep_mode_main = PDB.config.mainMode;
    w3m.config.rep_mode_het = PDB.config.hetMode;
    PDB.pdbId = file.name.split(".")[0];
    w3m.file.get(file, function(response) {
      text = response;
      w3m.pdb(text);
      PDB.pdbId = w3m.global.mol;
      scope.dealwithBigPDB();
      scope.getCenterOffset();
      w3m.api.switchRepModeMain(w3m.LINE);
      w3m.api.switchRepModeMain(w3m.BACKBONE);
      w3m.api.switchRepModeMain(w3m.CUBE);
      w3m.api.switchRepModeMain(w3m.CARTOON);
      w3m.api.switchRepModeHet(w3m.LINE);

      PDB.GROUP_STRUCTURE_INDEX = [];
      PDB.GROUP_MAIN_INDEX = [];
      PDB.GROUP_HET_INDEX = [];

      for (var chain in w3m.mol[PDB.pdbId].chain) {
        var gindex = "chain_" + chain;
        var first_atomid = PDB.tool.getFirstAtomIdByChain(chain);
        PDB.GROUP[gindex] = new THREE.Group();
        PDB.GROUP[gindex].name = chain;
        PDB.GROUP[gindex].userData["group"] = gindex;
        if (PDB.structureSizeLevel > 1) {
          PDB.GROUP[gindex].userData["type"] = 'normal';
        }
        PDB.GROUP[gindex].userData["presentAtom"] = PDB.tool.getMainAtom(PDB.pdbId, first_atomid);
        if (!PDB.pptShow) {
          scene.add(PDB.GROUP[gindex]);
        }
        PDB.GROUP_MAIN_INDEX.push(gindex);
        PDB.GROUP_STRUCTURE_INDEX.push(gindex);

        if (PDB.structureSizeLevel > 1) {
          //low
          var gindex_low = "chain_" + chain + "_low";
          //var first_atomid = PDB.tool.getFirstAtomIdByChain(chain);
          PDB.GROUP[gindex_low] = new THREE.Group();
          PDB.GROUP[gindex_low].name = chain;
          PDB.GROUP[gindex_low].userData["group"] = gindex_low;
          PDB.GROUP[gindex_low].userData["type"] = 'low';
          PDB.GROUP[gindex_low].userData["presentAtom"] = PDB.tool.getMainAtom(PDB.pdbId, first_atomid);
          if (!PDB.pptShow) {
            scene.add(PDB.GROUP[gindex_low]);
          }
          PDB.GROUP_MAIN_INDEX.push(gindex_low);
          PDB.GROUP_STRUCTURE_INDEX.push(gindex_low);
        }
      }
      PDB.GROUP_MAIN_INDEX.push(PDB.GROUP_MAIN);
      PDB.GROUP_HET_INDEX.push(PDB.GROUP_HET);
      PDB.GROUP_HET_INDEX.push(PDB.GROUP_WATER);
      PDB.GROUP_SURFACE_INDEX.push(PDB.GROUP_SURFACE);
      PDB.GROUP_MUTATION_INDEX.push(PDB.GROUP_MUTATION);
      //Structure
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MAIN);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_WATER);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_AXIS);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_HET);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_INFO);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_SURFACE);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MUTATION);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_DRUG);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_SLICE);
      PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_BOND);
      callBack();
    });
  },
  loadDrug: function(drugname, dbname, callBack) {
    var scope = this;
    w3m.ajax.getDrug(drugname, dbname, function(text) {
      w3m.tool.clear();
	  
      w3m.pdb(text, drugname);
      w3m.mol[drugname].drug = true;
	  scope.getDrugCenterOffset();
      callBack();
    });
  },
  loadResidue: function(resName, callBack) {
    var scope = this;
    w3m.ajax.getResidue(resName, function(text) {
      PDB.residue = resName;
      if (!w3m.mol[resName]) {
        w3m.mol[resName] = {};
      }
      w3m.tool.clear();
      w3m.mol[resName].res = true;
      w3m.pdb(text, resName);
      w3m.api.switchRepModeMain(w3m.LINE, resName);
      w3m.api.switchRepModeMain(w3m.BACKBONE, resName);
      PDB.residue = "";
      callBack();
    });
  },
  loadDocking: function(path, dockingName, callBack) {
    var scope = this;
    w3m.ajax.getDocking(path, dockingName, function(text) {
      w3m.tool.clear();
      w3m.pdb(text, dockingName);
      w3m.mol[dockingName].drug = true;
      callBack();
    });
  },
  clear: function() {
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
    PDB.GeoCenterOffset = "";
    PDB.fragmentList = {};
  },
  getDrugCenterOffset: function(){
	var limit = w3m.global.drugLimit;
	x = -(limit.x[0] + limit.x[1]) / 2;
	y = -(limit.y[0] + limit.y[1]) / 2;
	z = -(limit.z[0] + limit.z[1]) / 2; //copy from w3m.limit
	PDB.DrugCenterOffset = new THREE.Vector3(x, y, z);
	return offset;
  },
  getCenterOffset: function() {
    limit = w3m.global.limit;
    x = -(limit.x[0] + limit.x[1]) / 2;
    y = -(limit.y[0] + limit.y[1]) / 2;
    z = -(limit.z[0] + limit.z[1]) / 2;
    PDB.limit = {};
    $.extend(true, PDB.limit, limit); //copy from w3m.limit
    var offset = new THREE.Vector3(x, y, z);
    PDB.GeoCenterOffset = offset;
    PDB.GROUP[PDB.GROUP_BOX_HELPER].visible = false;
    PDB.painter.showBoxHelper();

    return offset;
  },
  dealwithBigPDB: function() {
    if (w3m.mol[PDB.pdbId]) {
      var mainAtomCount = w3m.mol[PDB.pdbId].atom['main'].length;
      console.log("MainAtomCount:" + mainAtomCount);
      if (mainAtomCount < 2000) {
        PDB.structureSizeLevel = 0;
      } else if (mainAtomCount < 5000) {
        PDB.structureSizeLevel = 1;
      } else if (mainAtomCount < 7000) {
        PDB.structureSizeLevel = 2;
      } else if (mainAtomCount < 20000) {
        PDB.structureSizeLevel = 3;
      } else {
        PDB.structureSizeLevel = 4;
      }
    }
    // switch(PDB.structureSizeLevel){
    // case 0:
    // break;
    // case 1:
    // PDB.CONFIG.sphere_width=20;
    // PDB.CONFIG.sphere_height=16;
    // PDB.CONFIG.stick_radius =15;
    // // PDB.config.mainMode = PDB.LINE;
    // // w3m.config.rep_mode_main = PDB.config.mainMode;
    // break;
    // case 2:
    // PDB.CONFIG.sphere_width=12;
    // PDB.CONFIG.sphere_height=8;
    // PDB.CONFIG.stick_radius =10;
    // // PDB.config.mainMode = PDB.LINE;
    // // w3m.config.rep_mode_main = PDB.config.mainMode;
    // break;
    // case 3:
    // PDB.CONFIG.sphere_width=8;
    // PDB.CONFIG.sphere_height=4;
    // PDB.CONFIG.stick_radius =6;
    // // PDB.config.mainMode = PDB.LINE;
    // // w3m.config.rep_mode_main = PDB.config.mainMode;
    // break;
    // }
  }
}
