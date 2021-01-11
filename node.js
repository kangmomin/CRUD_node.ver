inputFromConsole = function() {
    var args = process.argv;   //nodejs/argument.js a
    //배열로 저장
}

var _url = {
    pathName:function() {
        var url = require('url');
        var _url = request.url;

        var pathName = url.parse(_url, true).pathname;//url의 정보를 가져옴 ex)localhost:3000/create/?id=a result == /create
    },
    
    queryData:function() {
        var url = require('url');
        var _url = request.url;

        var queryData = url.parse(_url, true).query;//queryData만 가져옴 ex)localhost:3000/create/?id=a result == a
        console.log(queryData.id); //localhost:3000/?id=a일때 나오는 값은 a
    }
}

post = function() {
    var qs = require('querystring');

    request.on('data', (data) => {//request는 createServer에 있는 기본 함수
        body += data;
        if (body.length > 1e6) {//post로 넘어온값이 너무 많을시에 연결을 끊음
            request.connection.destroy();
        }
    });

    request.on('end', () => {
        var post = qs.parse(body);//body에 담긴 정보 객체화
        console.log(body);//title=NodeJs&description=description
        console.log(post.title); //post중에서도 title의 값을 가져옴. ex)title
        console.log(post);//post의 2중배열의 값을 모두 가져옴 ex){ title: 'title', description: 'description' }
    });
}//post를 모듈화 할땐 callback함수를 쓰는게 좋음


var file = {
    readFile: function () {
        var fs = require('fs');

        var data = fs.readFileSync('노드가 실행되는 경로', 'utf8');//동기Synchronus a b(작업) c순으로 출력
        fs.readFile('읽을 파일 경로', 'utf8', (err, data) => {//비동기Asynchronus a c b(작업)순으로 출력
            console.log(data);
        });
    },

    getFileList: function () {
        fs.readdir('./txt', (err, fileList) => {
            console.log(fileList);
        });
    },

    makeFile: function () {
        fs.writeFile(`만들 경로`, '내용', 'utf-8', (err) => {
        });
    },

    updateFile: function () {
        var fs = require('fs');

        fs.appendFile('파일 위치', '내용', (err) => {
            if (err) throw err;//에러 표시
        });//파일의 맨 끝에 내용을 추가함

        fs.writeFile('파일 위치', '내용', (err) => {
            if (err) throw err;//에러 표시
        });//파일자체의 내용을 교체함
    },

    removeFile: function () {
        fs.unlink('위치', (err) => {
            if (err) {
                console.error(err)
                return
            }
        });

        fs.unlinkSync('위치');
    }
}

_location = function () {
    response.writeHead(302, { Location: 'link' });
}

forIn = function () {
    var b = {
        node: 'js',
        html: 'hyperTextScript',
        css: 'decorate html'
    }

    for (var a in b) {
        console.log(a);
        console.log(b[a]);
    }
}
_mysqli = function() {
    var mysql = require('mysql');
    var mysqli = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "#koldin13579",
    database : "test"
    });

    mysqli.connect();

    mysqli.query('SELECT * from Users', (error, rows, fields) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    });

    mysqli.end();
}

secure = function() {
    var path = require('path');
    path.parse('요청 값(queryData.id)').base;
    // root:'?'
    // dir:'파일 경로ex)..'
    // base:'경로 제외한 링크ex)localhost/create/"../password.js"일때 password.js출력 ""안에 있는건 요청값'
    // ext:'확장자'
    // name:'fileName'
}