/**
 * Created by Kui Xu on 2017/6/27.
 * mail: xukui.cs@gmail.com
 */
PDB.painter = {
  /**
   * calculate initial Position of Group
   */
  calculateGroupPosition: function() {
    var limit = w3m.global.limit;
    var z = limit.z[1] + PDB.GeoCenterOffset.z;
    PDB.GROUP[PDB.GROUP_MAIN].position.z += (z + 3);
    PDB.GROUP[PDB.GROUP_HET].position.z += (z + 3);
  },
  zoomin: function() {
    var scale = PDB.GROUP[PDB.GROUP_MAIN].scale;
    scale.set(scale.x * 2, scale.y * 2, scale.z * 2);
    PDB.GROUP[PDB.GROUP_MAIN].scale.set(scale);
  },
  zoomout: function() {
    var scale = PDB.GROUP[PDB.GROUP_MAIN].scale;
    scale.set(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5);
    PDB.GROUP[PDB.GROUP_MAIN].scale.set(scale);
  },
  //before sphere visualization 2018-08-16
  near0: function() {
    for (var i in PDB.GROUP_STRUCTURE_INDEX) {
      var z = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.z;
      z -= PDB.ZOOM_STEP;
      //if(z>0)z-=PDB.ZOOM_STEP;
      //else z+=PDB.ZOOM_STEP;
      PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.z = z;
    }
    // console.log("near");
    PDB.painter.repeatPainter();
    // PDB.painter.repeatPainter();
  },
  //before sphere visualization 2018-08-16
  far0: function() {
    for (var i in PDB.GROUP_STRUCTURE_INDEX) {
      var z = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.z;
      z += PDB.ZOOM_STEP;
      //if(z>=0){z+=PDB.ZOOM_STEP;}
      //else z-=PDB.ZOOM_STEP;
      PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.z = z;
    }
    // console.log("far");
    PDB.painter.repeatPainter();
  },
  near: function() {
    for (var i in PDB.GROUP_STRUCTURE_INDEX) {
      switch (PDB.MOVE_AXIS) {
        case 1:
          PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.y = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.y - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          break;
        case 2:
          PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.x = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.x - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          break;
        case 3:
          PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.z = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.z - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          break;
      }
    }

    switch (PDB.MOVE_AXIS) {
      case 1:
        for (var chain in PDB.residueGroupObject) {
          for (var resid in PDB.residueGroupObject[chain]) {
            PDB.residueGroupObject[chain][resid].vector.y = PDB.residueGroupObject[chain][resid].vector.y - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          }
        }
        PDB.rotateAxis.y = PDB.rotateAxis.y - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
        break;
      case 2:

        for (var chain in PDB.residueGroupObject) {
          for (var resid in PDB.residueGroupObject[chain]) {
            PDB.residueGroupObject[chain][resid].vector.x = PDB.residueGroupObject[chain][resid].vector.x - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          }
        }
        PDB.rotateAxis.x = PDB.rotateAxis.x - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
        break;
      case 3:

        for (var chain in PDB.residueGroupObject) {
          for (var resid in PDB.residueGroupObject[chain]) {
            PDB.residueGroupObject[chain][resid].vector.z = PDB.residueGroupObject[chain][resid].vector.z - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          }
        }
        PDB.rotateAxis.z = PDB.rotateAxis.z - PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
        // PDB.zTemp = PDB.zTemp - PDB.ZOOM_STEP;
        break;
    }
    PDB.painter.repeatPainter();
  },
  far: function() {
    for (var i in PDB.GROUP_STRUCTURE_INDEX) {
      switch (PDB.MOVE_AXIS) {
        case 1:
          PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.y = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.y + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          break;
        case 2:
          PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.x = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.x + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          break;
        case 3:
          PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.z = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.z + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          break;
      }
    }
    switch (PDB.MOVE_AXIS) {
      case 1:
        for (var chain in PDB.residueGroupObject) {
          for (var resid in PDB.residueGroupObject[chain]) {
            PDB.residueGroupObject[chain][resid].vector.y = PDB.residueGroupObject[chain][resid].vector.y + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          }
        }

        PDB.rotateAxis.y = PDB.rotateAxis.y + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
        break;
      case 2:
        for (var chain in PDB.residueGroupObject) {
          for (var resid in PDB.residueGroupObject[chain]) {
            PDB.residueGroupObject[chain][resid].vector.x = PDB.residueGroupObject[chain][resid].vector.x + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          }
        }

        PDB.rotateAxis.x = PDB.rotateAxis.x + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
        break;
      case 3:
        for (var chain in PDB.residueGroupObject) {
          for (var resid in PDB.residueGroupObject[chain]) {
            PDB.residueGroupObject[chain][resid].vector.z = PDB.residueGroupObject[chain][resid].vector.z + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
          }
        }
        // PDB.zTemp = PDB.zTemp + PDB.ZOOM_STEP;
        PDB.rotateAxis.z = PDB.rotateAxis.z + PDB.ZOOM_STEP * PDB.ZOOM_TIMES;
        break;
    }
    PDB.painter.repeatPainter();
  },
  rotate: function() {
    switch (PDB.ROTATION_AXIS) {
      case 1:
        PDB.tool.rotation_x(PDB.GROUP_STRUCTURE_INDEX, PDB.ROTATION_DIRECTION);
        break;
      case 2:
        PDB.tool.rotation_y(PDB.GROUP_STRUCTURE_INDEX, PDB.ROTATION_DIRECTION);
        break;
      case 3:
        PDB.tool.rotation_z(PDB.GROUP_STRUCTURE_INDEX, PDB.ROTATION_DIRECTION);
        break;
    }
  },
  showInput: function(text) {
    if (text == "<--") {
      if (PDB.pdbVrId.length > 0) PDB.pdbVrId = PDB.pdbVrId.substring(0, PDB.pdbVrId.length - 1);
    } else {
      PDB.pdbVrId = PDB.pdbVrId + text;
    }

    if (PDB.pdbVrId.length >= 5) PDB.pdbVrId = "";
    console.log("showInput:" + PDB.pdbVrId);
    PDB.render.clearGroupIndex(PDB.GROUP_INPUT);
    var color = 0xf345;
    var limit = w3m.global.limit;
    var x = limit.x[1] + PDB.GeoCenterOffset.x;
    var z = limit.z[1] + PDB.GeoCenterOffset.z;
    var p = new THREE.Vector3(x * 0.02, 3.0, z * 0.02);
    PDB.drawer.drawTextKB(PDB.GROUP_INPUT, p, "PDB: " + PDB.pdbVrId, PDB.pdbVrId, color, 135);
    if (PDB.pdbVrId.length == 4) {
      PDB.controller.requestRemote(PDB.pdbVrId);
      PDB.isShowMenu = false;
      PDB.render.hideMenu();

    }
  },
  showKeyboard: function() {
    console.log("showKeyboard");
    var color = 0x1f43;
    var limit = w3m.global.limit;
    var x = limit.x[1] + PDB.GeoCenterOffset.x;
    var z = limit.z[1] + PDB.GeoCenterOffset.z;
    var pos = new THREE.Vector3(x * 0.02, 2.8, z * 0.02);
    var chars = [
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", "", "", "<--", "", ""],
    ];
    for (var i = 0; i < chars.length; i++) {
      for (var j = 0; j < chars[i].length; j++) {
        var p = new THREE.Vector3(pos.x + j * 0.2, pos.y - i * 0.2, pos.z);
        var reptype = "";
        PDB.drawer.drawTextKB(PDB.GROUP_KEYBOARD, p, chars[i][j], reptype, color, 135);
      }
    }
    //PDB.GROUP[PDB.GROUP_KEYBOARD].rotation.y = 180;
    //PDB.GROUP[PDB.GROUP_KEYBOARD].position.set(1,1,1);
    //PDB.GROUP[PDB.GROUP_KEYBOARD].visible=false;
    //PDB.isShowKeyboard=false;
  },
  showMenu: function(type) {
    console.log("showMenu");
    var color = 0xa345;
    var titleColor = 0xa3F5;
    var infoColor = 0xFF66CC;
    limit = w3m.global.limit;
    var x = limit.x[1] + PDB.GeoCenterOffset.x;
    var y = 2;
    var z = limit.z[1] + PDB.GeoCenterOffset.z;
    x = x * 0.02;
    z = z * 0.022;

    var pos = [];
    switch (type) {
      case PDB.MENU_TYPE_FIRST:
        var mainMenu = [
          ["Vis Mode", PDB.MENU_TYPE_VIS],
          ["Main Structure", PDB.MENU_TYPE_MAIN],
          ["Ligand", PDB.MENU_TYPE_LIGAND],
          ["Show Others", PDB.MENU_TYPE_EX_HET],
          ["Surface", PDB.MENU_TYPE_SURFACE],
          ["Label", PDB.MENU_TYPE_LABEL],
          ["Color", PDB.MENU_TYPE_COLOR],
          ["Measure", PDB.MENU_TYPE_MEASURE],
          ["Drag", PDB.MENU_TYPE_DRAG],
          ["Fragment", PDB.MENU_TYPE_FRAGMENT],
          ["Editing", PDB.MENU_TYPE_EDITING],
          ["Mutation", PDB.MENU_TYPE_MUTATION],
          ["Transition", PDB.MENU_TYPE_DIRECTION],
          ["Rotation", PDB.MENU_TYPE_ROTATION],
          // ["Bond", PDB.MENU_TYPE_HBOND],
          // ["Conservation",              PDB.MENU_TYPE_CONSERVATION],
          //["Density Map", PDB.MENU_TYPE_DENSITYMAP],
          ["Drugs & Docking", PDB.MENU_TYPE_DRUG],
          ["Export", PDB.MENU_TYPE_EXPORT],
          ["Speech", PDB.MENU_TYPE_SPEECH],
          //["Spherical View", PDB.MENU_TYPE_OUTBALL]
        ];
        for (var i = 0; i < mainMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU, new THREE.Vector3(x - 2, y - i * 0.22, z), mainMenu[i][0], mainMenu[i][1], titleColor, 135);
        }
        var info = w3m.mol[PDB.pdbId].info;
        var infoMenu = [
          ["PDB : " + info.id],
          ["Cat : " + info.classification],
          ["Exp : " + info.expdata],
          ["Res : " + info.resolution],
          ["Src : " + info.source],
          ["Aur : " + info.author],
          ["Jol : " + info.journal],
          ["Doi : " + info.doi],
        ];
        for (var i = 0; i < infoMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU, new THREE.Vector3(x + 3, y - i * 0.2, z), infoMenu[i][0], "", infoColor, 135);
        }
        break;
      case PDB.MENU_TYPE_MAIN:
        var main = [
          ["Hide", PDB.HIDE, ],
          ["Line", PDB.LINE, ],
          ["Backbone", PDB.BACKBONE],
          ["Sphere", PDB.SPHERE, ],
          ["Stick", PDB.STICK, ],
          ["Ball Rod", PDB.BALL_AND_ROD, ],
          ["Tube", PDB.TUBE, ],
          ["R-Flat", PDB.RIBBON_FLAT, ],
          ["R-Ellipse", PDB.RIBBON_ELLIPSE, ],
          ["R-Rectangle", PDB.RIBBON_RECTANGLE, ],
          ["R-Strip", PDB.RIBBON_STRIP, ],
          ["R-Railway", PDB.RIBBON_RAILWAY, ],
          ["R-SS", PDB.CARTOON_SSE, ],
        ];
        for (var i = 0; i < main.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_MAIN, new THREE.Vector3(x, y - i * 0.2, z), main[i][0], main[i][1], color, 135);
        }


        break;
      case PDB.MENU_TYPE_LIGAND:
        var het = [
          ["Hide", PDB.HIDE, ],
          ["Line", PDB.HET_LINE, ],
          ["Sphere", PDB.HET_SPHERE, ],
          ["Stick", PDB.HET_STICK, ],
          ["Ball Rod", PDB.HET_BALL_ROD, ]
        ];
        for (var i = 0; i < het.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_HET, new THREE.Vector3(x, y - i * 0.2, z), het[i][0], het[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_EX_HET:
        var exWater = [
          ["Show/Hide Water", 1],
          ["Show/Hide Axis", 2]
        ];
        for (var i = 0; i < exWater.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_EX_HET, new THREE.Vector3(x, y - i * 0.2, z), exWater[i][0], exWater[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_LABEL:
        var label = [
          ["By Models", PDB.SELECTION_MODEL],
          ["By Chain", PDB.SELECTION_CHAIN],
          ["By Residue", PDB.SELECTION_RESIDUE],
          ["By Atom", PDB.SELECTION_ATOM]
        ];

        for (var i = 0; i < label.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_LABEL, new THREE.Vector3(x, y - i * 0.2, z), label[i][0], label[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_COLOR:
        var colorMenu = [
          ["By Element", 601],
          ["By Residue", 602],
          ["By Second Stru.", 603],
          ["By Chain", 604],
          ["By Representat.", 605],
          ["By B-Factor", 606],
          ["By Spectrum", 607],
          ["By ChainSpectrum", 608],
          ["By Hydrophobicity", 609],
          ["By Conservation", 'Conservation'],

        ];
        for (var i = 0; i < colorMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_COLOR, new THREE.Vector3(x, y - i * 0.2, z), colorMenu[i][0], colorMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_DRAG:
        var dragMenu = [
          ["Exit this mode", "exit"],
          ["Reset Position", 0],
          ["Drag Ligand", PDB.SELECTION_HET],
          ["Drag Chain", PDB.SELECTION_CHAIN],
          ["Drag Residue", PDB.SELECTION_RESIDUE],
          ["Drag Drug", PDB.SELECTION_DRUG]
        ];
        for (var i = 0; i < dragMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_DRAG, new THREE.Vector3(x, y - i * 0.2, z), dragMenu[i][0], dragMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_MEASURE:
        var measureMenu = [
          ["Distance", PDB.TRIGGER_EVENT_DISTANCE],
          ["Angle", PDB.TRIGGER_EVENT_ANGLE]
        ];
        for (var i = 0; i < measureMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_MEASURE, new THREE.Vector3(x, y - i * 0.2, z), measureMenu[i][0], measureMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_FRAGMENT:
        var fragmentMenu = [
          ["Exit this mode", "exit"],
          ["Line", "Line"],
          ["Backbone", "Backbone"],
          ["Sphere", "Sphere"],
          ["Sticks", "Sticks"],
          ["Ball & Rod", "BallRod"],
          ["Tube", "Tube"],
          ["R-FLAT", "Flat"],
          ["R-ELLIPSE", "Ellipse"],
          ["R-RECTANGLE", "Rectangle"],
          ["R-STRIP", "Strip"],
          ["R-RAILWAY", "Railway"],
          ["R-SS", "SSE"]
        ];
        for (var i = 0; i < fragmentMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_FRAGMENT, new THREE.Vector3(x, y - i * 0.2, z), fragmentMenu[i][0], fragmentMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_EDITING:
        var editMenu = [
          ["Exit this mode", "exit"],
          ["ala", "ala"],
          ["gly", "gly"],
          ["ile", "ile"],
          ["leu", "leu"],
          ["pro", "pro"],
          ["val", "val"],
          ["phe", "phe"],
          ["trp", "trp"],
          ["tyr", "tyr"],
          ["asp", "asp"],
          ["glu", "glu"],
          ["arg", "arg"],
          ["his", "his"],
          ["lys", "lys"],
          ["ser", "ser"],
          ["thr", "thr"],
          ["cys", "cys"],
          ["met", "met"],
          ["asn", "asn"],
          ["gln", "gln"]
        ];
        for (var i = 0; i < editMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_EDITING, new THREE.Vector3(x, y - i * 0.2, z), editMenu[i][0], editMenu[i][1], color, 135);
        }
        break;
        case PDB.MENU_TYPE_VIS:
          var visMenu =[
          ["NonVR",               0 ],
          ["VR",               1 ],
          ["Spherical View",              2]
          ];
          for(var i = 0; i<visMenu.length;i++){
            PDB.drawer.drawTextKB(PDB.GROUP_MENU_VIS, new THREE.Vector3(x, y-i*0.2, z),  visMenu[i][0], visMenu[i][1], color, 135);
          }
        break;
      case PDB.MENU_TYPE_SURFACE:
        var surfaceMenu = [
          ["Hide", 0],
          ["Van der Waals", 1],
          ["Solvent excluded", 2],
          ["Solvent accessible", 3],
          ["Molecular", 4],
          ["Opacity 1.0", 5],
          ["Opacity 0.9", 6],
          ["Opacity 0.8", 7],
          ["Opacity 0.7", 8],
          ["Opacity 0.6", 9],
          ["Opacity 0.5", 10],
          ["Wireframe", 11]
        ];
        for (var i = 0; i < surfaceMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_SURFACE, new THREE.Vector3(x, y - i * 0.2, z), surfaceMenu[i][0], surfaceMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_MUTATION:
        var mutationMenu = [
          ["Hide", 1],
          ["TCGA", 2],
          ["CCLE", 3],
          ["ExAC", 4]
        ];
        for (var i = 0; i < mutationMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_MUTATION, new THREE.Vector3(x, y - i * 0.2, z), mutationMenu[i][0], mutationMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_ROTATION:
        var rotationMenu = [
          ["Rotate by x axis", 1],
          ["Rotate by y axis", 2],
          ["Rotate by z axis", 3]
        ];
        for (var i = 0; i < rotationMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_ROTATION, new THREE.Vector3(x, y - i * 0.2, z), rotationMenu[i][0], rotationMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_DRUG:
        var drugMenu = [
          ["Hide Drug", 1],
          ["Load Drug", 2],
          ["Drug Surface", 5],
          // ["Drug Random Migration", 3],
          ["Docking Region Box", 4],
        ];
        for (var i = 0; i < drugMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_DRUG, new THREE.Vector3(x, y - i * 0.2, z), drugMenu[i][0], drugMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_DENSITYMAP:
        var dmMenu = [
          ["Hide", 4],
          ["Solid", 1],
          ["Surface", 2],
          ["Mesh", 3],
        ];
        for (var i = 0; i < dmMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_DENSITYMAP, new THREE.Vector3(x, y - i * 0.2, z), dmMenu[i][0], dmMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_EXPORT:
        var exportMenu = [
          ["Export PDB", 1]
        ];
        for (var i = 0; i < exportMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_EXPORT, new THREE.Vector3(x, y - i * 0.2, z), exportMenu[i][0], exportMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_SPEECH:
        var vocieMenu = [
          ["Start voice", 0],
          ["End voice", 1],
          ["Chiness Voice", 2],
          ["English Voice", 3]
        ];
        for (var i = 0; i < vocieMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_SPEECH, new THREE.Vector3(x, y - i * 0.2, z), vocieMenu[i][0], vocieMenu[i][1], color, 135);
        }
        break;
        // case PDB.MENU_TYPE_CONSERVATION:
        // var conMenu =[
        // ["Load Conservation Score",               1 ]
        // ];
        // for(var i = 0; i<conMenu.length;i++){
        // PDB.drawer.drawTextKB(PDB.GROUP_MENU_CONSERVATION, new THREE.Vector3(x, y-i*0.2, z),  conMenu[i][0], conMenu[i][1], color, 135);
        // }
        // break;
      // case PDB.MENU_TYPE_HBOND:
      //   var bondMenu = [
      //     ["Hide Bond", PDB.BOND_TYPE_NONE],
      //     ["Show HBond", PDB.BOND_TYPE_HBOND],
      //     ["Show SSBond", PDB.BOND_TYPE_SSBOND],
      //     ["Show Covalent", PDB.BOND_TYPE_COVALENT]
      //   ];
      //   for (var i = 0; i < bondMenu.length; i++) {
      //     PDB.drawer.drawTextKB(PDB.GROUP_MENU_HBOND, new THREE.Vector3(x, y - i * 0.2, z), bondMenu[i][0], bondMenu[i][1], color, 135);
      //   }
      //   break;
      case PDB.MENU_TYPE_DIRECTION:
        var moveMenu = [
          ["Move along the X axis", 2],
          ["Move along the Y axis", 1],
          ["Move along the Z axis", 3],
          ["1 times speed", 4],
          ["2 times speed", 5],
          ["4 times speed", 6],
        ];
        for (var i = 0; i < moveMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_DIRECTION, new THREE.Vector3(x, y - i * 0.2, z), moveMenu[i][0], moveMenu[i][1], color, 135);
        }
        break;
      case PDB.MENU_TYPE_OUTBALL:
        var ballMenu = [
          ["SHOW", PDB.MENU_TYPE_OUTSHOW],
          ["HIDE", PDB.MENU_TYPE_OUTHIDE]
        ];
        for (var i = 0; i < ballMenu.length; i++) {
          PDB.drawer.drawTextKB(PDB.GROUP_MENU_OUTBALL, new THREE.Vector3(x, y - i * 0.2, z), ballMenu[i][0], ballMenu[i][1], color, 135);
        }
        break;
    }
  },
  showAtomInfo: function(showAtom) {
    var message = showAtom.chainname.toUpperCase() + "." +
      showAtom.resname.substring(0, 1).toUpperCase() + showAtom.resname.substring(1) + "." + showAtom.resid +
      "." + showAtom.name.substring(0, 1).toUpperCase() + showAtom.name.substring(1);
    var pos = PDB.tool.getAtomInfoPosition(showAtom.pos_curr, camera.position);
    PDB.drawer.drawText(PDB.GROUP_INFO, pos,
      message, "", showAtom.color, 180);
  },
  showMutationInfo: function(showAtom,mutation,pos_curr) {
    var message = mutation.pos + " " + mutation.p_change + " " + mutation.v_class + " " + mutation.v_type;
    var pos = PDB.tool.getAtomInfoPosition(pos_curr, camera.position);
    PDB.drawer.drawText(PDB.GROUP_INFO, pos,
      message, "", showAtom.color, 180);
  },
  showAtomInfoPos: function(showAtom, position) {
    var pos = new THREE.Vector3();
    pos.x = position.x + 0.5;
    pos.y = position.y + 0.5;
    pos.z = position.z - 0.5;
    var message = showAtom.chainname.toUpperCase() + "." +
      showAtom.resname.substring(0, 1).toUpperCase() + showAtom.resname.substring(1) + "." + showAtom.resid +
      "." + showAtom.name.substring(0, 1).toUpperCase() + showAtom.name.substring(1);
    PDB.drawer.drawText(PDB.GROUP_INFO, pos,
      message, "", showAtom.color, 180);
  },
  showMutation: function(mutations) {
    var jsonObj = JSON.parse(mutations);
    if (jsonObj.code === 1 && jsonObj.data !== undefined) {
      PDB.tool.printProgress("");
      var mutations = jsonObj.data.mutations;
      var chains = jsonObj.data.chains;
      //mutations
      chains.forEach(function(chain) {
        var chainName = chain;
        mutations.forEach(function(mutation) {
          var atom = PDB.tool.getCAAtomByResidueId(mutation.pos, chainName);
          if (atom !== undefined) {
            PDB.drawer.drawMutation(PDB.GROUP_MUTATION, atom.pos_centered, atom.color, atom.radius, mutation, undefined, atom);
          }
        });
      });
    } else {
      PDB.tool.printProgress(jsonObj.message);
      // alert(jsonObj.message);
    }
  },
  showConservation: function(conservations) {
    //var scale = chroma.scale(['green', 'red']);
    var jsonObj = JSON.parse(conservations);
    if (jsonObj.code === 1 && jsonObj.data !== undefined) {
      var consResidues = jsonObj.data;
      if (consResidues.length == 0) {
        PDB.tool.printProgress('Conservation information is missing.');
      } else {
        //consResidues
        consResidues.forEach(function(consResidues) {
          var resname = consResidues.resname;
          var resid = consResidues.resid;
          var chain = consResidues.chain.toLowerCase();
          var score = consResidues.score;
          var color = consResidues.color;
          //congole.log(consResidues);
          //var per =(c -threshold)/(1.0*(emmap.header.max-threshold));
          //var color = scale(color*0.1).hex();
          var residue = w3m.mol[PDB.pdbId].residueData[chain][resid];
          for (var i = residue.faid; i <= residue.laid; i++) {
            if (w3m.mol[PDB.pdbId].color.main[i] != undefined) {
              w3m.mol[PDB.pdbId].color.main[i] = 1200 + Number(color);
            }
          }
          // if(w3m.color.conservation == undefined){
          // w3m.color.conservation = {};
          // }
          // w3m.color.conservation[resid] = color;
          // mutations.forEach(function(mutation){
          //     var atom = PDB.tool.getCAAtomByResidueId(mutation.pos,chainName);
          //     if(atom!== undefined){
          //         PDB.drawer.drawMutation(PDB.GROUP_MUTATION, atom.pos_centered, atom.color, atom.radius, mutation);
          //     }
          // });
        });

      }


    } else {
      PDB.tool.printProgress(jsonObj.message);
    }
  },
  // before sphere visualization 2018-08-16
  showResidueInfo0: function(showAtom) {
    // var pos = new THREE.Vector3();
    // pos.x = showAtom.pos_centered.x + 0.5;
    // pos.y = showAtom.pos_centered.y + 0.5;
    // pos.z = showAtom.pos_centered.z - 0.5;
    var message = showAtom.chainname.toUpperCase() + "." +
      showAtom.resname.substring(0, 1).toUpperCase() + showAtom.resname.substring(1) + "." + showAtom.resid;
    var pos1 = PDB.tool.getAtomInfoPosition(showAtom.pos_curr, camera.position);
    PDB.drawer.drawText(PDB.GROUP_INFO, pos1,
      message, "", showAtom.color, 180);
  },
  showResidueInfo: function(showAtom) {
    var message = showAtom.chainname.toUpperCase() + "." +
      showAtom.resname.substring(0, 1).toUpperCase() + showAtom.resname.substring(1) + "." + showAtom.resid;

    var pos1 = PDB.tool.getAtomInfoPosition(showAtom.pos_curr, camera.position);

    PDB.drawer.drawText(PDB.GROUP_INFO, pos1,
      message, "", showAtom.color, 180);
  },
  showResidueInfoPos: function(showAtom, position) {
    // var pos = new THREE.Vector3();
    // pos.x = position.x + 0.5;
    // pos.y = position.y + 0.5;
    // pos.z = position.z - 0.5;
    var message = showAtom.chainname.toUpperCase() + "." +
      showAtom.resname.substring(0, 1).toUpperCase() + showAtom.resname.substring(1) + "." + showAtom.resid;
    var pos1 = PDB.tool.getAtomInfoPosition(position, camera.position);
    PDB.drawer.drawText(PDB.GROUP_INFO, pos1,
      message, "", showAtom.color, 180);
  },
  showChainInfo: function(showAtom) {
    var message = showAtom.chainname.toUpperCase();
    var pos1;
    console.log(showAtom.pos);
    if (showAtom.pos) {
      pos1 = showAtom.pos;
    } else {
      pos1 = PDB.tool.getAtomInfoPosition(showAtom.pos_centered, camera.position);
    }
    PDB.drawer.drawText(PDB.GROUP_INFO, pos1,
      message, "", showAtom.color, 180);
  },
  showLine: function() {
    for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {
      var ids = PDB.linkedAtomIdArray[t];

      var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
      var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);

      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      var groupindex = "chain_" + atom.chainname;
      PDB.drawer.drawLine(groupindex, startAtom.pos_centered, midp, startAtom.color);
      PDB.drawer.drawLine(groupindex, midp, atom.pos_centered, atom.color);
    }
  },
  showLineByStartEnd: function(startId, endId, isSelected) {
    if (isSelected) {
      for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {
        var ids = PDB.linkedAtomIdArray[t];
        if (ids[0] < startId && ids[1] < startId) continue;
        if (ids[0] > endId && ids[1] > endId) break;
        var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
        var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        var groupindex = "chain_" + atom.chainname;
        PDB.drawer.drawLine(groupindex, startAtom.pos_centered, midp, startAtom.color);
        PDB.drawer.drawLine(groupindex, midp, atom.pos_centered, atom.color);
      }
    } else {
      for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {
        var ids = PDB.linkedAtomIdArray[t];
        if (ids[0] < startId && ids[1] < startId) continue;
        if (ids[0] > endId && ids[1] > endId) break;
        var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
        var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        var groupindex = "chain_" + atom.chainname;
        PDB.drawer.drawLine(groupindex, startAtom.pos_centered, midp, new THREE.Color('#CCC'));
        PDB.drawer.drawLine(groupindex, midp, atom.pos_centered, new THREE.Color('#CCC'));
      }
    }

  },
  showLineByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var mater = []
    var color = new THREE.Color('#CCC');
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    atomIdArray = resobj.lines;
    for (var t = 0; t < atomIdArray.length; t++) {
      var startAtom = PDB.tool.getMainAtom(PDB.pdbId, atomIdArray[t][0]);
      var atom = PDB.tool.getMainAtom(PDB.pdbId, atomIdArray[t][1]);
      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');

      // var mat0 = new THREE.LineBasicMaterial({ color: sel?startAtom.color:color});
      // mater.push(mat0);
      // geometry.vertices.push(start,end);
      // geometry.vertices.materindex=mater.length-1;
      // var mat1 = new THREE.LineBasicMaterial({ color: sel?atom.color:color});
      // mater.push(mat1);
      // geometry.vertices.push(start,end);
      // geometry.vertices.materindex=mater.length-1;
      PDB.drawer.drawTempLine(groupindex, resobj.caid, startAtom.pos_centered, midp, sel ? startAtom.color : color);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      PDB.drawer.drawTempLine(groupindex, resobj.caid, midp, atom.pos_centered, sel ? atom.color : color);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      //geometry.vertices.push(start,end);
    }

  },

  showDot: function() {
    for (var i in w3m.mol) {
	  if(w3m.mol[i].drug)	continue;
      var main_obj = w3m.mol[i].atom.main;
      for (var i_atom in main_obj) {

        var atom = PDB.tool.getMainAtom(i, i_atom);
        var groupindex = "chain_" + atom.chainname;
        PDB.drawer.drawDot(groupindex, atom.pos_centered, atom.color);
      }
    }

  },
  showDotByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var color = new THREE.Color('#CCC');
    for (var i in w3m.mol) {
		if(w3m.mol[i].drug)	continue;
      var main_obj = w3m.mol[i].atom.main;
      for (var j = resobj.faid; j <= resobj.laid; j++) {
        var i_atom = main_obj[j];
        if (i_atom == undefined) {
          continue;
        }
        var atom = PDB.tool.getMainAtom(i, i_atom[1]);
        var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
        PDB.drawer.drawDot(groupindex, atom.pos_centered, sel ? atom.color : color);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      }
    }
  },
  showDotByStartEnd: function(startId, endId, isSelected) {
    if (isSelected) {
      for (var i in w3m.mol) {
		  if(w3m.mol[i].drug)	continue;
        var main_obj = w3m.mol[i].atom.main;
        for (var i_atom in main_obj) {
          if (i_atom < startId) continue;
          if (i_atom > endId) break;
          var atom = PDB.tool.getMainAtom(i, i_atom);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawDot(groupindex, atom.pos_centered, atom.color);
        }
      }
    } else {
      for (var i in w3m.mol) {
		  if(w3m.mol[i].drug)	continue;
        var main_obj = w3m.mol[i].atom.main;
        for (var i_atom in main_obj) {
          if (i_atom < startId) continue;
          if (i_atom > endId) break;
          var atom = PDB.tool.getMainAtom(i, i_atom);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawDot(groupindex, atom.pos_centered, new THREE.Color('#CCC'));
        }
      }
    }
  },
  showBackbone: function() {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var radius = 0.3;
    var history = {};

    for (var t = 0; t < PDB.backboneAtomIdArray.length; t++) {
      var ids = PDB.backboneAtomIdArray[t];
      //var ps = data;
      for (var i = 0; i < ids.length; i++) {
        var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[i]);
        var groupindex = "chain_" + atom.chainname;
        // sphere
        PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, radius, atom, addgroup, w);
        // stick
        if (i > 0) {
          var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
          PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
          PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, atom.color, radius, atom);
        } //drawMergeBackboneAtom
        startAtom = atom;
      }
    }
  },
  showBackboneByResdue: function(chainId, resid, sel, showLow, isshow) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var color = new THREE.Color('#CCC');
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var bbond = resobj.bbond;
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined) {
      bbond = [preresobj.bbond[preresobj.bbond.length - 1]].concat(bbond);
    }
    var radius = 0.3;
    var history = {};
    for (var i = 0; i < bbond.length; i++) {
      var atom = PDB.tool.getMainAtom(PDB.pdbId, bbond[i]);
      atom.caid = resobj.caid;
      var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
      // sphere
      PDB.drawer.drawSphere(groupindex, atom.pos_centered, sel ? atom.color : color, radius, atom, addgroup, w);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      // stick
      if (i > 0) {
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, sel ? startAtom.color : color, radius, startAtom);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
        PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, sel ? atom.color : color, radius, atom);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      } //drawMergeBackboneAtom
      startAtom = atom;
    }

  },
  showBackboneByStartEnd: function(startId, endId, isSelected) { //
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var radius = 0.3;
    var history = {};
    var startAtom = "";
    if (isSelected) {
      for (var t = 0; t < PDB.backboneAtomIdArray.length; t++) {
        var ids = PDB.backboneAtomIdArray[t];
        //var ps = data;
        for (var i = 0; i < ids.length; i++) {
          if (ids[i] < startId) continue;
          if (ids[i] > endId) break;
          var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[i]);
          var groupindex = "chain_" + atom.chainname;

          // sphere
          PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, radius, atom, addgroup, w);
          // stick
          if (startAtom !== "") {
            var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
            PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
            PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, atom.color, radius, atom);
          } //drawMergeBackboneAtom
          startAtom = atom;
        }
      }
    } else {
      for (var t = 0; t < PDB.backboneAtomIdArray.length; t++) {
        var ids = PDB.backboneAtomIdArray[t];
        //var ps = data;
        for (var i = 0; i < ids.length; i++) {
          if (ids[i] < startId) continue;
          if (ids[i] > endId) break;
          var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[i]);
          var groupindex = "chain_" + atom.chainname;

          // sphere
          PDB.drawer.drawSphere(groupindex, atom.pos_centered, new THREE.Color('#CCC'), radius, atom, addgroup, w);
          // stick
          if (startAtom !== "") {
            var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
            PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, new THREE.Color('#CCC'), radius, startAtom);
            PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, new THREE.Color('#CCC'), radius, atom);
          } //drawMergeBackboneAtom
          startAtom = atom;
        }
      }
    }

  },
  showBackbone1: function() {
    var radius = 0.3;
    var history = {};
    for (var t = 0; t < PDB.backboneAtomIdArray.length; t++) {
      var ids = PDB.backboneAtomIdArray[t];
      //var ps = data;
      var atom0 = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
      var atom1 = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
      PDB.drawer.drawMergeSphereStick(PDB.GROUP_MAIN, atom0, atom1, radius);
      for (var i = 1; i < ids.length - 1; i++) {
        var atom0 = PDB.tool.getMainAtom(PDB.pdbId, ids[i - 1]);
        var atom1 = PDB.tool.getMainAtom(PDB.pdbId, ids[i]);
        var atom2 = PDB.tool.getMainAtom(PDB.pdbId, ids[i + 1]);
        PDB.drawer.drawMergeStickSphereStick(PDB.GROUP_MAIN, atom0, atom1, atom2, radius)
      }
      var atom0 = PDB.tool.getMainAtom(PDB.pdbId, ids[ids.length - 2]);
      var atom1 = PDB.tool.getMainAtom(PDB.pdbId, ids[ids.length - 1]);
      PDB.drawer.drawMergeStickSphere(PDB.GROUP_MAIN, atom0, atom1, radius);
    }
  },
  showSphere: function() {
    var addgroup;
    var w = PDB.CONFIG.sphere_width;
    for (var i in w3m.mol) {
		if(w3m.mol[i].drug)	continue;
      var main_obj = w3m.mol[i].atom.main;
      for (var i_atom in main_obj) {
        var atom = PDB.tool.getMainAtom(i, i_atom);
        var groupindex = "chain_" + atom.chainname;
        PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, atom.radius, atom, addgroup, w);
      }
    }
  },
  showSphereByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var addgroup;
    var w = PDB.CONFIG.sphere_width;
    var color = new THREE.Color('#CCC');
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];

    for (var i in w3m.mol) {
		if(w3m.mol[i].drug)	continue;
      var main_obj = w3m.mol[i].atom.main;
      for (var j = resobj.faid; j <= resobj.laid; j++) {
        // var i_atom = main_obj[j];
        var atom = PDB.tool.getMainAtom(i, j);
        atom.caid = resobj.caid;
        if (atom == undefined) {
          continue;
        }
        var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
        PDB.drawer.drawSphere(groupindex, atom.pos_centered, sel ? atom.color : color, atom.radius, atom, addgroup, w);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      }
    }
  },
  showSphereByStartEnd: function(startId, endId, isSelected) {
    var addgroup;
    var w = PDB.CONFIG.sphere_width;
    if (isSelected) {
      for (var i in w3m.mol) {
		  if(w3m.mol[i].drug)	continue;
        var main_obj = w3m.mol[i].atom.main;
        for (var i_atom in main_obj) {
          if (i_atom < startId) continue;
          if (i_atom > endId) break;
          var atom = PDB.tool.getMainAtom(i, i_atom);
          var groupindex = "chain_" + atom.chainname;

          PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, atom.radius, atom, addgroup, w);
        }
      }
    } else {
      for (var i in w3m.mol) {
		  if(w3m.mol[i].drug)	continue;
        var main_obj = w3m.mol[i].atom.main;
        for (var i_atom in main_obj) {
          if (i_atom < startId) continue;
          if (i_atom > endId) break;
          var atom = PDB.tool.getMainAtom(i, i_atom);
          var groupindex = "chain_" + atom.chainname;

          PDB.drawer.drawSphere(groupindex, atom.pos_centered, new THREE.Color('#CCC'), atom.radius, atom, addgroup, w);
        }
      }
    }
  },
  showSticks: function() {
    var radius = 0.2;
    var history = {};
    for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {
      var ids = PDB.linkedAtomIdArray[t];
      var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
      var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
      var groupindex = "chain_" + atom.chainname;
      if (history[startAtom.id] == undefined) {
        PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, startAtom.color, radius, startAtom, addgroup, w);
        history[startAtom.id] = 1;
      } else if (history[atom.id] == undefined) {
        PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, radius, atom, addgroup, w);
        history[atom.id] = 1;
      } else {
        //console.log("showSticks: duplicate stick...atom.id:"+ atom.id);
      }
      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      //group, start, end, color, radius, atom, addGroup
      PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
      PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, atom.color, radius, atom);
    }
  },

  showLinksByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var color = new THREE.Color('#CCC');
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var lines = resobj.lines;

    // if(w3m.mol[PDB.pdbId].residueData[chainId][resid-1]!=undefined){
    // var prelines = w3m.mol[PDB.pdbId].residueData[chainId][resid-1].lines;
    // lines = [prelines[prelines.length-1]].concat(lines);
    // }
    var radius = 0.2;
    var history = {};
    for (var i in lines) {
      var ids = lines[i];
      var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
      var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
      startAtom.caid = resobj.caid;
      atom.caid = resobj.caid;
      var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
      if (history[startAtom.id] === undefined) {
        if(startAtom.name != 'n' && startAtom.name != 'o' && startAtom.name != 'c'){
          PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, sel ? startAtom.color : color, radius, startAtom, addgroup, w);
          PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
          history[startAtom.id] = 1;
        }
        
      }
      if (history[atom.id] === undefined) {
        if(atom.name != 'n' && atom.name != 'o' && atom.name != 'c'){
          PDB.drawer.drawSphere(groupindex, atom.pos_centered, sel ? atom.color : color, radius, atom, addgroup, w);
          PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
          history[atom.id] = 1;
        }
        
      }

      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      //group, start, end, color, radius, atom, addGroup
      if(startAtom.name != 'n' && startAtom.name != 'o' && startAtom.name != 'c' && atom.name != 'n' && atom.name != 'o' && atom.name != 'c'){
        PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, sel ? startAtom.color : color, radius, startAtom);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      }
      if(atom.name != 'n' && atom.name != 'o' && atom.name != 'c' && startAtom.name != 'n' && startAtom.name != 'o' && startAtom.name != 'c'){
        PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, sel ? atom.color : color, radius, atom);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      }
      
    }
  },


  showSticksByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var color = new THREE.Color('#CCC');
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var lines = resobj.lines;

    // if(w3m.mol[PDB.pdbId].residueData[chainId][resid-1]!=undefined){
    // var prelines = w3m.mol[PDB.pdbId].residueData[chainId][resid-1].lines;
    // lines = [prelines[prelines.length-1]].concat(lines);
    // }
    var radius = 0.2;
    var history = {};
    for (var i in lines) {
      var ids = lines[i];
      var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
      var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
      startAtom.caid = resobj.caid;
      atom.caid = resobj.caid;
      var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
      if (history[startAtom.id] === undefined) {
        PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, sel ? startAtom.color : color, radius, startAtom, addgroup, w);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
        history[startAtom.id] = 1;
      }
      if (history[atom.id] === undefined) {
        PDB.drawer.drawSphere(groupindex, atom.pos_centered, sel ? atom.color : color, radius, atom, addgroup, w);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
        history[atom.id] = 1;
      }

      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      //group, start, end, color, radius, atom, addGroup
      PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, sel ? startAtom.color : color, radius, startAtom);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, sel ? atom.color : color, radius, atom);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
    }
  },
  showSticksByStartEnd: function(startId, endId, isSelected) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    if (isSelected) {
      var radius = 0.2;
      var history = {};
      for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {

        var ids = PDB.linkedAtomIdArray[t];

        if (ids[0] < startId && ids[1] < startId) continue;
        if (ids[0] > endId && ids[1] > endId) break;
        var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
        var groupindex = "chain_" + atom.chainname;
        var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
        var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
        if (history[startAtom.id] == undefined) {
          PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, startAtom.color, radius, startAtom, addgroup, w);
          history[startAtom.id] = 1;
        } else if (history[atom.id] == undefined) {
          PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, radius, atom, addgroup, w);
          history[atom.id] = 1;
        } else {
          //console.log("showSticks: duplicate stick...atom.id:"+ atom.id);
        }
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        //group, start, end, color, radius, atom, addGroup
        PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
        PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, atom.color, radius, atom);
      }
    } else {
      var radius = 0.2;
      var history = {};
      for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {

        var ids = PDB.linkedAtomIdArray[t];

        if (ids[0] < startId && ids[1] < startId) continue;
        if (ids[0] > endId && ids[1] > endId) break;

        var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
        var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
        var groupindex = "chain_" + atom.chainname;
        if (history[startAtom.id] == undefined) {
          PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, new THREE.Color('#CCC'), radius, startAtom, addgroup, w);
          history[startAtom.id] = 1;
        } else if (history[atom.id] == undefined) {
          PDB.drawer.drawSphere(groupindex, atom.pos_centered, new THREE.Color('#CCC'), radius, atom, addgroup, w);
          history[atom.id] = 1;
        } else {
          //console.log("showSticks: duplicate stick...atom.id:"+ atom.id);
        }
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        //group, start, end, color, radius, atom, addGroup
        PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, new THREE.Color('#CCC'), radius, startAtom);
        PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, new THREE.Color('#CCC'), radius, atom);
      }
    }

  },
  showBallRod: function() {
    var radius = 0.1;
    var history = {};
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {
      var ids = PDB.linkedAtomIdArray[t];

      var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
      var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
      // atom.caid = atom.id;
      var groupindex = "chain_" + atom.chainname;

      if (history[startAtom.id] == undefined) {
        PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, startAtom.color, startAtom.radius * 0.2, startAtom, addgroup, w);
        history[startAtom.id] = 1;
      } else if (history[atom.id] == undefined) {
        PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, atom.radius * 0.2, atom, addgroup, w);
        history[atom.id] = 1;
      } else {
        //console.log("showHet_Stick: duplicate stick...atom.id:"+ atom.id);
      }
      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
      PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, atom.color, radius, atom);
    }
  },
  showBallRodByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var radius = 0.1;
    var color = new THREE.Color('#CCC');
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var lines = resobj.lines;
    var history = {};
    for (var t = 0; t < lines.length; t++) {
      var ids = lines[t];
      var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);

      var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
      if (!startAtom.caid) {
        startAtom.caid = resobj.caid;
        atom.caid = resobj.caid;
      }
      var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
      if (history[startAtom.id] == undefined) {

        PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, sel ? startAtom.color : color, startAtom.radius * 0.2, startAtom, addgroup, w);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
        history[startAtom.id] = 1;
      }
      if (history[atom.id] == undefined) {

        PDB.drawer.drawSphere(groupindex, atom.pos_centered, sel ? atom.color : color, atom.radius * 0.2, atom, addgroup, w);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
        history[atom.id] = 1;
      }
      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, sel ? startAtom.color : color, radius, startAtom);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, sel ? atom.color : color, radius, atom);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
    }
  },
  showBallRodByStartEnd: function(startId, endId, isSelected) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var radius = 0.1;
    var history = {};
    if (isSelected) {
      for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {
        var ids = PDB.linkedAtomIdArray[t];
        if (ids[0] < startId && ids[1] < startId) continue;
        if (ids[0] > endId && ids[1] > endId) break;
        var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
        var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
        var groupindex = "chain_" + atom.chainname;
        if (history[startAtom.id] == undefined) {
          PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, startAtom.color, startAtom.radius * 0.2, startAtom, addgroup, w);
          history[startAtom.id] = 1;
        } else if (history[atom.id] == undefined) {
          //console.log("showHet_Stick: duplicate stick...atom.id:"+ atom.id);
          PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, atom.radius * 0.2, atom, addgroup, w);
          history[atom.id] = 1;
        } else {}
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
        PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, atom.color, radius, atom);
      }
    } else {
      for (var t = 0; t < PDB.linkedAtomIdArray.length; t++) {
        var ids = PDB.linkedAtomIdArray[t];
        if (ids[0] < startId && ids[1] < startId) continue;
        if (ids[0] > endId && ids[1] > endId) break;
        var startAtom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
        var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
        var groupindex = "chain_" + atom.chainname;
        if (history[startAtom.id] == undefined) {
          PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, new THREE.Color('#CCC'), startAtom.radius * 0.2, startAtom, addgroup, w);
          history[startAtom.id] = 1;
        } else if (history[atom.id] == undefined) {
          //console.log("showHet_Stick: duplicate stick...atom.id:"+ atom.id);
          PDB.drawer.drawSphere(groupindex, atom.pos_centered, new THREE.Color('#CCC'), atom.radius * 0.2, atom, addgroup, w);
          history[atom.id] = 1;
        } else {}
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, new THREE.Color('#CCC'), radius, startAtom);
        PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, new THREE.Color('#CCC'), radius, atom);
      }
    }
  },
  showTubeByResdue: function(chainId, resid, sel, showLow, isshow) {

    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var radius = PDB.CONFIG.tube_radius;
    var residueData = w3m.mol[PDB.pdbId].residueData;

    //link
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
    var resobj = residueData[chainId][resid];
    var path = resobj.path;
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    atom.caid = resobj.caid;
    if (residueData[chainId][Number(resid) - 1] == undefined) {
      var groupindex = showLow ? ("chain_" + atom.chainname + "_low") : ("chain_" + atom.chainname);
      if (residueData[chainId][resid].path.length > 0) {
        PDB.drawer.drawSphere(groupindex, residueData[chainId][resid].path[0], sel ? atom.color : color, radius, atom, addgroup, w);
        PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
      }
    }

    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined && preresobj.path && preresobj.path.length > 0) {
      path = [preresobj.path[preresobj.path.length - 1]].concat(path);
    }

    var groupindex = showLow ? ("chain_" + atom.chainname + "_low") : ("chain_" + atom.chainname);
    if (path.length > 0) {
      var high_r = (PDB.structureSizeLevel >= 3 && Math.floor(path.length / 4) >= 2) ? Math.floor(path.length / 4) : (path.length - 1);
      var low_h = PDB.structureSizeLevel <= 1 ? high_r : 3;
      PDB.drawer.drawTube(groupindex, path, sel ? atom.color : color, radius, {}, showLow ? low_h : high_r, [resobj.caid]);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
    }

    if (residueData[chainId][Number(resid) + 1] == undefined && (path.length - 1) > 0) {
      //var atom = PDB.tool.getMainAtom(PDB.pdbId, residueData[chainId][resid].laid);
      var groupindex = showLow ? ("chain_" + atom.chainname + "_low") : ("chain_" + atom.chainname);
      PDB.drawer.drawSphere(groupindex, path[path.length - 1], sel ? atom.color : color, radius, atom, addgroup, w);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
    }
  },
  showTubeByResdueHEAD: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    //link
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
	if(resobj.path.length==0) return;
    var path = resobj.path.slice(0, resobj.path.length / 2 + 1); ///
    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined) {
      path = [preresobj.path[preresobj.path.length - 1]].concat(path);
    }
    var radius = PDB.CONFIG.tube_radius;
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = showLow ? ("chain_" + atom.chainname + "_low") : ("chain_" + atom.chainname);
    if (path.length > 0) {
      var high_r = PDB.structureSizeLevel >= 3 ? Math.floor(path.length / 4) : (path.length - 1);
      var low_h = PDB.structureSizeLevel <= 1 ? high_r : 3;
      PDB.drawer.drawTube(groupindex, path, sel ? atom.color : color, radius, {}, showLow ? low_h : high_r, [resobj.caid]);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
    }

  },
  showTubeByResdueFOOT: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    //link
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
	  if(resobj.path.length==0) return;
    var path = resobj.path.slice((resobj.path.length / 2) - 1, resobj.path.length); ///
    var color = new THREE.Color('#CCC');

    var radius = PDB.CONFIG.tube_radius;
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = showLow ? ("chain_" + atom.chainname + "_low") : ("chain_" + atom.chainname);
    if (path.length > 0) {
      var high_r = PDB.structureSizeLevel >= 3 ? Math.floor(path.length / 4) : (path.length - 1);
      var low_h = PDB.structureSizeLevel <= 1 ? high_r : 3;
      PDB.drawer.drawTube(groupindex, path, sel ? atom.color : color, radius, {}, showLow ? low_h : high_r, [resobj.caid]);
      PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
    }

  },
  showRibbon_Flat: function() {
    // var color  = 0xa345;
    var radius = 0;
    // for(var i in PDB.cubeData.path){
    // var path = PDB.cubeData.path[i];
    // var ids = PDB.cubeData.ids[i];
    // var obj =  {
    // binormals : PDB.cubeData.binormals[i],
    // normals   : PDB.cubeData.normals[i],
    // tangents  : PDB.cubeData.tangents[i]
    // };
    // PDB.drawer.drawFlat(PDB.GROUP_MAIN,path, color, radius,obj,path.length-1,ids);//draw helix
    // }

    // var radius = PDB.CONFIG.strip_radius;
    var chainmidppoint = {},
      chainmidbinormal = {},
      chainmidnormal = {},
      chainmidtangent = {};
    var chaintemppath = [],
      chaintempbinormal = [],
      chaintempnormal = [],
      chaintemptangent = [];
    var chainpreid = 0,
      chainpid = 0;
    for (var i in PDB.cubeData.path) {
      var path = PDB.cubeData.path[i];
      var ids = PDB.cubeData.ids[i];
      var preid = -1,
        pid = -1;
      var midppoint, midbinormal, midnormal, midtangent;
      var temppath = [],
        tempbinormal = [],
        tempnormal = [],
        temptangent = [];
      for (var j in ids) {
        pid = ids[j];
        temppath.push(path[j]);
        tempbinormal.push(PDB.cubeData.binormals[i][j]);
        tempnormal.push(PDB.cubeData.normals[i][j]);
        temptangent.push(PDB.cubeData.tangents[i][j]);
        if (pid != preid) {
          if (j != 0) {


            var color = PDB.tool.getColorByIndex(preid, 'main');
            var obj = {
              binormals: tempbinormal,
              normals: tempnormal,
              tangents: temptangent
            };
            var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
            var groupindex = "chain_" + atom.chainname;
            PDB.drawer.drawFlat(groupindex, temppath, color, radius, obj, temppath.length - 1, [preid]); //draw one id
            temppath = [], tempbinormal = [], tempnormal = [], temptangent = [];
            // temppath.push(path[j-1]);
            // tempbinormal.push(PDB.cubeData.binormals[i][j-1]);
            // tempnormal.push(PDB.cubeData.normals[i][j-1]);
            // temptangent.push(PDB.cubeData.tangents[i][j-1]);
            temppath.push(path[j]);
            tempbinormal.push(PDB.cubeData.binormals[i][j]);
            tempnormal.push(PDB.cubeData.normals[i][j]);
            temptangent.push(PDB.cubeData.tangents[i][j]);
          }
          preid = ids[j];
        }
      }
    }
  },
  showRibbon_FlatByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
    var cubedataObj = {};
    cubedataObj.tangents = resobj.tangents;
    cubedataObj.normals = resobj.normals;
    cubedataObj.binormals = resobj.binormals;
    var path = resobj.path;
	if(resobj.path.length==0) return;
    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined) {
      path = [preresobj.path[preresobj.path.length - 1]].concat(path);
      cubedataObj.tangents = [preresobj.tangents[preresobj.tangents.length - 1]].concat(cubedataObj.tangents);
      cubedataObj.normals = [preresobj.normals[preresobj.normals.length - 1]].concat(cubedataObj.normals);
      cubedataObj.binormals = [preresobj.binormals[preresobj.binormals.length - 1]].concat(cubedataObj.binormals);
    }

    if (showLow) {
      cubedataObj.tangents = [cubedataObj.tangents[0], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 4)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 2)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length * 3 / 4)], cubedataObj.tangents[cubedataObj.tangents.length - 1]];
      cubedataObj.normals = [cubedataObj.normals[0], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 4)], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 2)], cubedataObj.normals[Math.floor(cubedataObj.normals.length * 3 / 4)], cubedataObj.normals[cubedataObj.normals.length - 1]];
      cubedataObj.binormals = [cubedataObj.binormals[0], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 4)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 2)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length * 3 / 4)], cubedataObj.binormals[cubedataObj.binormals.length - 1]];
    } else if (!showLow && PDB.loadType == PDB.bigmodel) {

      if (PDB.structureSizeLevel >= 3) {
        var t = [];
        var n = [];
        var b = [];
        for (var i = 0; i < cubedataObj.tangents.length; i++) {
          if (i % 2 != 0) continue;
          t.push(cubedataObj.tangents[i]);
          n.push(cubedataObj.normals[i]);
          b.push(cubedataObj.binormals[i]);
        }
        cubedataObj = {
          tangents: t,
          normals: n,
          binormals: b
        }
      }
    }
    var radius = 0;
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');

    PDB.drawer.drawFlat(groupindex, path, sel ? atom.color : color, radius, cubedataObj, showLow ? 4 : cubedataObj.tangents.length - 1, [resobj.caid]);
    PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
  },
  showRibbon_Ellipse: function() {
    var radius = PDB.CONFIG.ellipse_radius;
    var chainmidppoint = {},
      chainmidbinormal = {},
      chainmidnormal = {},
      chainmidtangent = {};
    var chaintemppath = [],
      chaintempbinormal = [],
      chaintempnormal = [],
      chaintemptangent = [];
    var chainpreid = 0,
      chainpid = 0;
    for (var i in PDB.cubeData.path) {
      var path = PDB.cubeData.path[i];
      var ids = PDB.cubeData.ids[i];
      var preid = -1,
        pid = -1;
      var midppoint, midbinormal, midnormal, midtangent;
      var temppath = [],
        tempbinormal = [],
        tempnormal = [],
        temptangent = [];
      for (var j in ids) {
        pid = ids[j];
        temppath.push(path[j]);
        tempbinormal.push(PDB.cubeData.binormals[i][j]);
        tempnormal.push(PDB.cubeData.normals[i][j]);
        temptangent.push(PDB.cubeData.tangents[i][j]);
        if (pid != preid) {
          if (j != 0) {
            var color = PDB.tool.getColorByIndex(preid, 'main');
            var obj = {
              binormals: tempbinormal,
              normals: tempnormal,
              tangents: temptangent
            };
            var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
            var groupindex = "chain_" + atom.chainname;
            PDB.drawer.drawEllipse(groupindex, temppath, color, radius, obj, temppath.length - 1, [preid]); //draw one id
            temppath = [], tempbinormal = [], tempnormal = [], temptangent = [];
            temppath.push(path[j]);
            tempbinormal.push(PDB.cubeData.binormals[i][j]);
            tempnormal.push(PDB.cubeData.normals[i][j]);
            temptangent.push(PDB.cubeData.tangents[i][j]);
          }
          preid = ids[j];
        }
      }
    }
  },
  showRibbon_EllipseByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    //link
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
    var cubedataObj = {};
    cubedataObj.tangents = resobj.tangents;
    cubedataObj.normals = resobj.normals;
    cubedataObj.binormals = resobj.binormals;
    var path = resobj.path;
	if(resobj.path.length==0) return;
    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined) {
      path = [preresobj.path[preresobj.path.length - 1]].concat(path);
      cubedataObj.tangents = [preresobj.tangents[preresobj.tangents.length - 1]].concat(cubedataObj.tangents);
      cubedataObj.normals = [preresobj.normals[preresobj.normals.length - 1]].concat(cubedataObj.normals);
      cubedataObj.binormals = [preresobj.binormals[preresobj.binormals.length - 1]].concat(cubedataObj.binormals);
    }

    if (showLow) {
      cubedataObj.tangents = [cubedataObj.tangents[0], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 4)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 2)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length * 3 / 4)], cubedataObj.tangents[cubedataObj.tangents.length - 1]];
      cubedataObj.normals = [cubedataObj.normals[0], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 4)], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 2)], cubedataObj.normals[Math.floor(cubedataObj.normals.length * 3 / 4)], cubedataObj.normals[cubedataObj.normals.length - 1]];
      cubedataObj.binormals = [cubedataObj.binormals[0], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 4)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 2)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length * 3 / 4)], cubedataObj.binormals[cubedataObj.binormals.length - 1]];
    } else if (!showLow && PDB.loadType == PDB.bigmodel) {
      if (PDB.structureSizeLevel >= 3) {
        var t = [];
        var n = [];
        var b = [];
        for (var i = 0; i < cubedataObj.tangents.length; i++) {
          if (i % 2 != 0) continue;
          t.push(cubedataObj.tangents[i]);
          n.push(cubedataObj.normals[i]);
          b.push(cubedataObj.binormals[i]);
        }
        cubedataObj = {
          tangents: t,
          normals: n,
          binormals: b
        }
      }
    }
    //console.log(cubedataObj);
    var radius = PDB.CONFIG.ellipse_radius;
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
	if(path.length>0){
		PDB.drawer.drawEllipse(groupindex, path, sel ? atom.color : color, radius, cubedataObj, showLow ? 4 : cubedataObj.tangents.length - 1, [resobj.caid]);
		PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
	}
    
  },

  showRibbon_EllipseByResdueHEAD: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    //link
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
	if(resobj.path.length==0) return;
    var path = resobj.path.slice(0, resobj.path.length / 2); ///
    var cubedataObj = {};
    cubedataObj.tangents = resobj.tangents.slice(0, resobj.tangents.length / 2);
    cubedataObj.normals = resobj.normals.slice(0, resobj.normals.length / 2);
    cubedataObj.binormals = resobj.binormals.slice(0, resobj.binormals.length / 2);
    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined) {
      path = [preresobj.path[preresobj.path.length - 1]].concat(path);
      cubedataObj.tangents = [preresobj.tangents[preresobj.tangents.length - 1]].concat(cubedataObj.tangents);
      cubedataObj.normals = [preresobj.normals[preresobj.normals.length - 1]].concat(cubedataObj.normals);
      cubedataObj.binormals = [preresobj.binormals[preresobj.binormals.length - 1]].concat(cubedataObj.binormals);
    }
    if (showLow) {
      cubedataObj.tangents = [cubedataObj.tangents[0], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 4)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 2)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length * 3 / 4)], cubedataObj.tangents[cubedataObj.tangents.length - 1]];
      cubedataObj.normals = [cubedataObj.normals[0], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 4)], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 2)], cubedataObj.normals[Math.floor(cubedataObj.normals.length * 3 / 4)], cubedataObj.normals[cubedataObj.normals.length - 1]];
      cubedataObj.binormals = [cubedataObj.binormals[0], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 4)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 2)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length * 3 / 4)], cubedataObj.binormals[cubedataObj.binormals.length - 1]];
    } else if (!showLow && PDB.loadType == PDB.bigmodel) {
      if (PDB.structureSizeLevel >= 3) {
        var t = [];
        var n = [];
        var b = [];
        for (var i = 0; i < cubedataObj.tangents.length; i++) {
          if (i % 2 != 0) continue;
          t.push(cubedataObj.tangents[i]);
          n.push(cubedataObj.normals[i]);
          b.push(cubedataObj.binormals[i]);
        }
        cubedataObj = {
          tangents: t,
          normals: n,
          binormals: b
        }
      }
    }


    var radius = PDB.CONFIG.ellipse_radius;
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
	if(path.length>0){
		PDB.drawer.drawEllipse(groupindex, path, sel ? atom.color : color, radius, cubedataObj, showLow ? 4 : cubedataObj.tangents.length - 1, [resobj.caid]);
		PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
	}
    
  },
  showRibbon_EllipseByResdueFOOT: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    //link
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
	if(resobj.path.length==0) return;
    var path = resobj.path.slice((resobj.path.length / 2) - 1, resobj.path.length); ///
    var cubedataObj = {};
    cubedataObj.tangents = resobj.tangents.slice((resobj.tangents.length / 2) - 1, resobj.tangents.length);
    cubedataObj.normals = resobj.normals.slice((resobj.normals.length / 2) - 1, resobj.normals.length);
    cubedataObj.binormals = resobj.binormals.slice((resobj.binormals.length / 2) - 1, resobj.binormals.length);

    if (showLow) {
      cubedataObj.tangents = [cubedataObj.tangents[0], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 4)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 2)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length * 3 / 4)], cubedataObj.tangents[cubedataObj.tangents.length - 1]];
      cubedataObj.normals = [cubedataObj.normals[0], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 4)], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 2)], cubedataObj.normals[Math.floor(cubedataObj.normals.length * 3 / 4)], cubedataObj.normals[cubedataObj.normals.length - 1]];
      cubedataObj.binormals = [cubedataObj.binormals[0], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 4)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 2)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length * 3 / 4)], cubedataObj.binormals[cubedataObj.binormals.length - 1]];
    } else if (!showLow && PDB.loadType == PDB.bigmodel) {
      if (PDB.structureSizeLevel >= 3) {
        var t = [];
        var n = [];
        var b = [];
        for (var i = 0; i < cubedataObj.tangents.length; i++) {
          if (i % 2 != 0) continue;
          t.push(cubedataObj.tangents[i]);
          n.push(cubedataObj.normals[i]);
          b.push(cubedataObj.binormals[i]);
        }
        cubedataObj = {
          tangents: t,
          normals: n,
          binormals: b
        }
      }
    }

    var color = new THREE.Color('#CCC');
    var radius = PDB.CONFIG.ellipse_radius;
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
	if(path.length>0){
		PDB.drawer.drawEllipse(groupindex, path, sel ? atom.color : color, radius, cubedataObj, showLow ? 4 : cubedataObj.tangents.length - 1, [resobj.caid]);
		PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
	}
    
  },

  showRibbon_Rectangle: function() {

    var radius = 0;
    var chainmidppoint = {},
      chainmidbinormal = {},
      chainmidnormal = {},
      chainmidtangent = {};
    var chaintemppath = [],
      chaintempbinormal = [],
      chaintempnormal = [],
      chaintemptangent = [];
    var chainpreid = 0,
      chainpid = 0;
    for (var i in PDB.cubeData.path) {
      var path = PDB.cubeData.path[i];
      var ids = PDB.cubeData.ids[i];
      var preid = -1,
        pid = -1;
      var midppoint, midbinormal, midnormal, midtangent;
      var temppath = [],
        tempbinormal = [],
        tempnormal = [],
        temptangent = [];
      for (var j in ids) {
        pid = ids[j];
        if (pid != preid) {
          if (j != 0) {
            temppath.push(path[j]);
            tempbinormal.push(PDB.cubeData.binormals[i][j]);
            tempnormal.push(PDB.cubeData.normals[i][j]);
            temptangent.push(PDB.cubeData.tangents[i][j]);

            var color = PDB.tool.getColorByIndex(preid, 'main');
            var obj = {
              binormals: tempbinormal,
              normals: tempnormal,
              tangents: temptangent
            };
            var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
            var groupindex = "chain_" + atom.chainname;
            PDB.drawer.drawRectangle(groupindex, temppath, color, radius, obj, temppath.length - 1, [preid]); //draw one id
            temppath = [], tempbinormal = [], tempnormal = [], temptangent = [];
          }
          preid = ids[j];
        }
        temppath.push(path[j]);
        tempbinormal.push(PDB.cubeData.binormals[i][j]);
        tempnormal.push(PDB.cubeData.normals[i][j]);
        temptangent.push(PDB.cubeData.tangents[i][j]);
      }
    }
  },
  showRibbon_RectangleByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
	  if(resobj.path.length==0) return;
    var cubedataObj = {};
    cubedataObj.tangents = resobj.tangents;
    cubedataObj.normals = resobj.normals;
    cubedataObj.binormals = resobj.binormals;
    var path = resobj.path;
    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined) {
      path = [preresobj.path[preresobj.path.length - 1]].concat(path);
      cubedataObj.tangents = [preresobj.tangents[preresobj.tangents.length - 1]].concat(cubedataObj.tangents);
      cubedataObj.normals = [preresobj.normals[preresobj.normals.length - 1]].concat(cubedataObj.normals);
      cubedataObj.binormals = [preresobj.binormals[preresobj.binormals.length - 1]].concat(cubedataObj.binormals);
    }

    if (showLow) {
      cubedataObj.tangents = [cubedataObj.tangents[0], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 4)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 2)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length * 3 / 4)], cubedataObj.tangents[cubedataObj.tangents.length - 1]];
      cubedataObj.normals = [cubedataObj.normals[0], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 4)], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 2)], cubedataObj.normals[Math.floor(cubedataObj.normals.length * 3 / 4)], cubedataObj.normals[cubedataObj.normals.length - 1]];
      cubedataObj.binormals = [cubedataObj.binormals[0], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 4)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 2)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length * 3 / 4)], cubedataObj.binormals[cubedataObj.binormals.length - 1]];
    } else if (!showLow && PDB.loadType == PDB.bigmodel) {
      if (PDB.structureSizeLevel >= 3) {
        var t = [];
        var n = [];
        var b = [];
        for (var i = 0; i < cubedataObj.tangents.length; i++) {
          if (i % 2 != 0) continue;
          t.push(cubedataObj.tangents[i]);
          n.push(cubedataObj.normals[i]);
          b.push(cubedataObj.binormals[i]);
        }
        cubedataObj = {
          tangents: t,
          normals: n,
          binormals: b
        }
      }
    }
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
    var radius = 0;
	if(path.length>0){
		PDB.drawer.drawRectangle(groupindex, path, sel ? atom.color : color, radius, cubedataObj, showLow ? 4 : cubedataObj.tangents.length - 1, [resobj.caid]);
		PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
	}
    
  },
  showRibbon_Strip: function() {
    var radius = PDB.CONFIG.strip_radius;
    var chainmidppoint = {},
      chainmidbinormal = {},
      chainmidnormal = {},
      chainmidtangent = {};
    var chaintemppath = [],
      chaintempbinormal = [],
      chaintempnormal = [],
      chaintemptangent = [];
    var chainpreid = 0,
      chainpid = 0;
    for (var i in PDB.cubeData.path) {
      var path = PDB.cubeData.path[i];
      var ids = PDB.cubeData.ids[i];
      var preid = -1,
        pid = -1;
      var midppoint, midbinormal, midnormal, midtangent;
      var temppath = [],
        tempbinormal = [],
        tempnormal = [],
        temptangent = [];
      for (var j in ids) {
        pid = ids[j];
        if (pid != preid) {
          if (j != 0) {
            temppath.push(path[j]);
            tempbinormal.push(PDB.cubeData.binormals[i][j]);
            tempnormal.push(PDB.cubeData.normals[i][j]);
            temptangent.push(PDB.cubeData.tangents[i][j]);

            var color = PDB.tool.getColorByIndex(preid, 'main');
            var obj = {
              binormals: tempbinormal,
              normals: tempnormal,
              tangents: temptangent
            };
            var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[1]);
            var groupindex = "chain_" + atom.chainname;
            PDB.drawer.drawStrip(groupindex, temppath, color, radius, obj, temppath.length - 1, [preid]); //draw one id
            temppath = [], tempbinormal = [], tempnormal = [], temptangent = [];
          }
          preid = ids[j];
        }
        temppath.push(path[j]);
        tempbinormal.push(PDB.cubeData.binormals[i][j]);
        tempnormal.push(PDB.cubeData.normals[i][j]);
        temptangent.push(PDB.cubeData.tangents[i][j]);
      }
    }
  },
  showRibbon_StripByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
	if(resobj.path.length==0) return;
    var cubedataObj = {};
    cubedataObj.tangents = resobj.tangents;
    cubedataObj.normals = resobj.normals;
    cubedataObj.binormals = resobj.binormals;
    var path = resobj.path;
    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined) {
      path = [preresobj.path[preresobj.path.length - 1]].concat(path);
      cubedataObj.tangents = [preresobj.tangents[preresobj.tangents.length - 1]].concat(cubedataObj.tangents);
      cubedataObj.normals = [preresobj.normals[preresobj.normals.length - 1]].concat(cubedataObj.normals);
      cubedataObj.binormals = [preresobj.binormals[preresobj.binormals.length - 1]].concat(cubedataObj.binormals);
    }

    if (showLow) {
      cubedataObj.tangents = [cubedataObj.tangents[0], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 4)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 2)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length * 3 / 4)], cubedataObj.tangents[cubedataObj.tangents.length - 1]];
      cubedataObj.normals = [cubedataObj.normals[0], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 4)], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 2)], cubedataObj.normals[Math.floor(cubedataObj.normals.length * 3 / 4)], cubedataObj.normals[cubedataObj.normals.length - 1]];
      cubedataObj.binormals = [cubedataObj.binormals[0], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 4)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 2)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length * 3 / 4)], cubedataObj.binormals[cubedataObj.binormals.length - 1]];
    } else if (!showLow && PDB.loadType == PDB.bigmodel) {
      if (PDB.structureSizeLevel >= 3) {
        var t = [];
        var n = [];
        var b = [];
        for (var i = 0; i < cubedataObj.tangents.length; i++) {
          if (i % 2 != 0) continue;
          t.push(cubedataObj.tangents[i]);
          n.push(cubedataObj.normals[i]);
          b.push(cubedataObj.binormals[i]);
        }
        cubedataObj = {
          tangents: t,
          normals: n,
          binormals: b
        }
      }
    }
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');

    var radius = PDB.CONFIG.strip_radius;
	if(path.length>0){
		PDB.drawer.drawStrip(groupindex, path, sel ? atom.color : color, radius, cubedataObj, showLow ? 4 : cubedataObj.tangents.length - 1, [resobj.caid]);
		PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
	}
    
  },
  showRibbon_Railway: function() {
    // var color  = 0xa345;
    // var radius = 0.05;
    // for(var i in PDB.cubeData.path){
    // var path = PDB.cubeData.path[i];
    // var obj =  {
    // binormals : PDB.cubeData.binormals[i],
    // normals   : PDB.cubeData.normals[i],
    // tangents  : PDB.cubeData.tangents[i]
    // };
    // PDB.drawer.drawRailway(PDB.GROUP_MAIN,path, color, radius,obj,path.length-1);//draw helix
    // }

    var radius = PDB.CONFIG.railway_radius;
    var chainmidppoint = {},
      chainmidbinormal = {},
      chainmidnormal = {},
      chainmidtangent = {};
    var chaintemppath = [],
      chaintempbinormal = [],
      chaintempnormal = [],
      chaintemptangent = [];
    var chainpreid = 0,
      chainpid = 0;
    for (var i in PDB.cubeData.path) {
      var path = PDB.cubeData.path[i];
      var ids = PDB.cubeData.ids[i];
      var preid = -1,
        pid = -1;
      var midppoint, midbinormal, midnormal, midtangent;
      var temppath = [],
        tempbinormal = [],
        tempnormal = [],
        temptangent = [];
      for (var j in ids) {
        pid = ids[j];
        if (pid != preid) {
          if (j != 0) {
            temppath.push(path[j]);
            tempbinormal.push(PDB.cubeData.binormals[i][j]);
            tempnormal.push(PDB.cubeData.normals[i][j]);
            temptangent.push(PDB.cubeData.tangents[i][j]);

            var color = PDB.tool.getColorByIndex(preid, 'main');
            var obj = {
              binormals: tempbinormal,
              normals: tempnormal,
              tangents: temptangent
            };
            var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
            var groupindex = "chain_" + atom.chainname;
            PDB.drawer.drawRailway(groupindex, temppath, color, radius, obj, temppath.length - 1, [preid]); //draw one id
            temppath = [], tempbinormal = [], tempnormal = [], temptangent = [];
          }
          preid = ids[j];
        }
        temppath.push(path[j]);
        tempbinormal.push(PDB.cubeData.binormals[i][j]);
        tempnormal.push(PDB.cubeData.normals[i][j]);
        temptangent.push(PDB.cubeData.tangents[i][j]);
      }
    }
  },
  showRibbon_RailwayByResdue: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
	if(resobj.path.length==0) return;
    var cubedataObj = {};
    cubedataObj.tangents = resobj.tangents;
    cubedataObj.normals = resobj.normals;
    cubedataObj.binormals = resobj.binormals;
    var path = resobj.path;
    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined) {
      path = [preresobj.path[preresobj.path.length - 1]].concat(path);
      cubedataObj.tangents = [preresobj.tangents[preresobj.tangents.length - 1]].concat(cubedataObj.tangents);
      cubedataObj.normals = [preresobj.normals[preresobj.normals.length - 1]].concat(cubedataObj.normals);
      cubedataObj.binormals = [preresobj.binormals[preresobj.binormals.length - 1]].concat(cubedataObj.binormals);
    }

    if (showLow) {
      cubedataObj.tangents = [cubedataObj.tangents[0], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 4)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length / 2)], cubedataObj.tangents[Math.floor(cubedataObj.tangents.length * 3 / 4)], cubedataObj.tangents[cubedataObj.tangents.length - 1]];
      cubedataObj.normals = [cubedataObj.normals[0], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 4)], cubedataObj.normals[Math.floor(cubedataObj.normals.length / 2)], cubedataObj.normals[Math.floor(cubedataObj.normals.length * 3 / 4)], cubedataObj.normals[cubedataObj.normals.length - 1]];
      cubedataObj.binormals = [cubedataObj.binormals[0], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 4)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length / 2)], cubedataObj.binormals[Math.floor(cubedataObj.binormals.length * 3 / 4)], cubedataObj.binormals[cubedataObj.binormals.length - 1]];
    } else if (!showLow && PDB.loadType == PDB.bigmodel) {
      if (PDB.structureSizeLevel >= 3) {
        var t = [];
        var n = [];
        var b = [];
        for (var i = 0; i < cubedataObj.tangents.length; i++) {
          if (i % 2 != 0) continue;
          t.push(cubedataObj.tangents[i]);
          n.push(cubedataObj.normals[i]);
          b.push(cubedataObj.binormals[i]);
        }
        cubedataObj = {
          tangents: t,
          normals: n,
          binormals: b
        }
      }
    }
    var radius = PDB.CONFIG.railway_radius;
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
	if(path.length>0){
		PDB.drawer.drawRailway(groupindex, path, sel ? atom.color : color, radius, cubedataObj, showLow ? 4 : cubedataObj.tangents.length - 1, [resobj.caid]);
		PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
	}
    
  },
  showCartoon_SSE0: function() {
    var color = '';
    for (var t = 0; t < PDB.tubeArray.length; t++) {
      var ps = PDB.tubeArray[t];
      var path = [];
      for (var i = 0; i < ps.length; i++) {
        path.push(new THREE.Vector3(ps[i].x + offset.x, ps[i].y + offset.y, ps[i].z + offset.z));
        atom = PDB.tool.getMainAtom(PDB.pdbId, ps[i].id);
        resid = atom.resid;
        color = getColorByIndex(ps[i].c);
      }
      color = 0xa345;
      var radius = 0.2;
      PDB.drawer.drawTube(PDB.GROUP_MAIN, path, color, radius, 3000);
    }

    color = 0xa345;
    for (var i = 0; i < PDB.arrowArray.length; i++) {
      var points = PDB.arrowArray[i];
      drawArrow(PDB.GROUP_MAIN, points, color, 1);
    }
  },

  showCartoon_SSE: function() {
    var radius = PDB.CONFIG.ellipse_radius;
    var helix = PDB.cartoonHLObj.helix;
    // var phelix;
    for (var i in helix) {
      var helixa = helix[i];
      var ids = helixa[0];
      var pathss = helixa[1];
      var tangentss = helixa[3];
      var normalss = helixa[4];
      var binormalss = helixa[5];
      //add the tangent&normal&binormal information
      var preid = -1,
        pid = -1;
      var paths = [],
        binormals = [],
        normals = [],
        tangents = [];

      for (var j = 0; j < ids.length; j++) {
        pid = ids[j];
        paths.push(pathss[j]);
        binormals.push(binormalss[j]);
        normals.push(normalss[j]);
        tangents.push(tangentss[j]);
        if (preid != -1 && preid != pid) {
          var obj = {
            binormals: binormals,
            normals: normals,
            tangents: tangents
          };
          var color = PDB.tool.getColorByIndex(preid, 'main');
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawEllipse(groupindex, paths, color, radius, obj, paths.length - 1, [preid]); //draw helix
          paths = [], binormals = [], normals = [], tangents = [];
          paths.push(pathss[j]);
          binormals.push(binormalss[j]);
          normals.push(normalss[j]);
          tangents.push(tangentss[j]);
        } else if (j == ids.length - 1) {
          var obj = {
            binormals: binormals,
            normals: normals,
            tangents: tangents
          };
          var color = PDB.tool.getColorByIndex(preid, 'main');
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawEllipse(groupindex, paths, color, radius, obj, paths.length - 1, [preid]); //draw helix
        }
        preid = ids[j];
      }
    }
    var loop = PDB.cartoonHLObj.loop;
    radius = PDB.CONFIG.tube_radius;
    preid = -1;
    // for(var i in loop){
    // var paths = loop[i][1];
    // var ids = loop[i][0];
    // var atom = PDB.tool.getMainAtom(PDB.pdbId, ids[0]);
    // var groupindex = "chain_"+atom.chainname;
    // PDB.drawer.drawTube(groupindex, paths, color, radius,{},paths.length-1,ids);
    // }
    //var groupindex = "chain_"+atom.chainname;
    for (var i in loop) {
      var pathss = loop[i][1];
      var ids = loop[i][0];
      var preid = -1,
        pid = -1;
      var paths = [];
      for (var j = 0; j < ids.length; j++) {
        pid = ids[j];
        paths.push(pathss[j]);
        if (preid != -1 && preid != pid) {
          var color = PDB.tool.getColorByIndex(preid, 'main');
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawTube(groupindex, paths, color, radius, {}, paths.length - 1, [preid]);
          paths = [];
          paths.push(pathss[j - 1]);
          paths.push(pathss[j]);
        } else if (j == ids.length - 1) {
          var color = PDB.tool.getColorByIndex(preid, 'main');
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawTube(groupindex, paths, color, radius, {}, paths.length - 1, [preid]);
        }
        preid = ids[j];
      }
    }
    var arrow_head = PDB.cartoonSheetArray.head;
    for (var i in arrow_head) {
      var pathss = arrow_head[i].paths;
      var ids = arrow_head[i].ids;
      var preid = -1,
        pid = -1;
      var paths = [];
      for (var j = 0; j < ids.length; j = j + 4) {
        pid = ids[j];
        paths.push(pathss[j]);
        paths.push(pathss[j + 1]);
        paths.push(pathss[j + 2]);
        paths.push(pathss[j + 3]);
        if (preid != -1 && preid != pid) {
          var color = PDB.tool.getColorByIndex(preid, 'main');
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
          paths = [];
          paths.push(pathss[j - 8]);
          paths.push(pathss[j - 7]);
          paths.push(pathss[j - 6]);
          paths.push(pathss[j - 5]);
          paths.push(pathss[j - 4]);
          paths.push(pathss[j - 3]);
          paths.push(pathss[j - 2]);
          paths.push(pathss[j - 1]);
          paths.push(pathss[j]);
          paths.push(pathss[j + 1]);
          paths.push(pathss[j + 2]);
          paths.push(pathss[j + 3]);
        } else if (preid != -1 && j == ids.length - 4) {
          var color = PDB.tool.getColorByIndex(preid, 'main');
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
        }
        preid = ids[j];
      }
    }

    var arrow_tail = PDB.cartoonSheetArray.tail;
    for (var i in arrow_tail) {
      var pathss = arrow_tail[i].paths;
      var ids = arrow_tail[i].ids;
      var preid = -1,
        pid = -1;
      var paths = [];
      for (var j = 0; j < ids.length; j = j + 4) {
        pid = ids[j];
        paths.push(pathss[j]);
        paths.push(pathss[j + 1]);
        paths.push(pathss[j + 2]);
        paths.push(pathss[j + 3]);
        if (preid != -1 && preid != pid) {
          var color = PDB.tool.getColorByIndex(preid, 'main');
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
          paths = [];
          paths.push(pathss[j - 8]);
          paths.push(pathss[j - 7]);
          paths.push(pathss[j - 6]);
          paths.push(pathss[j - 5]);
          paths.push(pathss[j - 4]);
          paths.push(pathss[j - 3]);
          paths.push(pathss[j - 2]);
          paths.push(pathss[j - 1]);
          paths.push(pathss[j]);
          paths.push(pathss[j + 1]);
          paths.push(pathss[j + 2]);
          paths.push(pathss[j + 3]);
        } else if (preid != -1 && j == ids.length - 4) {
          var color = PDB.tool.getColorByIndex(preid, 'main');
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
        }
        preid = ids[j];
      }
    }
  },

  showCartoon_SSEByStartEnd: function(startId, endId, islected) {
    var t = PDB.tool.getCAAtomByLastAtomId(endId);
    if (t.length > 0) {
      endId = t[1];
    }
    t = PDB.tool.getCAAtomByStartAtomId(startId);
    if (t.length > 0) {
      startId = t[1];
    }
    var radius = PDB.CONFIG.ellipse_radius;
    var helix = PDB.cartoonHLObj.helix;
    for (var i in helix) {
      var helixa = helix[i];
      var ids = helixa[0];
      var pathss = helixa[1];
      var tangentss = helixa[3];
      var normalss = helixa[4];
      var binormalss = helixa[5];
      //add the tangent&normal&binormal information
      var preid = -1,
        pid = -1;
      var paths = [],
        binormals = [],
        normals = [],
        tangents = [];
      for (var j = 0; j < ids.length; j++) {
        if (ids[j] < startId) continue;
        if (ids[j] > endId) break;
        pid = ids[j];
        paths.push(pathss[j]);
        binormals.push(binormalss[j]);
        normals.push(normalss[j]);
        tangents.push(tangentss[j]);
        if (preid != -1 && preid != pid) {
          var obj = {
            binormals: binormals,
            normals: normals,
            tangents: tangents
          };
          var color;
          if (islected) {
            color = PDB.tool.getColorByIndex(preid, 'main');
          } else {
            color = new THREE.Color('#CCC');
          }
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawEllipse(groupindex, paths, color, radius, obj, paths.length - 1, [preid]); //draw helix
          paths = [], binormals = [], normals = [], tangents = [];

          paths.push(pathss[j]);
          binormals.push(binormalss[j]);
          normals.push(normalss[j]);
          tangents.push(tangentss[j]);
        } else if (j == ids.length - 1 || (j != 0 && preid == pid && j != (ids.length - 1) && ids[j] == endId && ids[j + 1] != endId)) {
          if (j < ids.length - 1) {
            paths.push(pathss[j + 1]);
            binormals.push(binormalss[j + 1]);
            normals.push(normalss[j + 1]);
            tangents.push(tangentss[j + 1]);
          }

          var obj = {
            binormals: binormals,
            normals: normals,
            tangents: tangents
          };
          var color;
          if (islected) {
            color = PDB.tool.getColorByIndex(preid, 'main');
          } else {
            color = new THREE.Color('#CCC');
          }
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawEllipse(groupindex, paths, color, radius, obj, paths.length - 1, [preid]); //draw helix
        }
        preid = ids[j];
      }
    }
    var loop = PDB.cartoonHLObj.loop;
    radius = PDB.CONFIG.tube_radius;
    for (var i in loop) {
      var pathss = loop[i][1];
      var ids = loop[i][0];
      var preid = -1,
        pid = -1;
      var paths = [];
      for (var j = 0; j < ids.length; j++) {
        if (ids[j] < startId) continue;
        if (ids[j] > endId) break;
        pid = ids[j];
        paths.push(pathss[j]);
        if (preid != -1 && preid != pid) {
          var color;
          if (islected) {
            color = PDB.tool.getColorByIndex(preid, 'main');
          } else {
            color = new THREE.Color('#CCC');
          }
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawTube(groupindex, paths, color, radius, {}, paths.length - 1, [preid]);
          paths = [];
          paths.push(pathss[j - 1]);
          paths.push(pathss[j]);
        } else if (j == ids.length - 1 || (j != 0 && preid == pid && j != (ids.length - 1) && ids[j] == endId && ids[j + 1] != endId)) {
          if (j < ids.length - 1) {
            paths.push(pathss[j + 1]);
          }
          var color;
          if (islected) {
            color = PDB.tool.getColorByIndex(preid, 'main');
          } else {
            color = new THREE.Color('#CCC');
          }
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawTube(groupindex, paths, color, radius, {}, paths.length - 1, [preid]); //draw helix
        }
        preid = ids[j];
      }
    }
    var arrow_head = PDB.cartoonSheetArray.head;
    for (var i in arrow_head) {
      var pathss = arrow_head[i].paths;
      var ids = arrow_head[i].ids;
      var preid = -1,
        pid = -1;
      var paths = [];
      for (var j = 0; j < ids.length; j = j + 4) {
        if (ids[j] < startId) continue;
        if (ids[j] > endId) break;
        pid = ids[j];
        paths.push(pathss[j]);
        paths.push(pathss[j + 1]);
        paths.push(pathss[j + 2]);
        paths.push(pathss[j + 3]);
        if (preid != -1 && preid != pid) {
          var color;
          if (islected) {
            color = PDB.tool.getColorByIndex(preid, 'main');
          } else {
            color = new THREE.Color('#CCC');
          }
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
          paths = [];
          paths.push(pathss[j]);
          paths.push(pathss[j + 1]);
          paths.push(pathss[j + 2]);
          paths.push(pathss[j + 3]);
        } else if (preid != -1 && j == ids.length - 4) {
          var color;
          if (islected) {
            color = PDB.tool.getColorByIndex(preid, 'main');
          } else {
            color = new THREE.Color('#CCC');
          }
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
        }
        preid = ids[j];
      }
    }

    var arrow_tail = PDB.cartoonSheetArray.tail;
    for (var i in arrow_tail) {
      var pathss = arrow_tail[i].paths;
      var ids = arrow_tail[i].ids;
      var preid = -1,
        pid = -1;
      var paths = [];
      for (var j = 0; j < ids.length; j = j + 4) {
        if (ids[j] < startId) continue;
        if (ids[j] > endId) break;
        pid = ids[j];
        paths.push(pathss[j]);
        paths.push(pathss[j + 1]);
        paths.push(pathss[j + 2]);
        paths.push(pathss[j + 3]);
        if (preid != -1 && preid != pid) {
          var color;
          if (islected) {
            color = PDB.tool.getColorByIndex(preid, 'main');
          } else {
            color = new THREE.Color('#CCC');
          }
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
          paths = [];
          paths.push(pathss[j]);
          paths.push(pathss[j + 1]);
          paths.push(pathss[j + 2]);
          paths.push(pathss[j + 3]);
        } else if (preid != -1 && j == ids.length - 4) {
          var color;
          if (islected) {
            color = PDB.tool.getColorByIndex(preid, 'main');
          } else {
            color = new THREE.Color('#CCC');
          }
          var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
          var groupindex = "chain_" + atom.chainname;
          PDB.drawer.drawArrowByPaths(groupindex, paths, color, [preid]);
        }
        preid = ids[j];
      }
    }
    // PDB.drawer.drawArrowByPaths(PDB.GROUP_MAIN,PDB.cartoonSheetArray.head);
    // PDB.drawer.drawArrowByPaths(PDB.GROUP_MAIN,PDB.cartoonSheetArray.tail);

  },
  showDNABond: function(chainId, resid, sel) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var color = new THREE.Color('#CCC');
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var bbond = resobj.dnaStick;
    var radius = PDB.CONFIG.tube_radius;
    if (bbond && bbond[0].length == 2) {
      var startAtom = PDB.tool.getMainAtom(PDB.pdbId, bbond[0][0].id);
      startAtom.pos_centered = bbond[0][0].xyz;
      var endAtom = PDB.tool.getMainAtom(PDB.pdbId, bbond[0][1].id);
      endAtom.pos_centered = bbond[0][1].xyz;
      // PDB.drawer.drawSphere("chain_"+startAtom.chainname, bbond[0][0].xyz, sel?startAtom.color:color, radius, startAtom);
      var midp = PDB.tool.midPoint(bbond[0][0].xyz, bbond[0][1].xyz);
      PDB.drawer.drawStick("chain_" + startAtom.chainname, bbond[0][0].xyz, midp, sel ? startAtom.color : color, radius, startAtom);
      PDB.drawer.drawStick("chain_" + endAtom.chainname, midp, bbond[0][1].xyz, sel ? endAtom.color : color, radius, endAtom);
      PDB.drawer.drawSphere("chain_" + endAtom.chainname, bbond[0][1].xyz, sel ? endAtom.color : color, radius, endAtom, addgroup, w);
    }

  },
  showRibbon_Arrow: function(chainId, resid, sel, showLow, isshow) {
    showLow = (showLow == undefined ? false : showLow);
    isshow = (isshow == undefined ? true : isshow);
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    var linkData = w3m.mol[PDB.pdbId].linkData;
    if (linkData && linkData[chainId] && linkData[chainId][resid]) {
      PDB.painter.showLinksByResdue(chainId, resid, sel, showLow, isshow);
    }
    var arrow = resobj.arrow;
    if (arrow.length == 0) return;
    var color = new THREE.Color('#CCC');
    var preresobj = w3m.mol[PDB.pdbId].residueData[chainId][resid - 1];
    if (preresobj != undefined && preresobj.arrow != undefined && preresobj.arrow.length > 0) {
      arrow = [preresobj.arrow[preresobj.arrow.length - 1]].concat(arrow);
      arrow = [preresobj.arrow[preresobj.arrow.length - 2]].concat(arrow);
      arrow = [preresobj.arrow[preresobj.arrow.length - 3]].concat(arrow);
      arrow = [preresobj.arrow[preresobj.arrow.length - 4]].concat(arrow);
    }
    var atom = PDB.tool.getMainAtom(PDB.pdbId, resobj.caid);
    var groupindex = "chain_" + atom.chainname + (showLow ? '_low' : '');
    PDB.drawer.drawArrowByPaths(groupindex, arrow, sel ? atom.color : color, [resobj.caid]);
    PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = isshow;
  },
  showCartoon_SSEByResdue: function(chainId, resid, sel, showLow, isshow) {
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];
    //HELIX : 150, HELIX_HEAD : 1500, HELIX_BODY : 1501, HELIX_FOOT : 1502,
    // SHEET : 151, SHEET_HEAD : 1510, SHEET_BODY : 1511, SHEET_FOOT : 1512,
    // LOOP  : 152, LOOP_HEAD  : 1520, LOOP_BODY  : 1521, LOOP_FOOT  : 1522,
    // this.showRibbon_Arrow(chainId,resid,sel);
    switch (resobj.sse) {
      case w3m.HELIX_HEAD: //tube-->loop & ellipse
        this.showTubeByResdueHEAD(chainId, resid, sel, showLow, isshow); //
        this.showRibbon_EllipseByResdueFOOT(chainId, resid, sel, showLow, isshow);
        break;
      case w3m.HELIX_BODY: //ellipse-->ellipse
        this.showRibbon_EllipseByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case w3m.HELIX_FOOT: //ellipse-->ellipse & loop
        this.showRibbon_EllipseByResdueHEAD(chainId, resid, sel, showLow, isshow);
        this.showTubeByResdueFOOT(chainId, resid, sel, showLow, isshow);
        break;
      case w3m.SHEET_HEAD: //loop-->tube
        this.showTubeByResdueHEAD(chainId, resid, sel, showLow, isshow); //
        this.showRibbon_Arrow(chainId, resid, sel, showLow, isshow);

        break;
      case w3m.SHEET_BODY: //helix-->ellipse
        this.showRibbon_Arrow(chainId, resid, sel, showLow, isshow);
        break;
      case w3m.SHEET_FOOT: //sheet-->rectangle

        this.showRibbon_Arrow(chainId, resid, sel, showLow, isshow);
        this.showTubeByResdueFOOT(chainId, resid, sel, showLow, isshow);
        break;
      case w3m.LOOP_HEAD: //sheet-->arrow
        this.showTubeByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case w3m.LOOP_BODY: //loop-->tube
        this.showTubeByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case w3m.LOOP_FOOT: //loop-->tube
        this.showTubeByResdue(chainId, resid, sel, showLow, isshow);
        break;
    }
  },
  showSurface0: function() {
    var maxedge = PDB.tool.MaxEdge();
    var offset = PDB.GeoCenterOffset;
    var minx = offset.x + limit.x[0],
      miny = offset.y + limit.y[0],
      minz = offset.z + limit.z[0];
    // if(MarchingCubes=!undefined){
    //     MarchingCubes.reset();
    // }
    // =====Marching Cube for surface =====
    var hue = 0.9,
      saturation = 0.8,
      lightness = 0.9,
      scale = 30,
      resolution = 100;
    // MATERIALS
    var material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x888888,
      shininess: 250
    });
    // MARCHING CUBES
    var MarchingCubes = new THREE.MarchingCubes(resolution, material, true, true);
    MarchingCubes.position.set(0, 0, 0);
    MarchingCubes.scale.set(scale, scale, scale);
    MarchingCubes.isolation = 500;
    MarchingCubes.enableUvs = false;
    MarchingCubes.enableColors = false;

    //updateCubes( effect, time, numBlobs, false, false,false );
    MarchingCubes.material.color.setHSL(hue, saturation, lightness);
    // =======================================
    // fill the field with some metaballs
    var i, ballx, bally, ballz, subtract, strength;

    for (var i in w3m.mol) {
      var main_obj = w3m.mol[i].atom.main;
      numblobs = main_obj.length;
      subtract = 12;
      strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
      for (var i_atom in main_obj) {
        var atom = PDB.tool.getMainAtom(i, i_atom);
        //PDB.drawer.drawDot(PDB.GROUP_MAIN, atom.pos_centered, atom.color);
        var xyz = atom.pos_centered;
        //strength = 18;
        //for ( i = 0; i < numblobs; i ++ ) {
        //ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
        //bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
        //ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;
        var ballx = (xyz.x - minx) / maxedge;
        var bally = (xyz.y - miny) / maxedge;
        var ballz = (xyz.z - minz) / maxedge;
        ballx = ballx * 0.85 + 0.1;
        bally = bally * 0.85 + 0.1;
        ballz = ballz * 0.85 + 0.1;
        //console.log(ballx+" "+bally+" "+ballz);
        MarchingCubes.addBall(ballx, bally, ballz, strength, subtract);
      }
    }
    PDB.GROUP[PDB.GROUP_MAIN].add(MarchingCubes);
    PDB.GROUP[PDB.GROUP_HET].visible = false;
  },
  showSurface1: function() {
    var maxedge = PDB.tool.MaxEdge();
    var offset = PDB.GeoCenterOffset;
    var minx = offset.x + limit.x[0],
      miny = offset.y + limit.y[0],
      minz = offset.z + limit.z[0];
    var maxx = offset.x + limit.x[1],
      maxy = offset.y + limit.y[1],
      maxz = offset.z + limit.z[1];
    // MATERIALS
    var material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x888888,
      shininess: 250
    });
    // MARCHING CUBES
    var atoms = {};
    for (var i in w3m.mol) {
      var main_obj = w3m.mol[i].atom.main;
      numblobs = main_obj.length;
      subtract = 12;
      strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
      for (var i_atom in main_obj) {
        var atom = PDB.tool.getMainAtom(i, i_atom);
        //PDB.drawer.drawDot(PDB.GROUP_MAIN, atom.pos_centered, atom.color);
        var xyz = atom.pos_centered;
        var atomSu = {
          coord: xyz,
          name: atom.name,
          serial: atom.id,
          elem: atom.type,
          resn: atom.resname,
          resi: atom.resid,
          color: atom.color
        };
        atoms[atom.id] = atomSu;
      }
    }
    console.log(atoms.length);
    //====================================
    var ps = ProteinSurface({
      min: {
        x: minx,
        y: miny,
        z: minz
      },
      max: {
        x: maxx,
        y: maxy,
        z: maxz
      },
      atoms: atoms,
      type: PDB.SURFACE_TYPE
    });
    var verts = ps.verts;
    var faces = ps.faces;
    var geo = new THREE.Geometry();
    geo.vertices = verts.map(function(v) {
      var r = new THREE.Vector3(v.x, v.y, v.z);
      r.atomid = v.atomid;
      return r;
    });
    geo.faces = faces.map(function(f) {
      return new THREE.Face3(f.a, f.b, f.c);
    });
    geo.computeFaceNormals();
    geo.computeVertexNormals(false);
    //this.surfaces[type] = geo;

    var geoc = geo.clone(); // A clone is necessary because the state of the geometry object will be changed.
    geoc.faces.forEach(function(f) {
      f.vertexColors = ['a', 'b', 'c'].map(function(d) {
        return atoms[geo.vertices[f[d]].atomid].color;
      });
    });
    var mesh = new THREE.Mesh(geoc, new THREE.MeshLambertMaterial({
      vertexColors: THREE.VertexColors,
      wireframe: PDB.SURFACE_WIREFRAME,
      opacity: PDB.SURFACE_OPACITY,
      transparent: true
    }));
    PDB.GROUP[PDB.GROUP_SURFACE].add(mesh);
  },
  showSurface: function(startId, endId, isSelected) {

    startId = PDB.tool.getValue(startId, 1);
    endId = PDB.tool.getValue(endId, w3m.mol[PDB.pdbId].atom.main.length);
    isSelected = PDB.tool.getValue(isSelected, true);
    var maxedge = PDB.tool.MaxEdge();
    var offset = PDB.GeoCenterOffset;
    var minx = offset.x + limit.x[0],
      miny = offset.y + limit.y[0],
      minz = offset.z + limit.z[0];
    var maxx = offset.x + limit.x[1],
      maxy = offset.y + limit.y[1],
      maxz = offset.z + limit.z[1];

    var atoms = {};
    for (var i in w3m.mol) {
      var main_obj = w3m.mol[i].atom.main;
      numblobs = main_obj.length;
      subtract = 12;
      strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
      for (var i_atom in main_obj) {
        var index = parseInt(i_atom);
        if (index < startId) continue;
        if (index > endId) break;
        var atom = PDB.tool.getMainAtom(i, i_atom);
        var xyz = atom.pos_centered;
        var color;
        if (isSelected) {
          color = atom.color;
        } else {
          color = new THREE.Color('#CCC');
        }
        var atomSu = {
          coord: xyz,
          name: atom.name,
          serial: atom.id,
          elem: atom.type,
          resn: atom.resname,
          resi: atom.resid,
          color: color
        };
        atoms[atom.id] = atomSu;
      }
    }
    //console.log(Object.keys(atoms).length);
    //====================================
    var ps = ProteinSurface({
      min: {
        x: minx,
        y: miny,
        z: minz
      },
      max: {
        x: maxx,
        y: maxy,
        z: maxz
      },
      atoms: atoms,
      type: PDB.SURFACE_TYPE,
    });
    var verts = ps.verts;
    var faces = ps.faces;
    var geo = new THREE.Geometry();
    geo.vertices = verts.map(function(v) {
      var r = new THREE.Vector3(v.x, v.y, v.z);
      r.atomid = v.atomid;
      return r;
    });
    geo.faces = faces.map(function(f) {
      return new THREE.Face3(f.a, f.b, f.c);
    });
    geo.computeFaceNormals();
    geo.computeVertexNormals(false);
    //this.surfaces[type] = geo;

    var geoc = geo.clone(); // A clone is necessary because the state of the geometry object will be changed.
    geoc.faces.forEach(function(f) {
      f.vertexColors = ['a', 'b', 'c'].map(function(d) {
        return atoms[geo.vertices[f[d]].atomid].color;
      });
    });
    var mesh = new THREE.Mesh(geoc, new THREE.MeshPhongMaterial({
      vertexColors: THREE.VertexColors,
      wireframe: PDB.SURFACE_WIREFRAME,
      opacity: PDB.SURFACE_OPACITY,
      transparent: true,
      specular: 0x888888,
      shininess: 250
    }));
    PDB.GROUP[PDB.GROUP_SURFACE].add(mesh);
    PDB.GROUP[PDB.GROUP_SURFACE].visible = true;
  },
  showSurfaceByResdue: function(chainId, resid, sel) {
    var resobj = w3m.mol[PDB.pdbId].residueData[chainId][resid];

    isSelected = PDB.tool.getValue(sel, true);
    var maxedge = PDB.tool.MaxEdge();
    var offset = PDB.GeoCenterOffset;
    var minx = offset.x + limit.x[0],
      miny = offset.y + limit.y[0],
      minz = offset.z + limit.z[0];
    var maxx = offset.x + limit.x[1],
      maxy = offset.y + limit.y[1],
      maxz = offset.z + limit.z[1];
    // MATERIALS
    var material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x888888,
      shininess: 250
    });
    // MARCHING CUBES
    var atoms = {};
    for (var i in w3m.mol) {
      var main_obj = w3m.mol[i].atom.main;
      numblobs = main_obj.length;
      subtract = 12;
      strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
      for (var i_atom = resobj.faid; i_atom <= resobj.laid; i_atom++) {
        var index = parseInt(i_atom);

        var atom = PDB.tool.getMainAtom(i, i_atom);
        var xyz = atom.pos_centered;
        var color;
        if (isSelected) {
          color = atom.color;
        } else {
          color = new THREE.Color('#CCC');
        }
        var atomSu = {
          coord: xyz,
          name: atom.name,
          serial: atom.id,
          elem: atom.type,
          resn: atom.resname,
          resi: atom.resid,
          color: color
        };
        atoms[atom.id] = atomSu;
      }
    }
    console.log(Object.keys(atoms).length);
    //====================================
    var ps = ProteinSurface({
      min: {
        x: minx,
        y: miny,
        z: minz
      },
      max: {
        x: maxx,
        y: maxy,
        z: maxz
      },
      atoms: atoms,
      type: PDB.SURFACE_TYPE
    });
    var verts = ps.verts;
    var faces = ps.faces;
    var geo = new THREE.Geometry();
    geo.vertices = verts.map(function(v) {
      var r = new THREE.Vector3(v.x, v.y, v.z);
      r.atomid = v.atomid;
      return r;
    });
    geo.faces = faces.map(function(f) {
      return new THREE.Face3(f.a, f.b, f.c);
    });
    geo.computeFaceNormals();
    geo.computeVertexNormals(false);
    //this.surfaces[type] = geo;

    var geoc = geo.clone(); // A clone is necessary because the state of the geometry object will be changed.
    geoc.faces.forEach(function(f) {
      f.vertexColors = ['a', 'b', 'c'].map(function(d) {
        return atoms[geo.vertices[f[d]].atomid].color;
      });
    });
    var mesh = new THREE.Mesh(geoc, new THREE.MeshLambertMaterial({
      vertexColors: THREE.VertexColors,
      wireframe: PDB.SURFACE_WIREFRAME,
      opacity: PDB.SURFACE_OPACITY,
      transparent: true,
    }));
    PDB.GROUP[PDB.GROUP_SURFACE].add(mesh);
    PDB.GROUP[PDB.GROUP_SURFACE].visible = true;
  },
  showWater: function() {
    var addgroup;
    var w = PDB.CONFIG.water_sphere_w;
    if (PDB.isShowWater && (PDB.GROUP[PDB.GROUP_WATER] === undefined || PDB.GROUP[PDB.GROUP_WATER].children.length == 0)) {
      var data_obj = [];
      for (var i in w3m.mol) {
        var main_obj = w3m.mol[i].single;
        for (var i_atom in main_obj) {
          var atom = PDB.tool.getHetAtom(i, i_atom);
          if (atom.resname === "hoh") {
            PDB.drawer.drawSphere(PDB.GROUP_WATER, atom.pos_centered, atom.color, 0.1 * atom.radius, atom, addgroup, w);
          }
        }
      }
    } else if (!PDB.isShowWater) {
      PDB.render.clearGroupIndex(PDB.GROUP_WATER);
    }
  },
  showRes_Line: function(molId) {
    var groupindex = PDB.GROUP_ONE_RES;
    var resobj = w3m.mol[molId].residueData['a'][1];
    atomIdArray = resobj.lines;
    for (var t = 0; t < atomIdArray.length; t++) {
      var startAtom = PDB.tool.getMainAtom(molId, atomIdArray[t][0]);
      var atom = PDB.tool.getMainAtom(molId, atomIdArray[t][1]);
      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      PDB.drawer.drawOneResLine(groupindex, resobj.caid, startAtom.pos_centered, midp, startAtom.color, startAtom);
      PDB.drawer.drawOneResLine(groupindex, resobj.caid, midp, atom.pos_centered, atom.color, atom);
      //geometry.vertices.push(start,end);
    }
  },
  showHet_Line: function(molId, isdocking) {
    this.showWater();
    var group = PDB.GROUP_HET;
    if (w3m.mol[molId].drug) {
      group = PDB.GROUP_DRUG;
    }
    if (isdocking && isdocking == true) {
      group = PDB.GROUP_DOCKING;
    }
    for (var i in w3m.mol[molId].connect) {
      for (j in w3m.mol[molId].connect[i]) {
        var startAtom = PDB.tool.getHetAtom(molId, i);
        if (startAtom == undefined) {
          startAtom = PDB.tool.getMainAtom(molId, i);
        }
        var atom = PDB.tool.getHetAtom(molId, w3m.mol[molId].connect[i][j]);
        if (atom == undefined) {
          atom = PDB.tool.getMainAtom(molId, i);
        }
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        PDB.drawer.drawLine(group, startAtom.pos_centered, midp, startAtom.color);
        PDB.drawer.drawLine(group, midp, atom.pos_centered, atom.color);
      }
    }
  },

  showHet_Sphere: function(molId, isdocking) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    this.showWater();
    var group = PDB.GROUP_HET;
    if (w3m.mol[molId].drug) {
      group = PDB.GROUP_DRUG;
    }
    if (isdocking && isdocking == true) {
      group = PDB.GROUP_DOCKING;
    }
    var main_obj = w3m.mol[molId].atom.het;
    for (var i_atom in main_obj) {
      var atom = PDB.tool.getHetAtom(molId, i_atom);
      if (atom == undefined) {
        atom = PDB.tool.getMainAtom(molId, i_atom);
      }
      atom.caid = atom.id;
      if (atom.resname !== "hoh") {
        PDB.drawer.drawSphere(PDB.GROUP_HET, atom.pos_centered, atom.color, 0.9 * atom.radius, atom, addgroup, w);
      }
    }
  },
  showHet_Stick: function(molId, isdocking) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    this.showWater();
    var radius = 0.2;
    var history = {};
    var group = PDB.GROUP_HET;
    if (w3m.mol[molId].drug) {
      group = PDB.GROUP_DRUG;
    }
    if (isdocking && isdocking == true) {
      group = PDB.GROUP_DOCKING;
    }
    for (var i in w3m.mol[molId].connect) {
      for (j in w3m.mol[molId].connect[i]) {
        var startAtom = PDB.tool.getHetAtom(molId, i);
        if (startAtom == undefined) {
          startAtom = PDB.tool.getMainAtom(molId, i);
        }
        var atom = PDB.tool.getHetAtom(molId, w3m.mol[molId].connect[i][j]);
        if (atom == undefined) {
          atom = PDB.tool.getMainAtom(molId, i);
        }
        atom.caid = atom.id;
        if (history[startAtom.id] == undefined) {
          PDB.drawer.drawSphere(group, startAtom.pos_centered, startAtom.color, radius + 0.001, startAtom, addgroup, w);
          history[startAtom.id] = 1;
        }
        if (history[atom.id] == undefined) {
          PDB.drawer.drawSphere(group, atom.pos_centered, atom.color, radius + 0.001, atom, addgroup, w);
          history[atom.id] = 1;
        }
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        PDB.drawer.drawStick(group, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
        PDB.drawer.drawStick(group, midp, atom.pos_centered, atom.color, radius, atom);
      }
    }
  },

  showRes_Sphere: function(molId) {
    PDB.CONFIG = PDB.CONFIG_HIGH;
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var group = PDB.GROUP_ONE_RES;
    var main_obj = w3m.mol[molId].atom.main;
    for (var i_atom in main_obj) {
      var atom = PDB.tool.getHetAtom(molId, i_atom);
      if (atom == undefined) {
        atom = PDB.tool.getMainAtom(molId, i_atom);
      }
      atom.caid = atom.id;
      if (atom.resname !== "hoh") {
        PDB.drawer.drawSphere(group, atom.pos_centered, atom.color, 0.9 * atom.radius, atom, addgroup, w);
      }
    }
  },
  showRes_Stick: function(molId) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var resobj = w3m.mol[molId].residueData['a'][1];
    var lines = resobj.lines;

    var radius = 0.2;
    var history = {};
    var groupindex = PDB.GROUP_ONE_RES;
    for (var i in lines) {
      var ids = lines[i];
      var startAtom = PDB.tool.getMainAtom(molId, ids[0]);
      var atom = PDB.tool.getMainAtom(molId, ids[1]);
      startAtom.caid = resobj.caid;
      atom.caid = resobj.caid;

      if (history[startAtom.id] === undefined) {
        PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, startAtom.color, radius, startAtom, addgroup, w);
        history[startAtom.id] = 1;
      }
      if (history[atom.id] === undefined) {
        PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, radius, atom, addgroup, w);
        history[atom.id] = 1;
      }
      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      //group, start, end, color, radius, atom, addGroup
      PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
      PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, atom.color, radius, atom);
    }
  },
  showRes_Ball_Rod: function(molId, isdocking) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    var radius = 0.1;
    var resobj = w3m.mol[molId].residueData['a'][1];
    var lines = resobj.lines;
    var history = {};
    var groupindex = PDB.GROUP_ONE_RES
    for (var t = 0; t < lines.length; t++) {
      var ids = lines[t];
      var startAtom = PDB.tool.getMainAtom(molId, ids[0]);

      var atom = PDB.tool.getMainAtom(molId, ids[1]);
      if (!startAtom.caid) {
        startAtom.caid = resobj.caid;
        atom.caid = resobj.caid;
      }
      //var groupindex = "chain_"+atom.chainname+(showLow?'_low':'');
      if (history[startAtom.id] == undefined) {
        PDB.drawer.drawSphere(groupindex, startAtom.pos_centered, startAtom.color, startAtom.radius * 0.2, startAtom, addgroup, w);
        //PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length-1].visible = isshow;
        history[startAtom.id] = 1;
      }
      if (history[atom.id] == undefined) {
        PDB.drawer.drawSphere(groupindex, atom.pos_centered, atom.color, atom.radius * 0.2, atom, addgroup, w);
        //PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length-1].visible = isshow;
        history[atom.id] = 1;
      }
      var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
      PDB.drawer.drawStick(groupindex, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
      //PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length-1].visible = isshow;
      PDB.drawer.drawStick(groupindex, midp, atom.pos_centered, atom.color, radius, atom);
      //PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length-1].visible = isshow;
    }
  },
  showHet_Ball_Rod: function(molId, isdocking) {
    var addgroup;
    var w = PDB.CONFIG.stick_sphere_w;
    this.showWater();
    var radius = 0.1;
    var history = {};
    var group = PDB.GROUP_HET;
    if (w3m.mol[molId].drug) {
      group = PDB.GROUP_DRUG;
    }
    if (isdocking && isdocking == true) {
      group = PDB.GROUP_DOCKING;
    }
    for (var i in w3m.mol[molId].connect) {
      for (j in w3m.mol[molId].connect[i]) {
        var startAtom = PDB.tool.getHetAtom(molId, i);
        if (startAtom == undefined) {
          startAtom = PDB.tool.getMainAtom(molId, i);
        }
        var atom = PDB.tool.getHetAtom(molId, w3m.mol[molId].connect[i][j]);
        if (atom == undefined) {
          atom = PDB.tool.getMainAtom(molId, i);
        }
        atom.caid = atom.id;
        if (startAtom == undefined) {
          continue;
        }
        if (history[startAtom.id] == undefined) {
          PDB.drawer.drawSphere(group, startAtom.pos_centered, startAtom.color, startAtom.radius * 0.2, startAtom, addgroup, w);
          history[startAtom.id] = 1;
        } else if (history[atom.id] == undefined) {
          PDB.drawer.drawSphere(group, atom.pos_centered, atom.color, atom.radius * 0.2, atom, addgroup, w);
          history[atom.id] = 1;
        } else {
          //console.log("showHet_Stick: duplicate stick...atom.id:"+ atom.id);
        }
        var midp = PDB.tool.midPoint(startAtom.pos_centered, atom.pos_centered);
        PDB.drawer.drawStick(group, startAtom.pos_centered, midp, startAtom.color, radius, startAtom);
        PDB.drawer.drawStick(group, midp, atom.pos_centered, atom.color, radius, atom);
      }
    }
    for (var i in w3m.mol[molId].connect) {
      for (j in w3m.mol[molId].connect[i]) {
        var atom = PDB.tool.getHetAtom(molId, w3m.mol[molId].connect[i][j]);
        if (atom.id && !history[atom.id]) {
          PDB.drawer.drawSphere(group, atom.pos_centered, atom.color, atom.radius * 0.2, atom, addgroup, w);
        }
      }
    }
  },
  showLabel: function(labeltype) {
    console.log("show label");
    var color = 0xffffff;
    switch (labeltype) {
      case PDB.LABEL_ATOM_NAME:
        var main_obj = w3m.mol[PDB.pdbId].atom.main;
        for (var i_atom in main_obj) {
          var atom = PDB.tool.getMainAtom(PDB.pdbId, i_atom);
          PDB.drawer.drawLabel(PDB.GROUP_LABEL, atom.pos_centered, atom.color, atom.name);
        }
        var het_obj = w3m.mol[PDB.pdbId].atom.het;
        for (var i_atom in het_obj) {
          var atom = PDB.tool.getMainAtom(PDB.pdbId, i_atom);
          PDB.drawer.drawLabel(PDB.GROUP_LABEL, atom.pos_centered, atom.color, atom.name);
        }
        break;
      case PDB.LABEL_RESIDUE_NAME:
        var main_obj = w3m.mol[PDB.pdbId].atom.main;
        for (var i_atom in main_obj) {
          var atom = PDB.tool.getMainAtom(PDB.pdbId, i_atom);
          if (atom.name == "ca") {
            PDB.drawer.drawLabel(PDB.GROUP_LABEL, atom.pos_centered, atom.color, atom.resname);
            //break;
          }
        }
        break;
      case PDB.LABEL_CHAIN_ID:
        var main_obj = w3m.mol[PDB.pdbId].chain;
        for (var chain in main_obj) {
          var atomid = w3m.mol[PDB.pdbId].tree.main[chain][1]["n"];
          var atom = PDB.tool.getMainAtom(PDB.pdbId, atomid);
          PDB.drawer.drawLabel(PDB.GROUP_LABEL, atom.pos_centered, atom.color, chain.toUpperCase());
        }
        break;
    }
  },
  showDistance: function(locationStart, locationEnd) {
    // PDB.render.clearGroupIndex(PDB.GROUP_INFO);
    var startPos = {
      x: locationStart.pos_curr.x - PDB.rotateAxis.x,
      y: locationStart.pos_curr.y - PDB.rotateAxis.y,
      z: locationStart.pos_curr.z - PDB.rotateAxis.z,
    }

    startPos = new THREE.Vector3(startPos.x, startPos.y, startPos.z);
    // console.log(locationStart);
    // console.log(startPos);
    var axis = new THREE.Vector3(1, 0, 0);
    startPos = PDB.tool.rotateAboutWorldAxis(startPos, axis, -PDB.rotateAxisAngle.x);
    axis = new THREE.Vector3(0, 1, 0);
    startPos = PDB.tool.rotateAboutWorldAxis(startPos, axis, -PDB.rotateAxisAngle.y);
    axis = new THREE.Vector3(0, 0, 1);
    startPos = PDB.tool.rotateAboutWorldAxis(startPos, axis, -PDB.rotateAxisAngle.z);
    var endPos = {
      x: locationEnd.pos_curr.x - PDB.rotateAxis.x,
      y: locationEnd.pos_curr.y - PDB.rotateAxis.y,
      z: locationEnd.pos_curr.z - PDB.rotateAxis.z,
    }
    endPos = new THREE.Vector3(endPos.x, endPos.y, endPos.z);
    // console.log(locationEnd);
    // console.log(endPos);
    axis = new THREE.Vector3(1, 0, 0);
    endPos = PDB.tool.rotateAboutWorldAxis(endPos, axis, -PDB.rotateAxisAngle.x);
    axis = new THREE.Vector3(0, 1, 0);
    endPos = PDB.tool.rotateAboutWorldAxis(endPos, axis, -PDB.rotateAxisAngle.y);
    axis = new THREE.Vector3(0, 0, 1);
    endPos = PDB.tool.rotateAboutWorldAxis(endPos, axis, -PDB.rotateAxisAngle.z);

    var distance = locationStart.pos_curr.distanceTo(locationEnd.pos_curr);
    var message = Number(distance).toFixed(2) + "A";
    var color = new THREE.Color(0.5, 0.5, 0.5);
    PDB.drawer.drawLine(PDB.GROUP_MAIN, startPos,
      endPos, color);
	if(PDB.trigger === PDB.TRIGGER_EVENT_DISTANCE){
		 if (PDB.mode === PDB.MODE_VR || PDB.mode === PDB.MODE_TRAVEL_VR) {
			PDB.drawer.drawTextForDistance(PDB.GROUP_MAIN, PDB.tool.midPoint(startPos, endPos),
				message, "", locationStart.color, 180);
		}else{
			PDB.tool.showInfoMeaPanel(true,message);
			PDB.drawer.drawTextForDistanceByDesktop(PDB.GROUP_MAIN, PDB.tool.midPoint(startPos, endPos),
				message, "", locationStart.color, 180);
		}
	}  
   
	
    // PDB.drawer.drawTextForDistance(PDB.GROUP_MAIN, PDB.tool.midPoint(startPos, endPos),
    //   message, "", locationStart.color, 180);
  },
  showSegmentByStartEnd: function(startId, endId, selectMode, selectedRadius) {
    var isShowNonTube = false;
    var isShowNonTube_unselect = false;
    var unselectMode = "";
    var unSelectedRadius = PDB.CONFIG.tube_radius;
    switch (PDB.config.mainMode) {
      case PDB.CARTOON_SSE:
        unselectMode = "SSE";
        break;
      case PDB.LINE:
        unselectMode = "Line";
        break;
      case PDB.DOT:
        unselectMode = "Dot";
        break;
      case PDB.BALL_AND_ROD:
        unselectMode = "BallRod";
        break;
      case PDB.STICK:
        unselectMode = "Sticks";
        break;
      case PDB.SPHERE:
        unselectMode = "Sphere";
        break;
      case PDB.TUBE:
        unselectMode = "Tube";
        unSelectedRadius = PDB.CONFIG.tube_radius;
        break;
      case PDB.RIBBON_FLAT:
        unselectMode = "Flat";
        unSelectedRadius = 0;
        break;
      case PDB.RIBBON_ELLIPSE:
        unselectMode = "Ellipse";
        unSelectedRadius = PDB.CONFIG.ellipse_radius;
        break;
      case PDB.RIBBON_RECTANGLE:
        unselectMode = "Rectangle";
        unSelectedRadius = 0;
        break;
      case PDB.RIBBON_STRIP:
        unselectMode = "Strip";
        unSelectedRadius = PDB.CONFIG.strip_radius;
        break;
      case PDB.RIBBON_RAILWAY:
        unselectMode = "Railway";
        unSelectedRadius = PDB.CONFIG.railway_radius;
        break;
      default:
        unselectMode = "Tube";
    }
    var defaultNoneSelectedColor = new THREE.Color('#CCC');
    for (var i in PDB.cubeData.path) {
      var path = PDB.cubeData.path[i];
      var ids = PDB.cubeData.ids[i];
      var preid = -1,
        pid = -1;
      var temppath = [],
        tempbinormal = [],
        tempnormal = [],
        temptangent = [];
      var hasids = [];
      for (var j in ids) {
        pid = ids[j];
        temppath.push(path[j]);
        tempbinormal.push(PDB.cubeData.binormals[i][j]);
        tempnormal.push(PDB.cubeData.normals[i][j]);
        temptangent.push(PDB.cubeData.tangents[i][j]);
        if (pid != preid || j == ids.length - 1) {
          if (j != 0) {
            var atom = PDB.tool.getMainAtom(PDB.pdbId, preid);
            var groupindex = "chain_" + atom.chainname;
            // var color1 = {};
            var obj = {
              binormals: tempbinormal,
              normals: tempnormal,
              tangents: temptangent
            };
            if (preid >= startId && preid <= endId) {

              if (selectMode === "Sphere") {
                if (!isShowNonTube) {
                  PDB.painter.showSphereByStartEnd(startId, endId, true);
                  isShowNonTube = true;
                }

              } else if (selectMode === "Sticks") {
                if (!isShowNonTube) {
                  PDB.painter.showSticksByStartEnd(startId, endId, true);
                  isShowNonTube = true;
                }

              } else if (selectMode === "BallRod") {
                if (!isShowNonTube) {
                  PDB.painter.showBallRodByStartEnd(startId, endId, true);
                  isShowNonTube = true;
                }

              } else if (selectMode === "Line") {
                if (!isShowNonTube) {
                  PDB.painter.showLineByStartEnd(startId, endId, true);
                  isShowNonTube = true;
                }

              } else if (selectMode === "Dot") {
                if (!isShowNonTube) {
                  PDB.painter.showDotByStartEnd(startId, endId, true);
                  isShowNonTube = true;
                }

              } else if (selectMode === "Backbone") {
                if (!isShowNonTube) {
                  PDB.painter.showBackboneByStartEnd(startId, endId, true);
                  isShowNonTube = true;
                }
              } else if (selectMode === "SSE") {
                if (!isShowNonTube) {
                  PDB.painter.showCartoon_SSEByStartEnd(startId, endId, true);
                  isShowNonTube = true;
                }
              } else {
                color = PDB.tool.getColorByIndex(preid, 'main');
                PDB.drawer['draw' + selectMode](groupindex, temppath, color, selectedRadius, obj, temppath.length - 1, [preid]);
              }

            } else {
              color = defaultNoneSelectedColor;
              if (unselectMode === "Sphere") {
                if (!isShowNonTube_unselect) {
                  PDB.painter.showSphereByStartEnd(1, startId, false);
                  var theEndId = PDB.cubeData.ids[endId, PDB.cubeData.ids.length - 1];
                  theEndId = theEndId[theEndId.length - 1];
                  PDB.painter.showSphereByStartEnd(endId, theEndId, false);
                  isShowNonTube_unselect = true;
                }
              } else if (unselectMode === "Sticks") {
                if (!isShowNonTube_unselect) {
                  PDB.painter.showSticksByStartEnd(1, startId, false);
                  var theEndId = PDB.cubeData.ids[endId, PDB.cubeData.ids.length - 1];
                  theEndId = theEndId[theEndId.length - 1];
                  PDB.painter.showSticksByStartEnd(endId, theEndId, false);
                  isShowNonTube_unselect = true;
                }
              } else if (unselectMode === "BallRod") {
                if (!isShowNonTube_unselect) {
                  PDB.painter.showBallRodByStartEnd(1, startId, false);
                  var theEndId = PDB.cubeData.ids[endId, PDB.cubeData.ids.length - 1];
                  theEndId = theEndId[theEndId.length - 1];
                  PDB.painter.showBallRodByStartEnd(endId, theEndId, false);
                  isShowNonTube_unselect = true;
                }

              } else if (unselectMode === "Line") {
                if (!isShowNonTube_unselect) {
                  PDB.painter.showLineByStartEnd(1, startId, false);
                  var theEndId = PDB.cubeData.ids[endId, PDB.cubeData.ids.length - 1];
                  theEndId = theEndId[theEndId.length - 1];
                  PDB.painter.showLineByStartEnd(endId, theEndId, false);
                  isShowNonTube_unselect = true;
                }

              } else if (unselectMode === "Dot") {
                if (!isShowNonTube_unselect) {
                  PDB.painter.showDotByStartEnd(1, startId, false);
                  var theEndId = PDB.cubeData.ids[endId, PDB.cubeData.ids.length - 1];
                  theEndId = theEndId[theEndId.length - 1];
                  PDB.painter.showDotByStartEnd(endId, theEndId, false);
                  isShowNonTube_unselect = true;
                }

              } else if (unselectMode === "Backbone") {
                if (!isShowNonTube_unselect) {
                  PDB.painter.showBackboneByStartEnd(1, startId, false);
                  var theEndId = PDB.cubeData.ids[endId, PDB.cubeData.ids.length - 1];
                  theEndId = theEndId[theEndId.length - 1];
                  PDB.painter.showBackboneByStartEnd(endId, theEndId, false);
                  isShowNonTube_unselect = true;
                }
              } else if (unselectMode === "SSE") {
                if (!isShowNonTube_unselect) {
                  PDB.painter.showCartoon_SSEByStartEnd(1, startId, false);
                  var theEndId = PDB.cubeData.ids[PDB.cubeData.ids.length - 1];
                  theEndId = theEndId[theEndId.length - 1];
                  PDB.painter.showCartoon_SSEByStartEnd(endId, theEndId, false);
                  isShowNonTube_unselect = true;
                }
              } else {
                PDB.drawer['draw' + unselectMode](groupindex, temppath, color, unSelectedRadius, obj, temppath.length - 1, [preid]);
              }
            }
            temppath = [], tempbinormal = [], tempnormal = [], temptangent = [];
            if ((unselectMode == 'Tube' && (preid < startId || preid > endId)) || (selectMode == 'Tube' && (preid >= startId && preid <= endId))) {

              temppath.push(path[j - 1]);
              tempbinormal.push(PDB.cubeData.binormals[i][j - 1]);
              tempnormal.push(PDB.cubeData.normals[i][j - 1]);
              temptangent.push(PDB.cubeData.tangents[i][j - 1]);
            }
            temppath.push(path[j]);
            tempbinormal.push(PDB.cubeData.binormals[i][j]);
            tempnormal.push(PDB.cubeData.normals[i][j]);
            temptangent.push(PDB.cubeData.tangents[i][j]);
          }
        }
        preid = ids[j];
      }
    }
  },
  showMapSolid: function(emmap, threshold) {
	if(emmap.header&&emmap.header.NZ){
		var scale = chroma.scale(['green', 'red']);
		for (var i = 0; i < emmap.header.NZ; i = i + PDB.map_step) {
		  for (var j = 0; j < emmap.header.NY; j = j + PDB.map_step) {
			for (var k = 0; k < emmap.header.NX; k = k + PDB.map_step) {
			  var v = emmap.data[i][j][k];
			  if (v > threshold) {
				var p = new THREE.Vector3(i, j, k) ;
				p = p.add(emmap.header.offset);

				var per = (v - threshold) / (1.0 * (emmap.header.max - threshold));
				var color = scale(per).hex();
				PDB.drawer.drawDot(PDB.GROUP_MAP, p, color);
			  }
			}
		  }
		}
		var newScale = emmap.header.voxelsize; // new THREE.Vector3(emmap.header.a / emmap.header.NX, emmap.header.b / emmap.header.NY, emmap.header.c / emmap.header.NZ);

		//PDB.GROUP[PDB.GROUP_MAP].position.applyMatrix4(emmap.header.matrix);
		// PDB.GROUP[PDB.GROUP_MAP].scale.set(newScale.x, newScale.y, newScale.z);
    // PDB scene offset
    // PDB.GROUP[PDB.GROUP_MAP].rotation.set(Math.PI/2, 0, 0)]

    // var cur_matrix4d = new THREE.Matrix4().identity().makeScale(newScale.x, newScale.y, newScale.y).makeRotationX(Math.PI / 4).makeRotationY(Math.PI / 4).makeRotationZ(Math.PI / 4).makeTranslation(PDB.GeoCenterOffset.x, PDB.GeoCenterOffset.y, PDB.GeoCenterOffset.z);
    // PDB.GROUP[PDB.GROUP_MAP].applyMatrix(cur_matrix4d);

    // PDB.GROUP[PDB.GROUP_MAP].position.copy(PDB.GeoCenterOffset);
    // console.log(PDB.GeoCenterOffset);
    
		// PDB.GROUP[PDB.GROUP_MAP].position.copy(new THREE.Vector3(emmap.header.x,emmap.header.y,emmap.header.z));
	}
    
  },
  // point material
  showMapSolid00000: function(emmap, threshold) {
    console.log("map: " + new Date() + " Prepare color and position! threshold:" + threshold);
    var scale = chroma.scale(['green', 'red']);
    var positions = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ * 3);
    var colors    = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ * 3);
    var alphas    = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ);
    var color = new THREE.Color();
    color = new THREE.Color("#567856");
    var color1 = new THREE.Color("#ffffff");
    for (var i = 0; i < emmap.header.NX; i++) {
      for (var j = 0; j < emmap.header.NY; j++) {
        for (var k = 0; k < emmap.header.NZ; k++) {
          var v = emmap.data[i][j][k];
          var m = i * emmap.header.NZ * emmap.header.NY + j * emmap.header.NZ + k;
          var n = m * 3;
          positions[n] = emmap.center.x + i;
          positions[n + 1] = emmap.center.y + j;
          positions[n + 2] = emmap.center.z + k;
          // var per =(v -threshold)/(1.0*(emmap.header.max-threshold));

          alphas[m] = 1;
          if (v < threshold) {
            color = color1;
            alphas[m] = 0;
          }
          colors[n] = color.r;
          colors[n + 1] = color.g;
          colors[n + 2] = color.b;
        }
      }
    }
    console.log("map: " + new Date() + "  position, color is ready!");
    PDB.drawer.drawMapPoints(PDB.GROUP_MAP, positions, colors, alphas);
  },
  //shader material
  showMapSolid00: function(emmap, threshold) {
    var start = new Date();
    console.log("MapSolid: " + start + " Prepare color and position! threshold:" + threshold);
    var scale = chroma.scale(['green', 'red']);
    var positions = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ * 3);
    var colors    = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ * 3);
    var alphas    = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ);
    var array = [];
    for (var i = 1000; i < 1100; i++) {
      var color = new THREE.Color(w3m.rgb[i][0], w3m.rgb[i][1], w3m.rgb[i][2]);
      array.push(color);
    }
    var color = new THREE.Color("#FFFFFF");
    var di = emmap.header.max - emmap.header.min;
    for (var i = 0; i < emmap.header.NX; i = i + PDB.map_step) {
      for (var j = 0; j < emmap.header.NY; j = j + PDB.map_step) {
        for (var k = 0; k < emmap.header.NZ; k = k + PDB.map_step) {
          var v = emmap.data[i][j][k];
          //var m = i*emmap.header.NS* emmap.header.NR  + j* emmap.header.NS+ k;
          var m = i * emmap.header.NY * emmap.header.NZ + j * emmap.header.NZ + k;

          var n = m * 3;
          positions[n] = emmap.center.x + i;
          positions[n + 1] = emmap.center.y + j;
          positions[n + 2] = emmap.center.z + k;

          alphas[m] = 1;
          if (v <= threshold) {
            alphas[m] = 0;
          }
          var per = Math.floor(((v - emmap.header.min) / (1.0 * di)) * 99);
          color = array[per];
          colors[n] = color.r;
          colors[n + 1] = color.g;
          colors[n + 2] = color.b;
        }
      }
    }
    var end = new Date();
    console.log("MapSolid: " + end + "  position, color is ready!");
    PDB.drawer.drawMapPoints(PDB.GROUP_MAP, positions, colors, alphas, Number(emmap.header.NS));
    console.log("MapSolid time(ms):" + (new Date() - start));
  },
  showMapSolid2: function(emmap, threshold) {
    console.log("map: " + new Date() + " Prepare color and position! threshold:" + threshold);
    var scale = chroma.scale(['green', 'red']);
    var positions = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ * 3);
    var colors    = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ * 3);
    var alphas    = new Float32Array(emmap.header.NX * emmap.header.NY * emmap.header.NZ);
    var color = new THREE.Color();
    color = new THREE.Color("#ffffff");
    for (var i = 0; i < emmap.mapdata.length; i++) {
      var v = emmap.mapdata[i];
      //if(v>threshold){
      //var m = i*emmap.header.NS* emmap.header.NR  + j* emmap.header.NS+ k;
      var n = i * 3;
      positions[n] = emmap.center.x + i;
      positions[n + 1] = emmap.center.y + i;
      positions[n + 2] = emmap.center.z + i;
      //var p= new THREE.Vector3(emmap.center.x+i, emmap.center.y+j, emmap.center.z+k) ;
      // var per =(v -threshold)/(1.0*(emmap.header.max-threshold));
      // var rgb = scale(per).hex();
      color = new THREE.Color(rgb);
      // alphas[i] = 1;
      // if(v<threshold){
      //     color = new THREE.Color("#ffffff");
      //     alphas[i] = 0;
      // }
      //rgb._rgb[0];
      //color.setRGB(rgb._rgb[0],rgb._rgb[1],rgb._rgb[2])
      colors[n] = color.r;
      colors[n + 1] = color.g;
      colors[n + 2] = color.b;
      //}
    }
    console.log("map: " + new Date() + "  position, color is ready!");
    PDB.drawer.drawMapPoints(PDB.GROUP_MAP, positions, colors, alphas);
  },
  //ParticleSystem
  showMapSolid3: function(emmap, threshold) {

    var pm = new THREE.ParticleBasicMaterial();
    pm.map = THREE.ImageUtils.loadTexture(SERVERURL + "/assets/textures/particles/particle.png");
    pm.blending = THREE.AdditiveBlending;
    pm.transparent = true;
    pm.size = 8;
    pm.vertexColors = true;

    var targetGeometry = new THREE.Geometry();
    var ps = new THREE.ParticleSystem(targetGeometry, pm);
    ps.name = 'ps';
    PDB.GROUP[PDB.GROUP_MAIN].add(ps);

    console.log("map: " + new Date() + " Prepare color and position! threshold:" + threshold);
    var scale = chroma.scale(['blue', 'green', 'red']);
    // var positions = new Float32Array( emmap.header.NC *emmap.header.NR* emmap.header.NS * 3 );
    // var colors  = new Float32Array( emmap.header.NC *emmap.header.NR* emmap.header.NS * 3 );
    // var alphas  = new Float32Array( emmap.header.NC *emmap.header.NR* emmap.header.NS  );
    var array = [];
    for (var i = 1000; i < 1100; i++) {
      var color = new THREE.Color(scale((i - 1000) * 0.01).hex());
      //var color = new THREE.Color(w3m.rgb[i][0],w3m.rgb[i][1],w3m.rgb[i][2]);
      array.push(color);
    }
    var color = new THREE.Color("#FFFFFF");
    var di = emmap.header.max - emmap.header.min;
    for (var i = 0; i < emmap.header.NX; i++) {
      for (var j = 0; j < emmap.header.NY; j++) {
        for (var k = 0; k < emmap.header.NZ; k++) {

          var v = emmap.data[i][j][k];
          if (v < threshold) continue;
          var per = Math.floor(((v - emmap.header.min) / (1.0 * di)) * 99);
          color = array[per];

          var m = i * emmap.header.NY * emmap.header.NZ + j * emmap.header.NZ + k;
          var n = m * 3;
          var vec = new THREE.Vector3(emmap.center.x + i, emmap.center.y + j, emmap.center.z + k);
          targetGeometry.vertices.push(vec);
          targetGeometry.colors.push(color);
        }
      }
    }
    console.log("map: " + new Date() + "  position, color is ready!");
    PDB.drawer.drawMapPoints(PDB.GROUP_MAP, positions, colors, alphas, Number(emmap.header.NS));
  },
  //ParticleSystem
  showMapSurface: function(emmap, threshold, wireframe) {
    var start = new Date();
    if(emmap.header&&emmap.header.voxelsize){
      var newScale = emmap.header.voxelsize;
      var wf = PDB.tool.getValue(wireframe, false);
      var offset = PDB.GeoCenterOffset;
      // var minx = emmap.center.x,
      //   miny = emmap.center.y,
      //   minz = emmap.center.z;
      // var maxx = emmap.center.x + emmap.header.NX,
      //   maxy = emmap.center.y + emmap.header.NY,
      //   maxz = emmap.center.z + emmap.header.NZ;
      var minx = emmap.header.offset.x,
        miny = emmap.header.offset.y,
        minz = emmap.header.offset.z;
      var maxx = emmap.header.offset.x + emmap.header.NX,
        maxy = emmap.header.offset.y + emmap.header.NY,
        maxz = emmap.header.offset.z + emmap.header.NZ;
      // MATERIALS
      var material = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x888888,
        shininess: 250
      });
      // MARCHING CUBES
      var atoms = {};
      var color = new THREE.Color("#3366cc");
      var numblobs = 0;
      //var scale = chroma.scale(['green', 'red']);
      //var array = [];
      // for(var i=1000;i< 1100;i++){
      //     var color = new THREE.Color(scale((i-1000)*0.01).hex());
      //     //var color = new THREE.Color(w3m.rgb[i][0],w3m.rgb[i][1],w3m.rgb[i][2]);
      //     array.push(color);
      // }
      var inner_offset = emmap.header.offset;
      // inner_offset.x = inner_offset.x * newScale.x;
      // inner_offset.y = inner_offset.y * newScale.y;
      // inner_offset.z = inner_offset.z * newScale.z;

      var di = emmap.header.max - emmap.header.min;
      for (var i = 0; i < emmap.header.NZ; i = i + PDB.map_step) {
        for (var j = 0; j < emmap.header.NY; j = j + PDB.map_step) {
          for (var k = 0; k < emmap.header.NX; k = k + PDB.map_step) {
            var m = i * emmap.header.NX * emmap.header.NY + j * emmap.header.NX + k;

            var v = emmap.data[i][j][k];
            if (v < threshold) continue;
            numblobs = numblobs + 1;
            var per = Math.floor(((v - emmap.header.min) / (1.0 * di)) * 99);
            //color = array[per];
            var xyz = new THREE.Vector3(i, j, k) ;
            xyz = xyz.add(inner_offset);
            //xyz = xyz.add(PDB.GeoCenterOffset);
            // var vec = new THREE.Vector3(emmap.center.x + i, emmap.center.y + j, emmap.center.z + k);
            // var xyz = vec;
            //var color = array[per];
            var atomSu = {
              coord: xyz,
              name: "c",
              serial: m,
              elem: "c",
              resn: "ala",
              resi: 1,
              color: color
            };
            atoms[m] = atomSu;
          }
        }
      }

      subtract = 12;
      strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

      //====================================
      var ps = ProteinSurface({
        min: {
          x: minx,
          y: miny,
          z: minz
        },
        max: {
          x: maxx,
          y: maxy,
          z: maxz
        },
        atoms: atoms,
        type: PDB.SURFACE_TYPE,
      });
      var verts = ps.verts;
      var faces = ps.faces;
      var geo = new THREE.Geometry();
      geo.vertices = verts.map(function(v) {
        var r = new THREE.Vector3(v.x, v.y, v.z);
        r.atomid = v.atomid;
        return r;
      });
      geo.faces = faces.map(function(f) {
        return new THREE.Face3(f.a, f.b, f.c);
      });
      geo.computeFaceNormals();
      geo.computeVertexNormals(false);
      //this.surfaces[type] = geo;

      var geoc = geo.clone(); // A clone is necessary because the state of the geometry object will be changed.
      geoc.faces.forEach(function(f) {
        f.vertexColors = ['a', 'b', 'c'].map(function(d) {
        return atoms[geo.vertices[f[d]].atomid].color;
        });
      });
      var mesh = new THREE.Mesh(geoc, new THREE.MeshLambertMaterial({
        vertexColors: THREE.VertexColors,
        wireframe: wf,
        opacity: PDB.SURFACE_OPACITY,
        transparent: true,
      }));
      // mesh.scale.set(newScale.x, newScale.y, newScale.z);
      // mesh.rotation.y =  -Math.PI/2;
      var cur_matrix4d = new THREE.Matrix4().makeScale(newScale.x, newScale.y, newScale.z);
      // var cur_matrix4d = new THREE.Matrix4().makeScale(1,1,1);
      // //var cur_matrix4d = emmap.header.matrix;
      // // console.log(cur_matrix4d);
      // cur_matrix4d = cur_matrix4d.multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      // // console.log(cur_matrix4d);
      // cur_matrix4d = cur_matrix4d.multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2));
      // // console.log(cur_matrix4d);
      // cur_matrix4d = cur_matrix4d.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
      // console.log(cur_matrix4d);
      // // cur_matrix4d = cur_matrix4d.multiply(emmap.header.matrix);
      cur_matrix4d = cur_matrix4d.multiply(new THREE.Matrix4().makeTranslation(PDB.GeoCenterOffset.x, PDB.GeoCenterOffset.y, PDB.GeoCenterOffset.z));
      // console.log(cur_matrix4d);
      // makeRotationX(Math.PI / 4).makeRotationY(Math.PI / 4).makeRotationZ(Math.PI / 4).makeTranslation(PDB.GeoCenterOffset.x, PDB.GeoCenterOffset.y, PDB.GeoCenterOffset.z);
      mesh.applyMatrix4(cur_matrix4d);
      PDB.GROUP[PDB.GROUP_MAP].add(mesh);
      // console.log(emmap.header.matrix);
      // PDB.GROUP[PDB.GROUP_MAP].applyMatrix(cur_matrix4d);
      PDB.GROUP[PDB.GROUP_MAP].visible = true;
      // PDB.GROUP[PDB.GROUP_MAP].scale.set(newScale.x, newScale.y, newScale.z);
    }
    
    // PDB.GROUP[PDB.GROUP_MAP].position.copy(new THREE.Vector3(emmap.header.x,emmap.header.y,emmap.header.z));
    console.log("time(ms):" + (new Date() - start));
  }, //ParticleSystem
  showMapSurface1: function(emmap, threshold, wireframe) {
    var newScale = new THREE.Vector3(emmap.header.c / emmap.header.NZ, emmap.header.b / emmap.header.NY, emmap.header.a / emmap.header.NX)
    var wf = PDB.tool.getValue(wireframe, false);
    var offset = PDB.GeoCenterOffset;
    var minx = emmap.center.x,
      miny = emmap.center.y,
      minz = emmap.center.z;
    var maxx = emmap.center.x + emmap.header.NX,
      maxy = emmap.center.y + emmap.header.NY,
      maxz = emmap.center.z + emmap.header.NZ;
    // MATERIALS
    var material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x888888,
      shininess: 250
    });
    // MARCHING CUBES
    var atoms = {};
    var numblobs = 0;
    var scale = chroma.scale(['green', 'red']);
    var array = [];
    for (var i = 1000; i < 1100; i++) {
      var color = new THREE.Color(scale((i - 1000) * 0.01).hex());
      //var color = new THREE.Color(w3m.rgb[i][0],w3m.rgb[i][1],w3m.rgb[i][2]);
      array.push(color);
    }

    var di = emmap.header.max - emmap.header.min;
    for (var i = 0; i < emmap.header.NX; i++) {
      for (var j = 0; j < emmap.header.NY; j++) {
        for (var k = 0; k < emmap.header.NZ; k++) {
          var m = i * emmap.header.NY * emmap.header.NZ + j * emmap.header.NZ + k;

          var v = emmap.data[i][j][k];
          if (v < threshold) continue;
          numblobs = numblobs + 1;
          var per = Math.floor(((v - emmap.header.min) / (1.0 * di)) * 99);
          color = array[per];

          var vec = new THREE.Vector3(emmap.center.x + i, emmap.center.y + j, emmap.center.z + k);
          var xyz = vec;
          var color = array[per];
          var atomSu = {
            coord: xyz,
            name: "c",
            serial: m,
            elem: "c",
            resn: "ala",
            resi: 1,
            color: color
          };
          atoms[m] = atomSu;
        }
      }
    }

    subtract = 12;
    strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

    var ps = ProteinSurface({
      min: {
        x: minx,
        y: miny,
        z: minz
      },
      max: {
        x: maxx,
        y: maxy,
        z: maxz
      },
      atoms: atoms,
      type: PDB.SURFACE_TYPE,
    });
    var verts = ps.verts;
    var faces = ps.faces;
    var geo = new THREE.Geometry();
    geo.vertices = verts.map(function(v) {
      var r = new THREE.Vector3(v.x, v.y, v.z);
      r.atomid = v.atomid;
      return r;
    });
    geo.faces = faces.map(function(f) {
      return new THREE.Face3(f.a, f.b, f.c);
    });
    geo.computeFaceNormals();
    geo.computeVertexNormals(false);
    //this.surfaces[type] = geo;

    var geoc = geo.clone(); // A clone is necessary because the state of the geometry object will be changed.
    geoc.faces.forEach(function(f) {
      f.vertexColors = ['a', 'b', 'c'].map(function(d) {
        return atoms[geo.vertices[f[d]].atomid].color;
      });
    });
    var mesh = new THREE.Mesh(geoc, new THREE.MeshLambertMaterial({
      vertexColors: THREE.VertexColors,
      wireframe: wf,
      opacity: PDB.SURFACE_OPACITY,
      transparent: true,
    }));
    mesh.scale.set(newScale.x, newScale.y, newScale.z);
    // mesh.rotation.y =  Math.PI/2;
    PDB.GROUP[PDB.GROUP_MAP].add(mesh);
    PDB.GROUP[PDB.GROUP_MAP].visible = true;
  },
  showMapSlices0: function(emmap, threshold, slice, dimensionType) {
    var start = new Date();
    var scale = chroma.scale(['green', 'red']);
    switch (dimensionType) {
      case PDB.DIMENSION_X:
        var val = slice;
        PDB.drawer.drawPlane(PDB.GROUP_SLICE, emmap.header.NY, emmap.header.NX, "", PDB.DIMENSION_X, val, emmap);
        break;
      case PDB.DIMENSION_Y:
        var val = slice;
        PDB.drawer.drawPlane(PDB.GROUP_SLICE, emmap.header.NZ, emmap.header.NX, "", PDB.DIMENSION_Y, val, emmap);
        break;
      case PDB.DIMENSION_Z:
        var val = slice;
        PDB.drawer.drawPlane(PDB.GROUP_SLICE, emmap.header.NZ, emmap.header.NY, "", PDB.DIMENSION_Z, val, emmap);
        break;
    }

    console.log("time(ms):" + (new Date() - start));
  },
  showMapSlices: function(emmap, threshold, slice, dimensionType) {
    var start = new Date();
    var scale = chroma.scale(['green', 'red']);
    switch (dimensionType) {
      case PDB.DIMENSION_X:
        var val = slice;
        PDB.drawer.drawPlane(PDB.GROUP_SLICE, emmap.header.NY, emmap.header.NZ, "", PDB.DIMENSION_X, val, emmap);
        break;
      case PDB.DIMENSION_Y:
        var val = slice;
        PDB.drawer.drawPlane(PDB.GROUP_SLICE, emmap.header.NZ, emmap.header.NX, "", PDB.DIMENSION_Y, val, emmap);
        break;
      case PDB.DIMENSION_Z:
        var val = slice;
        PDB.drawer.drawPlane(PDB.GROUP_SLICE, emmap.header.NX, emmap.header.NY, "", PDB.DIMENSION_Z, val, emmap);
        break;
    }

    console.log("time(ms):" + (new Date() - start));
  },
  // showTravelTube : function(paths,ids){
  // PDB.drawer.drawTubeByTravel(paths,ids,PDB.CONFIG.tube_radius);
  // },
  showResidue: function(chainId, resid, reptype, sel, showLow, isshow) {

    switch (reptype) {
      case PDB.LINE:
        PDB.painter.showLineByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.DOT:
        PDB.painter.showDotByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.BACKBONE:
        PDB.painter.showBackboneByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.SPHERE:
        PDB.painter.showSphereByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.STICK:
        PDB.painter.showSticksByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.BALL_AND_ROD:
        PDB.painter.showBallRodByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.TUBE:
        PDB.painter.showTubeByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.RIBBON_FLAT:
        PDB.painter.showRibbon_FlatByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.RIBBON_ELLIPSE:
        PDB.painter.showRibbon_EllipseByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.RIBBON_RECTANGLE:
        PDB.painter.showRibbon_RectangleByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.RIBBON_STRIP:
        PDB.painter.showRibbon_StripByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.RIBBON_RAILWAY:
        PDB.painter.showRibbon_RailwayByResdue(chainId, resid, sel, showLow, isshow);
        break;
      case PDB.CARTOON_SSE:
        PDB.painter.showCartoon_SSEByResdue(chainId, resid, sel, showLow, isshow);
        break;
        //case PDB.SURFACE           : PDB.painter.showSurfaceByResdue(chainId,resid,sel);		  break;
      default:
        PDB.painter.showTubeByResdue(chainId, resid, sel, showLow, isshow);
    }
  },
  showBond: function(type) {
    var mainAtoms = w3m.mol[PDB.pdbId].atom.main;
    for (var i_atom in mainAtoms) {
      var atom1 = PDB.tool.getMainAtom(PDB.pdbId, i_atom);
      for (var j_atom in mainAtoms) {
        if (i_atom < j_atom) {
          var atom2 = PDB.tool.getMainAtom(PDB.pdbId, j_atom);
          var flag = PDB.tool.isBonded(atom1, atom2);
          if (type === flag) {
            switch (flag) {
              case PDB.BOND_TYPE_COVALENT:
                //draw covalent
                var color = new THREE.Color("#567812");
                PDB.drawer.drawLine(PDB.GROUP_BOND, atom1.pos_centered, atom2.pos_centered, color);
                break;
              case PDB.BOND_TYPE_HBOND:
                // draw hbond
                var color = new THREE.Color("#567092");
                var groupindex = "chain_" + atom2.chainname;
                PDB.drawer.drawLine(PDB.GROUP_BOND, atom1.pos_centered, atom2.pos_centered, color);
                break;
              case PDB.BOND_TYPE_SSBOND:
                // draw ssbond
                var color = new THREE.Color("#810902");
                var groupindex = "chain_" + atom2.chainname;
                PDB.drawer.drawLine(PDB.GROUP_BOND, atom1.pos_centered, atom2.pos_centered, color);
                break;
              default:
                // Do nothing
            }
          }
        }
      }
    }

  },
  showAllResiduesBySelect: function() {
    var residueData = w3m.mol[PDB.pdbId].residueData;
    for (var chain in residueData) {
      var chainType = w3m.mol[PDB.pdbId].chain[chain];
      if (chainType == w3m.CHAIN_NA && type >= PDB.TUBE && type != PDB.HIDE) {
        for (var resid in residueData[chain]) {
          PDB.painter.showResidue(chain, resid, type, residueData[chain][resid].issel);
          PDB.painter.showDNABond(chain, resid, residueData[chain][resid].issel);
        }
        continue;
      }
      for (var resid in residueData[chain]) {
        PDB.painter.showResidue(chain, resid, PDB.config.mainMode, residueData[chain][resid].issel);
      }
    }
  },
  //before sphere visualization 2018-08-16
  showAllResidues0: function(type) {

    var showLengthThreshold = PDB.mode == PDB.MODE_VR ? PDB.initVRShowThreshold : PDB.initDesktopShowThreshold;
    // console.log(showLengthThreshold);
    if (type === PDB.config.surfaceMode) {
      PDB.painter.showSurface(1, w3m.mol[PDB.pdbId].atom.main.length, true);
    } else {
      var residueData = w3m.mol[PDB.pdbId].residueData;
      var chainNum = 0;

      PDB.tool.clearChainNameFlag();

      for (var chain in residueData) {
        if (PDB.residueGroupObject[chain] == undefined) {
          PDB.residueGroupObject[chain] = {};
        }
        // console.log(chainNum);
        var chainType = w3m.mol[PDB.pdbId].chain[chain];
        if (chainType == w3m.CHAIN_NA && type >= PDB.TUBE && type != PDB.HIDE) {
          for (var resid in residueData[chain]) {
            PDB.painter.showResidue(chain, resid, PDB.TUBE, true);
            PDB.painter.showDNABond(chain, resid, true);
          }
          continue;
        }
        chainNum++;
        // console.log(chainNum);
        if (chainNum <= PDB.initChainNumThreshold) {

          PDB.tool.initChainNameFlag(chain, true, chainNum);
          for (var resid in residueData[chain]) {
            var caid = residueData[chain][resid].caid;
            var pos = PDB.tool.getMainAtom(PDB.pdbId, caid).pos_centered;
            var offset = camera.position;
            var length = Math.sqrt(Math.pow(offset.x - pos.x, 2) + Math.pow(offset.y - pos.y, 2) + Math.pow(offset.z - pos.z, 2));
            // console.log(length);
            PDB.painter.showResidue(chain, resid, type, true);
            if (length < showLengthThreshold) {
              PDB.residueGroupObject[chain][resid] = PDB.residueGroup_show;
            } else {
              PDB.residueGroupObject[chain][resid] = PDB.residueGroup_hide;
              PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = false;
            }
          }
        } else {

          PDB.tool.initChainNameFlag(chain, false, chainNum);
          for (var resid in residueData[chain]) {
            var caid = residueData[chain][resid].caid;
            var pos = PDB.tool.getMainAtom(PDB.pdbId, caid).pos_centered;
            var offset = camera.position;
            var length = Math.sqrt(Math.pow(offset.x - pos.x, 2) + Math.pow(offset.y - pos.y, 2) + Math.pow(offset.z - pos.z, 2));
            PDB.painter.showResidue(chain, resid, PDB.LINE, true);

            if (length < showLengthThreshold) {
              PDB.residueGroupObject[chain][resid] = PDB.residueGroup_show;
            } else {
              PDB.residueGroupObject[chain][resid] = PDB.residueGroup_hide;
              PDB.GROUP[groupindex].children[PDB.GROUP[groupindex].children.length - 1].visible = false;
            }
          }
        }
      }
      PDB.tool.bindAllChainEvent(type, chainNum);
    }
  },
  showAllResidues: function(type) {
    var showLengthThreshold = PDB.mode == PDB.MODE_VR ? PDB.initVRShowThreshold : PDB.initDesktopShowThreshold;
    var offset = camera.position;
    PDB.offset = offset.clone();
    if (type === PDB.config.surfaceMode) {
      PDB.painter.showSurface(1, w3m.mol[PDB.pdbId].atom.main.length, true);
    } else {
      var residueData = w3m.mol[PDB.pdbId].residueData;
      var chainNum = 0;
      //clear label
      PDB.tool.clearChainNameFlag();
      for (var chain in residueData) {
        if (PDB.residueGroupObject[chain] == undefined) {
          PDB.residueGroupObject[chain] = {};
        }
        // console.log(chainNum);
        var chainType = w3m.mol[PDB.pdbId].chain[chain];
        if (chainType == w3m.CHAIN_NA && type >= PDB.TUBE && type != PDB.HIDE) {
          for (var resid in residueData[chain]) {
            PDB.painter.showResidue(chain, resid, PDB.TUBE, true, false, true);
            PDB.painter.showDNABond(chain, resid, true);
          }
          continue;
        }
        chainNum++;
        PDB.tool.initChainNameFlag(chain, true, chainNum);
        for (var resid in residueData[chain]) {
          var caid = residueData[chain][resid].caid;
          var pos = PDB.tool.getMainAtom(PDB.pdbId, caid).pos_centered;
          var length;
          if (!PDB.residueGroupObject[chain][resid]) {
            PDB.residueGroupObject[chain][resid] = {
              vector: {
                x: pos.x - offset.x,
                y: pos.y - offset.y,
                z: pos.z - offset.z
              }
            };
          }

          length = PDB.tool.getVectorLength(PDB.residueGroupObject[chain][resid].vector);
          // console.log('length:',length);
          // console.log(resid);
          // if(resid==314){
          // console.log(resid);
          // }
          PDB.residueGroupObject[chain][resid].len = length;
          if (length < showLengthThreshold) {
            if (PDB.loadType == PDB.bigmodel) {
              PDB.CONFIG = PDB.CONFIG_HIGH;
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_show;
              if (PDB.structureSizeLevel > 1) {
                if (type != PDB.DOT && type != PDB.LINE && type != PDB.BALL_AND_ROD && type != PDB.STICK) {
                  PDB.painter.showResidue(chain, resid, type, true, false, true);
                  PDB.CONFIG = PDB.CONFIG_LOW;
                  PDB.painter.showResidue(chain, resid, type, true, true, false);
                } else if (type == PDB.BALL_AND_ROD || type == PDB.STICK) {
                  if (PDB.structureSizeLevel >= 3) {
                    PDB.CONFIG = PDB.CONFIG_LOW;
                    PDB.painter.showResidue(chain, resid, type, true, true, true);
                  } else {
                    PDB.CONFIG = PDB.CONFIG_HIGH;
                    PDB.painter.showResidue(chain, resid, type, true, false, true);
                  }
                } else if (type == PDB.DOT || type == PDB.LINE) {
                  PDB.painter.showResidue(chain, resid, type, true, false, true);
                }
              } else {
                PDB.CONFIG = PDB.CONFIG_HIGH;
                PDB.painter.showResidue(chain, resid, type, true, false, true);
              }
            } else if (PDB.loadType == PDB.smallmodel) {
              PDB.CONFIG = PDB.CONFIG_HIGH;
              PDB.painter.showResidue(chain, resid, type, true);
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_show;
            }
          } else {

            if (PDB.loadType == PDB.bigmodel) {
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_low;
              //PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_undefined;
              PDB.CONFIG = PDB.CONFIG_LOW;
              if (PDB.structureSizeLevel > 1) {
                if (type != PDB.DOT && type != PDB.LINE && type != PDB.BALL_AND_ROD && type != PDB.STICK) {
                  PDB.painter.showResidue(chain, resid, type, true, true, true);
                  PDB.CONFIG = PDB.CONFIG_HIGH;
                  PDB.painter.showResidue(chain, resid, type, true, false, false);
                } else if (type == PDB.BALL_AND_ROD || type == PDB.STICK) {
                  if (PDB.structureSizeLevel >= 3) {
                    PDB.CONFIG = PDB.CONFIG_LOW;
                    PDB.painter.showResidue(chain, resid, type, true, true, true);
                  } else {
                    PDB.CONFIG = PDB.CONFIG_HIGH;
                    PDB.painter.showResidue(chain, resid, type, true, false, true);
                  }
                } else if (type == PDB.DOT || type == PDB.LINE) {
                  PDB.painter.showResidue(chain, resid, type, true, false, true);
                }
              } else {
                PDB.CONFIG = PDB.CONFIG_HIGH;
                PDB.painter.showResidue(chain, resid, type, true, false, true);
              }

            } else if (PDB.loadType == PDB.smallmodel) {
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_undefined;
            }
          }
        }
      }
      // bind initChainNumThreshold event
      PDB.tool.bindAllChainEvent(type, chainNum);
    }
  },
  showFragmentsResidues: function() {
    var residueData = w3m.mol[PDB.pdbId].residueData;
    var fragmentList = PDB.fragmentList;
    var ifrag = 0;
    for (var chain in residueData) {
      for (var resid in residueData[chain]) {
        var reptype = PDB.config.mainMode;
        var issel = false;
        for (var fKey in fragmentList) {
          if ((chain == fragmentList[fKey].start.chain) && (chain == fragmentList[fKey].end.chain)) {
            if (resid >= fragmentList[fKey].start.id && resid <= fragmentList[fKey].end.id) {
              reptype = fragmentList[fKey].reptype;
              issel = fragmentList[fKey].issel;
            }
          }
        }

        if (reptype === PDB.config.surfaceMode) {
          continue;
        }
        //fragment选中与否都不改变颜色
        issel = true;
        //if DNA draw as tube
        var chainType = w3m.mol[PDB.pdbId].chain[chain];
        if (chainType == w3m.CHAIN_NA && reptype >= PDB.TUBE && reptype != PDB.HIDE) {
          PDB.painter.showDNABond(chain, resid, issel);
          PDB.painter.showResidue(chain, resid, PDB.TUBE, issel);
          continue;
        }
        PDB.painter.showResidue(chain, resid, reptype, issel);
      }
    }

    //surface
    for (var fKey in fragmentList) {
      if (fragmentList[fKey].reptype === PDB.config.surfaceMode) {
        PDB.painter.showSurface(fragmentList[fKey].start.faid, fragmentList[fKey].end.laid, true);
      }
    }
  },
  showResidueByThreeTravel: function() {
    var redius = PDB.CONFIG.tube_radius;
    var residueData = w3m.mol[PDB.pdbId].residueData;
    var allPath = [];
    var allId = [];
    for (var c in residueData) {
      for (var r in residueData[c]) {
        var ids = new Array(residueData[c][r].path.length);
        for (var i = 0; i < ids.length; i++) {
          ids[i] = residueData[c][r].id;
        }
        allPath = allPath.concat(residueData[c][r].path);
        allId = allId.concat(ids);
      }
    }
    PDB.drawer.drawTubeByTravel(allPath, allId, redius);
  },
  showHet: function(molId, isdocking) {
    PDB.CONFIG = PDB.CONFIG_HIGH;
    if (isdocking) {
      this.showHet_Stick(molId, isdocking);
    } else {
      switch (PDB.config.hetMode) {
        case PDB.HET_LINE:
          this.showHet_Line(molId, isdocking);
          break;
        case PDB.HET_SPHERE:
          this.showHet_Sphere(molId, isdocking);
          break;
        case PDB.HET_STICK:
          this.showHet_Stick(molId, isdocking);
          break;
        case PDB.HET_BALL_ROD:
          this.showHet_Ball_Rod(molId, isdocking);
          break;
      }
    }
  },
  showOneRes: function(representation, molId) {
    //representation=representation?representation:PDB.SPHERE;
    switch (representation) {
      case PDB.LINE:
        this.showRes_Line(molId);
        break;
      case PDB.SPHERE:
        this.showRes_Sphere(molId);
        break;
      case PDB.STICK:
        this.showRes_Stick(molId);
        break;
      case PDB.BALL_AND_ROD:
        this.showRes_Ball_Rod(molId);
        break;
    }
  },
  showDrugSurface: function(molId) {
    var offset = PDB.GeoCenterOffset;
    var minx = offset.x + limit.x[0],
      miny = offset.y + limit.y[0],
      minz = offset.z + limit.z[0];
    var maxx = offset.x + limit.x[1],
      maxy = offset.y + limit.y[1],
      maxz = offset.z + limit.z[1];

    // MATERIALS
    var material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x888888,
      shininess: 250
    });
    // MARCHING CUBES
    var atoms = {};
    // for(var i in w3m.mol){
    var mol = w3m.mol[molId];
    if (mol == undefined) {
      return;
    }
    var het_obj = mol.atom.het;
    numblobs = het_obj.length;
    subtract = 12;
    strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
    for (var i_atom in het_obj) {
      var index = parseInt(i_atom);

      var atom = PDB.tool.getHetAtom(molId, i_atom);
      var xyz = atom.pos_centered;
      var color = atom.color;
      var atomSu = {
        coord: xyz,
        name: atom.name,
        serial: atom.id,
        elem: atom.type,
        resn: atom.resname,
        resi: atom.resid,
        color: color
      };
      atoms[atom.id] = atomSu;
    }

    //====================================
    var ps = ProteinSurface({
      min: {
        x: minx,
        y: miny,
        z: minz
      },
      max: {
        x: maxx,
        y: maxy,
        z: maxz
      },
      atoms: atoms,
      type: PDB.SURFACE_TYPE,
    });
    var verts = ps.verts;
    var faces = ps.faces;
    var geo = new THREE.Geometry();
    geo.vertices = verts.map(function(v) {
      var r = new THREE.Vector3(v.x, v.y, v.z);
      r.atomid = v.atomid;
      return r;
    });
    geo.faces = faces.map(function(f) {
      return new THREE.Face3(f.a, f.b, f.c);
    });
    geo.computeFaceNormals();
    geo.computeVertexNormals(false);
    //this.surfaces[type] = geo;

    var geoc = geo.clone(); // A clone is necessary because the state of the geometry object will be changed.
    geoc.faces.forEach(function(f) {
      f.vertexColors = ['a', 'b', 'c'].map(function(d) {
        return atoms[geo.vertices[f[d]].atomid].color;
      });
    });
    var mesh = new THREE.Mesh(geoc, new THREE.MeshLambertMaterial({
      vertexColors: THREE.VertexColors,
      wireframe: PDB.SURFACE_WIREFRAME,
      opacity: PDB.SURFACE_OPACITY,
      transparent: true,
    }));
	var po ;
	if(PDB.GROUP[PDB.GROUP_DRUG].visible  == true){
		po = PDB.GROUP[PDB.GROUP_DRUG].position;	
		
	}else{
		po = PDB.GROUP[PDB.GROUP_DOCKING].position;
		
	}

    PDB.GROUP[PDB.GROUP_SURFACE_HET].add(mesh);
    if(po){
		
		PDB.GROUP[PDB.GROUP_SURFACE_HET].position.copy(po);
	}
    
    PDB.GROUP[PDB.GROUP_SURFACE_HET].visible = true;
  },
  //before sphere visualization 2018-08-16
  repeatPainter0: function() {
    var residueData = w3m.mol[PDB.pdbId].residueData;
    var showLengthThreshold = PDB.mode == PDB.MODE_VR ? PDB.initVRShowThreshold : PDB.initDesktopShowThreshold;

    var offset = PDB.mode == PDB.MODE_VR ? camera.position : PDB.GeoCenterOffset;

    var chainNum = 0;
    for (var chain in residueData) {
      if (PDB.residueGroupObject[chain] == undefined) {
        PDB.residueGroupObject[chain] = {};
      }
      chainNum++;
      // console.log(chainNum);
      if (chainNum <= PDB.initChainNumThreshold) {
        for (var resid in residueData[chain]) {
          // getMainAtom
          var caid = residueData[chain][resid].caid;
          var pos = PDB.tool.getMainAtom(PDB.pdbId, caid).pos_centered;
          // var offset = camera.position;
          var length = Math.sqrt(Math.pow(offset.x - pos.x, 2) + Math.pow(offset.y - pos.y, 2) + Math.pow(offset.z - pos.z, 2));

          if (length < showLengthThreshold) {
            if (PDB.residueGroupObject[chain][resid] == undefined || PDB.residueGroupObject[chain][resid] == PDB.residueGroup_undefined) {
              PDB.painter.showResidue(chain, resid, PDB.config.mainMode, true);
              PDB.residueGroupObject[chain][resid] = PDB.residueGroup_show;
            } else if (PDB.residueGroupObject[chain][resid] == PDB.residueGroup_hide) {
              // var atom = PDB.tool.getMainAtom(PDB.pdbId, residueData[chain][resid].caid);
              var groupindex = "chain_" + chain;
              for (var i in PDB.GROUP[groupindex].children) {
                if (residueData[chain][resid].caid == PDB.GROUP[groupindex].children[i].name) {
                  PDB.GROUP[groupindex].children[i].visible = true;
                  PDB.residueGroupObject[chain][resid] = PDB.residueGroup_show;
                  break;
                }
              }
            }
          } else {
            if (PDB.residueGroupObject[chain][resid] == PDB.residueGroup_show) {
              // var atom = PDB.tool.getMainAtom(PDB.pdbId, residueData[chain][resid].caid);
              var groupindex = "chain_" + chain;
              for (var i in PDB.GROUP[groupindex].children) {
                if (residueData[chain][resid].caid == PDB.GROUP[groupindex].children[i].name) {
                  PDB.GROUP[groupindex].children[i].visible = false;
                  PDB.residueGroupObject[chain][resid] = PDB.residueGroup_hide;
                  break;
                }
              }
            }
          }
        }
      } else {

        for (var resid in residueData[chain]) {
          var caid = residueData[chain][resid].caid;
          var pos = PDB.tool.getMainAtom(PDB.pdbId, caid).pos_centered;
          var offset = camera.position;
          var length = Math.sqrt(Math.pow(offset.x - pos.x, 2) + Math.pow(offset.y - pos.y, 2) + Math.pow(offset.z - pos.z, 2));
          if (length < showLengthThreshold) {
            if (PDB.residueGroupObject[chain][resid] == undefined || PDB.residueGroupObject[chain][resid] == PDB.residueGroup_undefined) {
              PDB.painter.showResidue(chain, resid, PDB.LINE, true);
              PDB.residueGroupObject[chain][resid] = PDB.residueGroup_show;
            } else if (PDB.residueGroupObject[chain][resid] == PDB.residueGroup_hide) {
              // var atom = PDB.tool.getMainAtom(PDB.pdbId, residueData[chain][resid].caid);
              var groupindex = "chain_" + chain;
              for (var i in PDB.GROUP[groupindex].children) {
                if (residueData[chain][resid].caid == PDB.GROUP[groupindex].children[i].name) {
                  PDB.GROUP[groupindex].children[i].visible = true;
                  PDB.residueGroupObject[chain][resid] = PDB.residueGroup_show;
                  break;
                }
              }
            }
          } else {
            if (PDB.residueGroupObject[chain][resid] == PDB.residueGroup_show) {
              // var atom = PDB.tool.getMainAtom(PDB.pdbId, residueData[chain][resid].caid);
              var groupindex = "chain_" + chain;
              for (var i in PDB.GROUP[groupindex].children) {
                if (residueData[chain][resid].caid == PDB.GROUP[groupindex].children[i].name) {
                  PDB.GROUP[groupindex].children[i].visible = false;
                  PDB.residueGroupObject[chain][resid] = PDB.residueGroup_hide;
                  break;
                }
              }
            }
          }
        }
      }
    }
  },
  repeatPainter: function() {
    var residueData = w3m.mol[PDB.pdbId].residueData;
    var showLengthThreshold = PDB.mode == PDB.MODE_VR ? PDB.initVRShowThreshold : PDB.initDesktopShowThreshold;
    for (var chain in residueData) {
      var chainType = w3m.mol[PDB.pdbId].chain[chain];
      if (chainType == w3m.CHAIN_NA && PDB.config.mainMode >= PDB.TUBE && PDB.config.mainMode != PDB.HIDE) {
        continue;
      }
      for (var resid in residueData[chain]) {

        var caid = residueData[chain][resid].caid;
        if (!PDB.residueGroupObject[chain]) {
          continue;
        }
        var length = 0;
        if (PDB.residueGroupObject[chain][resid] && PDB.residueGroupObject[chain][resid].vector) {
          length = PDB.tool.getVectorLength(PDB.residueGroupObject[chain][resid].vector);
        }

        PDB.residueGroupObject[chain][resid].len = length;
        if (PDB.residueGroupObject[chain][resid].len < showLengthThreshold) {
          if (PDB.loadType == PDB.bigmodel) {
            if (PDB.residueGroupObject[chain][resid].v == PDB.residueGroup_low) {
              if (PDB.config.mainMode != PDB.DOT && PDB.config.mainMode != PDB.LINE && PDB.config.mainMode != PDB.BALL_AND_ROD && PDB.config.mainMode != PDB.STICK && PDB.structureSizeLevel > 1) {
                var gindex_low = "chain_" + chain + "_low";
                var meshs_low = PDB.GROUP[gindex_low].getChildrenByName(residueData[chain][resid].caid);
                for (var i in meshs_low) {
                  meshs_low[i].visible = false;
                }

                var groupindex = "chain_" + chain;
                var meshs = PDB.GROUP[groupindex].getChildrenByName(residueData[chain][resid].caid);
                for (var i in meshs) {
                  meshs[i].visible = true;
                }
              }
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_show;
            }
          } else if (PDB.loadType == PDB.smallmodel) {
            if (PDB.residueGroupObject[chain][resid].v == PDB.residueGroup_undefined) {
              PDB.CONFIG = PDB.CONFIG_HIGH;
              PDB.painter.showResidue(chain, resid, PDB.config.mainMode, true);
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_show;
            } else if (PDB.residueGroupObject[chain][resid].v == PDB.residueGroup_hide) {
              var groupindex = "chain_" + chain;
              var meshs = PDB.GROUP[groupindex].getChildrenByName(residueData[chain][resid].caid);
              if (meshs && meshs.length > 0) {
                for (var i in meshs) {
                  meshs[i].visible = true;
                }
              }
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_show;
            }
          }
        } else {

          if (PDB.loadType == PDB.bigmodel) {
            if (PDB.residueGroupObject[chain][resid].v == PDB.residueGroup_show) {

              if (PDB.config.mainMode != PDB.DOT && PDB.config.mainMode != PDB.LINE && PDB.config.mainMode != PDB.BALL_AND_ROD && PDB.config.mainMode != PDB.STICK && PDB.structureSizeLevel > 1) {
                var gindex_low = "chain_" + chain + "_low";
                var meshs_low = PDB.GROUP[gindex_low].getChildrenByName(residueData[chain][resid].caid);
                for (var i in meshs_low) {
                  meshs_low[i].visible = true;
                }
                var groupindex = "chain_" + chain;
                var meshs = PDB.GROUP[groupindex].getChildrenByName(residueData[chain][resid].caid);
                for (var i in meshs) {
                  meshs[i].visible = false;
                }
              }
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_low;
            }
          } else if (PDB.loadType == PDB.smallmodel) {
            if (PDB.residueGroupObject[chain][resid].v == PDB.residueGroup_show) {
              var groupindex = "chain_" + chain;
              var meshs = PDB.GROUP[groupindex].getChildrenByName(residueData[chain][resid].caid);
              if (meshs && meshs.length > 0) {
                for (var i in meshs) {
                  meshs[i].visible = false;
                }
              }
              PDB.residueGroupObject[chain][resid].v = PDB.residueGroup_hide;
            }
          }
        }
      }
    }
  },
  showBoxHelper: function(limit) {
    if (!limit) {
      limit = {
        x: w3m.global.limit.x,
        y: w3m.global.limit.y,
        z: w3m.global.limit.z
      };
    }
    limit.x = [limit.x[0] + PDB.GeoCenterOffset.x, limit.x[1] + PDB.GeoCenterOffset.x];
    limit.y = [limit.y[0] + PDB.GeoCenterOffset.y, limit.y[1] + PDB.GeoCenterOffset.y];
    limit.z = [limit.z[0] + PDB.GeoCenterOffset.z, limit.z[1] + PDB.GeoCenterOffset.z];
    var box = new THREE.Box3(new THREE.Vector3(limit.x[0], limit.y[0], limit.z[0]), new THREE.Vector3(limit.x[1], limit.y[1], limit.z[1]));
    box.setFromCenterAndSize(new THREE.Vector3((limit.x[0] + limit.x[1]) / 2, (limit.y[0] + limit.y[1]) / 2, (limit.z[0] + limit.z[1]) / 2), new THREE.Vector3(limit.x[1] - limit.x[0], limit.y[1] - limit.y[0], limit.z[1] - limit.z[0]));
    var helper = new THREE.Box3Helper(box, 0xfff100);
    PDB.render.clearGroupIndex(PDB.GROUP_BOX_HELPER);
    PDB.GROUP[PDB.GROUP_BOX_HELPER].add(helper);
  }
};
