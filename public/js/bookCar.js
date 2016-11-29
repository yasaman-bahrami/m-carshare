/**
 * Created by Bina on 2016-11-21.
 */

$('#bookCarForm').on('submit', function (e) {
    e.preventDefault();
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