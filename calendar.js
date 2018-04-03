(function() {
    'use strict'
    console.log("运行以下代码，清空所有提醒：localStorage.setItem('clockTimeArr','');");
    if(!localStorage.getItem("clockTimeArr")){
        localStorage.setItem('clockTimeArr','[]');
    }
    //在显示的时间
    var yearShow = "",
        monthShow = "",
        dateShow = "";
    //获取元素
    var hourEl = document.getElementById('hour');
    var dateEl = document.getElementById('date');
    var calendarTableEl = document.getElementById("calendarTable");
    var showDivEl = document.getElementsByClassName("showDiv")[0];
    var inputDivEl = document.getElementsByClassName("inputDiv")[0];
    var calendarBtnEl = document.getElementById("calendarBtn");
    var ltEl = document.getElementById("lt");
    var glEl = document.getElementById("gt");
    var btn = document.getElementById("btn");
    var calendarTitleEl = document.getElementById('calendarTitle');
    setInterval(getTime, 1000);
    //定义当前时间
    var currentYear = "",
        currentMonth = "",
        currentDate = "",
        currentHour = "",
        currentMin = "",
        currentSecond;
    /*
     *上下翻页事件
     */
    calendarBtnEl.onclick = function(event){
        //获取当前显示的月份
        var nowYear = calendarTitleEl.innerHTML.substring(0, 4);
        var nowMonth = calendarTitleEl.innerHTML.substring(5);
        nowMonth = nowMonth.substring(0, nowMonth.length - 1) - 1;
        //计算出新页的时间
        var time = "";
        if(event.target.id=="lt"){
            time = new Date(nowYear, nowMonth - 1);
        }else if(event.target.id=="gt"){
            time = new Date(nowYear, nowMonth + 1);
        }else{
            return;
        }
        var year = time.getFullYear(); //年
        var month = time.getMonth(); //月
        //利用时间创造日历表格
        createTable(year, month);
        //翻开新页后，隐藏输入框和提醒框
        addClass(inputDivEl,"hide");
        addClass(showDivEl,"hide");
        showDivEl.innerHTML = "";
    }
    /*
     *点击日历事件
     */
    calendarTableEl.onclick = function(event) {
        //将当前活动的单元格添加active类，清除之前的active类
        if (event.target.nodeName.toLowerCase() == "td") {
            var activeEl = document.getElementsByClassName("active");
            if (activeEl.length > 0 && event.target !== activeEl[0]) {
                removeClass(activeEl[0], "active");
            }
            addClass(event.target, "active");
        }
        //判断是否已经有了提醒
        if (hasClass(event.target, "record")) {
            var temp = JSON.parse(localStorage.getItem("clockTimeArr")||"[]");
            var len = temp.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    if (yearShow == temp[i][0] &&
                        monthShow == temp[i][1] &&
                        event.target.innerHTML == temp[i][2]) {
                        showDivEl.innerHTML = temp[i][5];
                        addClass(inputDivEl, "hide");
                    }
                }
            }
        }else{
            removeClass(inputDivEl, "hide");
            showDivEl.innerHTML = "";
        }
        //每次切换都置空输入框
        var hourEl = document.getElementById("hourInput");
        var minEl = document.getElementById("minInput");
        var remindEl = document.getElementById("remind");
        hourEl.value = "";
        minEl.value = "";
        remindEl.value = "";
        if (showDivEl.innerHTML == "") {
            addClass(showDivEl,"hide");
        }else{
            removeClass(showDivEl,"hide");
        }
        var dateTd = document.getElementsByClassName("active")[0];
        dateShow = dateTd.innerHTML;
    }
    /*
     *添加提醒按钮点击事件
     */
    btn.onclick = function() {
        //获取选择的年月日yearShow  monthShow
        var timeArr = []; //时间数组
        var dateTd = document.getElementsByClassName("active")[0];
        var dataNowTd = document.getElementsByClassName("current")[0];
        if (!!dateTd) {
            dateShow = dateTd.innerHTML;
        } else if (!!dataNowTd) {
            dateShow = dataNowTd.innerHTML;
        } else {
            alert("请选择一天添加提醒！");
            return;
        }
        var hourEl = document.getElementById("hourInput");
        var minEl = document.getElementById("minInput");
        var hour = hourEl.value;
        var min = minEl.value;
        if (/^(\d|1\d|2[0-3])$/.test(hour) && /^(\d|[1-5]\d)$/.test(min)) {
            var remindEl = document.getElementById("remind");
            var remindtext = remindEl.value;
            if (remindtext.length == 0) {
                alert("请输入提醒！");
                return;
            } else {
                remindtext = hour+"点"+min+"分:"+remindtext;
                //添加提醒到本地存储
                timeArr.push(yearShow, monthShow, dateShow, hour, min, remindtext);
                var temp = JSON.parse(localStorage.getItem("clockTimeArr")||"[]");
                temp.push(timeArr);
                localStorage.setItem("clockTimeArr",JSON.stringify(temp))
                if (!!dateTd) {
                    addClass(dateTd, "record");
                } else if (!!dataNowTd) {
                    addClass(dataNowTd, "record");
                }
                addClass(inputDivEl, "hide");
                //清空输入框
                hourEl.value = "";
                minEl.value = "";
                remindEl.value = "";
                showDivEl.innerHTML = remindtext;
                removeClass(showDivEl,"hide");
            }
        } else {
            alert("请输入正确的时间格式");
            return;
        }
    }
    /*
     *删除提醒函数
     */
    showDivEl.onclick = function(){
        //删除提醒
        showDivEl.innerHTML = "";
        addClass(showDivEl,"hide");
        //删除本地记录
        var temp = JSON.parse(localStorage.getItem("clockTimeArr")||"[]");
        var len = temp.length;
        if(len>0){
            for (var i = 0; i < len; i++) {
                    if (yearShow == temp[i][0] &&
                        monthShow == temp[i][1] &&
                        dateShow == temp[i][2]) {
                        temp.splice(i,1);
                        localStorage.setItem("clockTimeArr",JSON.stringify(temp));
                        removeClass(inputDivEl, "hide");
                        var dateTd = document.getElementsByClassName("active")[0];
                        removeClass(dateTd,"record");
                    }
                }
        }
    }
    /*
     *时间函数，间歇调用
     */
    function getTime() {
        var date = new Date();
        currentYear = date.getFullYear();
        currentMonth = date.getMonth();
        currentDate = date.getDate();
        currentHour = date.getHours();
        currentMin = date.getMinutes();
        currentSecond = date.getSeconds();
        //小时和分钟
        var timeString = date.toLocaleTimeString();
        hourEl.innerHTML = timeString;
        //年月日
        var dateString = date.toLocaleDateString();
        dateEl.innerHTML = dateString;
        //判断是否提醒
        var temp = JSON.parse(localStorage.getItem("clockTimeArr")||"[]");
        var len = temp.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if (currentYear == temp[i][0] &&
                    currentMonth == temp[i][1] - 1 &&
                    currentDate == temp[i][2] &&
                    currentHour == temp[i][3] &&
                    currentMin == temp[i][4] &&
                    currentSecond == 0) {
                    alert(temp[i][5]);
                    //提醒后删除提醒
                    temp.splice(i,1);
                    localStorage.setItem("clockTimeArr",JSON.stringify(temp));
                }
            }
        }
    }
    getTime();
    //封装日期数组
    var time = new Date();
    var year = time.getFullYear(); //年
    var month = time.getMonth(); //月
    var date = time.getDate(); //日
    //按当前时间创建日历
    createTable(year, month);
    /*
     *创建日历，year，month
     */
    function createTable(year, month) {
        //记录这天是否有提醒
        var day = [];
        var temp = JSON.parse(localStorage.getItem("clockTimeArr")||"[]");
        var len = temp.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if (year == temp[i][0] &&
                    month == temp[i][1] - 1) {
                    day.push(temp[i][2]);
                }
            }
        }
        //如果已经有表格，则清空
        if (calendarTableEl.children.length != 0) {
            calendarTableEl.innerHTML = "";
        }
        //标头
        calendarTitleEl.innerHTML = year + "年" + (month + 1) + "月";
        yearShow = year;
        monthShow = month + 1;
        var date2 = new Date(year, month + 1, 0);
        //本月第一天的星期
        var dayOfTheMonth = new Date(year, month).getDay();
        //当月的天数
        var dates = date2.getDate();
        //月份数组
        var monthArr = [];
        var flag = true; //标记是否是第一周
        var current = false; //标记是否是当前月份
        if (year == currentYear && month == currentMonth) {
            current = true;
        }
        //循环填入数据
        for (var i = 1; i <= dates;) {
            var arr = [];
            for (var j = 0; j < 7; j++) {
                if (dayOfTheMonth > j && flag) {
                    arr.push("");
                } else {
                    if (current && i == date) {
                        arr.push(i + "*");
                    } else {
                        arr.push(i);
                    }
                    if (day.indexOf(i.toString()) > -1) {
                        arr[arr.length - 1] += "$";
                    }
                    i++;
                    if (i > dates) {
                        break;
                    }
                }
            }
            monthArr.push(arr);
            flag = false;
        }

        //创建表格
        var tableEl = document.createElement("table");
        tableEl.border = 1;
        tableEl.width = "100%";
        //表头，星期标志
        var theadEl = document.createElement("thead");
        var trEl = document.createElement("tr");
        var dayArr = ["日", "一", "二", "三", "四", "五", "六"];
        for (var i = 0; i < 7; i++) {
            var thEl = document.createElement("th");
            thEl.innerHTML = dayArr[i];
            theadEl.appendChild(thEl);
        }
        tableEl.appendChild(theadEl);


        for (var i in monthArr) {
            creatRow(monthArr[i], tableEl);
        }
        calendarTableEl.appendChild(tableEl);

    }

    //创建表格的一行
    function creatRow(arr, tableEl) {
        if (tableEl.tBodies.length == 0) {
            var tbodyEl = document.createElement("tbody");
            tableEl.appendChild(tbodyEl);
        }
        var index = tableEl.rows.length;
        tableEl.tBodies[0].insertRow(index);
        for (var i in arr) {
            creatCell(tableEl.rows[index], arr[i]);
        }
    }
    //创建一个单元格
    function creatCell(rowEl, value) {
        var index = rowEl.cells.length;
        value = value.toString();
        rowEl.insertCell(index);
        if (value.indexOf("*") > -1) {
            addClass(rowEl.cells[index], "current");
        }
        if (value.indexOf("$") > -1) {
            addClass(rowEl.cells[index], "record");
        }
        value = value.replace(/\$|\*/g, "");
        rowEl.cells[index].appendChild(document.createTextNode(value));
    }

    //添加类
    function addClass(el, classVal) {
        if (hasClass(el, classVal)) {
            return;
        }
        var classNameArr = el.className.split(" ")
        classNameArr.push(classVal);
        el.setAttribute("class", classNameArr.join(" "));
    }
    //删除类
    function removeClass(el, classVal) {
        if(!hasClass(el, classVal)){
            return;
        }
        var classNameArr = el.className.split(" ");
        classNameArr.splice(classNameArr.indexOf(classVal), 1);
        var classString = classNameArr.join(" ");
        el.setAttribute("class", classString);
    }
    //判断是否含有该类
    function hasClass(el, classVal) {
        var classNameArr = el.className.split(" ");
        if (classNameArr.indexOf(classVal) > -1) {
            return true;
        } else {
            return false;
        };
    }


})()