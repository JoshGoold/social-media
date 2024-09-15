import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateLetter from "../functions/CreateLetter";

const UserLetter = (props) => {
  const [commentL, setCommentL] = useState("");
  const [likeState, setLikeState] = useState({ state: false, id: "" });
  const [commentState, setCommentState] = useState({ state: false, id: "" });
  const nav = useNavigate();

  const commentLetter = async (e, id, username, comment) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/comment-letter`,
        {
          letterId: id,
          profileUsername: username,
          comment: comment,
        },
        { withCredentials: true }
      );
      if (response.data.Success) {
        alert(response.data.Message);
        props.handleUserProfile();
        window.location.reload()
        setCommentL("");
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const likeLetter = async (letter_id, username) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/like-letter",
        {
          letterId: letter_id,
          profileUsername: username,
        },
        { withCredentials: true }
      );
      if (response.data.Success) {
        alert(response.data.Message);
        props.handleUserProfile();
        window.location.reload()
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {props.userData?.letters?.length > 0 ? (
        <div className="flex flex-col-reverse gap-3">
          {props.userData.letters.map((letter, index) => (
            <div className="bg-white bg-opacity-10" id={letter._id} key={index}>
              <div className="border-t-gray-300 bg-white shadow-md rounded-md p-3 border">
                <div className=" font-bold flex justify-between items-center  text-2xl">
                  <h1>{letter.letterHead}</h1>
                </div>
                <div className="">
                  <p>{letter.letterContent}</p>
                </div>
                <div className="flex mt-10 justify-between">
                  <div>
                    <small
                      onClick={() =>
                        setLikeState({
                          state: !likeState.state,
                          id: letter._id,
                        })
                      }
                      className="font-thin"
                    >
                      {props?.userData?.letters[index]?.likes?.length || 0}{" "}
                      Likes{" "}
                    </small>
                    <button
                      title="Like"
                      onClick={() =>
                        likeLetter(letter._id, props.userData.username)
                      }
                    >
                      ❣️
                    </button>
                    {letter?.likes.map((like, index) => (
                      <div key={index} className="">
                        {likeState.state && (
                          <div className="">
                            {letter._id === likeState.id && (
                              <div key={index}>
                                <h1>{like.likerUsername}</h1>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )) || 0}
                  </div>
                  <div className="items-center">
                    <small
                      onClick={() => {
                        setCommentState({
                          state: !commentState.state,
                          id: letter._id,
                        });
                      }}
                      className="font-thin"
                    >
                      {props?.userData?.letters[index]?.comments?.length > 0
                        ? props.userData.letters[index].comments.length
                        : 0}{" "}
                      Comments
                    </small>
                    <form
                      onSubmit={(e) =>
                        commentLetter(
                          e,
                          letter._id,
                          props.userData.username,
                          commentL
                        )
                      }
                    >
                      <input
                        className="border border-gray-400 rounded-md p-1"
                        onChange={(e) => setCommentL(e.target.value)}
                        type="text"
                        placeholder="Leave a comment"
                      />
                      <button type="submit">📩</button>
                    </form>
                  </div>
                </div>
                <div className="">
                  {commentState.state && (
                    <div className="">
                      {commentState.id === letter._id && (
                        <div className="w-full">
                          {letter?.comments.map((comment, index) => (
                            <div
                              className="shadow-sm flex mb-1 rounded-md border-t-gray-300 border border-l-gray-300 gap-2 p-2"
                              id={comment._id}
                              key={index}
                            >
                              <small
                                onClick={() =>
                                  nav(
                                    `/user-profile/${comment.commenterUsername}`
                                  )
                                }
                              >
                                {comment.commenterUsername}
                              </small>
                              <h1>{comment.comment}</h1>
                            </div>
                          )) || 0}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )) || "N/A"}
        </div>
      ) : (
        <h1 className="text-center text-gray-600 mt-20">
          User has no letters yet
        </h1>
      )}
    </div>
  );
};

export default UserLetter;
