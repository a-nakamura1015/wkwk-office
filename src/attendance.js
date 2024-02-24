import { auth, firestore } from './firebaseInit';
import { query, where, getDocs, addDoc, updateDoc, collection, orderBy } from 'firebase/firestore';
import { formatDate, formatTimeHHmm, formatYearMonth } from './util';

// ユーザーの出退勤状況をチェックする関数
export function checkAttendance() {
  const today = new Date(); // 現在の日付を取得
  const yearMonth = formatYearMonth(today); // 現在の年月を取得
  const uid = auth.currentUser ? auth.currentUser.uid : null; // ログインしているユーザーのUIDを取得

  // ユーザーがログインしていない場合は処理を終了
  if (!uid) {
    console.log('ユーザーがログインしていません');
    return;
  }

  // 当日の出勤・退勤記録を検索するクエリを作成
  const userQuery = query(collection(firestore, `users/${uid}/attendanceRecords/${yearMonth}/records`), where('date', '==', formatDate(today)));

  let isWorkStarted = false; // 出勤済みかどうかのフラグ
  let isWorkEnded = false; // 退勤済みかどうかのフラグ

  // クエリを実行して結果を処理
  getDocs(userQuery).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.data().type === '出勤') {
        isWorkStarted = true;
      } else if (doc.data().type === '退勤') {
        isWorkEnded = true;
      }
    });
    // 出勤データがあり、退勤データがない場合「退勤」ボタンを表示し、「出勤」ボタンを非表示にする
    if (isWorkStarted && !isWorkEnded) {
      // 出勤データがあって、退勤データがない場合は「退勤」ボタンを活性化して表示
      // TODO: STEP2 出勤ボタンを非表示にする
      // TODO: STEP2 退勤ボタンを表示する
      // TODO: STEP2 退勤ボタンをクリックできるようにする（活性化する）
    } else if (isWorkEnded) {
      // 退勤データがある場合は「退勤」ボタンを非活性で表示
      // TODO: STEP2 出勤ボタンを非表示にする
      // TODO: STEP2 退勤ボタンを表示する
      // TODO: STEP2 退勤ボタンをクリックできなくする（非活性化する）
    } else {
      // 出勤データも退勤データもない場合
      // TODO: STEP2 出勤ボタンを表示する
      // TODO: STEP2 退勤ボタンを非表示にする
    }

  }).catch((error) => {
    console.error("Firestoreからのデータ取得に失敗しました:", error);
  });  
}

// 出勤ボタンの処理を行う関数
export async function startWork() {
 // ユーザーがログインしていない場合は警告を表示して処理を終了
  if (!auth.currentUser) {
    alert('ログインをする必要があります');
    return;
  }
  const now = new Date(); // 現在の日付と時刻を取得
  const yearMonth = formatYearMonth(now); // 現在の年月を取得
  // 出勤記録のデータを作成
  const workData = {
      email: auth.currentUser.email,
      type: '出勤',
      date: formatDate(now),
      time: formatTimeHHmm(now)
  };
  // Firestoreに出勤データを登録
  addDoc(collection(firestore, `users/${auth.currentUser.uid}/attendanceRecords/${yearMonth}/records`), workData).then(() => {
    // 出勤後の状態チェックを実行
    checkAttendance(); 
  }).catch((error) => {
      console.error('エラー発生: ', error);
  });
}

// 退勤ボタンの処理を行う関数
export async function endWork() {
  // ユーザーがログインしていない場合は警告を表示して処理を終了
  if (!auth.currentUser) {
    alert('ログインをする必要があります');
    return;
  }
  const now = new Date(); // 現在の日付と時刻を取得
  const yearMonth = formatYearMonth(now); // 現在の年月を取得
  // 退勤記録のデータを作成
  const workData = {
      email: auth.currentUser.email,
      type: '退勤',
      date: formatDate(now),
      time: formatTimeHHmm(now)
  };
  // Firestoreに退勤データを登録
  addDoc(collection(firestore, `users/${auth.currentUser.uid}/attendanceRecords/${yearMonth}/records`), workData).then(() => {
      // 退勤後に再度状態をチェック
      checkAttendance(); 
  }).catch((error) => {
      console.error('エラー発生: ', error);
  });
}

// ユーザーの勤怠記録を表示する関数
export async function displayAttendanceRecords(userEmail) {
  // ログインしているユーザーのUIDを取得
  const uid = auth.currentUser ? auth.currentUser.uid : null;
  // ユーザーがログインしていない場合は警告を表示して処理を終了
  if (!uid) {
    alert('ログインをする必要があります');
    return;
  }

  // 現在の年月を取得
  const today = new Date();
  const yearMonth = `${today.getFullYear()}${('0' + (today.getMonth() + 1)).slice(-2)}`;

  // Firestoreから勤怠記録を取得するクエリを作成
  const attendanceRef = collection(firestore, `users/${uid}/attendanceRecords/${yearMonth}/records`);
  const q = query(
    attendanceRef,
    orderBy('date')
  );

  // クエリを実行して結果を処理
  try {
    const querySnapshot = await getDocs(q);
    // 勤怠一覧を表示する要素を取得
    const attendanceList = document.getElementById('attendanceList');
    // 既存の内容をクリア
    attendanceList.innerHTML = '';

    // 各記録に対して処理を行い、一覧に追加
    querySnapshot.forEach(doc => {
      const data = doc.data();
      // 記録の日付と出勤・退勤時刻を表示形式で取得
      const recordElement = document.createElement('div');
      recordElement.textContent = `${data.date} - 出勤: ${data.startTime || '未記録'} / 退勤: ${data.endTime || '未記録'}`;
      // 一覧に記録を追加
      attendanceList.appendChild(recordElement);
    });
  } catch (error) {
    console.error('勤怠情報の取得に失敗しました: ', error);
  }
}

// 出勤時間と退勤時間をFirestoreに登録または更新する関数
export async function registerAttendance(date, time, type) {
  // ログインしているユーザーを取得
  const user = auth.currentUser;
  // ユーザーがログインしていない場合はエラーを表示して処理を終了
  if (!user) {
    console.error('ユーザーがログインしていません。');
    return;
  }

  // 'YYYY/MM/DD'から'YYYYMM'を抽出し、ドキュメントのパスを構築
  const yearMonth = date.slice(0, 7).replace('/', ''); 

  // 指定された日付に対応するドキュメントを検索するクエリを作成
  const collectionPath = `users/${auth.currentUser.uid}/attendanceRecords/${yearMonth}/records`;
  const q = query(collection(firestore, collectionPath), where("date", "==", date), where("type", "==", type));

  // クエリを実行して結果を処理
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // データが存在しない場合は新規追加
      await addDoc(collection(firestore, collectionPath), {
        date: date,
        time: time,
        type: type,
        email: auth.currentUser.email
      });
      console.log(`${type}情報を登録しました`);
    } else {
      // データが存在する場合は更新（最初のドキュメントのみ更新）
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        time: time
      });
      console.log(`${type}情報を更新しました`);
    }
  } catch (error) {
    console.error('勤怠情報の登録に失敗しました: ', error);
    throw error; // エラーを呼び出し元に伝播させる
  }
}
