import { session_set, session_get, session_check, session_get2} from './session.js';

function encodeByAES256(key, data) {
  const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(""), // IV 초기화 벡터
    padding: CryptoJS.pad.Pkcs7, // 패딩
    mode: CryptoJS.mode.CBC, // 운영 모드
  });
  return cipher.toString();
}

function decodeByAES256(key, data) {
  const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(""),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return cipher.toString(CryptoJS.enc.Utf8);
}

export function encrypt_text(password) {
  const k = "key"; // 클라이언트 키
  const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
  const b = password;
  const eb = encodeByAES256(rk, b); // 실제 암호화
  return eb;
  console.log(eb);
}

export function decrypt_text() {
  const k = "key"; // 서버의 키
  const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
  const eb = session_get();
  const b = decodeByAES256(rk, eb); // 실제 복호화
  console.log("CBC 복호화:", b);
}

// 12주차 연습문제 회원가입 정보 암호화
export function encrypt_text_join(userObj) {
  const k = "key"; // 클라이언트 키
  const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
  const jsonStr = JSON.stringify(userObj); // 객체를 JSON 문자열로 변환
  const eb = encodeByAES256(rk, jsonStr); // 문자열 암호화
  return eb;
}

// 12주차 연습문제 회원가입 정보 복호화
export function decrypt_text_join() {
  const k = "key"; // 서버의 키
  const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
  const eb = session_get2(); // session_get2() 불러오기

  // 회원가입 세션이 없다면 복호화 X
  if (!eb) {
    console.log("회원가입 정보가 없어 복호화하지 않습니다.");
    return;
  }

  const decrypted = decodeByAES256(rk, eb); // 실제 복호화
  const parsed = JSON.parse(decrypted);

  console.log("복호화된 회원정보: ", parsed);
}
