// ローカル開発用の簡易サーバー
const http = require('http');
const fs = require('fs');
const path = require('path');

// ポート
const PORT = 3000;

// 簡易なメモリベースストレージ
let postsStorage = [];

// 投稿データを読み込む
function loadPosts() {
    return postsStorage;
}

// 投稿データを保存する
function savePosts(posts) {
    postsStorage = posts;
}

const server = http.createServer((req, res) => {
    // CORS対応
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ルーティング
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    console.log(`${req.method} ${pathname}`);

    // APIエンドポイント
    if (pathname === '/api/posts') {
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.method === 'GET') {
            const posts = loadPosts();
            posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const latestPosts = posts.slice(0, 100);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ posts: latestPosts }));
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const { author, content } = JSON.parse(body);
                    
                    if (!author || !content) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Author and content are required' }));
                        return;
                    }

                    if (content.length > 50) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Content is too long' }));
                        return;
                    }

                    const posts = loadPosts();
                    const newPost = {
                        id: Date.now().toString(),
                        author: author,
                        content: content,
                        timestamp: new Date().toISOString()
                    };

                    posts.push(newPost);
                    savePosts(posts);

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ post: newPost }));
                } catch (error) {
                    console.error('Error creating post:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to create post' }));
                }
            });
            return;
        }

        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    // 静的ファイルの配信
    let filePath = './src/index.html';
    
    if (pathname !== '/') {
        filePath = './src' + pathname;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
        } else {
            const ext = path.extname(filePath);
            const contentType = ext === '.html' ? 'text/html' : 'text/plain';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 ローカルサーバー起動しました！`);
    console.log(`📱 http://localhost:${PORT} でアクセスできます\n`);
    console.log('終了するには Ctrl+C を押してください');
});

