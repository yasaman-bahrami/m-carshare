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
	            $("#modal-"+billno).replaceWith($('#damageReported-'+billno));
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
    //alert(dmgAmount);
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/pages/carDamageReports',
        data: $('#editDamageForm').serialize(),
        success: function (result) {
            if (result == "ERROR") {
                alert("A problem occured. Try again later.");
            } else {
                var table = document.getElementById("damageTable").tBodies[0];
                var rowCount = table.rows.length;
                var ids = [];
                var toBeEditedRowNos = [];
                for (var i = 0; i < rowCount; i++) {
                    var row = table.rows[i];
                    var chkbox = row.cells[0].getElementsByTagName('input')[0];
                    if ('checkbox' == chkbox.type && true == chkbox.checked) {
                        ids.push($(chkbox).attr('id'));
                        toBeEditedRowNos.push(i);
                    }
                }
                console.log(toBeEditedRowNos);
                $.ajax({
                    type: 'post',
                    url: '/pages/carDamageReports',
                    data: {ids: ids},
                    success: function (result) {
                        var table = document.getElementById("damageTable").tBodies[0];
                        for(var i in ids){
                            var selected_row = $("#damage-row-"+ids[i]);
                            //table.getElementById('d_r_amount').innerHTML = dmgAmount;

                            //selected_row.get

                            $('#damage-row-'+ ids[i] + ' td:nth-child(3)').html(dmgAmount);

                            //alert();

                            //alert( $("#damage-row-"+ids[i]).html());
                                //.attr('d_r_amount').val("AAA");
                            // $("#damage-row-"+ids[i]).html()


                        }
                    },
                    error: function () {
                        alert("A problem occured. Try again later.");
                    }
                });
                $('#modal-container-393652').modal('hide');

            }
        },
        error: function () {
            alert("A problem occured. Try again later.");
        }
    });
    // e.preventDefault();
});
