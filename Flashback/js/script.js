// declare global variable
var photos;

// document ready function
$(document).ready(function() {
    getAlbumName();
});

//album name dropdown change event
$('.searchInput').live('autocompleteselect', function(e, ui) {
    var albumName = ui.item.value;
    showRequestedAlbum(albumName);
});

// show requested album
function showRequestedAlbum(albumName) {
    var jsonUrl = 'json/' + albumName + '.json';
    var list = ajaxRequestHandler(jsonUrl, "GET", false, false, false);
    if (list == false) {
        $('.showInfo').text('Sorry! no image found');
        $('.show').show();
    } else if (list.length < 5) {
        $('.showInfo').text('You have to upload atleast 5 photos');
        $('.show').show();
    } else {
        changeCSS();

        photos = list;
        var gallery = $('#gallery');
        gallery.perfectLayout(photos);
        $(window).resize(function() {
            gallery.perfectLayout(photos);
            fancyCall();
        });
        $(window).trigger('resize');

        fancyCall();
    }
}

// change search field CSS
function changeCSS() {
    $('#gallery').removeClass('docReady');
    $('.searchInput').css({
        'width': '400px',
        'height': '30px',
        'border': '2px solid #e74c3c'
    });
    $('.search').css({
        'width': '400px',
        'margin': '12px auto'
    });
    $('.searchIcon').css({
        'margin-top': '-28px',
        'margin-left': '383px'
    });
}
// this function will get all album names
function getAlbumName() {
    $.ajax({
        type: "GET",
        url: "php/albumNames.php",
        success: function(response) {
            var data_obj = JSON.parse(response);
            $("input#autocomplete").autocomplete({
                source: data_obj
            });
            buildAlbumDropdown(data_obj);
        }
    });
}
// call fancybox plugin
function fancyCall() {
    $("a[rel=example_group]").fancybox({
        'transitionIn': 'elastic',
        'transitionOut': 'elastic',
        'titlePosition': 'over',
        'titleFormat': function(title, currentArray, currentIndex, currentOpts) {
            return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
        }
    });
}

// build main gallery
$.fn.perfectLayout = function(photos) {
    var node = this;
    var perfectRows = perfectLayout(photos, $(this).width(), $(window).height(), {
        margin: 2
    });
    node.empty();
    perfectRows.forEach(function(row) {
        row.forEach(function(img) {
            var imgNode = $('<a class="image" rel="example_group" href="' + img.src + '"></a>');
            imgNode.css({
                'width': img.width + 'px',
                'height': img.height + 'px',
                'background': 'url(' + img.src + ')',
                'background-size': 'cover'
            });
            node.append(imgNode);
        });
    });
};

// hover main menu functionality
$('#ham,#mainMenu').mouseover(function() {
    $('#mainMenu').show();
}).mouseout(function() {
    $('#mainMenu').hide();
})


// folder creation
$('#createAlbum').live('click', function() {
    var albumName = $('.albumName').val();
    if (albumName != "") {
		if(/\s/g.test(albumName) == false){
			data = {
				folderName: albumName
			};
			var result = ajaxRequestHandler('php/php_folder.php', 'POST', data, false, false);
			if (result == 'done') {
				$("#modal-1").removeClass("md-show");
				$('.showInfo').text('Album has been created successfully.');
				$('.show').show();
				getAlbumName();
				createJsonFile(albumName);
			} else if (result == 'exists') {
				$('.modalMsg').text('Name already exists');
				$('.modalMsg').show().fadeOut(5000);
			}
		}
		else{
			$('.modalMsg').text('Space is not allowed');
        	$('.modalMsg').show().fadeOut(5000);
		}
    } else {
        $('.modalMsg').text('Name is required');
        $('.modalMsg').show().fadeOut(5000);
    }
});

//create json file with album name
function createJsonFile(albumName) {
    var data = {
        albumName: albumName
    };
    ajaxRequestHandler('php/createAlbumFiles.php', 'POST', data, false, false);
}

//hide after success / validation information
$('.cross').click(function() {
    $('.showInfo').text('');
    $('.show').hide();
})

//show browsed image name
$('#upImage').change(function() {
    var imageName = $(this).val().replace(/^.*[\\\/]/, '');
    if ($(this).val() != "") {
        $('.fileName').html('<i class="fa fa-picture-o fontMargin"></i><span>' + imageName + '</span>');
    } else {
        $('.fileName').html('');
    }
})

// submit image & image details
$('#storeImage').click(function() {
    var trueOrfalse = validation();
    if (trueOrfalse == true) {
        var albumName = $('.albums').val();
        var imageName = $('#upImage').val().replace(/^.*[\\\/]/, '');
        var modeWord = $('.modes').val();
        var title = $('.title').val();
        if (modeWord == "Landscape") {
            mode = 1.5047879616963065;
        } else if (modeWord == "Portrait") {
            mode = 0.6645454545454546;
        }
        var data = {
            albumName: albumName,
            imageName: imageName,
            mode: mode,
            title: title
        };
        $('#formSubmit').ajaxForm({
            contentType: "application/json",
            dataType: 'json',
            data: data,
            success: function(result) {},
            error: function(result) {
                $('.alert').html(result.responseText);
                $('.alert').show().fadeOut(5000);
                if (result.responseText == "The file has been uploaded.") {
                    jsonCreate(data);
                }
                clearAllFields();
            },
        }).submit();
    } else {
        $('.alert').html('Provide proper informations');
        $('.alert').show().fadeOut(5000);
        return false;
    }
});

// json creation
function jsonCreate(data) {
    console.log(data);
    var list = ajaxRequestHandler('php/writeJson.php', 'POST', data, false, false);
    console.log(list);
}

// this function will check validation
function validation() {
    var imageName = $('#upImage').val().replace(/^.*[\\\/]/, '');
    var albumName = $('.albums').val();
    var mode = $('.modes').val();
    if (imageName == "" || albumName == "Select album" || mode == "Select image view mode") {
        return false;
    } else {
        return true;
    }
}

// this function will build album dropdown
function buildAlbumDropdown(data) {
    var options = '';
    var li = '';
    $.each(data, function(i, item) {
        options += '<option value="' + item + '">' + item + '</option>';
        li += '<li value="' + item + '"><span>' + item + '</span><span class="albumArrow"><i class="fa fa-arrow-right icon_left"></i></span><span class="actions"><span title="Explore" class="explore icon_left"><i class="fa fa-paper-plane icon_left"></i></span><span title="Delete full album" class="deltFull icon_left"><i class="fa fa-folder icon_left"></i></span><span title="Delete specific images" class="deltImg icon_left"><i class="fa fa-picture-o icon_left"></i></span><a id="dFullFolder"><span title="Download full album" class="downloadFull icon_left"><i class="fa fa-folder icon_left"></i></span></a><span title="Download specific images" class="downloadImg icon_left"><i class="fa fa-picture-o icon_left"></i></span></span></li>'
    });
    $('.albums').html('').append(options);
    $('.albumsUl').html('').append(li);
}
// ajax call to download full folder
$('#dFullFolder').live('click', function() {
        var aName = $(this).parent().parent().find('span:first').text();
        url = "php/emptyCheck.php?albumName=" + aName + "";
        var result = ajaxRequestHandler(url, 'GET', false, false, false);
        if (result == 'empty') {
            $('.modalMsg').text('Album is empty');
            $('.modalMsg').show().fadeOut(5000);
        } else {
            window.location.href = "php/downloadFolder.php?albumName=" + aName + "";
        }
    })
    // hide/show action icons in modal
$('.deleteClick,.downloadClick,.exploreClick').live('click', function() {
    if ($('#modal-3').hasClass('md-show')) {
        $('.deltFull,.deltImg,.downloadFull,.downloadImg').addClass('noDisplay');
        $('.explore').removeClass('noDisplay');
    } else if ($('#modal-5').hasClass('md-show')) {
        $('.deltFull,.deltImg,.explore').addClass('noDisplay');
        $('.downloadFull,.downloadImg').removeClass('noDisplay');

    } else if ($('#modal-6').hasClass('md-show')) {
        $('.explore,.downloadFull,.downloadImg').addClass('noDisplay');
        $('.deltFull,.deltImg').removeClass('noDisplay');
    }
})

//click view icon
$('.explore').live('click', function() {
    $('.show').hide();
    $("#modal-3").removeClass("md-show");
    var albumName = $(this).parent().parent().find('span:first').text();
    var jsonUrl = 'json/' + albumName + '.json';
    var list = ajaxRequestHandler(jsonUrl, "GET", false, false, false);
    if (list == false) {
        $('.showInfo').text('Sorry! no image found');
        $('.show').show();
    } else if (list.length < 5) {
        $("#modal-3").removeClass("md-show");
        $('.showInfo').text('You have to upload atleast 5 photos');
        $('.show').show();
    } else {
        changeCSS();

        photos = list;
        var gallery = $('#gallery');
        gallery.perfectLayout(photos);
        $(window).resize(function() {
            gallery.perfectLayout(photos);
            fancyCall();
        });
        $(window).trigger('resize');

        fancyCall();
    }
})

// hide/show arrow icon 
$(".actions").live('mouseenter', function() {
    $(this).parent().find('span::eq(1)').show();
});
$(".actions").live('mouseleave', function() {
    $(this).parent().find('span::eq(1)').hide();
});

// delete full album
$('.deltFull').live('click', function() {
    var confirmation = confirm("Once DELETED, the whole album will be lost. Do you want to proceed?");
    if (confirmation == true) {
        var albumName = $(this).parent().parent().find('span:first').text();
        deleteFullAlbum(albumName);
    }
})

//function to delete full album
function deleteFullAlbum(albumName) {
    data = {
        folderName: albumName
    };
    var result = ajaxRequestHandler('php/php_folder_delt.php', 'POST', data, false, false);
    ajaxRequestHandler('php/deleteAlbumFiles.php', 'POST', data, false, false);
    $("#modal-6").removeClass("md-show");
    $('.showInfo').text('Album has been deleted successfully.');
    $('.show').show();
    getAlbumName();
}

function clearAllFields() {
    $('#upImage').val('');
    $('.fileName').html('');
    $('.albums option:eq(0)').attr('selected', 'selected');
    $('.modes option:eq(0)').attr('selected', 'selected');
    $('.albumName[name="val3"]').val('');
}

$(document).live('click', '.gridUI img:first-child', function() {
    $(this).next().toggle();
    $(this).toggleClass('toDelete');
})

// delete images (selected)
$('.deltImg').live('click', function() {
        var albumName = $(this).parent().parent().find('span:first').text();
        showRequestedAlbumForDelete(albumName);
    })
    // show requested album for delete purpose
function showRequestedAlbumForDelete(albumName) {
    var jsonUrl = 'json/' + albumName + '.json';
    var list = ajaxRequestHandler(jsonUrl, "GET", false, false, false);
    if (list != false) {
        var li = '';
        $.each(list, function(i, item) {
            li += '<li title="Delete"><img src="' + item.src + '"/><img class="trashIcon" src="img/7 trash.png"/><input type="hidden" value="' + item.album + '" id="hiddenAlbumName"></li>';
        });
        $("#modal-6").removeClass("md-show");
        $('.gridUI').html('').append(li);
        $("#modal-4").addClass("md-show");
    } else {
        $('.modalMsg').text('Album is empty');
        $('.modalMsg').show().fadeOut(5000);
    }
}
// delete clicked image
$('.gridUI li').live('click', function() {
    var src = $(this).find('img').attr('src');
    var hiddenAlbumName = $(this).find('#hiddenAlbumName').attr('value')
    var data = {
        src: src
    };
    var list = ajaxRequestHandler('php/deleteOneImg.php', "POST", data, false, false);
    if (list == 'deleted') {
        $(this).css('pointer-events', 'none');
        $(this).find('.trashIcon').attr('src', 'img/ok-shield-icon.png');
        var data1 = {
            src: src,
            album: hiddenAlbumName
        }
        var list1 = ajaxRequestHandler('php/deleteImgJson.php', "POST", data1, false, false);
    }
})

// download images (selected)
$('.downloadImg').live('click', function() {
        var albumName = $(this).parent().parent().find('span:first').text();
        showRequestedAlbumForDownload(albumName);
    })
    // show requested album for download purpose
function showRequestedAlbumForDownload(albumName) {
    var jsonUrl = 'json/' + albumName + '.json';
    var list = ajaxRequestHandler(jsonUrl, "GET", false, false, false);
    console.log(list);
    if (list != false) {
        var li = '';
        $.each(list, function(i, item) {
            var src = item.src;
            var fileNameIndex = src.lastIndexOf("/") + 1;
            var filename = src.substr(fileNameIndex);
            li += '<li><a href="php/downloadImage.php?img=' + filename + '&fol=' + albumName + '" title="Download"><img src="' + item.src + '"/><img class="Dicon" src="img/Graphicloads-100-Flat-2-Arrow-download.ico"/></a></li>';
        });
        $("#modal-5").removeClass("md-show");
        $('.gridUIDownload').html('').append(li);
        $("#modal-7").addClass("md-show");
    } else {
        $('.modalMsg').text('Album is empty');
        $('.modalMsg').show().fadeOut(5000);
    }
}

// custom modal close
$('.inputButton').live('click', function() {
    $("#modal-7,#modal-4").removeClass("md-show");
})