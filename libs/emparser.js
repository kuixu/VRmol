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
		PDB.tool.showSegmentholder(false);
      }

    };

    var url = scope.getURLByType(mapid, type);
    if (PDB.pptShow) {
      url = SERVERURL + '/' + url;
    }
    //console.log(url);
	if(!url){
		PDB.tool.showSegmentholder(false);
	}
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
  parseMap: function(data_bin, mapid) {
    var start = new Date();
    header_int = new Int32Array(data_bin, 0, 56);
    header_float = new Float32Array(data_bin, 0, 56);
    map_header = {};
    map_header.NX      = header_int[0]; // NC - columns (fastest changing)
    map_header.NY      = header_int[1]; // NR - rows
    map_header.NZ      = header_int[2]; // NS - sections (slowest changing)
    // mode
    //  0 image : signed 8-bit bytes range -128 to 127
    //  1 image : 16-bit halfwords
    //  2 image : 32-bit reals
    //  3 transform : complex 16-bit integers
    //  4 transform : complex 32-bit reals
    //  6 image : unsigned 16-bit range 0 to 65535
    // 16 image: unsigned char * 3 (for rgb data, non-standard)
    map_header.MODE    = header_int[3];
    map_header.NXSTART = header_int[4];
    map_header.NYSTART = header_int[5];
    map_header.NZSTART = header_int[6];
    map_header.MX = header_int[7];
    map_header.MY = header_int[8];
    map_header.MZ = header_int[9];
    map_header.xlen = header_float[10];
    map_header.ylen = header_float[11];
    map_header.zlen = header_float[12];
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
    map_header.originX = header_float[ 49 ];
    map_header.originY = header_float[ 50 ];
    map_header.originZ = header_float[ 51 ];
    map_header.ARMS = header_float[54];

    ix = map_header.MAPC - 1;
    iy = map_header.MAPR - 1;
    iz = map_header.MAPS - 1;

    //var offset = (offset[ix], offset[iy], offset[iz])

    map_header.voxelsize = new THREE.Vector3(map_header.xlen/map_header.MX,
      map_header.ylen/map_header.MY,
      map_header.zlen/map_header.MZ);
    map_header.offset = [map_header.NXSTART + map_header.originX,
      map_header.NYSTART + map_header.originY,
      map_header.NZSTART + map_header.originZ];
    map_header.offset = new THREE.Vector3(map_header.offset[ix], map_header.offset[iy],
      map_header.offset[iz]);
    // NEEED to comfirm
    // map_header.offset = map_header.offset.divide( map_header.voxelsize) ;
    //map_header.offset = map_header.offset.multipy( map_header.voxelsize) ;


    const h = map_header

    const basisX = [
      h.xlen,
      0,
      0
    ]

    const basisY = [
      h.ylen * Math.cos(Math.PI / 180.0 * h.gamma),
      h.ylen * Math.sin(Math.PI / 180.0 * h.gamma),
      0
    ]

    const basisZ = [
      h.zlen * Math.cos(Math.PI / 180.0 * h.beta),
      h.zlen * (
        Math.cos(Math.PI / 180.0 * h.alpha) -
        Math.cos(Math.PI / 180.0 * h.gamma) *
        Math.cos(Math.PI / 180.0 * h.beta)
      ) / Math.sin(Math.PI / 180.0 * h.gamma),
      0
    ]
    basisZ[ 2 ] = Math.sqrt(
      h.zlen * h.zlen * Math.sin(Math.PI / 180.0 * h.beta) *
      Math.sin(Math.PI / 180.0 * h.beta) - basisZ[ 1 ] * basisZ[ 1 ]
    )

    const basis = [ 0, basisX, basisY, basisZ ]
    const nxyz = [ 0, h.MX, h.MY, h.MZ ]
    const mapcrs = [ 0, h.MAPC, h.MAPR, h.MAPS ]

    const matrix = new THREE.Matrix4()

    matrix.set(
      basis[ mapcrs[1] ][0] / nxyz[ mapcrs[1] ],
      basis[ mapcrs[2] ][0] / nxyz[ mapcrs[2] ],
      basis[ mapcrs[3] ][0] / nxyz[ mapcrs[3] ],
      0,
      basis[ mapcrs[1] ][1] / nxyz[ mapcrs[1] ],
      basis[ mapcrs[2] ][1] / nxyz[ mapcrs[2] ],
      basis[ mapcrs[3] ][1] / nxyz[ mapcrs[3] ],
      0,
      basis[ mapcrs[1] ][2] / nxyz[ mapcrs[1] ],
      basis[ mapcrs[2] ][2] / nxyz[ mapcrs[2] ],
      basis[ mapcrs[3] ][2] / nxyz[ mapcrs[3] ],
      0,
      0, 0, 0, 1
    )

    matrix.setPosition(new THREE.Vector3(
      h.originX, h.originY, h.originZ
    ))

    matrix.multiply(new THREE.Matrix4().makeTranslation(
      h.NXSTART, h.NYSTART, h.NZSTART
    ))

    //return matrix

    map_header.matrix = matrix ;

    var emmap = {};
    var mapdata = [] ;
    emmap.header = map_header;
    if (map_header.MODE === 2) {
      mapdata = new Float32Array(data_bin, 256 * 4 + map_header.NSYMBT,
        map_header.NX * map_header.NY * map_header.NZ);
    } else if (map_header.MODE === 0) {
      mapdata = new Float32Array(new Int8Array(
        data_bin, 256 * 4 + map_header.NSYMBT,
        map_header.NX * map_header.NY * map_header.NZ
      ));
    }else {
      console.error('EM parser unknown mode: ', map_header.MODE)
    }
    var map = new Array();
    var min = 9999;
    var max = -9999;
    for (var i = 0; i < emmap.header.NZ; i++) {
      map[i] = new Array();
      for (var j = 0; j < emmap.header.NY; j++) {
        map[i][j] = new Array()
        for (var k = 0; k < emmap.header.NX; k++) {
          map[i][j][k] = mapdata[i * emmap.header.NX * emmap.header.NY + j * emmap.header.NX + k];
        }
      }
    }
    // for (var i = 0; i < emmap.header.NZ; i++) {
    //   for (var j = 0; j < emmap.header.NY; j++) {
    //     for (var k = 0; k < emmap.header.NX; k++) {
    //emmap.header.NS = emmap.header.NS/2;
    //console.log(emmap.header.NS);
    //emmap.header.NR = emmap.header.NR/2;
    //console.log(emmap.header.NR);
    //emmap.header.NC = emmap.header.NC/2;
    //console.log(emmap.header.NC);
    emmap.id = mapid;
    emmap.data = map;
    //emmap.mapdata = mapdata;
    emmap.center = new THREE.Vector3(-emmap.header.NX / 2, -emmap.header.NY / 2, -emmap.header.NZ / 2);
    emmap.threshold = (emmap.header.max - emmap.header.mean) / 2;
    emmap.slice = 0;
    var end = new Date();

    console.log("times(ms):" + parseInt(end - start));
    return emmap;
  }
}
