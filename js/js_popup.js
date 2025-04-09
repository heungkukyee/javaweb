function pop_up(){
    window.open("../popup/popup.html", "팝업테스트", "width=400, height=300, top=300, left=500");
    // ../ = 상위폴더, top, left는 위치
}

function show_clock(){
    let currentDate = new Date(); // 현재 시스템 날짜 객체 생성
    let divClock = document.getElementById('divClock'); //가장 상단에 표시
    let msg = "현재 시간 : ";
    if(currentDate.getHours()>12){ // 12시 보다 크면 오후 msg += "오후";
        msg += "오후";
        msg += currentDate.getHours()-12+"시";
    }
    else {
        msg += "오전";
        msg += currentDate.getHours()+"시";
    }

    msg += currentDate.getMinutes()+"분";
    msg += currentDate.getSeconds()+"초";
    divClock.innerText = msg;

    if (currentDate.getMinutes()>58) { 
        divClock.style.color="red"; //정각 1분전 빨강색 출력
    }
    setTimeout(show_clock, 1000); //1초마다 갱신
}

function over(obj) {
    obj.src="image/logo.jpg";
}

function out(obj) {
    obj.src="image/logo2.jpg";
}