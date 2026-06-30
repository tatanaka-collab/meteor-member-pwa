const API_URL = "https://script.google.com/macros/s/AKfycbxsHYfop671-Fb4GehXwx5XhfZguvlDZqvH2xCusPevwaggSRc3omhxittN7IQHPlC2/exec";

const memberId = localStorage.getItem("meteor_member_id");
const token = localStorage.getItem("meteor_token");

document.addEventListener("DOMContentLoaded", () => {
  if (!memberId || !token) {
    alert("ログイン情報が見つかりません。再度ログインしてください。");
    window.location.href = "index.html";
    return;
  }

  createQRCode(memberId);
  loadMemberInfo();
});

function createQRCode(value) {
  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=16&data=" +
    encodeURIComponent(value);

  document.getElementById("qrImage").src = qrUrl;
}

function loadMemberInfo() {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getMemberInfo",
      memberId: memberId
    })
  })
    .then(response => response.json())
    .then(result => {
      if (!result.success) {
        document.getElementById("memberNo").textContent = memberId;
        document.getElementById("memberName").textContent = "会員情報なし";
        document.getElementById("memberType").textContent = "会員";
        document.getElementById("expiryDate").textContent = "取得失敗";
        return;
      }

      const member = result.member || {};

      document.getElementById("memberNo").textContent =
        result.memberNo || member.memberNo || member.会員番号 || memberId;

      document.getElementById("memberName").textContent =
        result.name || result.memberName || member.name || member.氏名 || "会員様";

      document.getElementById("memberType").textContent =
        result.memberType || member.memberType || member.会員種別 || "会員";

      document.getElementById("expiryDate").textContent =
        formatDate(result.expireDate || member.expireDate || member.有効期限 || "確認中");
    })
    .catch(error => {
      console.error(error);
      document.getElementById("memberNo").textContent = memberId;
      document.getElementById("memberName").textContent = "会員様";
      document.getElementById("memberType").textContent = "会員";
      document.getElementById("expiryDate").textContent = "取得失敗";
    });
}

function formatDate(value) {
  if (!value) return "----";

  const text = String(value).trim();
  if (text.includes("/")) return text;

  const date = new Date(text);
  if (isNaN(date.getTime())) return text;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}