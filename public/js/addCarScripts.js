function getLatLangForAddress() {
    var address = document.getElementById("carLocationModal").value;
    if (address.length >= 5) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function (results, sttus) {
            if (sttus == google.maps.GeocoderStatus.OK) {
                var suggestionDivs = "";
                if (results.length == 0) {
                    suggestionDivs = "<div>No results were found. Change your search.</div>"
                } else {
                    for (var i in results) {
                        var lat = results[0].geometry.location.lat();
                        var lng = results[0].geometry.location.lng();
                        suggestionDivs += "<div class='suggested-item' onclick='setThisSuggestionAsLocation(this);'>" +
                            "<div class='suggested-address'>" + results[i].formatted_address + "</div>" +
                            "<div class='suggested-lat'>" + lat + "</div>" +
                            "<div class='suggested-lng'>" + lng + "</div>" +
                            "</div>";
                    }
                }
                $("#locationSuggestions").html(suggestionDivs);
                $("#locationSuggestions").show();
            } else {
                console.log("Failed to retrieve any address information");
            }

        });
    }

}
function setThisSuggestionAsLocation(obj) {
    var address = ($(obj).find('.suggested-address').text());
    var lat = ($(obj).find('.suggested-lat').text());
    var lng = ($(obj).find('.suggested-lng').text());
    $("#carLocationModal").val(address);
    $("#carLatitudeModal").val(lat);
    $("#carLongitudeModal").val(lng);
    $("#locationSuggestions").hide().html("");
}


$('#addCarForm').on('submit', function (e) {
    var carName = $("#carNameModal").val();
    var carModel = $("#carModelModal").val();
    var carType = $("#carTypeModal").val();
    var carPlateNumber = $("#carPlateNumberModal").val();
    var carPrice = $("#carPriceModal").val();
    var carLocation = $("#carLocationModal").val();
    var carLatitude = $("#carLatitudeModal").val();
    var carLongitude = $("#carLongitudeModal").val();
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/pages/addCar',
        data: $('#addCarForm').serialize(),
        success: function (result) {
            if (result == "ERROR") {
                alert("A problem occured. Try again later.");
            } else {
                var tr = "<tr id='car-row-"+result._id+"'>";
                $("#modal-container-393651").modal('hide');
                tr += "<td><input type='checkbox' id='" + result._id + "'/></td>";
                tr += "<td>" + result.carType.type + "</td>";
                tr += "<td>" + result.carName + ", "+ result.carModel+ "</td>";
                tr += "<td>" + result.locationName + "</td>";
                tr += "<td>" + ((result.isAvailable) ? 'Available' : 'Unavailable') + "</td>";
                tr += "</tr>";
                $("#modal-container-393651 .form-group input").each(function () {
                    $(this).val("");
                });
                $("#addedCarsBody").append(tr);
            }
        },
        error: function () {
            alert("A problem occured. Try again later.");
        }
    });
    // e.preventDefault();
});

function deleteRow() {
    var table = document.getElementById("carTable").tBodies[0];
    var rowCount = table.rows.length;
    var ids = [];
    var toBeDeletedRowNos = [];
    for (var i = 0; i < rowCount; i++) {
        var row = table.rows[i];
        var chkbox = row.cells[0].getElementsByTagName('input')[0];
        if ('checkbox' == chkbox.type && true == chkbox.checked) {
            ids.push($(chkbox).attr('id'));
            toBeDeletedRowNos.push(i);
        }
    }
    console.log(toBeDeletedRowNos);
    $.ajax({
        type: 'post',
        url: '/pages/deleteCars',
        data: {ids: ids},
        success: function (result) {
            var table = document.getElementById("carTable").tBodies[0];
            for(var i in ids){
                $("#car-row-"+ids[i]).remove();
            }
        },
        error: function () {
            alert("A problem occured. Try again later.");
        }
    });
    $('#modal-container-393652').modal('hide');
}