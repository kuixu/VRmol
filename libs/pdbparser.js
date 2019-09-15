/*!
 * PDB CIF file parser
 * By Gert-Jan Bekker, Kui Xu
 * License: MIT
 * http://www.wwpdb.org/documentation/file-format-content/format33/sect5.html#SHEET
 */

// pdbml

function PDBMLparser() {
  this.data = {};
}

Partition=function(String, point) {
	  var results = ["", "", ""];
	  var loc = String.indexOf(point);
	  if (loc == -1) {results[0] = String;}
	  else {results[0] = String.substr(0, loc); results[1] = point; results[2] = String.substr(loc+1);}
	  return results;
}

PDBMLparser.prototype.parse = function(data) {
  var root = data.documentElement;
  var rootJS = this.data["data_"+root.getAttribute("datablockName")] = {}
  var category, catName, loopMode, cat, scat, skip, item, n;
  for (var i=0, j, k; i<root.childNodes.length; i++) {
    cat = root.childNodes[i];
    catName = cat.localName;
    if (! catName) continue;
    catName = catName.substr(0, catName.length-8);
    category = rootJS[catName] = {};
    loopMode = cat.childNodes.length > 3;
    n = 0;
    for (j=0; j<cat.childNodes.length; j++) {
      scat = cat.childNodes[j];
      if (! scat.localName) continue;
      skip = [];
      for (k=0; k<scat.attributes.length; k++) {
        item = scat.attributes.item(k);
        if (loopMode) {
          if (! category.hasOwnProperty(item.localName)) category[item.localName] = new Array(n);
          category[item.localName].push(item.nodeValue);
          skip.push(item.localName);
        }
        else category[item.localName] = [item.nodeValue];
      }
      for (k=0; k<scat.childNodes.length; k++) {
        item = scat.childNodes[k];
        if (! item.localName) continue;
        if (loopMode) {
          if (! category.hasOwnProperty(item.localName)) category[item.localName] = new Array(n);
          category[item.localName].push(item.textContent);
          skip.push(item.localName);
        }
        else category[item.localName] = [item.textContent];
      }
      if (loopMode) for (k in category) {if (skip.indexOf(k) == -1) category[k].push(null);}
      n++;
    }
  }
}

//registerPublic::loadPDBML
function loadPDBML(data, noCnT) {
  var parser = new PDBMLparser();
  parser.parse(data);

  if (noCnT) return parser.data;
  //if (! window.__PDBMLDICT__) loadPDBMLdic();
  if (! window.__CIFDICT__) loadCIFdic();

  var func, e, e2, e3, i;
  for (e in parser.data) {
    for (e2 in parser.data[e]) {
      if (! __CIFDICT__.hasOwnProperty(e2)) continue;
      for (e3 in parser.data[e][e2]) {
        if (! __CIFDICT__[e2].hasOwnProperty(e3)) continue;
        func = __CIFDICT__[e2][e3];
        if (parser.data[e][e2][e3] instanceof Array) {
          for (i=0; i<parser.data[e][e2][e3].length; i++) parser.data[e][e2][e3][i] = func.call(null, parser.data[e][e2][e3][i]);
        }
        else parser.data[e][e2][e3] = func.call(null, parser.data[e][e2][e3]);
      }
    }
  }
  return parser.data;
}

// mmjson tree

//registerPublic::setupCIFTree
function setupCIFTree(target, jso, expandableTarget) {
  var point = target.pushNode("DIV");
  point.expandableTarget = expandableTarget;
  point.popup = target.parentNode; point.topNode = true;
  renderChildCIFTree(point, jso);
  if (point.childNodes.length == 1 && point.childNodes[0].childNodes[0].className.indexOf("optCat_p") != -1) point.childNodes[0].childNodes[0].onclick();
  return point;
}

function renderChildCIFTree(target, jso) {
  var item;
  var keys = Object.keys(jso);
  var table = null, row;
  if (jso[keys[0]] instanceof Array || "splice" in jso[keys[0]]) {
    var table = new drawTable(), row;
    if (! target.showAll || jso[keys[0]].length < 10000) table.tbl.setClass("dTO eqSpacedTbl");
    table.tbl.border = "1";
    table.tbl.style.width = "";
    row = table.addRowXH(keys);
    for (var i=0, j; i<(target.showAll ? jso[keys[0]].length : Math.min(jso[keys[0]].length, 25)); i++) {
      row = table.addRow();
      for (j=0; j<keys.length; j++) row.addCell(jso[keys[j]][i]);
    }
    target.pushNode(table.tbl);
    if (! target.showAll && jso[keys[0]].length > 25) {
      row = target.pushNode("a", "Show all ("+jso[keys[0]].length+(jso[keys[0]].length > 2500 ? " rows, which will take some time to process and might cause your browser to become unresponsive. Alternatively, switch to flat file representation." : " rows")+")");
      row.targetObj = target; row.jso = jso; row.style.cursor = "pointer";
      row.onclick = function() {
        Clear(this.targetObj);
        this.targetObj.showAll = true;
        renderChildCIFTree(this.targetObj, this.jso);
      };
    }
  }
  else {
    for (var i=0; i<keys.length; i++) {
      item = target.pushNode("DIV");
      item.plus = item.pushNode("a", "+");
      item.plus.setClass("optCat_p");
      item.name = item.pushNode("a", keys[i]);
      item.name.setClass("optCat_n");
      item.plus.onclick = item.name.onclick = expandCatTree;
      item.payload = jso[keys[i]];
      item.expandFunc = renderChildCIFTree;
    }
  }
}

// mmcif parser
function _loop(parserObj) {
  this.parserObj = parserObj;
  this.length = 0;
  this.refID = -1;
  this.refList = [];
  this.namesDefined = false;
}

_loop.prototype.addName = function(name) {
  var catName = Partition(name, ".");
  var ref = this.parserObj.currentTarget[this.parserObj.currentTarget.length-2];
  if (catName[1]) {
    if (! ref.hasOwnProperty(catName[0])) ref[catName[0]] = {};
    if (! ref[catName[0]].hasOwnProperty(catName[2])) ref[catName[0]][catName[2]] = [];
    this.refList.push(ref[catName[0]][catName[2]]);
  }
  else {
    if (! ref.hasOwnProperty(catName[0])) ref[catName[0]] = [];
    this.refList.push(ref[catName[0]]);
  }
  this.length = this.refList.length;
};

_loop.prototype.pushValue = function(value) {
  this.namesDefined = true;
  var target = this.nextTarget();
  if (value == "stop_") return this.stopPush();
  target.push(value);
};

_loop.prototype.nextTarget = function() {
  this.refID = (this.refID+1)%this.length;
  return this.refList[this.refID];
};

_loop.prototype.stopPush = function() {
  this.refID = -1;
};

function CIFparser() {
  this.data = {};
  this.currentTarget = null;
  this.loopPointer = null;
  this.selectGlobal();
}

CIFparser.prototype.parse = function(data) {
  var lines = data.split("\n"), line, buffer = [], multi_line_mode = false, Z;
  for (var i=0; i<lines.length; i++) {
    Z = lines[i].substr(0, 1);
    line = lines[i].trim();
    if (Z == ";") {
      if (multi_line_mode) this.setDataValue(buffer.join("\n"));
      else buffer = [];
      multi_line_mode = ! multi_line_mode;
      line = line.substr(1).trim();
    }
    if (multi_line_mode) buffer.push(line);
    else this.processContent(this.specialSplit(line));
  }
};

CIFparser.prototype.specialSplit = function(content) {
  var output = [["", false]], quote = false, length = content.length, isWS, olast=0;
  for (var i=0; i<length; i++) {
    isWS = content[i] == " " || content[i] == "\t";
    if ((content[i] == "'" || content[i] == '"') && (i == 0 || content[i-1] == " " || content[i-1] == "\t" || i == length-1 || content[i+1] == " " || content[i+1] == "\t")) quote = ! quote;
    else if (! quote && isWS && output[olast][0] != "") {output.push(["", false]); olast++;}
    else if (! quote && content[i] == "#") break;
    else if (! isWS || quote) {output[olast][0] += content[i]; output[olast][1] = quote;}
  }
  if (output[olast][0] == "") output.pop();
  return output;
};

CIFparser.prototype.processContent = function(content) {
  for (var i=0; i<content.length; i++) {
    if (content[i][0] == "global_" && ! content[i][0]) {
      this.loopPointer = null;
      this.selectGlobal();
    }
    else if (content[i][0].substr(0, 5) == "data_" && ! content[i][1]) {
      this.loopPointer = null;
      this.selectData(content[i][0]);
    }
    else if (content[i][0].substr(0, 5) == "save_" && ! content[i][1]) {
      this.loopPointer = null;
      if (content[i][0].substr(5).length) this.selectFrame(content[i][0]);
      else this.endFrame();
    }
    else if (content[i][0] == "loop_" && ! content[i][1]) this.loopPointer = new _loop(this);
    else if (content[i][0].substr(0, 1) == "_" && ! content[i][1]) this.setDataName(content[i][0].substr(1));
    else this.setDataValue(content[i][0]);
  }
};

CIFparser.prototype.setDataName = function(name) {
  if (this.loopPointer != null) {
    if (this.loopPointer.namesDefined) this.loopPointer = null;
    else return this.loopPointer.addName(name);
  }
  var name = Partition(name, ".");
  this.currentTarget.pop();
  if (name[1]) {
    if (! this.currentTarget[this.currentTarget.length-1].hasOwnProperty(name[0])) this.currentTarget[this.currentTarget.length-1][name[0]] = {};
    this.currentTarget[this.currentTarget.length-1][name[0]][name[2]] = "";
    this.currentTarget.push([this.currentTarget[this.currentTarget.length-1][name[0]], name[2]]);
  }
  else {
    this.currentTarget[this.currentTarget.length-1][name[0]] = "";
    this.currentTarget.push([this.currentTarget[this.currentTarget.length-1], name[0]]);
  }
};

CIFparser.prototype.setDataValue = function(value) {
  if (this.loopPointer != null) this.loopPointer.pushValue(value);
  else {var tmp = this.currentTarget[this.currentTarget.length-1]; tmp[0][tmp[1]] = [value];}
};

CIFparser.prototype.selectGlobal = function() {this.currentTarget = [this.data, this.data, null];};

CIFparser.prototype.selectData = function(name) {
  if (! this.data.hasOwnProperty(name)) this.data[name] = {};
  this.currentTarget = [this.data, this.data[name], null];
};

CIFparser.prototype.selectFrame = function(name) {
  if (! this.currentTarget[1].hasOwnProperty(name)) this.currentTarget[1][name] = {};
  this.currentTarget = this.currentTarget.slice(0, 2); this.currentTarget.push(this.currentTarget[1][name]); this.currentTarget.push(null);
};

CIFparser.prototype.endData = function() {this.currentTarget = this.currentTarget.slice(0, 2);};

CIFparser.prototype.endFrame = function() {this.currentTarget = this.currentTarget.slice(0, 3);};

function loadCIFdic() {
  var request = new CallRemote("GET");
  //request.Send("/mmcif_pdbx_v40.dic");
  request.Send("/mmcif_pdbx.dic");

  var parser = new CIFparser();
  parser.parse(request.request.responseText);

  var ref = parser.data["data_mmcif_pdbx.dic"], name, dic = {};
  for (var e in ref) {
    if (typeof ref[e] != "object" || ref[e] instanceof Array || ! ref[e].hasOwnProperty("item_type")) continue;
    name = Partition(e.substr(6), ".");
    if (! dic.hasOwnProperty(name[0])) dic[name[0]] = {};
    dic[name[0]][name[2]] = ref[e].item_type.code.trim()
  }

  var typing = {}, e2;
  for (var e in dic) {
    for (e2 in dic[e]) {
      if (dic[e][e2] == "int") {
        if (! typing.hasOwnProperty(e)) typing[e] = {};
        typing[e][e2] = parseInt;
      }
      else if (dic[e][e2] == "float") {
        if (! typing.hasOwnProperty(e)) typing[e] = {};
        typing[e][e2] = parseFloat;
      }
      else if (dic[e][e2] == "int-range") {
        if (! typing.hasOwnProperty(e)) typing[e] = {};
        typing[e][e2] = parseIntRange;
      }
      else if (dic[e][e2] == "float-range") {
        if (! typing.hasOwnProperty(e)) typing[e] = {};
        typing[e][e2] = parseFloatRange;
      }
    }
  }
  __CIFDICT__ = typing;
}

function parseIntRange(inp) {
  try {
    var pos = inp.indexOf("-", 1);
    if (pos == -1) throw -1;
    return [parseInt(inp.substr(0, pos)), parseInt(inp.substr(pos+1))];
  }
  catch (e) {return [parseInt(inp)];}
}

function parseFloatRange() {
  try {
    var pos = inp.indexOf("-", 1);
    if (pos == -1) throw -1;
    return [parseFloat(inp.substr(0, pos)), parseFloat(inp.substr(pos+1))];
  }
  catch (e) {return [parseFloat(inp)];}
}

//registerPublic::loadCIF
function loadCIF(data, noCnT) {
  var parser = new CIFparser();
  parser.parse(data);

  if (noCnT) {
    cont = to_cont(parser.data);
    return cont;
  }
  if (! window.__CIFDICT__) loadCIFdic();

  var e, e2, e3, i;
  for (e in parser.data) {
    for (e2 in parser.data[e]) {
      for (e3 in parser.data[e][e2]) {
        if (parser.data[e][e2][e3] instanceof Array) {for (i=0; i<parser.data[e][e2][e3].length; i++) parser.data[e][e2][e3][i] = ! (parser.data[e][e2][e3][i] == "?" || parser.data[e][e2][e3][i] == ".") ? parser.data[e][e2][e3][i] : null;}
        else parser.data[e][e2][e3] = ! (parser.data[e][e2][e3] == "?" || parser.data[e][e2][e3] == ".") ? parser.data[e][e2][e3] : null;
      }
    }
  }

  var func;
  for (e in parser.data) {
    for (e2 in parser.data[e]) {
      if (! __CIFDICT__.hasOwnProperty(e2)) continue;
      for (e3 in parser.data[e][e2]) {
        if (! __CIFDICT__[e2].hasOwnProperty(e3)) continue;
        func = __CIFDICT__[e2][e3];
        if (parser.data[e][e2][e3] instanceof Array) {for (i=0; i<parser.data[e][e2][e3].length; i++) parser.data[e][e2][e3][i] = func.call(null, parser.data[e][e2][e3][i]);}
        else parser.data[e][e2][e3] = func.call(null, parser.data[e][e2][e3]);
      }
    }
  }

  cont = to_cont(parser.data);
  return cont;
}

String.form = function(str, arr) {
  var i = -1;
  function callback(exp, p0, p1, p2, p3, p4) {
      if (exp=='%%') return '%';
      if (arr[++i]===undefined) return undefined;
      exp  = p2 ? parseInt(p2.substr(1)) : undefined;
      var base = p3 ? parseInt(p3.substr(1)) : undefined;
      var val;
      switch (p4) {
          case 's': val = arr[i]; break;
          case 'c': val = arr[i][0]; break;
          case 'f': val = parseFloat(arr[i]).toFixed(exp); break;
          case 'p': val = parseFloat(arr[i]).toPrecision(exp); break;
          case 'e': val = parseFloat(arr[i]).toExponential(exp); break;
          case 'x': val = parseInt(arr[i]).toString(base?base:16); break;
          case 'd': val = parseFloat(parseInt(arr[i], base?base:10).toPrecision(exp)).toFixed(0); break;
      }
      val = typeof(val)=='object' ? JSON.stringify(val) : val.toString(base);
      var sz = parseInt(p1); /* padding size */
      var ch = p1 && p1[0]=='0' ? '0' : ' '; /* isnull? */
      while (val.length<sz) val = p0 !== undefined ? val+ch : ch+val; /* isminus? */
     return val;
  }
  var regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;
  return str.replace(regex, callback);
}

String.prototype.$ = function() {
    return String.form(this, Array.prototype.slice.call(arguments));
}

function to_cont(data) {
  var cont = '';
  var model = data[Object.keys(data)];
  var header = model.struct_keywords;
  if (header!==undefined){
    classification = "%-40s".$(header.pdbx_keywords[0]);
    depDate        = "%-10s".$(model.pdbx_database_status.recvd_initial_deposition_date[0]);
    idCode         = "%4s".$(header.entry_id[0]);
    line = "%-6s".$("HEADER")+"     "+classification+depDate+" "+idCode;
    cont = cont + line+"\n";
  }
  cont = cont + model.entry.id+'\n';
  cont = cont + 'TITLE     '+model.struct.title+'\n';
  var hel = model.struct_conf;
  if(hel.id.length > 0){
    for (i=0; i<hel.id.length; i++){
      serNum    = "%4d".$(hel.id[i]);
      helixID   = "%3s".$(hel.pdbx_PDB_helix_id[i]);
      beg_label = "%-3s".$(hel.beg_label_comp_id[i]);
      end_label = "%-3s".$(hel.end_label_comp_id[i]);
      beg_chain = "%s".$(hel.beg_label_asym_id[i]);
      end_chain = "%s".$(hel.end_label_asym_id[i]);
      beg_seqid = "%4d".$(hel.beg_label_seq_id[i]);
      end_seqid = "%4d".$(hel.end_label_seq_id[i]);
      initICode = "%s".$(' ');
      endICode  = "%s".$(' ');
      helixClass= "%2d".$(hel.pdbx_PDB_helix_class[i]);
      comment   = "%-30s".$(" ");
      length    = "%2d".$(hel.pdbx_PDB_helix_length[i]);
      line = "%-6s".$("HELIX")+" "+helixID+" "+helixID+" "+beg_label+" "+beg_chain+" "+beg_seqid+initICode+" "+end_label+" "+end_chain+" "+end_seqid+endICode+helixClass+comment+" "+length;
      cont = cont + line+"\n";
    }
  }
  // SHEET    1 1   10 THR A  66  LYS 60  66
  // SHEET    2   A10 THR A  49  SER A  55 -1  N  PHE A  50   O  PHE A  65                             13
  var sheet = model.struct_sheet_range;
  if(sheet.id.length > 0){
    for (i=0; i<sheet.id.length; i++){
      strand    = "%3d".$(sheet.id[i]);
      sheetID   = "%3s".$(sheet.sheet_id[i]);
      numStrands= "%-2s".$(sheet.id.length);
      beg_label = "%-3s".$(sheet.beg_label_comp_id[i]);
      end_label = "%-3s".$(sheet.end_label_comp_id[i]);
      beg_chain = "%s".$(sheet.beg_label_asym_id[i]);
      end_chain = "%s".$(sheet.end_label_asym_id[i]);
      beg_seqid = "%4d".$(sheet.beg_label_seq_id[i]);
      end_seqid = "%4d".$(sheet.end_label_seq_id[i]);
      initICode = "%s".$(' ');
      endICode  = "%s".$(' ');
      sense     = 0;
      sense     = "%2d".$(sense);
      curAtom   = "";
      curResName= "";
      curChainId= "";
      curResSeq = "";
      curICode  = "";

      preAtom   = "";
      preResName= "";
      preChainId= "";
      preResSeq = "";
      preICode  = "";
      if(i>0){
        sense   = model.struct_sheet_order.sense[i];
        if (sense==='anti-parallel'){
          sense = -1;
        }else if(sense==='parallel'){
          sense = 1;
        }else{
          sense = 0;
        }

      }
      var sheet_hbond = model.pdbx_struct_sheet_hbond;
      if(i>0 && sense !==0 && sheet_hbond!==undefined){
        sense     = "%2d".$(sense);
        
        curAtom   = "%-4s".$(sheet_hbond.range_2_label_atom_id[i-1]);
        curResName= "%-3s".$(sheet_hbond.range_2_label_comp_id[i-1]);
        curChainId= "%s".$(sheet_hbond.range_2_label_asym_id[i-1]);
        curResSeq = "%4d".$(sheet_hbond.range_2_label_seq_id[i-1]);
        curICode  = "%s".$(' ');

        preAtom   = "%-4s".$(sheet_hbond.range_1_label_atom_id[i-1]);
        preResName= "%-3s".$(sheet_hbond.range_1_label_comp_id[i-1]);
        preChainId= "%s".$(sheet_hbond.range_1_label_asym_id[i-1]);
        preResSeq = "%4d".$(sheet_hbond.range_1_label_seq_id[i-1]);
        preICode  = "%s".$(' ');
      }

      line = "%-6s".$("SHEET")+" "+strand+" "+sheetID+numStrands+" "+beg_label+" "+
           beg_chain+beg_seqid+initICode+" "+end_label+" "+end_chain+end_seqid+endICode+
           sense+" "+curAtom+curResName+" "+curChainId+curResSeq+curICode+" "+preAtom+preResName+" "+preChainId+preResSeq+preICode;
      cont = cont + line+"\n";
    }
  }
  // SSBOND AND link
  var bonds = model.struct_conn;
  if (bonds!==undefined){
    for (i=0; i<bonds.id.length; i++){
      if (bonds.conn_type_id[i]==="disulf"){
        serNum   = "%3d".$(i+1);
        resName1 = "%3s".$(bonds.ptnr1_auth_comp_id[i]);
        chainID1 = "%s".$(bonds.ptnr1_auth_asym_id[i]);
        seqNum1  = "%4d".$(bonds.ptnr1_auth_seq_id[i]);
        iCode1   = " ";
        resName2 = "%3s".$(bonds.ptnr2_auth_comp_id[i]);
        chainID2 = "%s".$(bonds.ptnr2_auth_asym_id[i]);
        seqNum2  = "%4d".$(bonds.ptnr2_auth_seq_id[i]);
        iCode2   = " ";
        space    = "%23s".$(' ');
        sym1     = "%6s".$(bonds.ptnr1_symmetry[i]);
        sym2     = "%6s".$(bonds.ptnr2_symmetry[i]);
        length   = "%5.2f".$(bonds.pdbx_dist_value[i]);
        line = "%-6s".$("SSBOND")+" "+serNum+" "+resName1+" "+chainID1+" "+seqNum1+iCode1+"   "+resName2+" "+chainID2+" "+seqNum2+iCode2+space+sym1+" "+sym2+" "+length;
      }
      if (bonds.conn_type_id[i]==="covale"){
        name1      = "%-3s".$(bonds.ptnr1_label_atom_id[i]);
        altLoc1    = "%s".$(' ');
        resName1   = "%-3s".$(bonds.ptnr1_auth_comp_id[i]);
        chainID1   = "%s".$(bonds.ptnr1_auth_asym_id[i]);
        resSeq1    = "%4d".$(bonds.ptnr1_auth_seq_id[i]);
        iCode1     = "%s".$(' ');

        space      = "%15s".$(' ');

        name2      = "%-4s".$(bonds.ptnr2_label_atom_id[i]);
        altLoc2    = "%s".$(' ');
        resName2   = "%-3s".$(bonds.ptnr2_auth_comp_id[i]);
        chainID2   = "%s".$(bonds.ptnr2_auth_asym_id[i]);
        resSeq2    = "%4d".$(bonds.ptnr2_auth_seq_id[i]);
        iCode2     = "%s".$(' ');

        sym1     = "%6s".$(bonds.ptnr1_symmetry[i]);
        sym2     = "%6s".$(bonds.ptnr2_symmetry[i]);
        length   = "%5.2f".$(bonds.pdbx_dist_value[i]);
        line = "%-6s".$("LINK")+"      "+name1+altLoc1+resName1+" "+chainID1+resSeq1+iCode1+space+name2+altLoc2+resName2+" "+chainID2+resSeq2+iCode2+"   "+sym1+" "+sym2+" "+length;
      }
      // + sense+curAtom+curResName+curChainId+curResSeq+curICode+preAtom+preResName+preChainId+preResSeq+preICode;
      cont = cont + line+"\n";
    }
  }
  // SITE
  var sites = model.struct_site_gen;
  if (sites!==undefined){
    for (i=0; i<sites.id.length; i++){
      seqNum   = "%3d".$(sites.id[i]);
      siteID   = "%3s".$(sites.site_id[i]);
      numRes   = "%2d".$(sites.pdbx_num_res[i]);
      resName1 = "%3s".$(sites.auth_comp_id[i]);
      chainID1 = "%s".$(sites.auth_asym_id[i]);
      seq1     = "%4d".$(sites.auth_seq_id[i]);
      iCode1   = " ";

      line = "%-6s".$("SITE")+" "+seqNum+" "+siteID+" "+numRes+" "+resName1+" "+chainID1+seq1+iCode1;
      // + sense+curAtom+curResName+curChainId+curResSeq+curICode+preAtom+preResName+preChainId+preResSeq+preICode;
      cont = cont + line+"\n";
    }
  }
  var atoms = model.atom_site;
  if(atoms.id.length > 0){
    for (i=0; i<atoms.id.length; i++){
      group     = "%-6s".$(atoms.group_PDB[i]);
      serial    = "%5d".$(atoms.id[i]);
      name      = "%-4s".$(atoms.label_atom_id[i]);
      altLoc    = "%s".$(' ');
      resName   = "%-3s".$(atoms.label_comp_id[i]);
      chainID   = "%s".$(atoms.label_asym_id[i]);
      resSeq    = "%4d".$(atoms.auth_seq_id[i]);
      iCode     = "%s".$(' ');
      x         = "%8.3f".$(atoms.Cartn_x[i]);
      y         = "%8.3f".$(atoms.Cartn_y[i]);
      z         = "%8.3f".$(atoms.Cartn_z[i]);
      occupancy = "%6.2f".$(atoms.occupancy[i]);
      tempFactor= "%6.2f".$(atoms.B_iso_or_equiv[i]);
      element   = "%s".$(atoms.type_symbol[i]);
      space     = "%12s".$(' ');
      charge    = "%2s".$(' ');

      line = group+serial+" "+name+altLoc+resName+" "+chainID+resSeq+iCode+"   "+x+y+z+occupancy+tempFactor+space+element;
      // + sense+curAtom+curResName+curChainId+curResSeq+curICode+preAtom+preResName+preChainId+preResSeq+preICode;
      cont = cont + line+"\n";
    }
  }
  cont = cont + line+"\nEND";


  return cont;

}

//registerPublic::dumpCIF
function dumpCIF(data) {
  var cifStrCheck = new RegExp("[\\s\(\)]");
  var cifStrNLCheck = new RegExp("[\n]");

  var sliceConst = '';
  for (var i=0; i<1024; i++) sliceConst += ' ';
  var padString = function(inp, flength) {"use strict";
    return inp+sliceConst.slice(inp.length, flength);
  };

  var dumpStr = function(inp) {
    if (inp == null) return "?";
    else {
      if (typeof(inp) != "string") return inp+"";
      if (cifStrNLCheck.test(inp)) return "\n;"+inp+"\n;";
      if (cifStrCheck.test(inp)) return "'"+inp+"'";
      return inp;
    }
  };

  var dumpCat = function(k, v) {
    var output = "#\n", k, i, noi, pad, tmp1, tmp2, j;
    noi = v[Object.keys(v)[0]].length;
    if (noi == 1) {
      pad = 0
      for (k2 in v) if (k2.length > pad) pad = k2.length;
      pad += 3;
      for (k2 in v) output += "_"+k+"."+padString(k2, pad)+dumpStr(v[k2][0], pad)+"\n";
    }
    else {
      output += "loop_\n";
      pad = [];
      for (k2 in v) {
        output += "_"+k+"."+k2+"\n";
        pad.push(0);
      }
      tmp1 = [];
      for (i=0; i<noi; i++) {
        tmp1.push(tmp2=[]);
        for (k2 in v) tmp2.push(dumpStr(v[k2][i]));
      }

      for (j=0; j<tmp1[0].length; j++) {
        pad = 0;
        for (i=0; i<tmp1.length; i++) {
          if (tmp1[i][j].substr(0,2) != '\n;' && tmp1[i][j].length > pad) pad = tmp1[i][j].length;
        }
        pad += 1;
        for (i=0; i<tmp1.length; i++) {
          if (tmp1[i][j].substr(0,2) != '\n;') tmp1[i][j] = padString(tmp1[i][j], pad);
        }
      }

      for (i=0; i<noi; i++) output += tmp1[i].join("")+"\n";
    }
    return output.trim()+"\n";
  }

  var inner = true;
  var dumpPart = function(part, skip) {
    var output = "", k;
    for (k in part) {
      if (typeof(part[k]) == "object" && ! Array.isArray(part[k])) {
        if (k.substr(0, 5) != "data_" && k.substr(0, 5) != "save_" && k.substr(0, 7) != "global_") output += dumpCat(k, part[k], true);
        else {output += k+"\n" + dumpPart(part[k]); inner = false;}
      }
    }
    if (skip || ! inner) return output;
    else return output+"#\n";
  }
  return dumpPart(data);
}
