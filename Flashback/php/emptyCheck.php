<?php
	$get_folder = trim($_GET['albumName']);
	$target_dir = realpath("../albums/".$get_folder);   
    $zip = new ZipArchive;
    $zip->open($target_dir.".zip", ZipArchive::CREATE) ;
	if (count(glob($target_dir."/*")) === 0 ) {	
		echo "empty";
		exit;
	}
function is_dir_empty($dir) {
  if (!is_readable($dir)) return NULL; 
  return (count(scandir($dir)) == 2);
}
    ?>