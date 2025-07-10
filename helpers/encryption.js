import CryptoJS from 'crypto-js';

export function encrypt(text) {
    const secretKey = CryptoJS.SHA256(process.env.SECRET_KEY).toString();;
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(
        text,
        CryptoJS.enc.Hex.parse(secretKey),
        {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }
    );

    const encryptedBase64 = CryptoJS.enc.Base64.stringify(
        iv.concat(encrypted.ciphertext)
    );

    console.log('encrypted:', encryptedBase64);
}

export function decrypt(key) {
    try {
        const fullCipher = CryptoJS.enc.Base64.parse(key);
        
        const iv = CryptoJS.lib.WordArray.create(fullCipher.words.slice(0, 4), 16);
        const ciphertext = CryptoJS.lib.WordArray.create(fullCipher.words.slice(4));

        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: ciphertext
        });

        const secretKey = CryptoJS.SHA256(process.env.SECRET_KEY).toString();

        const decrypted = CryptoJS.AES.decrypt(
            cipherParams,
            CryptoJS.enc.Hex.parse(secretKey),
            {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC,
            }
        );

        const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        
        return [decryptedStr, null];
    } catch (error) {
        console.error("Decryption error:\n", error);
        return [null, { status: 500, message: 'An error occurred while decrypting the given key.'}];
    }
}