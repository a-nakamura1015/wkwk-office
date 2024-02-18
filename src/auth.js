import { auth } from './firebaseInit';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// ログイン機能
export function googleLogin() {
  // GoogleAuthProvider のインスタンスを作成
  const provider = new GoogleAuthProvider();
  // signInWithPopup を呼び出し
  signInWithPopup(auth, provider).then((result) => {
    console.log('ログイン成功');
  }).catch((error) => {
    // ログイン時にエラーが発生した場合
    console.error('ログインエラー', error);
  })
}

// ログアウト機能
export function googleLogout() {
  signOut(auth).then(() => {
    // ログアウト成功時の処理
    console.log('ログアウトしました');
  }).catch((error) => {
    console.error('ログアウトエラー', error);
  });
}

// ユーザーUIの更新
export function updateUserUI(user) {
  const displayNameElement = document.getElementById('userDisplayName');
  const userIconElement = document.getElementById('userIcon');
  const defaultIcon = 'https://4.bp.blogspot.com/-3RUKo5svYpQ/W4PJhjUdq_I/AAAAAAABOH4/gKeyTomHJNs7OF1YkvbuvQo-jUqen9SrwCLcBGAs/s800/animal_usaghi_netherland_dwarf.png';
  if (user) {
    displayNameElement.textContent = user.displayName;
    userIconElement.src = user.photoURL || defaultIcon;
    displayNameElement.style.display = 'block';
    userIconElement.style.display = 'block';
  } else {
    displayNameElement.style.display = 'none';
    userIconElement.style.display = 'none';
  }
}
