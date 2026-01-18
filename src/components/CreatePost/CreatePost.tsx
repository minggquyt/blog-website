import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useAuth } from '../../contexts/AuthContext';
import { createPost, getTags, uploadImageToStorage } from '../../services/postService';
import type { CreatePostFormData } from '../../types/create-post';
import './CreatePost.css';

interface CreatePostProps {
  onPostCreated?: (postId: string) => void;
  onCancel?: () => void;
}

export default function CreatePost({ onPostCreated, onCancel }: CreatePostProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState<any[]>([]);

  const [formData, setFormData] = useState<CreatePostFormData>({
    title: '',
    content: '',
    tagIds: [],
    coverImage: null,
    coverImageUrl: ''
  });

  // Load available tags
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    const { data, error } = await getTags();
    if (!error && data) {
      setAvailableTags(data);
    }
  };

  const handleInputChange = (field: keyof CreatePostFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          coverImage: file,
          coverImageUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: null,
      coverImageUrl: ''
    }));
  };

  const handleAddTag = async () => {
    const selectedTag = availableTags.find(tag => tag.name.toLowerCase() === tagInput.toLowerCase());
    if (!selectedTag) {
      setError('Vui lòng chọn tag từ danh sách có sẵn');
      return;
    }

    if (formData.tagIds.includes(selectedTag.id)) {
      setError('Tag này đã được thêm rồi');
      return;
    }

    if (formData.tagIds.length >= 5) {
      setError('Chỉ có thể thêm tối đa 5 tags');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tagIds: [...prev.tagIds, selectedTag.id]
    }));
    
    setTagInput('');
  };

  const removeTag = (tagIdToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(id => id !== tagIdToRemove)
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const generateUniqueSlug = (title: string): string => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Vui lòng nhập tiêu đề bài viết';
    }

    if (!formData.content.trim()) {
      return 'Vui lòng nhập nội dung bài viết';
    }

    if (formData.tagIds.length === 0) {
      return 'Vui lòng chọn ít nhất 1 tag cho bài viết';
    }

    if (formData.tagIds.length > 5) {
      return 'Chỉ có thể chọn tối đa 5 tags';
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Bạn cần đăng nhập để tạo bài viết');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let coverImageUrl: string | null = null;
      
      // Upload cover image if exists
      if (formData.coverImage) {
        console.log('Cover image selected:', formData.coverImage.name, formData.coverImage.size);
        const { url, error: uploadError } = await uploadImageToStorage(formData.coverImage, 'posts');
        if (uploadError) {
          // Ask user if they want to continue without cover image
          const shouldContinue = confirm(`Không thể upload ảnh bìa: ${uploadError.message}\n\nBạn có muốn tiếp tục tạo bài viết không có ảnh bìa không?`);
          if (!shouldContinue) {
            setIsLoading(false);
            setError(`Upload ảnh bìa thất bại: ${uploadError.message}`);
            return;
          }
          console.warn('User chose to continue without cover image');
        } else {
          coverImageUrl = url;
          console.log('Cover image upload success, URL:', url);
        }
      }

      // Try different content formats to debug
      const postSubmission = {
        title: formData.title.trim(),
        content: [{ type: 'text', value: formData.content.trim() }], // Try array format
        author_id: user.id,
        slug: generateUniqueSlug(formData.title.trim()),
        tagIds: formData.tagIds, // Add selected tag IDs
        cover_image: coverImageUrl // Add cover image URL
      };
      
      console.log('Sending to database:', postSubmission);
      
      // Store other data separately
      const selectedTagIds = formData.tagIds;
      
      const { data, error: createError } = await createPost(postSubmission);
      
      if (createError) {
        throw new Error('Không thể tạo bài viết: ' + createError.message);
      }

      // Add tags separately after post creation
      if (selectedTagIds.length > 0 && data) {
        console.log('Adding tags to post:', data.id, selectedTagIds);
        // TODO: Add tags in next step
      }

      setSuccess(`Bài viết đã được tạo thành công cùng với ${formData.tagIds.length} tags!`);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        tagIds: [],
        coverImage: null,
        coverImageUrl: ''
      });

      // Call callback if provided
      if (onPostCreated && data) {
        onPostCreated(data.slug || data.id); // Use slug for better URLs
      }

    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // Similar to handleSubmit but with published: false
    if (!user) {
      setError('Bạn cần đăng nhập để lưu bài viết');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let coverImageUrl: string | null = null;
      
      // Upload cover image if exists
      if (formData.coverImage) {
        console.log('Cover image selected for draft:', formData.coverImage.name, formData.coverImage.size);
        const { url, error: uploadError } = await uploadImageToStorage(formData.coverImage, 'posts');
        if (uploadError) {
          // Ask user if they want to continue without cover image
          const shouldContinue = confirm(`Không thể upload ảnh bìa: ${uploadError.message}\n\nBạn có muốn tiếp tục lưu bản nháp không có ảnh bìa không?`);
          if (!shouldContinue) {
            setIsLoading(false);
            setError(`Upload ảnh bìa thất bại: ${uploadError.message}`);
            return;
          }
          console.warn('User chose to continue without cover image for draft');
        } else {
          coverImageUrl = url;
          console.log('Cover image upload success for draft, URL:', url);
        }
      }

      const postSubmission = {
        title: formData.title.trim(),
        content: [{ type: 'text', value: formData.content.trim() }], // Try array format
        author_id: user.id,
        slug: generateUniqueSlug(formData.title.trim()),
        tagIds: formData.tagIds,
        cover_image: coverImageUrl // Add cover image URL
      };
      
      console.log('Sending draft to database:', postSubmission);
      
      const { error: createError } = await createPost(postSubmission);
      
      if (createError) {
        throw new Error('Không thể lưu bản nháp: ' + createError.message);
      }

      setSuccess(`Bản nháp đã được lưu thành công cùng với ${formData.tagIds.length} tags!`);

    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu bản nháp');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="create-post-container">
        <div className="error-message">
          Bạn cần đăng nhập để tạo bài viết mới
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div>Đang xử lý...</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="create-post-header">
        <h1 className="create-post-title">Tạo bài viết mới</h1>
        <div className="create-post-actions">
          {onCancel && (
            <button className="btn-secondary" onClick={onCancel}>
              Hủy
            </button>
          )}
          <button 
            className="btn-secondary" 
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            Lưu nháp
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Đăng bài
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* Title */}
      <div className="form-group">
        <input
          type="text"
          className="form-input title-input"
          placeholder="Nhập tiêu đề bài viết..."
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>

      {/* Cover Image */}
      <div className="cover-image-section">
        <label className="form-label">Ảnh bìa (không bắt buộc)</label>
        <div className={`cover-image-upload ${formData.coverImageUrl ? 'has-image' : ''}`}>
          {formData.coverImageUrl ? (
            <>
              <img 
                src={formData.coverImageUrl} 
                alt="Cover preview" 
                className="cover-image-preview"
              />
              <button 
                className="remove-image-btn"
                onClick={removeCoverImage}
                type="button"
              >
                ×
              </button>
            </>
          ) : (
            <div className="upload-placeholder">
              <div>📷 Thêm ảnh bìa</div>
              <div style={{ fontSize: '14px', marginTop: '5px', color: '#9ca3af' }}>
                Kéo thả hoặc click để chọn ảnh
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="upload-input"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="tags-section">
        <label className="form-label">Tags</label>
        <div className="tags-input-container">
          <input
            type="text"
            className="form-input tags-input"
            placeholder="Nhập tên tag để tìm kiếm..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            list="availableTags"
          />
          <datalist id="availableTags">
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </datalist>
          <button 
            className="add-tag-btn"
            onClick={handleAddTag}
            type="button"
          >
            Thêm
          </button>
        </div>
        
        {formData.tagIds.length > 0 && (
          <div className="tags-display">
            {formData.tagIds.map((tagId) => {
              const tag = availableTags.find(t => t.id === tagId);
              return tag ? (
                <div key={tagId} className="tag-chip">
                  <span>{tag.name}</span>
                  <button
                    className="remove-tag-btn"
                    onClick={() => removeTag(tagId)}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Content Editor */}
      <div className="content-section">
        <label className="form-label">Nội dung</label>
        <div className="markdown-editor">
          <MDEditor
            value={formData.content}
            onChange={(val) => handleInputChange('content', val || '')}
            preview="edit"
            hideToolbar={false}
            data-color-mode="light"
            height={500}
            textareaProps={{
              placeholder: 'Nhập nội dung bài viết của bạn ở đây...\n\nBạn có thể sử dụng Markdown để định dạng:\n- **in đậm**\n- *in nghiêng*\n- # Tiêu đề\n- [liên kết](url)\n- ![hình ảnh](url)',
              style: { fontSize: '14px', lineHeight: '1.6' }
            }}
          />
        </div>
      </div>
    </div>
  );
}