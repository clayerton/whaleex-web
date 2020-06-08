import ecc from 'eosjs-ecc';
import crypto from 'crypto';
/*
获取和设置本地用户配置
 */
export function saveExpressIds({ userUniqKey, ids, timestamp, remark }) {
  const userId = sessionStorage.getItem('userId');
  callOnStore(function(store) {
    store.put({
      id: userId + 'Ids',
      ids,
      timestamp,
      remark,
    });
  });
}
export function getExpressIds({ userUniqKey }) {
  const userId = sessionStorage.getItem('userId');
  return new Promise((resolve, reject) => {
    callOnStore(function(store) {
      var getData = store.get(userId + 'Ids');
      getData.onsuccess = async function(r) {
        let result = (getData.result && getData.result) || {};
        resolve(result);
      };
    });
  });
}
export function saveCustomConfig(data) {
  callOnStore(function(store) {
    store.put({
      id: 'customConfig',
      data,
    });
  });
}
export function getCustomConfig() {
  return new Promise((resolve, reject) => {
    callOnStore(function(store) {
      var getData = store.get('customConfig');
      getData.onsuccess = async function() {
        resolve((getData.result && getData.result.data) || {});
      };
    });
  });
}
/*
秘钥对 保存
 */
export async function encryptDataSaveKey(data) {
  const userId = sessionStorage.getItem('userId');
  const { userUniqKey, id, pubkey, privateKey } = data;
  callOnStore(function(store) {
    store.put({
      userId,
      id: userId,
      pubkey,
      userEncryptKey: encrypt(privateKey, userUniqKey),
    });
  });
}
export async function encryptDataCopySaveKey(data) {
  const { userId, pubkey, userEncryptKey } = data;
  callOnStore(function(store) {
    store.put({
      userId,
      id: userId,
      pubkey,
      userEncryptKey,
    });
  });
}
/*
秘钥对 获取 key user-key
 */
export function loadKeyDecryptData(key) {
  const userId = sessionStorage.getItem('userId');
  const lastUserId = sessionStorage.getItem('lastUserId');
  if (!userId) {
    return {};
  }
  return new Promise((resolve, reject) => {
    callOnStore(function(store) {
      var getData = store.get(`${userId}`);
      getData.onsuccess = async function() {
        if (!getData.result && `${lastUserId}` !== '0') {
          var tryGetData = store.get(`${lastUserId}`);
          tryGetData.onsuccess = async function() {
            //删除原有id数据  保留？删数据可能会出现异常？
            //复制数据
            if (!_.isEmpty(tryGetData.result)) {
              const { pubkey, userEncryptKey } = tryGetData.result;
              encryptDataCopySaveKey({
                userId,
                pubkey,
                userEncryptKey,
              });
            }
            resolve(tryGetData.result || {});
          };
        } else {
          resolve(getData.result || {});
        }
      };
    });
  });
}
/*
秘钥对 删除 key user-key
 */
export function deleteStoreByKey(key) {
  callOnStore(function(store) {
    var deleteData = store.delete(key);
    deleteData.onsuccess = async function() {};
  });
}
/**
 * 加密  https://we.whaleex.net/pages/viewpage.action?pageId=14483924
 * key:从服务器获取user key
 */
export function encrypt(privatekey, key) {
  // 加密
  const algorithm = 'aes-128-ecb';
  let data = privatekey;
  let cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * 解密
 * @param key
 * encrypted:缓存里 的 加密过的私钥
 * @constructor
 */
export function decrypt(encrypted, key) {
  const algorithm = 'aes-128-ecb';
  let decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted; //加密前的 私钥
}

/*
保存数据库
 */
function callOnStore(fn_) {
  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
  var indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;
  if (!indexedDB) {
    //TODO 兼容性
    console.log('你的浏览器不支持IndexedDB');
  }
  // Open (or create) the database
  var open = indexedDB.open('MyDatabase', 1);

  // Create the schema
  open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore('MyObjectStore', { keyPath: 'id' });
  };

  open.onsuccess = function() {
    // Start a new transaction
    var db = open.result;
    var tx = db.transaction('MyObjectStore', 'readwrite');
    var store = tx.objectStore('MyObjectStore');

    fn_(store);

    // Close the db when the transaction is done
    tx.oncomplete = function() {
      db.close();
    };
  };
}

// export async function encryptDecrypt() {
//   var data = await makeData();
//   console.log('generated data', data);
//   var keys = await makeKeys();
//   var encrypted = await encrypt(data, keys);
//   console.log('encrypted', encrypted);
//   var finalData = await decrypt(encrypted, keys);
//   console.log('decrypted data', data);
// }
//
// function makeData() {
//   let a = new Uint8Array(16);
//   return window.crypto.getRandomValues(a);
// }
//
// function makeKeys() {
//   return window.crypto.subtle.generateKey(
//     {
//       name: 'RSA-OAEP',
//       modulusLength: 2048, //can be 1024, 2048, or 4096
//       publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
//       hash: { name: 'SHA-256' }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
//     },
//     false, //whether the key is extractable (i.e. can be used in exportKey)
//     ['encrypt', 'decrypt'] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
//   );
// }
//
// function encrypt(data, keys) {
//   return window.crypto.subtle.encrypt(
//     {
//       name: 'RSA-OAEP',
//       //label: Uint8Array([...]) //optional
//     },
//     keys.publicKey, //from generateKey or importKey above
//     data //ArrayBuffer of data you want to encrypt
//   );
// }
//
// async function decrypt(data, keys) {
//   return new Uint8Array(
//     await window.crypto.subtle.decrypt(
//       {
//         name: 'RSA-OAEP',
//         //label: Uint8Array([...]) //optional
//       },
//       keys.privateKey, //from generateKey or importKey above
//       data //ArrayBuffer of the data
//     )
//   );
// }
