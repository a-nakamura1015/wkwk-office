// 日付を 'YYYY/MM/DD' 形式の文字列に変換する関数
export function formatDate(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

// 時刻を 'HH:MM:SS' 形式の文字列に変換する関数
export function formatTime(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

// 時刻を 'HH:MM' 形式の文字列に変換する関数（秒を除外）
export function formatTimeHHmm(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 年月を 'YYYYMM' 形式の文字列に変換する関数
export function formatYearMonth(date) {
  return `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}`;
}

// 曜日を日本語で返す関数
// 日付は 'YYYY-MM-DD' または Date オブジェクト形式で指定
export function getJapaneseDayOfWeek(date) {
  const dayOfWeek = new Date(date).getDay(); // 曜日を数値で取得 (0:日曜日, ..., 6:土曜日)
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[dayOfWeek];
}
