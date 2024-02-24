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
  // TODO: STEP1 ログインボタンをクリックした際に googleLogin 関数を呼び出す
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
      // TODO: STEP1 ログインボタンを非表示にする
      // TODO: STEP1 ログアウトボタンを表示する
      document.getElementById('attendanceLink').style.display = 'block'; // 「勤怠一覧」リンクを表示

      checkAttendance(); // ログイン状態が確定した後に実行（出勤ボタンと退勤ボタンを表示する）

    } else {
      // ユーザーがログアウトしている場合
      updateUserUI(null);
      // TODO: STEP1 ログインボタンを表示する
      // TODO: STEP1 ログアウトボタンを非表示にする　
      document.getElementById('attendanceLink').style.display = 'none'; // 「勤怠一覧」リンクを非表示
      // TODO: STEP1 出勤ボタンを非表示にする
      // TODO: STEP1 退勤ボタンを非表示にする
    }
  });
});