const settings = require("../../config/settings")
let _crypto = require("crypto")
let Service = {
  encryption: async (data) => {
    let RESPONSE = {
      is_error: false,
      msg: "Ok",
      result: {},
    }
    try {
      if (!data) throw new Error("no data to encrypt or decrypt")
      let hash = _crypto
        .createHash("sha256")
        .update(settings.ENCRYPT_DECRYPT_KEY)
        .digest()
        .toString("hex")
        .substring(0, 32)
      let cipher = _crypto.createCipheriv(settings.ALGORITHM, hash, settings.IV)
      let encrypted = cipher.update(data, "utf8", "base64")
      encrypted += cipher.final("base64")
      encrypted = encrypted.replace(/-/g, "+").replace(/_/g, "/")
      console.log("encrypted : ", encrypted)
      RESPONSE.result = encrypted
    } catch (e) {
      console.log(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
  decryption: async (data) => {
    let RESPONSE = {
      is_error: false,
      msg: "Ok",
      result: {},
    }
    try {
      console.log("data : ", data)
      if (!data) throw new Error("no data to encrypt or decrypt")
      let hash = _crypto
        .createHash("sha256")
        .update(settings.ENCRYPT_DECRYPT_KEY)
        .digest()
        .toString("hex")
        .substring(0, 32)
      let decrypt = data.replace(/\+/g, "-").replace(/\//g, "_")
      let decipher = _crypto.createDecipheriv(
        settings.ALGORITHM,
        hash,
        settings.IV
      )
      let decrypted = decipher.update(decrypt, "base64", "utf8")
      decrypted += decipher.final("utf8")
      let parsedData = JSON.parse(decrypted)
      RESPONSE.result = parsedData
    } catch (e) {
      console.log(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
}

module.exports = Service
