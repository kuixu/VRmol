#!/bin/bash
mv index.html index_dev.html
mv index_out.html index.html
uglifyjs extension.js  math.js w3m.js  static.js PDBFileCore.js  PDBFileLoader.js PDBFileRender.js PDBFileTool.js PDBFileDrawer.js PDBFilePainter.js PDBFileController.js  index.js \
-c -m -o inano.min.js 
#-c -m --mangle-props -o inano.min.js 
#-c -o inano.min.js 
