<?php
//
// Created by Kui XU on 2017/08/08.
// mail: xukui.cs@gmail.com
//
//var_dump(parseConservationData("http://bental.tau.ac.il/new_ConSurfDB/DB/3IVE/A/consurf.grades"));
//parseConservationScoreByURL("http://bental.tau.ac.il/new_ConSurfDB/DB/3IVE/A/consurf.grades");
function parseConservationDataURL($pdbid,$chain){

		$url="http://bental.tau.ac.il/new_ConSurfDB/main_output.php?pdb_ID=".$pdbid."&view_chain=files_".$chain;
		$ch = curl_init();
		$timeout = 5;
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$html = curl_exec($ch);
		curl_close($ch);

		# Create a DOM parser object
		$dom = new DOMDocument();

		# Parse the HTML from Google.
		# The @ before the method call suppresses any warnings that
		# loadHTML might throw because of invalid HTML in the page.
		@$dom->loadHTML($html);
		$confurl=null;
		# Iterate over all the <a> tags
		foreach($dom->getElementsByTagName('form') as $link) {
		        # Show the <a href>
		        $a = $link->getAttribute('action');
		        #echo $a."\n";
		        if(strpos($a,'consurf.grades') !== false){
		                $confurl = $a;
		        }
		}

		return  $confurl;
}


class simpleForm
{
    private $pos;
    private $seq;
    private $resname;
    private $resid;
    private $chain;
    private $score;
    private $color;
    private $confidenceInterval;
    private $confidenceIntervalColors;
    private $msaData;
    private $residueVariety;
    public function __construct($pos,$seq,$resname,$resid,$chain,$score,$color,$confidenceInterval,$confidenceIntervalColors,$msaData,$residueVariety) {
        $this->pos = $pos;
        $this->seq = $seq;
        //$this->latom = $latom;
        $this->resname = $resname;
        $this->resid = $resid;
        $this->chain = $chain;
        $this->score = $score;
        $this->color = $color;
        $this->confidenceInterval = $confidenceInterval;
        $this->confidenceIntervalColors = $confidenceIntervalColors;
        $this->msaData = $msaData;
        $this->residueVariety = $residueVariety;

    }
	  public function tofullarray(){
			$cons = array(
				"pos" => $this->pos,
				"seq" => $this->seq,
				"resname" => $this->resname,
				"resid" => $this->resid,
				"chain" => $this->chain,
				"score" => $this->score,
				"color" => $this->color,
				"confinter" => $this->confidenceInterval,
				"confintercolor" => $this->confidenceIntervalColors,
				"msa" => $this->msaData,
				"resvar" => $this->residueVariety,
			);
	    return $cons;
	  }
    public function toarray(){
        $cons = array(
            "pos" => $this->pos,
            "seq" => $this->seq,
            "resname" => $this->resname,
            "resid" => $this->resid,
            "chain" => $this->chain,
            "score" => $this->score,
            "color" => $this->color,
        );
    return $cons;
    }
}

function parseConservationScoreByURL($url){
    $ch = curl_init();
    $timeout = 5;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    $html = curl_exec($ch);
    curl_close($ch);
    $html = stristr($html,"alignment");
    $parttern = '/\s\s+/';
    $arr = preg_split($parttern, $html);
    $start = $arr[0];
    $end = end($arr);
    //var_dump($html);
    //echo $html;
    //echo $start;
    //echo $end;
    $html = str_replace($start, "", $html);
    $html = str_replace($end, "", $html);
    //echo $html;
    $h = $html;
    $h = str_replace(', ', ",", $h);
    $tab = preg_split('/\s+/', $h);
    //var_dump($tab);
    $res = array();
    $len = count($tab);
    //echo $len;
    for($i=0;$i<$len;$i++) {
        if($tab[$i] == 1) {
            //$s = $i;
            break;
        }
    }
    //echo $tab[$i];
    //echo $i;
    for(;$i+9<count($tab);) {
        $tab2 = $tab[$i+2];
        //echo $tab2;
        if(strlen($tab2) > 3) {
            $tab2 = str_replace(":", ",", $tab2);
            $tab2 = substr_replace($tab2, ",", 3,0);
            $resArr = explode(",", $tab2);
            $resname = $resArr[0];
            $resid = $resArr[1];
            $chain = $resArr[2];
        }else{
            $resname = "";
            $resid = "";
            $chain = "";
        }

        $temp = new simpleForm($tab[$i],$tab[$i+1],$resname,$resid,$chain,$tab[$i+3],$tab[$i+4],$tab[$i+5],$tab[$i+6],$tab[$i+7],$tab[$i+8],$tab[$i+9]);
        array_push($res, $temp->toarray());
        $i += 9;
    }
    //echo "string";
    return $res;
}

function parseConservationData($pdbid,$chain){
		$confurl =  parseConservationDataURL($pdbid,$chain);
		$data = parseConservationScoreByURL($confurl);
		//echo $response;
		if($data!==null ){
		        $msgArray = array('code'=>1, 'data'=>$data, 'message'=>'success');
		}else{
		        $msgArray = array('code'=>0, 'data'=>null, 'message'=>'no conservation score');
		}
		return $msgArray;
}

?>
