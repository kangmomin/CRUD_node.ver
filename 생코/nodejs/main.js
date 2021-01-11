var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathName = url.parse(_url, true).pathname;
  templete = function(list, title, control, isQuery = false, isH3 = true) {
    var updateBTN = '';
    var deleteBTN = '';
    if(isQuery === true) {
      updateBTN = `<a href="/update?id=${title}">update</a>`;
      deleteBTN = `
                  <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                  </form>
      `;
    }
    if(isH3) {
      control += `<h3>${sanitizeHtml(control)}</h3>`;
    }
    title = sanitizeHtml(title);
    let templete = `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <h2>${list}</h2>
      <a href="/create">create</a>
      ${updateBTN}
      ${deleteBTN}
      <h2>${title}</h2>
      ${control}
    </body>
    </html>
    `;
    response.writeHead(200);
    response.end(templete);
  }
  showList = function(fileList) {
    let list = '';
    list += '<ul>';
    let i = 0;
    while(i < fileList.length) {
      list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
      i += 1;
    }
    list += '</ul>';
    return list;
  }
  post = function(callback) {
    var body = '';
    var post;
    request.on('data', function(data) {
      body += data;
      if(body.Length > 1e6) {
        request.connection.destroy();
      }
    });
    request.on('end', function(data) {
      post = qs.parse(body);
      callback(post);
    });
  }
  var list = showList(fs.readdirSync('../txt'));
  var description;
  var title;
  var control;
  var mysqli = mysql.createConnection({host:"localhost", user:"root", password:"#koldin13579", database:"test"});

  if(pathName === '/') {
    if(queryData.id === undefined) {
      title = 'Welcome';
      control = 'Hello, NodeJS!';
      templete(list, title, control, false, false);
    } else {
      fs.readFile(`../txt/${path.parse(queryData.id).base}`, 'utf8', (err, file) => {
        title = queryData.id;
        control = `<h3>${file}</h3>`;
        templete(list, title, control, true);
      });
    }
  } else if(pathName === '/create') {
    control = `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `;
    title = 'Create!';
    templete(list, title, control, false, false);
  } else if(pathName === '/create_process') {
    post((post) => {
      fs.writeFile(`../txt/${post.title}`, post.description, (err) => {
        if (err) throw err;
        response.writeHead(302, {Location: `/?id=${post.title}`});
        response.end();
      });
    });
  } else if(pathName === '/update') {
    fs.readFile(`../txt/${path.parse(queryData.id).base}`,'utf8' , (err, file) => {
      if (err) throw err;
      title = queryData.id;
      control = `
      <form action="/update_process" method="post">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${file}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `;
      templete(list, title, control, false, false);
    });
  } else if(pathName === '/update_process') {
    post((post) => {
      fs.writeFile(`../txt/${post.title}`, post.description, (err) => {
        if (err) throw err;
        response.writeHead(302, {Location: `/?id=${post.title}`});
        response.end();
      })
    });
  } else if(pathName === '/delete_process') {
    post((post) => {
      fs.unlink(`../txt/${path.parse(post.id).base}`, (err) => {
        if (err) throw err;
        response.writeHead(302, {Location: `/`});
        response.end();
      })
    });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);