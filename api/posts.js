// 簡易なメモリベースのストレージ（Vercelのファイルシステムは読み取り専用のため）
// 注意：本番環境では外部データベース（Vercel KV、Airtable、Supabase など）の使用を推奨します
let postsStorage = [];

// 投稿データを読み込む
function loadPosts() {
    return postsStorage;
}

// 投稿データを保存する
function savePosts(posts) {
    postsStorage = posts;
}

export default async function handler(req, res) {
    // CORS対応
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // 全投稿を取得
        const posts = loadPosts();
        
        // タイムスタンプでソート（新しい順）
        posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // 最新100件のみ返す
        const latestPosts = posts.slice(0, 100);
        
        res.status(200).json({ posts: latestPosts });
        return;
    }

    if (req.method === 'POST') {
        // 新規投稿を作成
        try {
            const { author, content } = req.body;
            
            if (!author || !content) {
                res.status(400).json({ error: 'Author and content are required' });
                return;
            }

            if (content.length > 50) {
                res.status(400).json({ error: 'Content is too long' });
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

            res.status(201).json({ post: newPost });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Failed to create post' });
        }
        return;
    }

    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ error: 'Method not allowed' });
}

