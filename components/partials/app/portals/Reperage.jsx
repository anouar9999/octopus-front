import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openCommentModal } from "@/components/partials/app/portals/store";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaReply,
  FaPaperclip,
  FaEllipsisV,
  FaTimesCircle,
  FaTrash 
} from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, memo } from "react";
import Icon from "@/components/ui/Icon";

const Reperage = ({ stageId, projectId }) => {
  const { CommentModel, imageId } = useSelector((state) => state.portals);
  const dispatch = useDispatch();

  return (
    <div>
      <Modal
        className="max-w-4xl"
        title="Comments"
        labelClassName="btn-outline-dark"
        activeModal={CommentModel}
        expandable={true}
        onClose={() => dispatch(openCommentModal({ open: false }))}
      >
        <CommentSection
          projectId={projectId}
          stageId={stageId}
          imageId={imageId}
        />
      </Modal>
    </div>
  );
};
export default Reperage;

const CommentSection = ({ projectId, stageId, imageId }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentFile, setNewCommentFile] = useState(null);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project-images/${imageId}/comments/`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    }
  };

  const addComment = async () => {
    try {
      const formData = new FormData();
      formData.append("text", newCommentText);
      formData.append("project_image", imageId);
      formData.append("username", userData?.user.id.toString());
      
      if (newCommentFile) {
        formData.append("image", newCommentFile);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project-images/${imageId}/comments/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setComments([response.data, ...comments]);
      setNewCommentText("");
      setNewCommentFile(null);
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const addReply = async (parentId, replyText, replyFile) => {
    try {
      const formData = new FormData();
      formData.append("text", replyText);
      formData.append("project_image", imageId);
      formData.append("username", userData?.user.id.toString());
      // Ensure parentId is a number
      formData.append("parent", Number(parentId));
      
      if (replyFile) {
        formData.append("image", replyFile);
      }
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project-image-comments/${parentId}/reply/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setComments(prevComments => 
        prevComments.map(comment =>
          comment.id === parentId
            ? { ...comment, replies: [...(comment.replies || []), response.data] }
            : comment
        )
      );
      toast.success("Reply added successfully");
    } catch (error) {
      console.error("Error adding reply:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      toast.error("Failed to add reply");
    }
  };
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/project-image-comments/${commentId}/`
      );
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-800 py-8 lg:py-16 rounded-lg">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Discussion ({comments.length})
        </h2>
        <form className="mb-8 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <textarea
            id="comment"
            rows="4"
            className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            required
          ></textarea>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                <FaPaperclip className="text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Attach file
                </span>
                <input
                  type="file"
                  onChange={(e) => setNewCommentFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {newCommentFile && (
                <div className="flex items-center bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                  <span className="text-sm text-blue-800 dark:text-blue-200 mr-2">
                    {newCommentFile.name}
                  </span>
                  <FaTimesCircle
                    className="text-blue-800 dark:text-blue-200 cursor-pointer"
                    onClick={() => setNewCommentFile(null)}
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={addComment}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-colors"
            >
              Post comment
            </button>
          </div>
        </form>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={addReply}
              onDelete={deleteComment}
              projectId={projectId}
              stageId={stageId}
              imageId={imageId}
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </section>
  );
};

const Comment = ({
  comment,
  onReply,
  onDelete,
  projectId,
  stageId,
  imageId,
  isReply = false,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState(null);

  const handleReply = () => {
    onReply(comment.id, replyText, replyFile);
    setReplyText("");
    setReplyFile(null);
    setShowReplyForm(false);
  };

  return (
    <article
      className={`p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-700 ${
        isReply
          ? "ml-6 lg:ml-12 border-l-4 border-gray-300 dark:border-gray-500"
          : "shadow-lg"
      }`}
    >
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            <FaUser className="mr-2 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 p-1" />
            {comment.user?.username || "Anonymous"}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time
              dateTime={comment.created_at}
              title={new Date(comment.created_at).toLocaleString()}
            >
              {new Date(comment.created_at).toLocaleString()}
            </time>
          </p>
        </div>
        <button
          onClick={() => onDelete(comment.id)}
          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          type="button"
        >
          <FaTrash  className="w-4 h-4" />
        </button>
      </footer>
      <p className="text-gray-800 dark:text-gray-200">{comment.text}</p>
      {comment.image && (
        <a
          href={comment.image}
          className="inline-flex items-center text-blue-600 hover:underline mt-4 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full"
        >
          <FaPaperclip className="mr-2" />
          View Attachment
        </a>
      )}
      <div className="flex items-center mt-4 space-x-4">
        <button
          type="button"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
        >
          <FaReply className="mr-1.5 w-3.5 h-3.5" />
          Reply
        </button>
      </div>
      {showReplyForm && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
          <textarea
            rows="3"
            className="w-full px-3 py-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
          ></textarea>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 dark:bg-gray-500 px-3 py-1 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors">
                <FaPaperclip className="text-gray-600 dark:text-gray-200" />
                <span className="text-gray-700 dark:text-gray-200">Attach</span>
                <input
                  type="file"
                  onChange={(e) => setReplyFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {replyFile && (
                <div className="flex items-center bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                  <span className="text-xs text-blue-800 dark:text-blue-200 mr-1">
                    {replyFile.name}
                  </span>
                  <FaTimesCircle
                    className="text-blue-800 dark:text-blue-200 cursor-pointer w-3 h-3"
                    onClick={() => setReplyFile(null)}
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleReply}
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-colors"
            >
              Post reply
            </button>
          </div>
        </div>
      )}
    {comment.replies && comment.replies.length > 0 && (
  <div className="mt-4">
    {comment.replies.map((reply) => (
      <Comment
        key={reply.id}
        comment={reply}
        onReply={onReply}
        onDelete={onDelete}
        projectId={projectId}
        stageId={stageId}
        imageId={imageId}
        isReply={true}
      />
    ))}
  </div>
)}
    </article>
  );
};

const Modal = memo(
  ({
    activeModal,
    onClose,
    noFade = false,
    disableBackdrop = false,
    children,
    footerContent,
    submitButton,
    themeClass = "bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700",
    title = "Basic Modal",
    uncontrol = false,
    label = "Basic Modal",
    labelClass = "",
    expandable = false,
  }) => {
    const [showModal, setShowModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);
    const handleClose = uncontrol ? closeModal : onClose;
    const toggleExpand = () => setIsExpanded(!isExpanded);

    const modalContent = (
      <Transition
        appear
        show={uncontrol ? showModal : activeModal}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-[99999]"
          onClose={disableBackdrop ? () => {} : handleClose}
        >
          <Transition.Child
            as={Fragment}
            enter={noFade ? "" : "ease-out duration-300"}
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave={noFade ? "" : "ease-in duration-200"}
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter={noFade ? "" : "ease-out duration-300"}
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave={noFade ? "" : "ease-in duration-200"}
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full ${
                    isExpanded ? "max-w-5xl" : "max-w-2xl"
                  } transform overflow-hidden rounded-2xl bg-gray-200 p-6 text-left align-middle shadow-xl transition-all`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="flex items-center space-x-2">
                      {/* {expandable && (
                      <button
                        type="button"
                        onClick={toggleExpand}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Icon
                          icon={isExpanded ? "heroicons-outline:switch-vertical" : "heroicons-outline:switch-horizontal"}
                          className="h-6 w-6"
                        />
                      </button>
                    )} */}
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={handleClose}
                      >
                        <span className="sr-only">Close</span>
                        <Icon
                          icon="heroicons-outline:x"
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">{children}</div>
                  {(footerContent || submitButton) && (
                    <div className="mt-4">
                      {footerContent}
                      {submitButton}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );

    return uncontrol ? (
      <>
        <button type="button" onClick={openModal} className={labelClass}>
          {label}
        </button>
        {modalContent}
      </>
    ) : (
      modalContent
    );
  }
);

Modal.displayName = "Modal";
