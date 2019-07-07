/**
 * Created by Kui Xu on 2017/8/7.
 * mail: xukui.cs@gmail.com
 * MRC/CCP4 file format http://www.ccpem.ac.uk/mrc_format/mrc2014.php
 * The 2mFo-DFc map (in CCP4 format): http://www.ebi.ac.uk/pdbe/coordinates/files/1cbs.ccp4
 * The mFo-DFc map (in CCP4 format): http://www.ebi.ac.uk/pdbe/coordinates/files/1cbs_diff.ccp4
 * The reflection file (in MTZ format): http://www.ebi.ac.uk/pdbe/coordinates/files/1cbs_map.mtz
 */
var EmMapParser;
EmMapParser = {
  getURLByType: function(mapid, type) {
    // console.log("======"+mapid+"----"+type);
    switch (type) {
      case "X-Ray":
        return 'https://www.ebi.ac.uk/pdbe/coordinates/files/' + mapid.toLowerCase() + '.ccp4';
        break;
      case "X-Ray-desc":
        return 'https://www.ebi.ac.uk/pdbe/entry/pdb/' + mapid.toLowerCase();
        break;
      case "ccp4":
        return 'https://ipr.pdbj.org/edmap/ccp4/' + mapid.toLowerCase() + '.ccp4.gz';
        break;
      case "ccp4-local":
        return 'http://localhost/ccp4/data/' + mapid.toLowerCase() + '.ccp4.gz';
        break;
      case "EM":
        return 'https://ftp.wwpdb.org/pub/emdb/structures/EMD-' + mapid.toLowerCase() + '/map/emd_' + mapid.toLowerCase() + '.map.gz';
        break;
      case "EM-desc":
        return 'https://www.ebi.ac.uk/pdbe/entry/emdb/EMD-' + mapid.toLowerCase();
        break;
      case "map-local":
        return 'data/emd_' + mapid.toLowerCase() + '.map.gz';
        break;
    }
  },
  loadMap: function(mapid, type, onCallBack) {
    var scope = this;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.status == 200) {
        var unit8map = new Uint8Array(this.response);
        if (type != "X-Ray") {
          var gunzip = new Zlib.Gunzip(unit8map);
          unit8map = gunzip.decompress();
        }
        var emmap = scope.parseMap(unit8map.buffer, mapid);

        onCallBack(emmap) // showMap(emmap);
      } else {
        if (!PDB.pptShow) {
          PDB.tool.printProgress("Error! Failed to load " + type + " map " + mapid);
        }
        // if ( w3m_isset(PDB.remoteUrl[++url_index]) ) {
        //     this.get(id, callback);
        // } else {
        //     url_index = 0;
        // }
      }
    };
    xhr.onprogress = function(e) {
      if (!PDB.pptShow) {
        if (e.lengthComputable) {
          PDB.tool.setProgressBar(e.loaded, e.total);
          var ratio = Math.floor((e.loaded / e.total) * 100) + "%";
          var loaded = PDB.tool.toHumanByte(e.loaded);
          var total = PDB.tool.toHumanByte(e.total);
          PDB.tool.printProgress(type + " map: " + mapid + " loaded, size(" + loaded + "/" + total + ") " + ratio);
          // console.log(e.loaded);
        }
      }
    };
    xhr.onloadstart = function(e) {
      if (!PDB.pptShow) {
        PDB.tool.setProgressBar(0, e.total);
      }
    };
    xhr.onloadend = function(e) {
      if (!PDB.pptShow) {
        PDB.tool.setProgressBar(e.loaded, e.total);
      }
    };

    xhr.onerror = function(e) {
      if (!PDB.pptShow) {
        PDB.tool.progressBar.value = e.loaded;
        PDB.tool.printProgress("Error: EMD-" + mapid);
      }

    };

    var url = scope.getURLByType(mapid, type);
    if (PDB.pptShow) {
      url = SERVERURL + '/' + url;
    }
    console.log(url);
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.send();
  },
  loadMapFromFile: function(response, type, onCallBack) {
    var scope = this;
    if (type === "gz") {
      var gunzip = new Zlib.Gunzip(new Uint8Array(response));
      var plain = gunzip.decompress();
      var emmap = scope.parseMap(plain.buffer, 200);
      onCallBack(emmap) // showMap(emmap);
    } else if (type === "mrc") {
      var emmap = scope.parseMap(response, 200);
      onCallBack(emmap) // showMap(emmap);
    }

  },
  parseMap: function(data, mapid) {
    var start = new Date();
    header_int = new Int32Array(data, 0, 56);
    header_float = new Float32Array(data, 0, 56);
    map_header = {};
    map_header.NC = header_int[0];
    map_header.NR = header_int[1];
    map_header.NS = header_int[2];
    map_header.NCSTART = header_int[4];
    map_header.NRSTART = header_int[5];
    map_header.NSSTART = header_int[6];
    map_header.NX = header_int[7];
    map_header.NY = header_int[8];
    map_header.NZ = header_int[9];
    map_header.a = header_float[10];
    map_header.b = header_float[11];
    map_header.c = header_float[12];
    map_header.alpha = header_float[13];
    map_header.beta = header_float[14];
    map_header.gamma = header_float[15];
    map_header.MAPC = header_int[16];
    map_header.MAPR = header_int[17];
    map_header.MAPS = header_int[18];
    map_header.min = header_float[19];
    map_header.max = header_float[20];
    map_header.mean = header_float[21];
    map_header.ISPG = header_int[22];
    map_header.NSYMBT = header_int[23];
    map_header.ARMS = header_float[54];
    var emmap = {};
    emmap.header = map_header;
    var mapdata = new Float32Array(data, 256 * 4 + map_header.NSYMBT, map_header.NC * map_header.NR * map_header.NS);
    var map = new Array();
    var min = 9999;
    var max = -9999;
    for (var i = 0; i < emmap.header.NS; i++) {
      //if(i%4!=0) continue;
      map[i] = new Array();
      for (var j = 0; j < emmap.header.NR; j++) {
        //if(j%4!=0) continue;
        map[i][j] = new Array()
        for (var k = 0; k < emmap.header.NC; k++) {
          //if(k%4!=0) continue;
          //map[i][j][k] = mapdata[i*emmap.header.NS*emmap.header.NR+ j*emmap.header.NS+ k];
          map[i][j][k] = mapdata[i * emmap.header.NC * emmap.header.NR + j * emmap.header.NC + k];
          // if (min > map[i][j][k]) min =map[i][j][k];
          // if (max < map[i][j][k]) max =map[i][j][k];
        }
      }
    }
    //emmap.header.NS = emmap.header.NS/2;
    //console.log(emmap.header.NS);
    //emmap.header.NR = emmap.header.NR/2;
    //console.log(emmap.header.NR);
    //emmap.header.NC = emmap.header.NC/2;
    //console.log(emmap.header.NC);
    emmap.id = mapid;
    emmap.data = map;
    //emmap.mapdata = mapdata;
    emmap.center = new THREE.Vector3(-emmap.header.NC / 2, -emmap.header.NR / 2, -emmap.header.NS / 2);
    emmap.threshold = (emmap.header.max - emmap.header.mean) / 2;
    emmap.slice = 0;
    var end = new Date();

    console.log("times(ms):" + parseInt(end - start));
    return emmap;
  }
}
