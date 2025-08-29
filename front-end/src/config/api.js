const getServerUrl = () => {
  const url =
    import.meta.env.VITE_REACT_APP_SERVER_URL || "http://localhost:5001";

  if (!import.meta.env.VITE_REACT_APP_SERVER_URL) {
    console.warn("VITE_REACT_APP_SERVER_URL not set, using default:", url);
  }

  return url;
};

export const serverUrl = getServerUrl();
export default serverUrl;
