# Setup Supabase cho Blog Website

## 1. Tạo Database Tables

Bạn cần tạo các bảng sau trong Supabase:

### Bảng `posts` (đã có sẵn)
Bảng posts của bạn đã có structure:
```sql
-- Schema hiện tại (đã có sẵn):
-- id (uuid)
-- title (text)
-- content (jsonb) 
-- slug (text)
-- author_id (uuid)
-- cover_image (text)
-- published_at (timestamp)
-- created_at (timestamp)
-- updated_at (timestamp)
```

### Bảng `posts_tags` (bắt buộc - để lưu relationship giữa posts và tags)
```sql
CREATE TABLE posts_tags (
  id SERIAL PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint to prevent duplicate entries
ALTER TABLE posts_tags ADD CONSTRAINT unique_post_tag UNIQUE (post_id, tag_id);

-- Enable RLS
ALTER TABLE posts_tags ENABLE ROW LEVEL SECURITY;

-- Policy để cho phép mọi người xem post tags
CREATE POLICY "Anyone can view post tags" ON posts_tags
  FOR SELECT USING (true);

-- Policy để cho phép user thêm tags cho posts của họ
CREATE POLICY "Users can manage tags for own posts" ON posts_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE id = post_id AND author_id = auth.uid()
    )
  );

-- Policy để cho phép user xóa tags của posts họ
CREATE POLICY "Users can delete tags for own posts" ON posts_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE id = post_id AND author_id = auth.uid()
    )
  );
```

### Bảng `tags`
```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  tag_slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Policy để cho phép mọi người xem tags
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

-- Policy để cho phép user đã đăng nhập tạo tags
CREATE POLICY "Authenticated users can create tags" ON tags
  FOR INSERT TO authenticated WITH CHECK (true);
```

### Bảng `user_profiles` (nếu chưa có)
```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  background TEXT,
  avatar_width INTEGER,
  avatar_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy để cho phép mọi người xem profiles
CREATE POLICY "Anyone can view profiles" ON user_profiles
  FOR SELECT USING (true);

-- Policy để cho phép user update profile của họ
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 2. Tạo Storage Bucket

1. Vào Supabase Dashboard > Storage
2. Tạo bucket mới tên `blog-images`
3. Đặt bucket là public
4. Thêm policy cho bucket:

```sql
-- Policy để cho phép authenticated users upload
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images');

-- Policy để cho phép mọi người xem ảnh
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

-- Policy để cho phép users delete ảnh của họ
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 3. Environment Variables

Đảm bảo file `.env.local` có các biến:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Test Authentication

Đảm bảo Supabase Authentication đã được kích hoạt và cấu hình email/password provider.

## 5. Sample Data (Optional)

Bạn có thể thêm một số sample tags:

```sql
INSERT INTO tags (name, tag_slug, description) VALUES
('JavaScript', 'javascript', 'JavaScript programming language'),
('React', 'react', 'React framework'),
('Vue', 'vue', 'Vue.js framework'),
('Node.js', 'nodejs', 'Node.js runtime'),
('TypeScript', 'typescript', 'TypeScript programming language');
```