$('#bookCarForm').on('submit', function (e) {
    e.preventDefault();
    if (!calculateDuration()) {
        alert("Duration can't be above 12 hours");
        return;
    };

    var carId = $('#carId').val();
    $.ajax({
        type: 'post',
        url: '/pages/bookCar',
        data: $('#bookCarForm').serialize(),
        success: function (result) {
            if (result == "ERROR") {
                alert("A problem occured. Try again later.");
            } else {
                $("#modal-container-bill").modal('hide');
                $("#modal-container-bill .form-group input").each(function () {
                    $(this).val("");
                });
                $("#modal-container-bill-car").modal('hide');
                $("#modal-container-bill-car .form-group input").each(function () {
                    $(this).val("");
                });
                $("#car-row-"+carId).closest('table').remove();
            }
        },
        error: function () {
            alert("A problem occured. Try again later.");
        }
    });

});

function setCarId(carId) {
    $('#bookCarForm').find('#carId').val(carId);
}

$(document).ready(function(e) {
    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName("pickUpDate")[0].setAttribute('min', today);
    document.getElementsByName("dropOffDate")[0].setAttribute('min', today);
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes();
    document.getElementsByName("pickUpTime")[0].setAttribute('min', time);
});

/**
 * The duration must be within 12 hours
 **/
function calculateDuration() {

    var pickUpDateTime = $('#pickUpDate').val() + " " + $('#pickUpTime').val();
    var dropOffDateTime = $('#dropOffDate').val() + " " + $('#dropOffTime6563').val();
    var timeStart = new Date(pickUpDateTime);
    var timeEnd = new Date(dropOffDateTime);
    var diff = (timeEnd - timeStart) / 60000; //dividing by seconds and milliseconds
    var minutes = diff % 60;
    var hours = (diff - minutes) / 60;

    if ( hours > 12 || (hours == 12 && minutes > 0) ) {
        return false;
    }

    return true;
}