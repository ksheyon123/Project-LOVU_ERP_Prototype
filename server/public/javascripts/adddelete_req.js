addOrderList = () => {
    count++;
    var objRow;
    var row_nm = document.getElementById('item_nm').childNodes[0].textContent;
    var row_code = document.getElementById('item_code').childNodes[0].textContent;
    var row_cp = document.getElementById('item_cp').childNodes[0].textContent;
    var row_cnt = document.getElementById('item_cnt').value;
    var row_rt = document.getElementById('incharge').value;
    var row_rtp = document.getElementById('cphone').value;
    var row_date = document.getElementById('deliverydate').value;
    var row_dway = $('input[name="deliveryway"]:checked').val();
    var row_ord = document.getElementById('orderer').value;
    var row_ordp = document.getElementById('ophone').value;
    var row_cmy = document.getElementById('companyname').value;
    var row_addr = document.getElementById('address').value;
    objRow = document.all('tblShow').insertRow();

    //No.
    var objCell_Num = objRow.insertCell();
    objCell_Num.innerHTML = count;

    //Product Code
    var objCell_Code = objRow.insertCell();
    objCell_Code.innerHTML = row_code;

    //Product Name
    var objCell_Nm = objRow.insertCell();
    objCell_Nm.innerHTML = row_nm;

    //Product Capacity(Volume)
    var objCell_Cp = objRow.insertCell();
    objCell_Cp.innerHTML = row_cp;

    //Ordered Product Count
    var objCell_Cnt = objRow.insertCell();
    objCell_Cnt.innerHTML = row_cnt;

    //Requestor
    var objCell_Rt = objRow.insertCell();
    objCell_Rt.innerHTML = row_rt;

    //Requestor Phone
    var objCell_Rtp = objRow.insertCell();
    objCell_Rtp.innerHTML = row_rtp;

    //Order date
    var objCell_Date = objRow.insertCell();
    objCell_Date.innerHTML = row_date;

    //Delivery Way
    var objCell_Dway = objRow.insertCell();
    objCell_Dway.innerHTML = row_dway;

    //Buyer
    var objCell_Ord = objRow.insertCell();
    objCell_Ord.innerHTML = row_ord;

    //Buyer Phone
    var objCell_Ordp = objRow.insertCell();
    objCell_Ordp.innerHTML = row_ordp;

    //Company
    var objCell_Cmy = objRow.insertCell();
    objCell_Cmy.innerHTML = row_cmy;

    //Company
    var objCell_Addr = objRow.insertCell();
    objCell_Addr.innerHTML = row_addr;
}
deleteOrderList = () => {
    if (count < 1) {
        count = 1;
    }
    count--;
    var tblContent = document.getElementById('tblShow');
    //If There is no Data at all, Do Nothing.
    if (tblContent.rows.length < 1) return;

    //Delete From Last Table
    tblContent.deleteRow(tblContent.rows.length - 1);
}