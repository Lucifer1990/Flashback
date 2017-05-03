<?php
	$get_folder = trim($_GET['albumName']);
	$target_dir = realpath("../albums/".$get_folder);   
    $zip = new ZipArchive;
    $zip->open($target_dir.".zip", ZipArchive::CREATE) ;
		
    if ($handle = opendir($target_dir)) 
	{
      while ($entry = readdir($handle)) 
	  {
		  if($entry!='.' && $entry!='..')
		  		$zip->addFile($target_dir.'/'.$entry,$get_folder.'/'.$entry);
        
      }
      closedir($handle);
    }

$zip->close();

   header('Content-disposition: attachment; filename='.$get_folder.'.zip');
            header('Content-type: application/zip');
            readfile($target_dir.".zip");
unlink($target_dir.".zip") ;
    ?>