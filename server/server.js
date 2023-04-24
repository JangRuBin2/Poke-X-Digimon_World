import http from "http"
const server = http.createServer((req, res)=> { 
  res.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
  // res.write()
  res.end(console.log("하이"))
})
server.listen(8080,(err)=> {
  if(err) {
  console.log("연결 안 됨")}
  else {
  console.log("연결 됨")}
}
)