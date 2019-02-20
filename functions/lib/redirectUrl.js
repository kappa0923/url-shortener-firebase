"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
/**
 * @desc ショートリクエストをリダイレクト
 */
exports.redirectUrl = functions.https.onRequest((request, response) => {
    const id = request.path.substr(1);
    const db = admin.firestore();
    console.log('ID : ', id);
    response.set('Cache-Control', 'public, max-age=604800, s-maxage=604800');
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
//# sourceMappingURL=redirectUrl.js.map