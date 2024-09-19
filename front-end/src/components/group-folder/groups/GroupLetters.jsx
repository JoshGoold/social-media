import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateGroupLetter from "../function/CreateGroupLetter";

const GroupLetters = ({getData, groupid, groupData}) => {
  const [curMonth, setCurMonth] = useState("");
  const [editState, setEditState] = useState({
    state: false,
    letterid: "",
    content: "",
    title: "",
  });
  const [commentL, setCommentL] = useState("");
  const [likeState, setLikeState] = useState({ state: false, id: "" });
  const [commentState, setCommentState] = useState({ state: false, id: "" });
  const nav = useNavigate();

  const commentLetter = async (e, id, username, comment) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/comment-group-letter`,
        {
          groupid: groupid,
          comment: comment,
        },
        { withCredentials: true }
      );
      if (response.data.Success) {
        alert(response.data.Message);
        getData()
        setCommentL("");
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const likeLetter = async (letter_id) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/like-group-letter",
        {
          letterId: letter_id,
          groupid: groupid,
        },
        { withCredentials: true }
      );
      if (response.data.Success) {
        getData()
        alert(response.data.Message);
        
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function deleteLetter(id) {
    try {
      const response = await axios.post(
        `http://localhost:3000/delete-group-letter`,
        {
          id: id,
          groupid: groupid
        },
        { withCredentials: true }
      );
      if (response.data.Success) {
        alert(response.data.Message);
        getData()
        window.location.reload();
      } else {
        alert(response.data.Message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function editLetter() {
    if (
      editState.letterid.length > 0 &&
      editState.title.length > 0 &&
      editState.content.length > 0
    ) {
      try {
        const response = await axios.post(
          "http://localhost:3000/edit-group-letter",
          {
            id: editState.letterid,
            title: editState.title,
            content: editState.content,
            groupid: groupid
          },
          { withCredentials: true }
        );
        if (response.data.Success) {
          getData
          window.location.reload();
        } else {
          alert(response.data.Message);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please fill in all available fields");
    }
  }

  useEffect(() => {
    getMonth();
  }, []);
  function getMonth() {
    const date = new Date();
    const month = date.getMonth();
    setCurMonth(month);
  }

  return (
    <div>
      {groupData?.letters?.length > 0 ? (
        <div className="flex flex-col-reverse gap-3">
          {groupData.letters.map((letter, index) => (
            <div className="bg-white bg-opacity-10" id={letter._id} key={index}>
              <div className="border-t-gray-300 bg-white shadow-md rounded-md p-3 border">
                <div className=" font-bold flex justify-between items-center  text-2xl">
                  <h1>{letter.letterHead}</h1>
                  <span className="flex items-center gap-2">
                    <button
                      className="hover:scale-110 text-sm rounded-full "
                      onClick={() => deleteLetter(String(letter._id))}
                      title="Delete Letter"
                    >
                      🔴
                    </button>
                    <button
                      className="hover:scale-110 text-sm rounded-full "
                      onClick={() =>
                        setEditState((prev) => ({
                          ...prev,
                          state: true,
                          letterid: letter._id,
                        }))
                      }
                      title="Edit Letter"
                    >
                      🟠
                    </button>
                  </span>
                </div>
                <div className="">
                  <p>{letter.letterContent}</p>
                  <small className="text-sm text-gray-400 font-thin">
                    {curMonth}/{letter.createdAt}
                  </small>
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
                      {groupData?.letters[index]?.likes?.length || 0}{" "}
                      Likes{" "}
                    </small>
                    <button
                      title="Like"
                      onClick={() =>
                        likeLetter(letter._id, groupData.username)
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
                      {groupData?.letters[index]?.comments?.length > 0
                        ? groupData.letters[index].comments.length
                        : 0}{" "}
                      Comments
                    </small>
                    <form
                      onSubmit={(e) =>
                        commentLetter(
                          e,
                          letter._id,
                          groupData.username,
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
          {editState.state && (
            <div className="flex fixed a-center p-10 bg-white shadow-lg flex-col border border-gray-400 w-96 rounded-md">
              <input
                className="border text-2xl text-black rounded-md p-1 border-gray-300"
                placeholder="Title"
                onChange={(e) =>
                  setEditState((prev) => ({ ...prev, title: e.target.value }))
                }
                type="text"
              />
              <textarea
                className="border text-black rounded-md p-1 border-gray-300"
                placeholder="Contents here"
                onChange={(e) =>
                  setEditState((prev) => ({ ...prev, content: e.target.value }))
                }
                cols={20}
                rows={10}
                type="text"
              />
              <button
                className="bg-green-500 text-white"
                onClick={() => editLetter()}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white"
                onClick={() =>
                  setEditState((prev) => ({ ...prev, state: false }))
                }
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <h1 className="text-center text-gray-600 mt-20">
          Group has no letters yet
        </h1>
      )}
    </div>
  );
};

export default GroupLetters;
