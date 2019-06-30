"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const settings = { timestampsInSnapshots: true };
admin.firestore().settings(settings);

/**
 * @desc ショートリクエストをリダイレクト
 */
exports.redirectUrl = functions.https.onRequest((request, response) => {
  const id = request.path.substr(1);
  const db = admin.firestore();
  console.log('ID : ', id);

  // TODO : 06. リクエストへのレスポンスを設定
  response.status(200).send(`Hello ${id}!`);

  // TODO : 13. キャッシュコントロール
  response.set('Cache-Control', 'public, max-age=604800, s-maxage=604800');

  // TODO : 08. リダイレクト先のURLをデータベースから読み込み
  db.collection('urls').doc(id).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('Page not found');
        response.status(404).end();
      }
      else {
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
exports.registerUrl = functions.https.onRequest((request, response) => {
  const validUrl = require("valid-url");
  const baseUrl = "https://nabe.ga/";
  const url = data.url;
  const db = admin.firestore();
  console.log('Register URL : ', url);

  // URLのバリデーション
  if (!validUrl.isUri(url)) {
    throw new functions.https.HttpsError('invalid-argument', `${url} is not a url.`);
  }

  const urlData = {
    url: url,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  // TODO : 10. 非同期オペレーションの後にデータを返すにはPromiseを返す
  db.collection('urls').add(urlData)
    .then(ref => {
      const responseData = {
        originUrl: url,
        shortId: baseUrl + ref.id,
        isSuccess: true
      };
      response.status(200).send(responseData);
    })
    .catch(err => {
      throw new functions.https.HttpsError('invalid-argument', url + 'is not a url.');
    });
});
