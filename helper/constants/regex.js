module.exports = {
  DATETIME:
    /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])\+05:30$/i,
  NAME: /^[a-z]+$/i,
  ADDRESS_LABEL: /(.*?)/i,
  MOBILE: /^\d{10}$/,
  EMAIL: /\S+@\S+\.\S+/,
  PINCODE: /^\d{6}$/,
  OTP: /^\d{4}$/,
  LATITUDE: /(.*?)$/,
  LONGITUDE: /(.*?)$/,
  ADDRESS_LINE1: /(.*?)/i,
  ADDRESS_LINE2: /(.*?)/i,
  LANDMARK: /(.*?)/i,
  INSTRUCTIONS_TO_REARCH: /(.*?)/i,
  GOOGLE_MAPS_ADDRESS: /(.*?)/i,

  USER_SEARCH_QUERY: /^[a-z ]+$/i,
  REFRESH_TOKEN_LABEL: /^refresh_token$/,
  REFRESH_TOKEN: /^[a-z0-9.]+$/i,
  SENDER_AND_RECEIVER_NAME: /(.*?)$/,
  SENDER_AND_RECEIVER_PHONE: /^[0-9]{10}$/i,
  // PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/  // 8chars; 1upper; 1lower;1 number; 1special
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#]{8,}$/, // min 8 chars; 1 letter; 1 number
}
