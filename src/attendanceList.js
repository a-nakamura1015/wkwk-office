import { auth, firestore } from './firebaseInit';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { googleLogin, googleLogout, updateUserUI } from './auth';
import { registerAttendance } from './attendance';
import { getJapaneseDayOfWeek } from './util';

// 現在表示している年と月を保持する変数
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 月は0から始まるため、+1する必要がある

// ユーザーのログイン状態を監視し、UIを更新するイベントリスナー
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // ユーザーがログインしている場合
    updateUserUI(user);
    // ヘッダーに表示する部品を表示
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'block';
    document.getElementById('userDisplayName').textContent = user.displayName;
    document.getElementById('userIcon').src = user.photoURL || 'デフォルトのアイコンのURL';
    document.getElementById('userDisplayName').style.display = 'block';
    document.getElementById('userIcon').style.display = 'block';
    
    // ログイン、ログアウトボタンのイベントリスナーを設定
    document.getElementById('loginButton').addEventListener('click', googleLogin);
    document.getElementById('logoutButton').addEventListener('click', googleLogout);

    // 前月、次月ボタンのイベントリスナーを設定
    document.getElementById('prevMonthButton').addEventListener('click', () => {
      changeMonth(-1);
    });
    document.getElementById('nextMonthButton').addEventListener('click', () => {
      changeMonth(1);
    });

    // ダイアログのボタンのイベントリスナーを設定
    document.getElementById('closeDialogButton').addEventListener('click', closeDialog);
    document.getElementById('registerButton').addEventListener('click', callRegisterAttendance);

    // 年月の表示を更新して勤怠一覧を表示
    updateYearMonthDisplay();

    await displayAttendanceRecords(auth.currentUser);
  } else {
    // ユーザーがログアウトしている場合はindex.htmlにリダイレクト
    window.location.href = 'index.html';
  }
});

// 前月または次月へ切り替える関数
async function changeMonth(change) {
  // TODO: STEP3 保持している月数に change 分を加算する
  // 年の境界を超える場合の処理
  // TODO: STEP3 保持している月数が0未満の場合は、保持している年数を１減らし、保持している月数を11にする
  // TODO: STEP3 保持している月数が11を超える場合は、保持している年数を１増やし、保持している月数を0にする

  // 年月表示と勤怠一覧の更新
  updateYearMonthDisplay();
  await displayAttendanceRecords(auth.currentUser); // 更新された年月で勤怠一覧を再表示
}

// 現在の年月を表示する関数
function updateYearMonthDisplay() {
  const yearMonthDisplay = document.getElementById('currentYearMonth');
  const formattedMonth = ('0' + (currentMonth + 1)).slice(-2); // 月を2桁表示にする
  yearMonthDisplay.textContent = `${currentYear}年${formattedMonth}月`;
}

// 勤怠情報を表示する関数
async function displayAttendanceRecords(user) {
  // 現在の年月に基づいてFirestoreからデータを取得
  const yearMonth = `${currentYear}${('0' + (currentMonth + 1)).slice(-2)}`;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // 現在の年月に基づいてFirestoreからデータを取得
  const recordsRef = collection(firestore, `users/${user.uid}/attendanceRecords/${yearMonth}/records`);
  // 日付順に並べ替えたクエリを作成
  const q = query(recordsRef, orderBy('date'));

  try {
    // クエリの実行と結果の処理
    const querySnapshot = await getDocs(q);
    const attendanceRecords = {}; // 日付をキーとして出勤・退勤時間を保持するオブジェクト
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const day = data.date.split('/')[2]; // 日付の日部分を取得
      // 初めてその日のデータを処理する場合は初期化
      if (!attendanceRecords[day]) {
        attendanceRecords[day] = { startTime: '', endTime: '' };
      }
      // 出勤・退勤時間をセット
      if (data.type === '出勤') {
        attendanceRecords[day].startTime = data.time;
      } else if (data.type === '退勤') {
        attendanceRecords[day].endTime = data.time;
      }
    });

    // 表示の更新
    const attendanceTable = document.getElementById('attendanceTable').getElementsByTagName('tbody')[0];
    attendanceTable.innerHTML = ''; // 既存の内容をクリア

    // 日付ごとにテーブルの行を生成
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${('0' + (currentMonth + 1)).slice(-2)}-${('0' + day).slice(-2)}`;
      const dateFormatted = `${currentYear}/${('0' + (currentMonth + 1)).slice(-2)}/${('0' + day).slice(-2)}`;
      const dayOfWeek = getJapaneseDayOfWeek(dateString);
      const record = attendanceRecords[`${('0' + day).slice(-2)}`] || {};
  
      const tr = document.createElement('tr');
      // 日付のセル
      const tdDate = document.createElement('td');
      tdDate.textContent = dateFormatted;
  
      // 曜日のセル
      const tdDayOfWeek = document.createElement('td');
      // TODO: STEP3 曜日のセルに日本語の曜日を表示する
      
      // 出勤時間のセル
      const tdStartTime = document.createElement('td');
      // TODO: STEP3 出勤時間のセルに出勤時間を表示する
  
      // 退勤時間のセル
      const tdEndTime = document.createElement('td');
      // TODO: STEP3 退勤時間のセルに退勤時間を表示する
      
      // 曜日によってスタイルを変更
      if (dayOfWeek === "土") {
        tr.classList.add("saturday");
      } else if (dayOfWeek === "日") {
        tr.classList.add("sunday");
      }

      // 編集ボタンの追加
      const tdEdit = document.createElement('td');
      const editButton = document.createElement('button');
      editButton.textContent = '編集';
      editButton.addEventListener('click', () => {
        // TODO: STEP3 ダイアログを表示する関数を呼び出す
      });
      tdEdit.appendChild(editButton);
  
      // セルを行に追加
      tr.appendChild(tdDate);
      tr.appendChild(tdDayOfWeek); // 曜日のセルを追加
      tr.appendChild(tdStartTime);
      tr.appendChild(tdEndTime);
      tr.appendChild(tdEdit);
      
      // 行をテーブルに追加
      attendanceTable.appendChild(tr);
    }
  } catch (error) {
    console.error('勤怠情報の取得に失敗しました: ', error);
  }
}

// ダイアログを表示する関数
function showDialog(date, startTime, endTime) {
  // TODO: STEP4 対象行の日付をダイアログに表示する
  // TODO: STEP4 対象行の出勤時刻をダイアログに表示する
  // TODO: STEP4 対象行の退勤時刻をダイアログに表示する
  // TODO: STEP4 非表示になっているダイアログを表示する
}

// Firestoreのデータを更新する関数
async function callRegisterAttendance() {
  const date = document.getElementById('editDate').value;
  const startTime = document.getElementById('editStartTime').value;
  const endTime = document.getElementById('editEndTime').value;

  // 出勤時間と退勤時間が入力されているかチェック
  // TODO: STEP4 出勤時刻、または退勤時刻が入力されていない場合はアラートで以下のメッセージを表示し、処理を中断する
  // 表示するメッセージ：出勤時間と退勤時間を両方入力してください。

  // 出勤時間が退勤時間よりも前であるかチェック
  // TODO: STEP4 出勤時刻が退勤時刻を超えている場合はアラートで以下のメッセージを表示し、処理を中断する
  // 表示するメッセージ：出勤時間は退勤時間よりも前でなければなりません。

  try {
    await registerAttendance(date, startTime, '出勤');
    // TODO: STEP4 退勤処理を行う
    closeDialog(); // ダイアログを閉じる
    displayAttendanceRecords(auth.currentUser); // 勤怠一覧を再表示
    window.location.href = 'attendance-list.html';
  } catch (error) {
    console.error('勤怠情報の更新に失敗しました。', error);
  }
}

// ダイアログを閉じる関数
function closeDialog() {
  document.getElementById('editDialog').style.display = "none";
  // 必要に応じて画面を再描画
  window.location.href = 'attendance-list.html';
}
