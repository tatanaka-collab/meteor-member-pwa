document.addEventListener("DOMContentLoaded", () => {
  const member = getLoginMember();

  if (!member) {
    alert("ログイン情報が見つかりません。再度ログインしてください。");
    window.location.href = "index.html";
    return;
  }

  const memberId =
    member.memberId ||
    member.memberID ||
    member.id ||
    member.会員ID ||
    member["会員ID"];

  const memberNo =
    member.memberNo ||
    member.memberNumber ||
    member.会員番号 ||
    member["会員番号"] ||
    memberId ||
    "---";

  const memberName =
    member.name ||
    member.memberName ||
    member.氏名 ||
    member["氏名"] ||
    "---";

  const memberType =
    member.memberType ||
    member.会員種別 ||
    member["会員種別"] ||
    "会員";

  const expiry =
    member.expiryDate ||
    member.expiry ||
    member.有効期限 ||
    member["有効期限"] ||
    "----";

  document.getElementById("memberNo").textContent = memberNo;
  document.getElementById("memberName").textContent = memberName;
  document.getElementById("memberType").textContent = memberType;
  document.getElementById("expiryDate").textContent = formatDate(expiry);

  const qrValue = memberId || memberNo;

  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=16&data=" +
    encodeURIComponent(qrValue);

  document.getElementById("qrImage").src = qrUrl;
});

function getLoginMember() {
  const storageKeys = [
    "meteoMember",
    "currentMember",
    "memberData",
    "loginMember",
    "loginUser",
    "user",
    "meteoLoginUser"
  ];

  for (const key of storageKeys) {
    const localValue = localStorage.getItem(key);
    if (localValue) {
      try {
        return JSON.parse(localValue);
      } catch (e) {}
    }

    const sessionValue = sessionStorage.getItem(key);
    if (sessionValue) {
      try {
        return JSON.parse(sessionValue);
      } catch (e) {}
    }
  }

  return null;
}

function formatDate(value) {
  if (!value) return "----";

  const text = String(value).trim();

  if (text.includes("/")) return text;

  const date = new Date(text);
  if (isNaN(date.getTime())) return text;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}/${m}/${d}`;
}