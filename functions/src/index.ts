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

  response.set('Cache-Control', 'public, max-age=604800, s-maxage=604800');

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
export const registerUrl = functions.https.onRequest((request, response) => {
  const url = request.query['url'];
  const db = admin.firestore();
  console.log('Register URL : ', url);

  const urlData = {
    url: url,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }

  db.collection('urls').add(urlData)
    .then(ref => {
      console.log(ref.id);
      const responseData = {
        originUrl: url,
        shortId: ref.id,
        isSuccess: true
      };
      response.status(200).send(responseData);
    })
    .catch(err => {
      const responseData = {
        originUrl: url,
        shortId: '',
        isSuccess: false
      };
    });
});
