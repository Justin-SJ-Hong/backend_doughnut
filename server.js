const express = require('express');
const db = require('./src/db.js')
// const conn = db.connection
const bodyParser = require('body-parser')
// const path = require('path');
const cors = require('cors')

const app = express();

app.use(bodyParser.json())

app.use(cors())

require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 헌혈의집 검색
app.post('/api/redcross_select', async (req, res) => {
  console.log(req.body)
  const {selectedCity, selectedCounty} = req.body

  try {
    const rows = await db.searchRedCross(selectedCity, selectedCounty)
    console.log(rows)
    res.json(rows)
  } catch(error) {
    console.error(error)
  }
})

// 헌혈의집 예약
app.post('/api/reserve_redcross', async (req, res) => {
  console.log(req.body)
  
  try {
    res.json(req.body)
  } catch(error) {
    console.log(error)
  }
})

// 헌혈카페 검색
app.post('/api/hanmaum_select', async (req, res) => {
  console.log(req.body)
  const {selectedHanmaumCity, selectedHanmaumCounty} = req.body

  try {
    const hanmaumRows = await db.searchHanmaum(selectedHanmaumCity, selectedHanmaumCounty)
    res.json(hanmaumRows)
    console.log(hanmaumRows)
  } catch(error) {
    console.error(error)
  }
})

// 헌혈카페 예약
app.post('/api/reserve_hanmaum', async (req, res) => {
  console.log(req.body)

  try {
    res.json(req.body)
  } catch(error) {
    console.log(error)
  }
})

// 전자문진
app.post('/api/question_submit', async (req, res) => {
  console.log(req.body)

  try {
    res.json(req.body)
  } catch(error) {
    console.log(error)
  }
})

// 회원가입
app.post('/api/register', async (req, res) => {
  console.log(req.body)
  const {username, id, password, gender} = req.body

  try {
    const idExists = await db.checkIDExists(id)

    if (idExists) {
      res.status(400).json({ message: '이미 사용중인 아이디가 있습니다.' })
      console.log('이미 사용중인 아이디가 있습니다')
      return
    }

    await db.registerUser(username, id, password, gender)

    res.status(200).json({ message: ' 회원가입이 성공적으로 완료되었습니다.'})
  } catch (error) {
    console.error('회원가입 도중 에러가 발생했습니다: ', error)
    res.status(500).json({ message: '회원가입 도중 에러가 발생했습니다.'})
  }
})

// 로그인
app.post('/api/login', async (req, res) => {
  console.log(req.body)
  const {id, password} = req.body

  try {
    const isValid = await db.validateLogin(id, password)

    if (isValid) {
      res.status(200).json({ message: '로그인 성공' })
      console.log('로그인 성공')
    } else {
      res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다' })
      console.log('아이디 또는 비밀번호가 잘못되었습니다')
    }
  } catch (error) {
    console.error('로그인 실패 : ', error)
    res.status(500).json({ message: '로그인 검증에 실패했습니다.' })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`서버가 ${process.env.PORT}번 포트에서 실행중입니다. http://${process.env.NODE_SERVER_IP}:${process.env.PORT}`)
})
