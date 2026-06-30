document.addEventListener("DOMContentLoaded", () => {
  const member = getMemberData();

  const memberNo = member.memberNo || member.memberNumber || member.会員番号 || member.id || member.会員ID || "---";
  const memberName = member.name || member.memberName || member.氏名 || "---";
  const memberType = member.memberType || member.会員種別 || "会員";
  const expiry = member.expiryDate || member.expiry || member.有効期限 || "----";

  document.getElementById("memberNo").textContent = memberNo;
  document.getElementById("memberName").textContent = memberName;
  document.getElementById("memberType").textContent = memberType;
  document.getElementById("expiryDate").textContent = formatDate(expiry);

  const qrValue = member.memberId || member.会員ID || memberNo;
  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=16&data=" +
    encodeURIComponent(qrValue);

  document.getElementById("qrImage").src = qrUrl;
});

function getMemberData() {
  const keys = [
    "meteoMember",
    "currentMember",
    "memberData",
    "loginMember",
    "user"
  ];

  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (!value) continue;

    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn("会員データの読み込みに失敗:", key);
    }
  }

  return {
    会員番号: "000000",
    氏名: "ゲスト 様",
    会員種別: "1年会員",
    有効期限: "2027/06/30",
    会員ID: "000000"
  };
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