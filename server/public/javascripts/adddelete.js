addOrderList = () => {
    if (document.getElementById('item_nm').childNodes[0] == undefined) {
        window.alert('제품이 입력되지 않았습니다')
    } else if ( document.getElementById('item_cnt').value == '' ) {
        window.alert('제품 요청 수량이 입력되지 않았습니다')
    } else {
        count++;
        var row_nm = document.getElementById('item_nm').childNodes[0].textContent;
        var row_code = document.getElementById('item_code').childNodes[0].textContent;
        var row_cp = document.getElementById('item_cp').childNodes[0].textContent;
        var row_cnt = document.getElementById('item_cnt').value;
        var row_price = document.getElementById('item_price').value;
        var row_rt = document.getElementById('item_rt').value;
        var row_dnt = $('input[name="item_dnt"]:checked').val();
        var row_pmt = $('input[name="item_pmt"]:checked').val();
        var row_sup = document.getElementById('item_sup').value;
        var row_void = document.getElementById('item_void').value;

        var objRow;
        objRow = document.all('tblShow').insertRow();

        //No.
        var objCell_Num = objRow.insertCell();
        objCell_Num.innerHTML = count;

        //Product Code
        var objCell_Code = objRow.insertCell();
        objCell_Code.innerHTML = row_code;

        //Product Name
        var objCell_Name = objRow.insertCell();
        objCell_Name.innerHTML = row_nm;

        //Product Capacity(Volume)
        var objCell_Cp = objRow.insertCell();
        objCell_Cp.innerHTML = row_cp;

        //Product Count
        var objCell_Cnt= objRow.insertCell();
        objCell_Cnt.innerHTML = row_cnt;
        
        //Price
        var objCell_Price= objRow.insertCell();
        objCell_Price.innerHTML = row_price;

        //Requestor
        var objCell_Rt= objRow.insertCell();
        objCell_Rt.innerHTML = row_rt;

        //Supply Purpose (Distinct)
        var objCell_Dnt = objRow.insertCell();
        objCell_Dnt.innerHTML = row_dnt;

        //Payment
        var objCell_Pmt = objRow.insertCell();
        objCell_Pmt.innerHTML = row_pmt;

        //Supplier
        var objCell_Sup = objRow.insertCell();
        objCell_Sup.innerHTML = row_sup;

        //Note
        var objCell_Void = objRow.insertCell();
        objCell_Void.innerHTML = row_void;
    }
}
deleteOrderList = () => {
    if(count < 1) {
        count = 1;
    }
    count--;
    var tblContent = document.getElementById('tblShow');
    //If There is no Data at all, Do Nothing.
    if (tblContent.rows.length < 1) return;

    //Delete From Last Table
    tblContent.deleteRow(tblContent.rows.length-1);
}