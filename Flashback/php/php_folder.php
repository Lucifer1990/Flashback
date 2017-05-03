<?php
$get_folder = trim($_POST['folderName']);
$filename = "../albums/" .$get_folder;
if (!file_exists($filename)) {
	mkdir ("../albums/" . $get_folder, 0777);
	echo "done";
}
else{
  echo "exists" ;	
}
?>