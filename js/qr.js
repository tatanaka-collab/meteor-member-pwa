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
  loadCachedMemberInfo();
  loadMemberInfo();
});

function createQRCode(value) {
  const qrArea = document.getElementById("qrImage");
  qrArea.innerHTML = "";

  new QRCode(qrArea, {
    text: value,
    width: 223,
    height: 223,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

function loadCachedMemberInfo() {
  const cache = localStorage.getItem("meteor_member_cache");

  if (!cache) {
    document.getElementById("memberNo").textContent = memberId;
    return;
  }

  try {
    const member = JSON.parse(cache);

    document.getElementById("memberNo").textContent = member.memberNo || memberId;
    document.getElementById("memberName").textContent = member.memberName || "会員様";
    document.getElementById("memberType").textContent = member.memberType || "会員";
    document.getElementById("expiryDate").textContent = formatDate(member.expireDate);

    setExpiryColor(member.expireDate);
  } catch (e) {
    document.getElementById("memberNo").textContent = memberId;
  }
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
      if (!result.success) return;

      const member = result.member || {};

      const cacheData = {
        memberNo: result.memberNo || member.memberNo || member.会員番号 || memberId,
        memberName: result.name || result.memberName || member.name || member.氏名 || "会員様",
        memberType: result.memberType || member.memberType || member.会員種別 || "会員",
        expireDate: result.expireDate || member.expireDate || member.有効期限 || ""
      };

      localStorage.setItem("meteor_member_cache", JSON.stringify(cacheData));

      document.getElementById("memberNo").textContent = cacheData.memberNo;
      document.getElementById("memberName").textContent = cacheData.memberName;
      document.getElementById("memberType").textContent = cacheData.memberType;
      document.getElementById("expiryDate").textContent = formatDate(cacheData.expireDate);

      setExpiryColor(cacheData.expireDate);
    })
    .catch(() => {
      loadCachedMemberInfo();
    });
}

function formatDate(value) {
  if (!value) return "確認中";

  const text = String(value).trim();

  if (text.includes("/")) return text;

  const date = new Date(text);
  if (isNaN(date.getTime())) return text;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

function setExpiryColor(value) {
  const expiryElement = document.getElementById("expiryDate");

  expiryElement.classList.remove(
    "expiry-safe",
    "expiry-warning",
    "expiry-danger"
  );

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    expiryElement.classList.add("expiry-safe");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    expiryElement.classList.add("expiry-danger");
  } else if (diffDays <= 30) {
    expiryElement.classList.add("expiry-warning");
  } else {
    expiryElement.classList.add("expiry-safe");
  }
}