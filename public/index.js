/**
 * Copyright (c) 2018 kappa0923.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// index.js
'use strict';

/**
 * @desc Initializes UrlShorter.
 */
class UrlShorter {
  /**
   * @desc Constructor
   */
  constructor() {
    this.checkSetup();

    this.originUrlInput = document.getElementById('originUrl');
    this.shortenButton = document.getElementById('shorten');
    this.shortenedUrlInput = document.getElementById('shortenedUrl');

    this.shortenButton.addEventListener('click', this.shortenClicked.bind(this));

    this.initFirebase();

    // TODO : 07. 画像を指定して表示
    // TODO : 08. リアルタイム表示するなら不要
    // this.loadPictures('pic-01', '1523809671051.jpg', false);
  }

  /**
   * @desc Firebaseの初期設定
   */
  initFirebase() {
    this.storageRef = firebase.storage().ref();
    this.firestore = firebase.firestore();

    const settings = { timestampsInSnapshots: true };
    this.firestore.settings(settings);

    // TODO : 08. 画像の情報をFirestoreから読み出し
    // this.firestore.collection('images')
    //   .orderBy('updatedDate')
    //   .onSnapshot(async (querySnapshot) => {
    //     for (let change of querySnapshot.docChanges) {
    //       if (change.type === 'added') {
    //         await this.loadPictures(change.doc.id,
    //           change.doc.data().fileName, change.doc.data().isThumb);
    //       }
    //     }
    //   });
  }

  /**
   * @desc Download Pictures
   * @param {string} key identify key
   * @param {string} fileName saved image file name
   * @param {boolean} isThumb generated thumbnail or not
   * @return {Promise} FirebaseのPromise
   */
  loadPictures(key, fileName, isThumb) {
    // TODO : 07. 単一の画像をダウンロード
    // TODO : 11. サムネイル表示するなら不要
    // return this.storageRef.child(`images/${fileName}`)
    //   .getDownloadURL()
    //   .then((url) => {
    //     this.displayPicture(key, url);
    //   });

    // TODO : 11. サムネイル画像を表示
    // if (isThumb) {
    //   return this.storageRef.child(`images/thumb_${fileName}`)
    //     .getDownloadURL()
    //     .then((url) => {
    //       this.displayPicture(key, url);
    //     });
    // } else {
    //   return this.storageRef.child(`images/${fileName}`)
    //     .getDownloadURL()
    //     .then((url) => {
    //       this.displayPicture(key, url);
    //     });
    // }
  }

  /**
   * @desc Display a Picture in the UI
   * @param {string} key identify key
   * @param {string} picUrl 表示画像のURL
   */
  displayPicture(key, picUrl) {
    // 表示する子要素のcontainerを取得
    let item = document.getElementById(key);

    // 子要素を生成
    if (!item) {
      const container = document.createElement('li');
      container.innerHTML = CloudAlbum.PICTURE_TEMPLATE;
      item = container.firstChild;
      item.setAttribute('id', key);
      this.pictureList.appendChild(item);
    }

    // 子要素の画像のURLを指定
    if (picUrl) {
      item.querySelector('.pic').setAttribute('src', picUrl);
      item.querySelector('.link').setAttribute('href', picUrl);
    }

    // Show the card fading-in.
    setTimeout(() => {
      item.classList.add('visible');
    }, 1);
  }

  /**
   * @desc アップロードボタンが押されたことを検知する
   * @param {object} event イベントオブジェクト
   */
  uploadClicked(event) {
    event.preventDefault();
    this.uploadInput.click();
  }

  /**
   * @desc ファイル選択後に呼ばれる
   * @param {object} event イベントオブジェクト
   */
  uploadImage(event) {
    // TODO : 06. ファイルアップロード処理
    // const file = event.target.files[0];
    // const extension = file.name.split('.').pop();
    // const fileName = `${Date.now()}.${extension}`;
    // const imageRef = this.storageRef.child(`images/${fileName}`);

    imageRef.put(file).then(() => {
      console.log('Uploaded file');

      // TODO : 08. 画像情報をFirestoreに保存する
      // this.saveImageInfo(fileName);
    });

    this.uploadInput.value = '';
  }

  /**
   * @desc ファイル名を指定して、その情報をfirestoreに保存する
   * @param {string} fileName 保存するファイル名
   */
  saveImageInfo(fileName) {
    this.firestore.collection('images')
      .add({
        fileName: fileName,
        isThumb: false,
        updatedDate: new Date(),
      })
      .then(() => {
        console.log('Document saved');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }

  /**
   * @desc firebaseが正常にロードされているかのチェック
   */
  checkSetup() {
    if (!window.firebase
      || !(firebase.app instanceof Function)
      || !firebase.app().options) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
    }
  }
}

window.onload = () => {
  // Initializes UrlShorter.
  window.urlShorter = new UrlShorter();
};
