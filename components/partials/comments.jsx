import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '../ui/Card';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

const Comments = ({ projectId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/comments/`);
      setComments(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments. Please try again.");
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('project', projectId);
    formData.append('text', newComment);
    formData.append('user_id', userData?.user.id);

    if (file) formData.append('file', file);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/comments/add/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
      setFile(null);
      setImage(null);
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  return (
    <Card className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="mb-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <Textarea
            className="w-full mb-4"
            rows="4"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <div className="flex flex-wrap items-center gap-4">
            <FileUploadButton setFile={setFile} accept="*/*" icon="heroicons-outline:paper-clip">
              Attach File
            </FileUploadButton>
            <FileUploadButton setFile={setImage} accept="image/*" icon="heroicons-outline:photograph">
              Attach Image
            </FileUploadButton>
            <Button type="submit" variant="primary" className="ml-auto">
              Post Comment
            </Button>
          </div>
          {(file || image) && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {file && <p>File selected: {file.name}</p>}
              {image && <p>Image selected: {image.name}</p>}
            </div>
          )}
        </form>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Icon icon="eos-icons:loading" className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CommentItem comment={comment} projectId={projectId} fetchComments={fetchComments} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </Card>
  );
};

const CommentItem = ({ comment, projectId, fetchComments }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replyFile, setReplyFile] = useState(null);
  const [replyImage, setReplyImage] = useState(null);
  const userData = useSelector((state) => state.auth.userData);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('project', projectId);
    formData.append('text', newReply);
    formData.append('user_id', userData?.user.id);
    formData.append('parent', comment.id);
    if (replyFile) formData.append('file', replyFile);
    if (replyImage) formData.append('image', replyImage);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/comments/add/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setNewReply('');
      setReplyFile(null);
      setReplyImage(null);
      setShowReplyForm(false);
      fetchComments();
      toast.success("Reply posted successfully!");
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply. Please try again.");
    }
  };

  const handleDeleteComment = () => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/comments/${comment.id}/delete/`)
      .then(() => {
        fetchComments();
        toast.success("Comment deleted successfully!");
      })
      .catch(error => {
        console.error("There was an error deleting the comment!", error);
        toast.error("Failed to delete comment. Please try again.");
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Avatar
            src={comment.user?.avatar || "https://via.placeholder.com/40"}
            alt={comment.user?.username || "Anonymous"}
            size="md"
          />
          <div className="ml-4">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
              {comment.user?.username || "Anonymous"}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        {(userData?.isAdmin || userData?.user?.id === comment.user?.id) && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteComment}
            className="flex items-center"
          >
            <Icon icon="heroicons-outline:trash" className="w-4 h-4 mr-1" />
            Delete
          </Button>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{comment.text}</p>
      
      <AttachmentDisplay comment={comment} />

      <div className="flex items-center mt-4 space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center"
        >
          <Icon icon="heroicons-outline:reply" className="w-4 h-4 mr-1" />
          Reply
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {comment.replies?.length || 0} replies
        </span>
      </div>

      <AnimatePresence>
        {showReplyForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleReplySubmit}
            className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
          >
            <Textarea
              className="w-full mb-4"
              rows="3"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write a reply..."
              required
            />
            <div className="flex flex-wrap items-center gap-4">
              <FileUploadButton setFile={setReplyFile} accept="*/*" icon="heroicons-outline:paper-clip">
                Attach File
              </FileUploadButton>
              <FileUploadButton setFile={setReplyImage} accept="image/*" icon="heroicons-outline:photograph">
                Attach Image
              </FileUploadButton>
              <Button type="submit" variant="primary" className="ml-auto">
                Post Reply
              </Button>
            </div>
            {(replyFile || replyImage) && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {replyFile && <p>File selected: {replyFile.name}</p>}
                {replyImage && <p>Image selected: {replyImage.name}</p>}
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} projectId={projectId} fetchComments={fetchComments} />
          ))}
        </div>
      )}
    </div>
  );
};

const AttachmentDisplay = ({ comment }) => {
  if (comment.image) {
    return (
      <div className="mb-4">
        <img 
          src={comment.image} 
          alt="Comment attachment" 
          className="max-w-xs rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-90 transition-opacity cursor-pointer"
          onClick={() => window.open(comment.image, '_blank')}
        />
      </div>
    );
  } else if (comment.file) {
    return (
      <div className="mb-4">
        <a
          href={comment.file}
          download
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon icon="heroicons-outline:download" className="w-5 h-5 mr-2" />
          Download Attachment
        </a>
      </div>
    );
  }
  return null;
};

const FileUploadButton = ({ setFile, accept, children, icon }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      toast.success(`File "${file.name}" selected`);
    }
  };

  return (
    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-700">
      <Icon icon={icon} className="w-5 h-5 mr-2" />
      {children}
      <input type="file" className="hidden" onChange={handleFileChange} accept={accept} />
    </label>
  );
};

const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  );
};

export default Comments;