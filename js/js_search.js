document.getElementById("search_button_msg").addEventListener('click', search_message);

/*
function search_message(){
    alert("검색을 수행합니다!");
    }
*/

/*
function search_message(){
    let message = "검색을 수행합니다."; //message 변수 선언하고 변수에 문자열 저장
    alert(message); //변수 선언
    }
*/    

const search_message = () => {
    const c = "검색을 수행합니다.";
    alert(c);
};    

/*
function search_message(){

    }
같은 이름의 함수 여러 개 만들면 가장 마지막 함수 수행
*/

/* 원래 코드
function googleSearch(){
    const searchTerm = document.getElementById("search_input").value; //검색어로 설정
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`; //작은따옴표가 아니라 백틱 opt+₩
    //새 창에서 구글 검색 수행
    window.open(googleSearchUrl, "_blank");
    return false;
    }
*/

//5주차 연습문제 코드
function googleSearch() {
    const searchTerm = document.getElementById("search_input").value.trim(); // .trim 검색어 공백 제거
    const badwords = ["욕1", "욕2", "욕3", "욕4", "욕5"]; //비속어 구분

    //공백 문자열 검사
    if (searchTerm.length == 0) {
        alert("검색창이 비었습니다.");
        return false;
    }

    //비속어 검사
    for (let i = 0; i < badwords.length; i++) {
        if (searchTerm.includes(badwords[i])) {
            alert("비속어가 포함되어 있습니다.");
            return false;
        }
    }

    //검색 수행
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}
    
    