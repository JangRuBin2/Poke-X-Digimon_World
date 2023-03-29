import http from "http";
import fs from "fs";
import qs from "qs";
import url from "url";
import mysql from "mysql2";
// mysql 접속 정보
import dbConnection from "./dataBase.js";

// 서버 생성
const loginPage = http.createServer((request, response) => {
  // DB 연결
  dbConnection.connect();
  let data = fs.readFileSync("./main.html", "utf8", function (err, data) {
    if (err) throw err;
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(data);
  });
  let _url = request.url;
  // url의 querystring에 form 데이터가 담김
  let urlQueryData = url.parse(_url, true).query;
  // 최초 페이지 불러옴
  if (_url == "/") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(data);
  } else if (_url == "/login.html") {
    let data = fs.readFileSync("./login.html");
    response.end(data);
  }
  // 로그인 버튼 눌렀을 때
  else if (_url == "/next.html") {
    let strings = "";
    request.on("data", (data) => {
      strings += data;
    });

    request.on("end", () => {
      let userInfo = qs.parse(strings);
      // 회원이 넘긴 id, pw값
      let userId = userInfo.email;
      let userPw = userInfo.password;
      let data = `<html>
      <p>${userId}+${userPw}</p>
      </html>`;
      response.writeHead(200);
      response.end(data);
    });
  } // 회원가입 창
  else if (_url == "/hwin.html") {
    let data = fs.readFileSync("./hwin.html");
    response.end(data);
  } else if (_url == "/hwinSuccess.html") {
    let strings = "";
    request.on("data", (data) => {
      strings += data;
    });
    request.on("end", () => {
      let userInfo = qs.parse(strings);
      let userHwinEmail = userInfo.username;
      let userHwinPw = userInfo.password;
      // id와 pw 값이 입력 됐을 때 시작
      if (userHwinEmail && userHwinPw) {
        dbConnection.query(
          `SELECT * FROM usertable WHERE username="${userHwinEmail}"`,
          (err, rows, fields) => {
            if (err) {
              console.log("연결 안됨");
            }
          }
        );
      }
    });
    response.end(data);
  }
});
loginPage.listen(8080, () => {
  console.log("연결 요청");
});
