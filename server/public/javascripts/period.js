
    
    // start_year, start_month, start_day Element
    // end_year, end_month, end_day Element
    // referred 6 Element to be set

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var today = year + '-' + month + '-' + day;

    var date = document.getElementById('date');
    date.innerHTML = today;

    var sYear = document.getElementById('start_year');
    var sMonth = document.getElementById('start_month');
    var sDay = document.getElementById('start_day');

    var eYear = document.getElementById('end_year');
    var eMonth = document.getElementById('end_month');
    var eDay = document.getElementById('end_day');

    //Put Initial Value of start_year, end_year
    var nYear = year - 5;
    for (var i = 1; i <= 5; i++) {
        newOption1 = document.createElement('option');
        newOption2 = document.createElement('option');
        if (i == 5) {
            newOption1.setAttribute('selected', 'selected');
            newOption2.setAttribute('selected', 'selected');
        }

        newOption1.innerHTML = nYear + i;
        newOption2.innerHTML = nYear + i;

        sYear.append(newOption1);
        eYear.append(newOption2);
    }

    //Put Initial Value of start_month, end_month
    for(var i = 1; i <= 12; i++) {
        newOption1 = document.createElement('option');
        newOption2 = document.createElement('option');
        if (i == 1) {
            newOption1.setAttribute('selected', 'selected');
            newOption2.setAttribute('selected', 'selected');
        }

        newOption1.innerHTML = i;
        newOption2.innerHTML = i;

        sMonth.append(newOption1);
        eMonth.append(newOption2);

    }

    ///Put Initial value of start_day, end_day
    for(var i = 1; i <= 31; i++) {
        newOption1 = document.createElement('option');
        newOption2 = document.createElement('option');
        if (i == 1) {
            newOption1.setAttribute('selected', 'selected');
            newOption2.setAttribute('selected', 'selected');
        }

        newOption1.innerHTML = i;
        newOption2.innerHTML = i;

        sDay.append(newOption1);
        eDay.append(newOption2);

    }

    //If User Changes Month Value, Bring selected year to distinguish whether selected year is Leap-Year or Non-Leap-Year.
    //Based on Selected Year and Month, Set different Value of day.
    $('#start_month').change(() => {
        var sElement = document.getElementById('start_month').getElementsByTagName('option');
        var syElement = document.getElementById('start_year').value;
        var leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var nonleapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        for (var i = 0; i < sElement.length; i++) {
            sElement[i].removeAttribute('selected');
        }

        if (syElement % 4 == 0) {
            var pageYear = leapYear;
        } else {
            var pageYear = nonleapYear;
        }

        $('#start_month option:selected').attr('selected', 'selected');

        var stMonth = $('#start_month option:selected').val();
        var stDay = $('#start_day');
        stDay.empty('option')
        for (var i = 0; i < pageYear[parseInt(stMonth-1)]; i++) {
            newOption1 = document.createElement('option');
            newOption1.innerHTML = i + 1;
            sDay.append(newOption1);
        }
    })

    $('#end_month').change(() => {
        var sElement = document.getElementById('end_month').getElementsByTagName('option');
        var syElement = document.getElementById('end_year').value;
        var leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var nonleapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        for (var i = 0; i < sElement.length; i++) {
            sElement[i].removeAttribute('selected');
        }

        if (syElement % 4 == 0) {
            var pageYear = leapYear;
        } else {
            var pageYear = nonleapYear;
        }

        $('#end_month option:selected').attr('selected', 'selected');

        var stMonth = $('#end_month option:selected').val();
        var stDay = $('#end_day');
        stDay.empty('option')
        for (var i = 0; i < pageYear[parseInt(stMonth-1)]; i++) {
            newOption2 = document.createElement('option');
            newOption2.innerHTML = i + 1;
            eDay.append(newOption2);
        }
    })

    // Reset Every Selected Value
    $('#start_year').change(() => {

        var stElement = $('#start_month');
        var stDay = $('#start_day');
        stElement.empty();
        stDay.empty();

        for(var i = 1; i <= 12; i++) {
            newOption1 = document.createElement('option');
            if (i == 1) {
                newOption1.setAttribute('selected', 'selected');
            }
            newOption1.innerHTML = i;
            sMonth.append(newOption1);
        }

        for(var i = 1; i <= 31; i++) {
            newOption1 = document.createElement('option');
            if (i == 1) {
                newOption1.setAttribute('selected', 'selected');
            }
            newOption1.innerHTML = i;
            sDay.append(newOption1);
        }
    })
    $('#end_year').change(() => {

        var stElement = $('#end_month');
        var stDay = $('#end_day');
        stElement.empty();
        stDay.empty();

        for(var i = 1; i <= 12; i++) {
            newOption2 = document.createElement('option');
            if (i == 1) {
                newOption2.setAttribute('selected', 'selected');
            }
            newOption2.innerHTML = i;
            eMonth.append(newOption2);
        }

        for(var i = 1; i <= 31; i++) {
            newOption2 = document.createElement('option');
            if (i == 1) {
                newOption2.setAttribute('selected', 'selected');
            }
            newOption2.innerHTML = i;
            eDay.append(newOption2);
        }
    })




