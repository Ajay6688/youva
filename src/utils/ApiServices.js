import axios from "axios";

const key = "ecf746cb03e34b57b0b71911233004";

export const callWeatherApi = async (location) => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`
    );
    console.log(response);
    const responseData = {
      temp_c: response.data.current.temp_c,
      feelslike_c: response.data.current.feelslike_c,
      condition: response.data.current.condition.text,
      icon: response.data.current.condition.icon,
      humidity: response.data.current.humidity,
    };
    return responseData;
  } catch (error) {
    alert(error);
    console.log(error);
  }
};
