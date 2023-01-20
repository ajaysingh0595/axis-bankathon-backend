const aws = require("./aws")
const os = require("os")
const fs = require("fs")
const settings = require("../../config/settings")
// Decent bucket name
const bucketName = "flaplive-static-assets"

// Initiating S3 instance
const s3 = new aws.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName },
})

// Options you can choose to set to accept files upto certain size limit
const options = { partSize: 10 * 1024 * 1024, queueSize: 1 }
// The heart
// "Key" accepts name of the file, keeping it a timestamp for simplicity
// "Body" accepts the file
async function upload_common(file_details) {
  // let file_stream = fs.createReadStream(file_details.path)
  const params = {
    Bucket: bucketName,
    Key: file_details.filename,
    Body: file_details.body,
    ContentType: file_details.mimetype,
    ACL: "public-read",
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
async function stream_upload(file_details) {
  let file_stream = fs.createReadStream(file_details.path)
  const params = {
    Bucket: bucketName,
    Key: file_details.filename,
    Body: file_stream,
    ContentType: file_details.mimetype,
    ACL: "public-read",
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
async function upload_image(file_details) {
  let file_stream = fs.createReadStream(file_details.path)
  const params = {
    Bucket: bucketName,
    Key: file_details.filename,
    Body: file_stream,
    ContentType: file_details.mimetype,
    ACL: "public-read",
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

async function upload_base64(file, file_details) {
  const buf = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""), "base64")
  const data = {
    Bucket: bucketName,
    Key: file_details,
    ACL: "public-read",
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  }
  try {
    let file_resp
    await s3
      .upload(data, options)
      .promise()
      .then((res) => {
        file_resp = res
      })
    console.log(file_resp)
    return file_resp["Location"]
  } catch (err) {
    return ""
  }
}

let upload_to_s3 = async (req, file, remote_filename) => {
  let RESPONSE = {
    is_error: false,
    msg: "",
    result: { path: null },
  }
  try {
    req.log("File Uploading")
    const temp_dir = os.tmpdir()
    const temp_file_name = Math.floor(new Date()) + "-" + file.hapi.filename
    const file_stream = fs.createWriteStream(`${temp_dir}/${temp_file_name}`)
    const file_details = await new Promise((resolve, reject) => {
      file.on("error", function (err) {
        reject(new Error(err))
      })

      file.pipe(file_stream)

      file.on("end", function (err) {
        const file_details = {
          fieldname: file.hapi.name,
          originalname: file.hapi.filename,
          mimetype: file.hapi.headers["content-type"],
          destination: `${temp_dir}/`,
          filename: remote_filename + temp_file_name,
          path: `${temp_dir}/${temp_file_name}`,
          s3_cdn_path:
            settings.AWS.CDN_URL + "/" + remote_filename + temp_file_name,
          //  size: fs.statSync(`${temp_dir}/${temp_file_name}`).size,
        }

        resolve(file_details)
      })
    })

    // Uploading file to AWS S3
    await upload_image(file_details).then((resp) => {
      RESPONSE.result["path"] = file_details.s3_cdn_path // resp.Location
    })
  } catch (e) {
    console.error(e)
    RESPONSE.is_error = true
    RESPONSE.msg = e.message
  }
  //req.log(rFile);
  return RESPONSE
}
module.exports = {
  upload_to_s3: upload_to_s3,
  upload_common: upload_common,
  stream_upload: stream_upload,
}
