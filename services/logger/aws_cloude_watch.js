let api_logs = (req, status_code) => {
  let start = parseInt(req["x-request-start"])
  let end = new Date().getTime()
  req["x-execution-time"] = end - start
  let error_type = "success"
  if (status_code === 200) {
    error_type = "success"
  } else if (status_code === 200) {
    error_type = "bad_request"
  } else {
    error_type = "error"
  }

  return {
    error_type: error_type,
    execution_time: `${req["x-execution-time"]}`,
    path: req.path,
    headers: req.headers,
    method: req.method,
    payload: req.payload,
    query: req.query,
    status_code: status_code,
  }
}

module.exports = {
  api_logs,
}
