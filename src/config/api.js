const getServerUrl = () => {
  // const url = process.env.REACT_APP_SERVER_URL || "http://localhost:5001";
  const url = "https://migdalor.onrender.com";

  if (!process.env.REACT_APP_SERVER_URL) {
    console.warn("REACT_APP_SERVER_URL not set, using default:", url);
  }

  return url;
};

export const serverUrl = getServerUrl();
export default serverUrl;
