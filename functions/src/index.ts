import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const settings = {timestampsInSnapshots: true};
admin.firestore().settings(settings);

/**
 * @desc ショートリクエストをリダイレクト
 */
export const redirectUrl = functions.https.onRequest((request, response) => {
  const id = request.path.substr(1);
  const db = admin.firestore();
  console.log('ID : ', id);

  // キャッシュコントロール
  response.set('Cache-Control', 'public, max-age=604800, s-maxage=604800');

  // リダイレクト先のURLをデータベースから読み込み
  db.collection('urls').doc(id).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('Page not found');
        response.status(404).end();
      } else {
        console.log('Redirect to ', doc.data().url);
        response.redirect(301, doc.data().url);
      }
    }).catch(err => {
      console.log('Error getting document', err);
    });
});

/**
 * @desc URLを登録
 */
export const registerUrl = functions.https.onCall((data, context) => {
  const validUrl = require("valid-url");
  const baseUrl = "https://nabe.ga/";
  const url = data.url;
  const db = admin.firestore();
  console.log('Register URL : ', url);

  // URLのバリデーション
  if (!validUrl.isUri(url)) {
    throw new functions.https.HttpsError('invalid-argument', `${url} is not a url.`);
  }

  // データベースに登録するデータセット
  const urlData = {
    url: url,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }

  // 非同期オペレーションの後にデータを返すにはPromiseを返す。
  return db.collection('urls').add(urlData)
    .then(ref => {
      const responseData = {
        originUrl: url,
        shortUrl: baseUrl + ref.id,
        isSuccess: true
      };
      return responseData;
    })
    .catch(err => {
      throw new functions.https.HttpsError('invalid-argument', url + 'is not a url.');
    });
});
