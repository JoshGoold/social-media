import React from "react";
import axios from "axios";
import { useState, useContext, useEffect } from "react";

const Post = (props) => {
  const [curMonth, setCurMonth] = useState("");

  const [commentP, setCommentP] = useState("");
  const [likeState, setLikeState] = useState({ state: false, id: "" });
  const [commentState, setCommentState] = useState({ state: false, id: "" });

  const likePost = async (post_id, username) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/like-post",
        {
          postId: post_id,
          profileUsername: username,
        },
        { withCredentials: true }
      );
      if (response.data.Success) {
        alert(response.data.Message);
        props.handleUserProfile();
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMonth();
  }, []);
  function getMonth() {
    const date = new Date();
    const month = date.getMonth();
    setCurMonth(month);
  }

  const commentPost = async (e, id, username, comment) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/comment-post`,
        {
          postId: id,
          profileUsername: username,
          comment: comment,
        },
        { withCredentials: true }
      );
      if (response.data.Success) {
        alert(response.data.Message);
        props.handleUserProfile();
        setCommentP("");
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  async function deletePost(id) {
    try {
      const response = await axios.post(
        `http://localhost:3000/delete-post`,
        {
          id: id,
        },
        { withCredentials: true }
      );
      if (response.data.Success) {
        alert(response.data.Message);
        props.handleUserProfile();
        window.location.reload();
      } else {
        alert(response.data.Message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="-mt-2">
      {props.userData?.posts?.length > 0 ? (
        <div className="p-2 flex flex-col gap-3">
          {props.userData.posts.map((post, index) => (
            <div
              className="border-t-gray-300 shadow-md rounded-md p-3 bg-white border"
              id={post._id}
              key={index}
            >
              <button
                className="hover:scale-110 rounded-full "
                onClick={() => deletePost(String(post._id))}
                title="Delete Post"
              >
                🔴
              </button>
              <div className="flex justify-center mb-3">
              <img className="" src={`http://localhost:3000${post.postImg}`} alt="Post" /></div>
              <p>{post.postContent}</p>
              <small className="text-sm text-gray-400 font-thin">
                {curMonth}/{post.createdAt}
              </small>
              <div className="flex mt-10 justify-between">
                <div className="">
                <small
                  onClick={() =>
                    setLikeState({ state: !likeState.state, id: post._id })
                  }
                >
                  {props?.userData?.posts[index]?.likes?.length > 0
                    ? props.userData.posts[index].likes.length
                    : 0}{" "}
                  Likes:</small>
                  <button
                    onClick={() => likePost(post._id, props.userData.username)}
                  >
                    ❣️
                  </button>
                  {post?.likes.map((like, index) => (
                    <div key={index} className="">
                      {likeState.state && (
                        <div className="">
                          {likeState.id === post._id && (
                            <div key={index}>
                              <h1>{like.likerUsername}</h1>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )) || 0}</div>
                
                <div className="items-center">
                <small
                      onClick={() => {
                        setCommentState({
                          state: !commentState.state,
                          id: post._id,
                        });
                      }}
                      className="font-thin"
                    >
                      {props?.userData?.posts[index]?.comments?.length > 0
                        ? props.userData.posts[index].comments.length
                        : 0}{" "}
                      Comments
                    </small>
                  <form
                    onSubmit={(e) =>
                      commentPost(
                        e,
                        post._id,
                        props.userData.username,
                        commentP
                      )
                    }
                  >
                    <input
                      className="border border-gray-400 rounded-md p-1"
                      value={commentP}
                      onChange={(e) => setCommentP(e.target.value)}
                      type="text"
                      placeholder="Leave a comment"
                    />
                    <button type="submit">📩</button>
                  </form>
                  </div>
                </div>
                  {post.comments?.map((comment, index) => (
                    <div key={index} className="">
                      {commentState.state && (
                        <div className="">
                          {commentState.id === post._id && (
                            <div className="shadow-sm flex mb-1 rounded-md border-t-gray-300 border border-l-gray-300 gap-2 p-2" id={comment._id} key={index}>
                              <h1>{comment.commenterUsername}</h1>
                              <h2>{comment.comment}</h2>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )) || 0}
                 </div>
              
            
          )) || "N/A"}
        </div>
      ) : (
        <h1 className="text-center text-gray-600 mt-20">User has no posts</h1>
      )}
    </div>
  );
};

export default Post;
