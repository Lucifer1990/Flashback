/**
*   Generic function to handle ajax calls.
*
*   parameters : 
*		*url - http request url
*		type - GET or POST (default is GET if not provided)
*		json data - data in json format
*		cache - true or false (default is false if not provided)
*		async - true or false (default is false if not provided)
*	
*   return : response
*
**/
function ajaxRequestHandler(pUrl, pType, pJsonData, pCache, pAsync) {

	
	
	var responseData = false;
	
    if (!pUrl) {
        return;
    }

    var information = JSON.stringify(pJsonData);
	
    var urlVal = pUrl;
    var typeVal = "GET";
    if (pType)
        typeVal = pType;

    var cacheVal = false;
    if (pCache)
        cacheVal = pCache;

    var asyncVal = false;
    if (pAsync)
        asyncVal = pAsync;

    $.ajax({
        url: urlVal,
        type: typeVal,
        cache: cacheVal,
        //dataType: "json",
        async: asyncVal,
        data:pJsonData,
       // contentType: "application/json",
        success: function(response) {

            if (response) {
                responseData = response;
            } else {
                responseData = false;
            }
        },

        error: function(xhr, status, errorThrown) {
            //console.log("Error in httpRequest " + xhr + " - " + status + " - " + errorThrown);
            responseData = xhr + " - " + status + " - " + errorThrown;
            BootstrapDialog.show({
                title: 'Error',
                message: xhr.status+' '+xhr.statusText,
                buttons: [{
            	  label: 'Ok',
            	  cssClass: 'btn btn-primary customPrimary',
            	  action: function(dialog) {
            		dialog.close();
            	  }
                }]
              }); 
        }

    });

	return responseData;
}