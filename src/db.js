const mariadb = require('mariadb');

// DB 쿼리할 때 환경변수를 사용하려면 여기에 import한다.
require("dotenv").config();

// const pool = mariadb.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'manchu9810!',
//   database: 'reddoughnutdb'
// });

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
  connectionLimit: 10
})

// 회원가입 로직 실행
const registerQuery = async (query, userData) => {
  let conn;
  try {
    conn = await pool.getConnection()
    const result = await conn.query(query, userData)
    return result

    // const registerQuery = `INSERT INTO red_account (user_name, user_id, user_password, user_gender) VALUES (?, ?, ?, ?)`
    // await conn.query(registerQuery, [userData.username, userData.id, userData.password, userData.gender])
  } catch (err) {
    throw err
  } finally {
    if (conn) {
      conn.release()
    }
  }
}
// 회원 가입 전에 아이디 중복되는지 확인
const checkIDExists = async (id) => {
  const query = `SELECT * FROM red_account WHERE user_id = ?`
  const result = await registerQuery(query, [id])
  return result.length > 0
}
// 아이디가 중복되지 않으면 회원 가입 실행
const registerUser = async (username, id, password, gender) => {
  const query = `INSERT INTO red_account (user_name, user_id, user_password, user_gender) VALUES (?, ?, ?, ?)`
  await registerQuery(query, [username, id, password, gender])
}

// 로그인 로직 실행
const loginQuery = async (query, loginData) => {
  let conn;
  try {
    conn = await pool.getConnection()
    const result = await conn.query(query, loginData)
    return result
  } catch (err) {
    throw err
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

// 아이디와 비밀번호가 맞는지 확인
const validateLogin = async (id, password) => {
  const query = `SELECT * FROM red_account WHERE user_id = ? AND user_password = ?`
  const result = await loginQuery(query, [id, password])
  return result.length > 0
}

// 헌혈의집 검색
const searchRedCrossQuery = async (query, searchData) => {
  let conn
  try {
    conn = await pool.getConnection()
    const result = await conn.query(query, searchData)
    //console.log(result)
    return result
  } catch (err) {
    throw err
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

const searchRedCross = async (selectedCity, selectedCounty) => {
  const query = `SELECT center_name FROM red_house_center WHERE city = ? AND county = ?`
  const result = await searchRedCrossQuery(query, [selectedCity, selectedCounty])
  //console.log(result)
  //return result.length > 0
  return result
}

// 헌혈카페 검색
const searchHanmaumQuery = async (query, searchData) => {
  let conn
  try {
    conn = await pool.getConnection()
    const result = await conn.query(query, searchData)
    //console.log(result)
    return result
  } catch (err) {
    throw err
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

const searchHanmaum = async (selectedHanmaumCity, selectedHanmaumCounty) => {
  const query = `SELECT center_name FROM red_cafe_center WHERE city = ? AND county = ?`
  const result = await searchHanmaumQuery(query, [selectedHanmaumCity, selectedHanmaumCounty])
  //console.log(result)
  //return result.length > 0 -> result.length > 0은 그냥 true false만 반환해준다
  return result
}

module.exports = {checkIDExists, registerUser, validateLogin, searchRedCross, searchHanmaum};