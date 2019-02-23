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
 * @desc Initializes UrlShortener.
 */
class UrlShortener {
  /**
   * @desc Constructor
   */
  constructor() {
    this.checkSetup();

    this.shortenButton = document.getElementById('shorten');
    this.urlInput = document.getElementById('origin-url');

    this.shortenButton.addEventListener('click', this.shortenClicked.bind(this));

    this.initFirebase();
  }

  /**
   * @desc Firebaseの初期設定
   */
  initFirebase() {
    this.functions = firebase.functions();

    firebase.auth().signInAnonymously();
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

  /**
   * @desc URLを登録
   */
  shortenClicked() {
    const registerUrl = firebase.functions().httpsCallable('registerUrl');
    const originUrl = this.urlInput.value;

    registerUrl({ url: originUrl })
      .then(result => {
        console.log(result.data.shortUrl);
        this.showShortenUrl(result.data.shortUrl);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  /**
   * @desc 短縮後のURLを画面に表示
   * @param {String} url 短縮後のURL
   */
  showShortenUrl(url) {
    const urlDiv = document.getElementById('shorten-url');
    urlDiv.textContent = `Shorten to ${url}`;
  }
}

window.onload = () => {
  // Initializes UrlShortener.
  window.urlShortener = new UrlShortener();
};
