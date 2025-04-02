document.getElementById("search_btn").addEventListener('click', search_message);

function search_message(){
    alert("검색을 수행합니다!");
    }

function googleSearch(){
    const searchTerm = document.getElementById("search_input").value; //검색어로 설정
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`; //작은따옴표가 아니라 백틱 opt+₩
    //새 창에서 구글 검색 수행
    window.open(googleSearchUrl, "_blank");
    return false;
    }
