const fs = require("fs")
const path = require("path")
const stream = require("stream")
const AWS = require("aws-sdk")
const mapValues = require("lodash.mapvalues")
const axios = require("axios")
const { PassThrough } = require("stream")
const s3Conf = {
  //   ...require("./secret.json"),
  bucketName: "flaplive-assets-static",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  acl: "public-read",
}

async function saveToFileSystem(fileStream, index) {
  return await new Promise((resolve, reject) => {
    const dir = path.dirname("/tmp/" + index + ".png")
    fs.mkdirSync(dir, {
      recursive: true,
    })
    const writeStream = fs.createWriteStream("/tmp/" + path)
    stream.pipeline(fileStream, writeStream, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          size: -1, // unknown size
          hash: "hash", // unknown hash
        })
      }
    })
  })
}

async function saveToS3(fileStream, index) {
  return await new Promise((resolve, reject) => {
    const s3 = new AWS.S3()
    fileStream.on("error", (err) => {
      this.logger.error(`Error while sending to S3`, { path })
      reject(err)
    })

    const params = {
      Bucket: s3Conf.bucketName,
      ACL: s3Conf.acl,
      Key: "/" + index + ".png",
      ContentType: "image/jpeg",
      Body: fileStream,
    }

    const managedUpload = s3.upload(params, {
      queueSize: 1,
      partSize: 5 * 1024 * 1024,
    })
    let size = 0

    managedUpload.on("httpUploadProgress", (progress) => {
      // console.log(`-- upload progress  --`, progress);
      if (progress.total) size = progress.total
    })

    managedUpload.send((err, data) => {
      if (err) reject(err)
      else resolve({ size, hash: data.ETag.replace(/[^a-z0-9A-Z]/g, "") })
    })
  })
}

async function launchUpload(storageType, fileName, index) {
  const startTime = Date.now()
  console.log(`--------------------------------`)
  console.log(`Start upload to ${storageType} !`)
  console.log(`--------------------------------`)
  //   const fileStream = fs.createReadStream("media-sample.jpg")

  //   let uploadResult
  //   if (storageType === "fs")
  //     uploadResult = await saveToFileSystem(fileStream, index)
  //   else if (storageType === "s3") uploadResult = await saveToS3(fileStream)
  //   else throw new Error("unknown-storage-type")

  await Promise.all(
    Array(10)
      .fill(0)
      .map(async (v, index) => {
        const fileStream = fs.createReadStream(fileName)

        let uploadResult
        if (storageType === "fs")
          uploadResult = await saveToFileSystem(fileStream, index)
        else if (storageType === "s3") uploadResult = await saveToS3(fileStream)
        else throw new Error("unknown-storage-type")

        // printRAMUsage();
        // console.log(`DONE ${index} size: ${uploadResult.size} hash : ${uploadResult.hash}`);
      })
  )

  console.log(`END upload to ${storageType} in ${Date.now() - startTime} ms`)
}

function printRAMUsage() {
  const memoryUsage = mapValues(process.memoryUsage(), (v) =>
    (Math.round((v * 10) / (1024 * 1024)) / 10).toLocaleString().padStart(7)
  )
  console.log(
    `RAM usage :`,
    `Heap : ${memoryUsage.heapUsed}/${memoryUsage.heapTotal} Mo rss : ${memoryUsage.rss} Mo external : ${memoryUsage.external} Mo`
  )
}
let upload = async (fileName, index) => {
  //   setInterval(printRAMUsage, 500)

  AWS.config.update({
    accessKeyId: s3Conf.accessKeyId,
    secretAccessKey: s3Conf.secretAccessKey,
  })
  //   printRAMUsage()
  await launchUpload("fs", fileName, index)
  //   printRAMUsage()
  await launchUpload("s3")
  //   printRAMUsage()
}
async function upload_image(filePath, filename, file_type) {
  await AWS.config.update({
    accessKeyId: s3Conf.accessKeyId,
    secretAccessKey: s3Conf.secretAccessKey,
  })
  const s3 = new AWS.S3()

  let fileStream = fs.createReadStream(filePath)

  const options = { partSize: 10 * 1024 * 1024, queueSize: 1 }
  const params = {
    Bucket: s3Conf.bucketName,
    ACL: s3Conf.acl,
    Key: "static-common/" + filename,
    ContentType: file_type,
    Body: fileStream,
  }
  let file_resp = null
  await s3
    .upload(params, options)
    .promise()
    .then((res) => {
      file_resp = res
    })
  return file_resp
}
const uploadToS3FromUrl = async (url) => {
  let RESPONSE = {
    result: {
      url: "",
    },
    is_error: false,
  }
  try {
    await AWS.config.update({
      accessKeyId: s3Conf.accessKeyId,
      secretAccessKey: s3Conf.secretAccessKey,
    })
    const s3 = new AWS.S3()
    var milliseconds = new Date().getTime()
    var timestamp = milliseconds.toString().substring(9, 13)
    var random = ("" + Math.random()).substring(2, 8)
    var random_number = timestamp + random

    let filename = random_number + ".png"
    const { data } = await axios
      .get(url, { responseType: "stream" })
      .catch((e) => {
        throw Error("Url is not valid")
      })

    const upload = await s3
      .upload({
        Bucket: s3Conf.bucketName,
        ACL: s3Conf.acl,
        Key: "static-common/" + filename,
        ContentType: "image/png",
        Body: data,
        Body: data,
      })
      .promise()
    RESPONSE.result = {
      url: upload.Location,
      //   cdn: `https://d11k6i1zyiz1cm.cloudfront.net/static-common/${filename}`,
    }

    return RESPONSE
  } catch (error) {
    RESPONSE.is_error = true
    console.error(error)
  }
  return RESPONSE
}
module.exports = {
  saveToS3,
  saveToFileSystem,
  upload,
  upload_image,
  uploadToS3FromUrl,
}

// ()
//   .then(() => {
//     console.log(`DONE`)
//     // process.exit(0)
//   })
//   .catch((error) => console.log(`END WITH ERROR `, error))
