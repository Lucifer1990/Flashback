<?php
$get_folder = trim($_POST['folderName']);
$ext = ".json";
$file = "../json/" .$get_folder.$ext;
$path = "../albums/" .$get_folder;
Delete($path);
Delete($file);
function Delete($path)
{
    if (is_dir($path) === true)
    {
        $files = array_diff(scandir($path), array('.', '..'));

        foreach ($files as $file)
        {
            Delete(realpath($path) . '/' . $file);
        }

        return rmdir($path);
		
    }

    else if (is_file($path) === true)
    {
        return unlink($path);
    }

    return false;
}

?>