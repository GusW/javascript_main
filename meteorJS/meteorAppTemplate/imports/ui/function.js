JSONToCSVConvertor = function(JSONData, ReportTitle) {

    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '";';
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }
    if (CSV == '') {
        alert("Invalid data");
        return;
    }
    var fileName = "List_of_";
    fileName += ReportTitle.replace(/ /g, "_");
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


monthToString = function(monthNumber) {
    let result;
    if (monthNumber.toString().length === 1) {
        result = String("0" + monthNumber);
    } else {
        result = String(monthNumber);
    }
    return result;
};

monthDays = function(monthYear) {
    let days = 0;
    const month = Number(monthYear.substring(0,2));
    const year = Number(monthYear.substring(3,7));
    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12){
        days = 31;
    } else if (month !== 2){
        days = 30;
    } else {
        if (year % 4  === 0 || year % 100 !== 0){
            days = 29;
        } else {
            days = 28;
        }
    }
    return days;
};
