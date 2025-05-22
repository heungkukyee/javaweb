// 11주차 응용 문제()

// 텍스트 인코더/디코더
const enc = new TextEncoder();
const dec = new TextDecoder();

// GCM용 키 생성 함수
async function getKeyFromPassword(password) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("salt"), // salt는 고정 문자열
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// 암호화 함수 - Session_Storage_pass2, Session_Storage_iv에 저장
async function encrypt_text_gcm(password, plainText) {
  const key = await getKeyFromPassword(password);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // GCM용 IV는 12바이트

  // IV를 base64로 인코딩해서 세션에 저장
  const ivBase64 = btoa(String.fromCharCode(...iv));
  sessionStorage.setItem("Session_Storage_iv", ivBase64);

  // 암호화 실행
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    enc.encode(plainText)
  );

  // 암호문을 인코딩 후 세션에 저장
  const cipherBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  sessionStorage.setItem("Session_Storage_pass2", cipherBase64);
}

// 복호화 함수(console에 출력)
async function decrypt_text_gcm(password) {
  const encryptedBase64 = sessionStorage.getItem("Session_Storage_pass2");
  const ivBase64 = sessionStorage.getItem("Session_Storage_iv");

  if (!encryptedBase64 || !ivBase64) {
    console.warn("세션에 GCM 암호문 또는 IV가 없습니다.");
    return;
  }

  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const key = await getKeyFromPassword(password);

  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encryptedBytes
    );

    const plainText = dec.decode(decrypted);
    console.log("GCM 복호화:", plainText);
  } catch (err) {
    console.error("복호화 실패:", err);
  }
}
