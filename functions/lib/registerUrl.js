"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
/**
 * @desc URLを登録
 */
exports.registerUrl = functions.https.onRequest((request, response) => {
    const url = request.query['url'];
    const db = admin.firestore();
    console.log('Register URL : ', url);
    const urlData = {
        url: url,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    db.collection('urls').add(urlData)
        .then(ref => {
        console.log(ref.id);
        const responseData = {
            originUrl: url,
            shortId: ref.id
        };
        response.status(200).send(responseData);
    });
});
//# sourceMappingURL=registerUrl.js.map