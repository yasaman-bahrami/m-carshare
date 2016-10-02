function addCar() {
    var table = document.getElementById("carTable").innerHTML;
	var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell3 = row.insertCell(3);
    cell1.innerHTML = "NEW CELL1";
    cell2.innerHTML = "NEW CELL2";
	cell3.innerHTML = "NEW CELL2";
	cell4.innerHTML = "NEW CELL2";
}
$("#addCar").click( function () { 
	var carTypeModal = $( "#carTypeModal" ).val();
	var carNameModal = $( "#carNameModal" ).val();
	var carNumberModal = $( "#carNumberModal" ).val();
	var seconds = new Date().getTime();
	var row = $("<tr id='"+seconds+"'>");
	row.append($('<td ><input type="checkbox"></td>'))
		.append($("<td>"+carNumberModal+"</td>"))
		.append($("<td>"+carTypeModal+"</td>"))
		.append($("<td>"+carNameModal+"</td>"));
	 
		$("#carTable tbody").append(row);
		$('#modal-container-393651').modal('hide');
});
function deleteRow()  {
        var table = document.getElementById("carTable").tBodies[0];
        var rowCount = table.rows.length;

        for(var i=1; i<rowCount; i++) {
            var row = table.rows[i];
            var chkbox = row.cells[0].getElementsByTagName('input')[0];
            if('checkbox' == chkbox.type && true == chkbox.checked) {
                table.deleteRow(i);
             }
        }
		$('#modal-container-393652').modal('hide');
}