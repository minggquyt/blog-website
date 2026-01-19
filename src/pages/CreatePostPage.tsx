import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost/CreatePost';

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handlePostCreated = (postIdOrSlug: string) => {
    // Navigate to the created post using slug for better URL
    // Force page refresh to ensure data is loaded fresh
    navigate(`/post/${postIdOrSlug}`, { 
      replace: true,
      state: { refresh: true } // Pass state to indicate refresh needed
    });
  };

  const handleCancel = () => {
    // Navigate back to previous page or home
    navigate(-1);
  };

  return (
    <div>
      <CreatePost 
        onPostCreated={handlePostCreated}
        onCancel={handleCancel}
      />
    </div>
  );
}