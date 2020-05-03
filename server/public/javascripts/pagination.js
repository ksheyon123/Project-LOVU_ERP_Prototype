paging = async (json, totalData, dataPerPage, pageCount, currentPage) => {
    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹

    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

    var $pingingView = $("#paging");

    var html = "";

    if (prev > 0)
        html += "<a href=# id='prev'><</a> ";

    for (var i = first; i <= last; i++) {
        html += "<a href='#' id=" + i + ">" + i + "</a> ";
    }

    if (last < totalPage)
        html += "<a href=# id='next'>></a>";

    $("#paging").html(html);    // 페이지 목록 생성
    $("#paging a").css("color", "black");
    $("#paging a#" + currentPage).css({
        "text-decoration": "none",
        "color": "red",
        "font-weight": "bold"
    });    // 현재 페이지 표시

    var st = (currentPage - 1) * 10;
    if (currentPage * 10 > totalData) {

        var en = totalData;
        for (var i = st; i < totalData; i++) {

            objRow = document.all('resDataShow').insertRow();
            var newBtn = "<button type='button' onclick='putRequest(" + `${JSON.stringify(json[i])}` + ")'>" + "선택" + "</button>";

            var objCell_Num = objRow.insertCell();
            objCell_Num.innerHTML = i + 1;
            var objCell_Select = objRow.insertCell();
            objCell_Select.innerHTML = newBtn;
            var objCell_Code = objRow.insertCell();
            objCell_Code.innerHTML = json[i][0];
            var objCell_Name = objRow.insertCell();
            objCell_Name.innerHTML = json[i][1];
            var objCell_Cp = objRow.insertCell();
            objCell_Cp.innerHTML = json[i][2];
        }
    } else {
        for (var i = st; i < currentPage * 10; i++) {

            objRow = document.all('resDataShow').insertRow();
            var newBtn = "<button type='button' onclick='putRequest(" + `${JSON.stringify(json[i])}` + ")'>" + "선택" + "</button>";

            var objCell_Num = objRow.insertCell();
            objCell_Num.innerHTML = i + 1;
            var objCell_Select = objRow.insertCell();
            objCell_Select.innerHTML = newBtn;
            var objCell_Code = objRow.insertCell();
            objCell_Code.innerHTML = json[i][0];
            var objCell_Name = objRow.insertCell();
            objCell_Name.innerHTML = json[i][1];
            var objCell_Cp = objRow.insertCell();
            objCell_Cp.innerHTML = json[i][2];
        }
    }

    $("#paging a").click(function () {
        var cell = document.getElementById('resDataShow');
        console.log('cell', cell)
        while (cell.hasChildNodes()) {
            cell.removeChild(cell.firstChild);
        }
        var $item = $(this);
        var $id = $item.attr("id");
        var selectedPage = $item.text();

        if ($id == "next") selectedPage = next;
        if ($id == "prev") selectedPage = prev;

        paging(json, totalData, dataPerPage, pageCount, selectedPage);
    });
}
