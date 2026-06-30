const API_URL = "https://script.google.com/macros/s/AKfycbxsHYfop671-Fb4GehXwx5XhfZguvlDZqvH2xCusPevwaggSRc3omhxittN7IQHPlC2/exec";

const memberId = localStorage.getItem("meteor_member_id");
const token = localStorage.getItem("meteor_token");

document.addEventListener("DOMContentLoaded", () => {
  if (!memberId || !token) {
    alert("ログイン情報が見つかりません。再度ログインしてください。");
    window.location.href = "index.html";
    return;
  }

  loadCachedPointInfo();
  loadPointInfo();
});

function loadCachedPointInfo() {
  const cache = localStorage.getItem("meteor_point_cache");

  if (!cache) return;

  try {
    const data = JSON.parse(cache);

    setText("currentPoint", formatNumber(data.currentPoint));
    setText("yearEarnedPoint", formatNumber(data.yearEarnedPoint));
    setText("yearUsedPoint", formatNumber(data.yearUsedPoint));
  } catch (e) {}
}

function loadPointInfo() {
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

      const pointData = {
        currentPoint:
          result.currentPoint ??
          result.point ??
          result.points ??
          result.currentPoints ??
          member.currentPoint ??
          member.point ??
          member.points ??
          member.現在ポイント ??
          member.ポイント残高 ??
          0,

        yearEarnedPoint:
          result.yearEarnedPoint ??
          result.thisYearEarnedPoint ??
          result.yearGetPoint ??
          result.今年獲得ポイント ??
          member.yearEarnedPoint ??
          member.thisYearEarnedPoint ??
          member.今年獲得ポイント ??
          0,

        yearUsedPoint:
          result.yearUsedPoint ??
          result.thisYearUsedPoint ??
          result.yearUsePoint ??
          result.今年利用ポイント ??
          member.yearUsedPoint ??
          member.thisYearUsedPoint ??
          member.今年利用ポイント ??
          0
      };

      localStorage.setItem("meteor_point_cache", JSON.stringify(pointData));

      setText("currentPoint", formatNumber(pointData.currentPoint));
      setText("yearEarnedPoint", formatNumber(pointData.yearEarnedPoint));
      setText("yearUsedPoint", formatNumber(pointData.yearUsedPoint));
    })
    .catch(() => {});
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatNumber(value) {
  const num = Number(String(value).replace(/,/g, ""));

  if (isNaN(num)) return "0";

  return num.toLocaleString("ja-JP");
}