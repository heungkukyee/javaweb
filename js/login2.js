import { session_set, session_get, session_check } from './session.js';
// 12주차 연습문제 회원가입 복호화 모듈 추가
import { encrypt_text, decrypt_text, decrypt_text_join } from './crypto.js';
import { getKeyFromPassword, encrypt_text_gcm, decrypt_text_gcm } from './crypto2.js';
import { generateJWT, checkAuth } from './token.js';

/* function init() { // 로그인 폼에 쿠키에서 가져온 아이디 입력
  const emailInput = document.getElementById("typeEmailX");
  const idsave_check = document.getElementById("idSaveCheck");
  let get_id = getCookie("id");
  if (get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
  }
  session_check(); // 세션 유무 검사
} */

document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  init_logined();
});

function init_logined() {
  if (sessionStorage) {
    decrypt_text(); // 복호화 함수
    decrypt_text_gcm("key");
    decrypt_text_join("key");
  } else {
    alert("세션 스토리지 지원 x");
  }
}

const check_xss = (input) => {
  // DOMPurify 라이브러리 로드 (CDN 사용)
  const DOMPurify = window.DOMPurify;
  // 입력 값을 DOMPurify로 sanitize
  const sanitizedInput = DOMPurify.sanitize(input);
  // Sanitized된 값과 원본 입력 값 비교
  if (sanitizedInput !== input) {
    // XSS 공격 가능성 발견 시 에러 처리
    alert("XSS 공격 가능성이 있는 입력값을 발견했습니다.");
    return false;
  }
  // Sanitized된 값 반환
  return sanitizedInput;
};

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
      var cookie_array = cookie.split("; ");
      for (var index in cookie_array) {
        var cookie_name = cookie_array[index].split("=");
        if (cookie_name[0] == name) { //쿠키를 id에서 name으로 변경
          return cookie_name[1];
        }
      }
    }
    return;
  }

function setCookie(name, value, expiredays) {
  var date = new Date();
  date.setDate(date.getDate() + expiredays);
  document.cookie =
    escape(name) +
    "=" +
    escape(value) +
    "; expires=" +
    date.toUTCString() +
    "; path=/" +
    "; SameSite=None; Secure";
}

// 10주차 응용 문제 (로그인, 로그아웃 쿠키 카운트)
const login_count = () => {
  let loginCount = Number(getCookie("login_cnt")) || 0; 
  //쿠키 없을 때 NaN으로 리턴하는 오류 때문에 or 0 으로 기본값 설정
  loginCount += 1;
  setCookie("login_cnt", loginCount, 1);
  console.log(`로그인 횟수: ${loginCount}`);
};

const logout_count = () => {
  // 기존 logout_cnt 쿠키 값 가져오기
  let logoutCount = Number(getCookie("logout_cnt")) || 0;
  logoutCount += 1;
  // 쿠키 다시 저장
  setCookie("logout_cnt", logoutCount, 1);
  console.log(`현재 로그아웃 횟수: ${logoutCount}`);
};

// 10주차 연습 문제(로그인 실패 카운트 및 로그인 제한)
const login_failed = () => {
  let failedCount = Number(getCookie("failed_cnt")) || 0;
  failedCount += 1;
  setCookie("failed_cnt", failedCount, 1);
  console.log(`현재 로그인 실패 횟수: ${failedCount}`);

  if(failedCount>3){
    alert("로그인 3회 실패! 로그인이 제한됩니다.");
    const btn = document.getElementById("login_btn"); // btn이라는 새 변수에 login_btn 클릭 이벤트 할당
    if (btn) btn.disabled = true; // 로그인 버튼 비활성화
    return false; // submit 막기
  }
};

const check_input = async () => { // 11주차 응용 문제 해결 때문에 async 추가(밑에서 await 사용하기 위해서)
  const loginForm = document.getElementById("login_form");
  const loginBtn = document.getElementById("login_btn");
  const emailInput = document.getElementById("typeEmailX");
  const passwordInput = document.getElementById("typePasswordX");
  // 전역 변수 추가, 맨 위 위치
  const idsave_check = document.getElementById("idSaveCheck");

  const c = "아이디, 패스워드를 체크합니다";
  alert(c);

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();
  // Input으로 받으니 계속 alert가 뜨는 오류가 있어 Value로 변경
  const sanitizedPassword = check_xss(passwordValue);
  // check_xss 함수로 비밀번호 Sanitize
  const sanitizedEmail = check_xss(emailValue);
  // check_xss 함수로 이메일 Sanitize

  const payload = {
    id: emailValue,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 (3600초)
  };
  const jwtToken = generateJWT(payload);

  if (emailValue === "") {
    alert("이메일을 입력하세요.");
    login_failed(); // 로그인 실패 함수 추가
    return false;
  }
  if (passwordValue === "") {
    alert("비밀번호를 입력하세요.");
    login_failed(); // 로그인 실패 함수 추가
    return false;
  }

  // 9주차 응용 문제 (로그인 입력 길이 제한 변경)
  if (emailValue.length < 10) {
    alert("아이디는 최소 10글자 이상 입력해야 합니다.");
    login_failed(); // 로그인 실패 함수 추가
    return false;
  }
  if (passwordValue.length < 15) {
    alert("비밀번호는 반드시 15글자 이상 입력해야 합니다.");
    login_failed(); // 로그인 실패 함수 추가
    return false;
  }

  const hasSpecialChar =
    passwordValue.match(/[!,@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/) !== null;
  if (!hasSpecialChar) {
    alert("패스워드는 특수문자를 1개 이상 포함해야 합니다.");
    login_failed(); // 로그인 실패 함수 추가
    return false;
  }
  const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
  const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
  if (!hasUpperCase || !hasLowerCase) {
    alert("패스워드는 대소문자를 1개 이상 포함해야 합니다.");
    login_failed(); // 로그인 실패 함수 추가
    return false;
  }

  // 9주차 연습 문제 (패턴식을 이용해 반복 입력 금지하기)
  const repeatmore3 = /(.{3,})\1/;
  const repeaagain2 = /(\d{2}).*?\1/;
  if (repeatmore3.test(emailValue)) {
    alert("3글자 이상 반복 입력할 수 없습니다.");
    login_failed(); // 로그인 실패 함수 추가
    return false;
  }
  if (repeaagain2.test(emailValue)) {
    alert("연속되는 숫자를 2개 이상 반복할 수 없습니다.");
    login_failed(); // 로그인 실패 함수 추가
    return false;
  }

  if (!sanitizedEmail) {
    // Sanitize된 비밀번호 사용
    return false;
  }
  if (!sanitizedPassword) {
    // Sanitize된 비밀번호 사용
    return false;
  }

  // 검사 마무리 단계 쿠키 저장, 최하단 submit 이전
  if (idsave_check.checked == true) {
    // 아이디 체크 o
    alert("쿠키를 저장합니다.", emailValue);
    setCookie("id", emailValue, 1); // 1일 저장
    alert("쿠키 값 :" + emailValue);
  } else {
    // 아이디 체크 x
    setCookie("id", emailValue.value, 0); //날짜를 0 - 쿠키 삭제
  }

  console.log("이메일:", emailValue);
  console.log("비밀번호:", passwordValue);
  session_set(); // 세션 생성
  localStorage.setItem('jwt_token', jwtToken);

  // 11주차 응용 문제 
  await encrypt_text_gcm("key", passwordValue); // 암호화
  await decrypt_text_gcm("key"); // 복호화

  loginForm.submit();
};

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("login_btn");
  if (btn) {
    btn.addEventListener("click", check_input);     // 로그인 입력 확인 및 암호화
    btn.addEventListener("click", login_count);     // 로그인 카운트 증가
    btn.addEventListener("click", logout_count);    // 로그아웃 카운트 증가
  }
});
