import axios from "axios";

const PostAPI = async (data) => {
  const params = new URLSearchParams();
  params.append("text_input", data.text);
  params.append("history", data.hist);

  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/?",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    // alert(error);
    console.log(error);
  }
};
export default PostAPI;
