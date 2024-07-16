import "./index.css";
import { useReducer, useState, useRef, useEffect } from "react";
import Button from "./components/Button";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";


// //costum hook
// //hook is a function that we can use for any repeatable code (Reuse)
// function useInput(initialValue){
//   const [value, setValue] = useState(initialValue);
//   return [
//     {
//       value, 
//       onChange: e => setValue(e.target.value)
//     },
//     () => setValue(initialValue)
//   ];
// }

// function GithubUser({name, id, avatar}){
//   return(
//   <div>
//     <h1>{name}</h1>
//     <p>{id}</p>
//     <img src={avatar} height={150} alt={name}/>
//   </div>
// );
// }

function App() {
  // const [titleProps, resetTitle] = useInput("");
  // const [colorProps, resetColor] = useState("#000000");
  // const submit = (e) =>{
  //   e.preventDefault();
  //   alert(`${titleProps.value}, ${colorProps.value}`);
  //   resetTitle();
  //   resetColor();
  // };

  // const [data, setData] = useState(null);
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   fetch(`https://api.github.com/users/edenbar01`)
  //   .then((response) => response.json())
  //   .then(setData)
  //   .then(() => setLoading(false))
  //   .catch(setError);
  // }, []);

  // if (loading) return <h1>Loading...</h1>;
  // if (error) return <pre>{JSON.stringify(error)}</pre>
  // if (!data) return null;

  return(
    <div>
      <Navbar />
      <LoginPage />  
    </div> 
    

    
  )

  return (
  //  <form onSubmit={submit}> 
  //   <input 
  //   {...titleProps}
  //   type="text" 
  //   placeholder="color title..."/>
  //   <input 
  //   {...colorProps}
  //   type="color"/>
  //   <button>ADD</button>
  //  </form>
  <h1>Data</h1>
  );
}

export default App;
