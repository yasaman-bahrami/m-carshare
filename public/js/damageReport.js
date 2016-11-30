/**
 * Created by Sam on 2016-11-24.
 */

// retrieve the bill id for each damage
function btnDamageReportClicked(myId){
$("#myBill").text("Bill: #" + myId);
$("#billno").val(myId);
}
// update the popup of edit damage for the admin
function btnDamageEditClicked(damageId, damageAmount){
    //alert(damageId);
    $("#dmgAmount").val(damageAmount);
    $("#damageNo").val(damageId);
}

// Only one damage can be clicked at a time
$('input.myDamages').on('change', function() {
    $('input.myDamages').not(this).prop('checked', false);
});

$('#addDamageReportForm').on('submit', function (e) {
    var description = $("#description").val();
    var amount = $("#amount").val();
    var damageType = $("#damageType").val();
    var billno = $("#billno").val();
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/pages/myCurrentCar',
        data: $('#addDamageReportForm').serialize(),
        success: function (result) {
            if (result == "ERROR") {
                alert("A problem occured. Try again later.");
            } else {
	            $("#modal-"+billno).fadeOut("slow",function(){
	                $("div.col-md-6 button#"+billno).parent().append('<div id= "damageReported-'+billno+'" class="alert alert-dismissible alert-danger" style="margin-top: 5px;"> <strong>Damage Already Reported!</strong> <a href=tel:555-555-5555" class="alert-link"><i class="fa fa-mobile" aria-hidden="true"> Please call us.</i></a> </div>');
                });
	            $('#modal-container-1').modal('hide');
            }
        },
        error: function () {
            alert("A problem occured. Try again later.");
        }
    });
    // e.preventDefault();
});

$('#editDamageForm').on('submit', function (e) {
    var dmgAmount = $("#dmgAmount").val();
    var dmgId = $("#damageNo").val();
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/pages/carDamageReports',
        data: $('#editDamageForm').serialize(),
        success: function (result) {
            if (result == "ERROR") {
                alert("A problem occured. Try again later.");
            } else {
                $("#damageCarReportBody tr#damage-row-"+dmgId+" td#d_r_amount").html(dmgAmount);
                $('#modal-container-393652').modal('hide');

            }
        },
        error: function () {
            alert("A problem occured. Try again later.");
        }
    });
});
