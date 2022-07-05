import { useState, useEffect, useCallback } from "react";

function useFetch(page, totalTasks, todosLength, lastId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);
    
  const sendQuery = useCallback( () => {
    try {
       await setLoading(true);
       await setError(false);
      if (totalTasks > todosLength) {
        console.log(lastId);

        fetch(`http://localhost:3001/loadtasks/${lastId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        }).then((response) => response.json())
          .then((todos) => {
            setList(todos)
            console.log(todos[todos.length -1].id);
    
          });
      }
     
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [ page]);

  useEffect(() => {
    sendQuery();
  }, [ page]);

  return { loading, error, list };
}

export default useFetch;
