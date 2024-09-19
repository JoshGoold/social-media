import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [feed, setFeed] = useState([])
    const [curMonth, setCurMonth] = useState("");
    const nav = useNavigate()

const [commentP, setCommentP] = useState("");
const [likeState, setLikeState] = useState({ state: false, id: "" });
const [commentState, setCommentState] = useState({ state: false, id: "" });

const [windowWidth, setWindowWidth] = useState(window.screen.width);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    setWindowWidth(window.innerWidth)
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, []);

async function getData(){
    try {
        const response = await axios.get("http://localhost:3000/home-feed",{withCredentials: true})

        if(response.data.Success){
            setFeed(response.data.feed)
        }
        else{
            alert(response.data)
        }
    } catch (error) {
        console.error(error)
    }
}

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
        window.location.reload()
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  function getMonth() {
    const date = new Date();
    setCurMonth(date.getMonth() + 1);
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
        window.location.reload()
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

useEffect(()=>{
    getData()
    getMonth();
},[])




  return (
    <div className="h-screen flex justify-center overflow-scroll">
      {feed.length > 0 ? (
        <div className={`p-2 ${windowWidth > 1000 ? "max-w-[60%]" : "w-full"} flex flex-col gap-3`}>
          {feed.map((post, index) => (
            <div
              className="border-t-gray-300 shadow-md rounded-md p-3 bg-white border"
              id={post._id}
              key={index}
            >
             
              <h1 onClick={()=> nav(`/user-profile/${post.username}`)} className='cursor-pointer font-bold my-3'>{post.username}</h1>
              {post.postImg ? (<img src={`http://localhost:3000${post.postImg}`} alt="Post" />) : ""}
              {post.letterHead ? (<h1 className='font-bold text-2xl'>{post.letterHead}</h1>) : ""}
              {post.postContent ? (<p>{post.postContent}</p>) : ""}
              {post.letterContent ? (<p>{post.letterContent}</p>) : ""}
              <small className="text-sm text-gray-400 font-thin">
                {curMonth}/{post.createdAt}
              </small>
              <div  className="flex mt-10 justify-between">
                <div className="">
                <small
                  onClick={() =>
                    setLikeState({ state: !likeState.state, id: post._id })
                  }
                >
                  {post?.likes?.length > 0
                    ? post.likes.length
                    : 0}{" "}
                  Likes:{" "}</small>
                  <button
                    onClick={() => likePost(post._id, post.username)}
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
                  {" "}
                  
                  <small
                    onClick={() => {
                      setCommentState({
                        state: !commentState.state,
                        id: post._id,
                      });
                    }}
                  >
                   {post?.comments?.length > 0
                    ? post.comments.length
                    : 0}{" "} Comments:{" "}
                  </small>
                  <form
                    onSubmit={(e) =>
                      commentPost(
                        e,
                        post._id,
                        post.username,
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
                            <div  className="shadow-sm flex mb-1 rounded-md border-t-gray-300 border border-l-gray-300 gap-2 p-2" id={comment._id} key={index}>
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
        <h1 className="text-center text-gray-600 mt-20">Refresh Feed</h1>
      )}
    </div>
  )
}

export default Home
