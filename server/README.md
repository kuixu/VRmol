# Database Connection 


## Statistics

Kuis-iMac:dload kuixu$ wl uniprot_pdb_none.tab
    6153 uniprot_pdb_none.tab
Kuis-iMac:dload kuixu$ wl uniprot_pdb.tab 
  159552 uniprot_pdb.tab



## Mutation data API
http://vr.zhanglab.net/server/api.php?taskid=10&pdbid=1MBD&ds=tcga
```
{
  "code": 0,
  "message": "no corresponding Uniprot-AC"
}
```

http://vr.zhanglab.net/server/api.php?taskid=10&pdbid=2YGD&ds=ccle
```
{
  "code": 0,
  "message": "no mutation information in the current CCLE database."
}
```


http://vr.zhanglab.net/server/api.php?taskid=10&pdbid=2YGD&ds=tcga
```
{
  "code": 1,
  "data": {
    "mutations": [
      {
        "id": "832951",
        "v_class": "Missense_Mutation",
        "v_type": "SNP",
        "g_change": "g.chr11:111779667C>G",
        "p_change": "p.E117Q",
        "disease": "UCEC",
        "pos": "117"
      },
      {
        "id": "832952",
        "v_class": "Missense_Mutation",
        "v_type": "SNP",
        "g_change": "g.chr11:111781056G>A",
        "p_change": "p.R107C",
        "disease": "UCEC",
        "pos": "107"
      },
      {
        "id": "832953",
        "v_class": "Silent",
        "v_type": "SNP",
        "g_change": "g.chr11:111781108G>T",
        "p_change": "p.L89L",
        "disease": "UCEC",
        "pos": "89"
      },
      {
        "id": "79882",
        "v_class": "Silent",
        "v_type": "SNP",
        "g_change": "g.chr11:111779560G>A",
        "p_change": "p.V152V",
        "disease": "SKCM",
        "pos": "152"
      },
      {
        "id": "118368",
        "v_class": "Missense_Mutation",
        "v_type": "SNP",
        "g_change": "g.chr11:111782377A>C",
        "p_change": "p.F24L",
        "disease": "SKCM",
        "pos": "24"
      },
      {
        "id": "390477",
        "v_class": "Silent",
        "v_type": "SNP",
        "g_change": "g.chr11:111782347C>T",
        "p_change": "p.E34E",
        "disease": "STAD",
        "pos": "34"
      },
      {
        "id": "646695",
        "v_class": "Missense_Mutation",
        "v_type": "SNP",
        "g_change": "g.chr11:111779603G>A",
        "p_change": "p.S138L",
        "disease": "LUAD",
        "pos": "138"
      }
    ],
    "chains": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X"
    ],
    "pdbid": "2YGD",
    "dataset": "tcga"
  },
  "message": "success"
}
```


## Conservation data API
http://vr.zhanglab.net/server/api.php?taskid=11&pdbid=3IVD&chain=A
```
{
    code: 1,
    datas: [
    {
        pos: "1",
        seq: "M",
        resname: "",
        resid: "",
        chain: "",
        score: "0.013",
        color: "5",
        confinter: "-0.705,0.469",
        confintercolor: "7,4",
        msa: "8/301",
        resvar: "F,M,D,L"
    },
    {
        pos: "2",
        seq: "S",
        resname: "",
        resid: "",
        chain: "",
        score: "0.253",
        color: "4",
        confinter: "-0.355,0.687",
        confintercolor: "6,3",
        msa: "20/301",
        resvar: "A,S,T,D,K,G"
    },
...
```

## Drug data API
http://vr.zhanglab.net/server/api.php?taskid=12&pdbid=2BR9
```
{
    code: 1,
    data: [
        {
            id: "77",
            uniprotac: "P62258",
            bindingdb: "",
            chembl: "CHEMBL3329082;",
            swisslipids: "",
            guidetopharmacology: "",
            drugbank: "DB01780;"
        }
    ],
    message: "success"
}
```

## EMDB
http://vr.zhanglab.net/server/api.php?taskid=13&pdbid=1MI6
```
{
   code: 1,
   data: [
       "1006",
       "1007",
       "1008",
       "1009",
       "1010"
   ],
   message: "success"
}
```
