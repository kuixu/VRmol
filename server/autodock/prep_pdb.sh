#!/bin/bash
#
# Created by Kui XU on 2018/09/08.
# mail: xukui.cs@gmail.com
#
if [ $# -gt 0 ];then
  proteinFile=$1

  # If no protein file is present, die.
  if [[ ! -f $proteinFile ]];then
    die "File $proteinFile does not exist."
  fi

  # check the file extension
  if [[ ${proteinFile##*.} == pdb ]];then
    IS_PDB=true;
  elif [[ ${proteinFile##*.} == pdbqt ]];then
    IS_PDBQT=true;
  else
    IS_PDB=false;
    IS_PDBQT=false;
  fi



  # check the contents
  numChars=`grep -m 1 ^ATOM $proteinFile | wc -m`;
  numWords=`grep -m 1 ^ATOM $proteinFile | wc -w`;
  if [[ $numWords -gt 12 ]];then
    LOOKS_LIKE_PDBQT=true;
  else
    LOOKS_LIKE_PDBQT=false;
  fi

echo "LOOKS_LIKE_PDBQT = $LOOKS_LIKE_PDBQT";

  # I'd like to have more rigorous testing in place to distinguish between pdb
  # and pdbqt, but I'll start with this.
  if [[ $IS_PDBQT != true ]]; then

  echo "Converting Protein from PDB to PDBQT..."

  # the skeleton for this script was taken from Stan Watowich's group
  # It looks like this line removes all HETATMs, which I can only guess
  # is intended to delete a ligand if there happens to be one in the file.
  # I'm a little concerned about this deleting ions.
  sed -i '/^HETATM/d' $proteinFile
        MGLTOOLS_LOCATION="/home/vr/tools/mgltools_x86_64Linux2_1.5.6";
        #MGLTOOLS_LOCATION="/home/t7910/mgltools_x86_64Linux2_1.5.6";
        PYTHON_INTERPRETER="$MGLTOOLS_LOCATION/bin/pythonsh";
        LIGAND_SCRIPT="$MGLTOOLS_LOCATION/MGLToolsPckgs/AutoDockTools/Utilities24/prepare_ligand4.py";
        RECEPTOR_SCRIPT="$MGLTOOLS_LOCATION/MGLToolsPckgs/AutoDockTools/Utilities24/prepare_receptor4.py";
        PARAMS="-A hydrogens_bonds -U nphs_lps_waters_nonstdres";
        INFILE="-r $proteinFile";
        pdbqtFile="`basename $proteinFile .pdb`.pdbqt";
        OUTFILE="-o $pdbqtFile";

        echo "running: $PYTHON_INTERPRETER $RECEPTOR_SCRIPT $INFILE $OUTFILE $PARAMS";

        $PYTHON_INTERPRETER $RECEPTOR_SCRIPT $INFILE $OUTFILE $PARAMS > /dev/null
  fi
  if [[ ! -f $pdbqtFile ]]
  then
        die "Error: Could not convert .pdb protein file into .pdbqt"
  fi

else
  echo "Usage: pdb2pdbqt.sh proteinFile"
  echo "proteinFile should either be a pdb or pdbqt file."
fi
