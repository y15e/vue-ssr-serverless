import * as Cookies from 'js-cookie';

/** @class */
export default class CustomStorage {

  /**
   * Constructs a new CookieStorage object
   * @param {object} data Creation options.
   * @param {string} data.domain Cookies domain (mandatory).
   * @param {string} data.path Cookies path (default: '/')
   * @param {integer} data.expires Cookie expiration (in days, default: 365)
   * @param {boolean} data.secure Cookie secure flag (default: true)
   */
  constructor(data) {
    console.log('[Storage constructor]')
    Object.keys(data).forEach(key => {
      console.log(key)
      this[key] = data[key]
    })
  }

  /**
   * This is used to set a specific item in storage
   * @param {string} key - the key for the item
   * @param {object} value - the value
   * @returns {string} value that was set
   */
  setItem(key, value) {
    console.log('[Storage setItem] ' + key + ' ' + value)
    this[key] = value
    return value
  }

  /**
   * This is used to get a specific key from storage
   * @param {string} key - the key for the item
   * This is used to clear the storage
   * @returns {string} the data item
   */
  getItem(key) {
    console.log('[Storage getItem] ' + key)
    return this[key]
  }

  /**
   * This is used to remove an item from storage
   * @param {string} key - the key being set
   * @returns {string} value - value that was deleted
   */
  removeItem(key) {
    console.log('[Storage removeItem] ' + key)
    return Cookies.remove(key, {
      path: this.path,
      domain: this.domain,
      secure: this.secure,
    }
    );
  }

  /**
   * This is used to clear the storage
   * @returns {string} nothing
   */
  clear() {
    console.log('[Storage clear]')
    const cookies = Cookies.get();
    let index;
    for (index = 0; index < cookies.length; ++index) {
      Cookies.remove(cookies[index]);
    }
    return {};
  }
}