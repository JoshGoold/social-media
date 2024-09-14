import { useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../CookieContext";

const CreatePost = (props) => {
  const { handleUserProfile, user } = useContext(UserContext);
  const [state, setState] = useState(false);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // Handle image input change
  const handleImageChange = (e) => {
    const imgFile = e.target.files[0];
    setFile(imgFile);
    setPreview(URL.createObjectURL(imgFile));
  };

  const createPost = async () => {
    const formData = new FormData();
    formData.append("img", file);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:3000/new-post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      props.handleUserProfile();
      window.location.reload();
      setState(false);
      setDescription("");
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  return (
    <div>
      {!state && (
        <div className="mt-3">
          <button
            className="bg-purple-500 text-white font-thin p-2 rounded-sm"
            onClick={() => setState(true)}
          >
            New Post
          </button>
        </div>
      )}
      {state && (
        <div className="flex fixed a-center p-10 bg-white shadow-lg flex-col border border-gray-400 w-96 rounded-md">
          <input
            placeholder="Insert Img"
            type="file"
            name="img"
            required
            onChange={handleImageChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Image Preview"
              className="mt-3 mb-3 max-h-48 object-contain"
            />
          )}
          <textarea
            className=" text-black rounded-md p-1 border-gray-300"
            placeholder="Description"
            cols={10}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Capture description
          />
          <button
            className="bg-green-500 text-white mt-2 p-2 rounded"
            onClick={createPost}
          >
            Post
          </button>
          <button
            className="bg-red-500 text-white mt-2 p-2 rounded"
            onClick={() => setState(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
