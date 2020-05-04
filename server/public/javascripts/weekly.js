weekly = (weekStart, weekEnd) => {
    var sYear = weekStart.getFullYear();
    var sMonth = (parseInt(weekStart.getMonth()) + 1);
    var sDay = weekStart.getDate();
    var eYear = weekEnd.getFullYear();
    var eMonth = (parseInt(weekEnd.getMonth()) + 1);
    var eDay = weekEnd.getDate();

    var stDate = sYear + '-' + sMonth + '-' + sDay;
    var edDate = eYear + '-' + eMonth + '-' + eDay;


    var html = "<div id='ddate'><a href=# id='prev'><</a>" + "<span>" + stDate + "</span>" + ' ~ ' + "<span>" + edDate + "</span>" + "<a href=# id='next'>></a></div>";
    $("#weekly").html(html);

    var prevBtn = document.getElementById('prev');
    var nextBtn = document.getElementById('next');
    // prevBtn.onclick = () => {
    //     prev = new Date(weekEnd.valueOf() + 7 * 86400000);
    // }

    nextBtn.onclick = () => {
        s = new Date(weekEnd.valueOf() + 1 * 86400000);
        e = new Date(weekEnd.valueOf() + 7 * 86400000);
        weekly(s, e)
    }
    prevBtn.onclick = () => {
        s = new Date(weekStart.valueOf() - 7 * 86400000);
        e = new Date(weekStart.valueOf() - 1 * 86400000);
        weekly(s, e)
    }
}
