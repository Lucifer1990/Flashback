<?php 
// Force download of image file specified in URL query string and which 
// is in the same directory as this script: 
if(!empty($_GET['img'])) 
{ 
   $filename = basename($_GET['img']);
   $foldername = basename($_GET['fol']);// don't accept other directories 
   $path = realpath('../albums/'.$foldername.'/'.$filename);
   $size = @getimagesize($path); 
	
   $fp = @fopen($path, "rb"); 
   if ($fp) 
   { 
       header('Content-type:'.$size['mime']);
	   header('Content-Disposition: attachment; filename="'.$filename.'"');
	   readfile($path); 
 
      exit; 
   } 
} 

?>