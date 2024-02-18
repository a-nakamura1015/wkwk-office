import { auth } from './firebaseInit';
import { googleLogin, googleLogout, updateUserUI } from './auth';
import { formatDate, formatTime } from './util';
import { checkAttendance, startWork, endWork } from './attendance';

// 現在の日付と時刻を表示する関数
function updateDateTime() {
  const now = new Date();
  document.getElementById('currentDate').textContent = formatDate(now);
  document.getElementById('currentTime').textContent = formatTime(now);
}

// DOMがロードされた後に実行される処理
document.addEventListener('DOMContentLoaded', async () => {
  // 各ボタンにイベントリスナーを設定
  document.getElementById('loginButton').addEventListener('click', googleLogin);
  document.getElementById('logoutButton').addEventListener('click', googleLogout);
  document.getElementById('startWork').addEventListener('click', async() => await startWork());
  document.getElementById('endWork').addEventListener('click', async() => await endWork());

  // 現在の日付と時刻を更新する関数を呼び出し、1秒ごとに更新
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // ユーザーのログイン状態を監視し、UIを更新するイベントリスナー
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // ユーザーがログインしている場合
      updateUserUI(user);
      document.getElementById('loginButton').style.display = 'none'; // ログインボタンを非表示
      document.getElementById('logoutButton').style.display = 'block'; // ログアウトボタンを表示
      document.getElementById('attendanceLink').style.display = 'block'; // 「勤怠一覧」リンクを表示

      checkAttendance(); // ログイン状態が確定した後に実行

    } else {
      // ユーザーがログアウトしている場合
      updateUserUI(null);
      document.getElementById('loginButton').style.display = 'block'; // ログインボタンを表示
      document.getElementById('logoutButton').style.display = 'none'; // ログアウトボタンを非表示
      document.getElementById('attendanceLink').style.display = 'none'; // 「勤怠一覧」リンクを非表示
      document.getElementById('startWork').style.display = 'none'; // 「出勤」ボタンを非表示
      document.getElementById('endWork').style.display = 'none'; // 「退勤」ボタンを非表示
    }
  });
});