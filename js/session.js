 import { encrypt_text, decrypt_text } from './crypto.js';

/* function session_set() {  //세션 저장
  let session_id = document.querySelector("#typeEmailX");
  if (sessionStorage) {
    sessionStorage.setItem("Session_Storage_test", session_id.value);
  } else {
    alert("로컬 스토리지 지원 x");
  }
} */

/* export function session_set() { //세션 저장
  let session_id = document.querySelector("#typeEmailX"); // DOM 트리에서 ID 검색
  let session_pass = document.querySelector("#typePasswordX"); // DOM 트리에서 pass 검색
  if (sessionStorage) {
    let en_text = encrypt_text(session_pass.value);
    sessionStorage.setItem("Session_Storage_id", session_id.value);
    sessionStorage.setItem("Session_Storage_pass", en_text);
  } else {
    alert("로컬 스토리지 지원 x");
  }
} */

export async function session_set() { //세션 저장(객체)
  let id = document.querySelector("#typeEmailX");
  let password = document.querySelector("#typePasswordX");
  let random = new Date(); // 랜덤 타임스탬프

  const obj = { // 객체 선언
    id: id.value,
    otp: random,
  };
  
  if (sessionStorage) {
    const objString = JSON.stringify(obj); // 객체-> JSON 문자열 변환
    let en_text = await encrypt_text(objString); // 암호화
    sessionStorage.setItem("Session_Storage_id", id.value);
    sessionStorage.setItem("Session_Storage_object", objString);
    sessionStorage.setItem("Session_Storage_pass", en_text);
  } else {
    alert("세션 스토리지 지원 x");
  }
}

export async function session_set2() { //세션 저장(객체)
  if (sessionStorage) {
    const objString = JSON.stringify(obj); // 객체-> JSON 문자열 변환
    // let en_text = await encrypt_text(objString); // 암호화
    sessionStorage.setItem("Session_Storage_join", objString);
  } else {
    alert("세션 스토리지 지원 x");
  }
}

/* function session_get() { //세션 읽기
  if (sessionStorage) {
    return sessionStorage.getItem("Session_Storage_test");
  } else {
    alert("세션 스토리지 지원 x");
  }
} */

export function session_get() { //세션 읽기
  if (sessionStorage) {
    return sessionStorage.getItem("Session_Storage_pass");
  } else {
    alert("세션 스토리지 지원 x");
  }
}

/* function session_check() { //세션 검사
  if (sessionStorage.getItem("Session_Storage_test")) {
    alert("이미 로그인 되었습니다.");
    location.href = "../login/index_login.html"; // 로그인된 페이지로 이동
  }
} */

export function session_check() { //세션 검사
  if (sessionStorage.getItem("Session_Storage_id")) {
    alert("이미 로그인 되었습니다.");
    location.href = "../login/index_login.html"; // 로그인된 페이지로 이동
  }
}

/* function session_del() { //세션 삭제
  if (sessionStorage) {
    sessionStorage.removeItem("Session_Storage_test");
    alert("로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.");
  } else {
    alert("세션 스토리지 지원 x");
  }
} */

// 로그아웃 시 세션 삭제 안 되는 오류 해결 위해 id와 pass로 같이 변경
function session_del() { // 세션 삭제
  if (sessionStorage) {
    sessionStorage.removeItem("Session_Storage_id");
    sessionStorage.removeItem("Session_Storage_pass");
    // 세션 삭제 시 11주차 응용 문제 세션 같이 삭제
    sessionStorage.removeItem("Session_Storage_pass2");
    sessionStorage.removeItem("Session_Storage_iv");
    
    alert("로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.");
  } else {
    alert("세션 스토리지 지원 x");
  }
}

function logout() {
  session_del(); // 세션 삭제
  jwt_token_del(); // 토큰 삭제
  location.href = "../index.html";
}

// document.getElementById("logout_btn").addEventListener("click", logout);

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout_btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});
