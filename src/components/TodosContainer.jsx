import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Spinner } from 'reactstrap';

function TodosContainer(){
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getTodos()
    });
    

    const getTodos = () => {
        axios.get("https://todo-api-20.herokuapp.com/api/v1/todos")
        .then(response => {
            setTodos(response.data)
        })
        .catch(error => console.log(error))
    }

    const createTodo = (e) => {
        if (e.key === 'Enter') {
            setLoading(true)
            axios.post('https://todo-api-20.herokuapp.com/api/v1/todos', {todo: {title: e.target.value}})
            .then(response => {
                setTodos([...todos, response.data]);
                setLoading(false);
                setInputValue("");
            })
            .catch(error => console.log(error))
        }    
    }

    const updateTodo = (e, id) => {
        axios.put(`https://todo-api-20.herokuapp.com/api/v1/todos/${id}`, {todo: {done: e.target.checked}})
        .then(response => {
            const todo = todos.find(x => x.id === response.data.id)
            setTodos(todos.map((todo, i) => todo.id === response.data.id ? {...todo, done: todo.done} : todo ))
        })
        .catch(error => console.log(error))      
    }

    const deleteTodo = (id) => {
        axios.delete(`https://todo-api-20.herokuapp.com/api/v1/todos/${id}`)
        .then(response => {
            setTodos([...todos, response.data]);
        })
        .catch(error => console.log(error))
    }

    if(todos.length == 0){
        return(
            <div style={{textAlign: 'center'}}>
                <Spinner animation="border" />
            </div>
        )
    }else{
        return (
            <div>
                <div className="inputContainer">
                    <input 
                        className="taskInput" 
                        type="text" 
                        placeholder="Add a task" 
                        maxLength="50"
                        onKeyPress={(event) => createTodo(event)}
                        value={inputValue} 
                        onChange={(event) => setInputValue(event.target.value)}  
                    />
                </div> 
                { loading &&
                    <div style={{textAlign: 'center'}}>
                        <Spinner animation="border" />
                    </div>
                }    
                <div className="listWrapper">
                    <ul className="taskList">
                        {todos.map((todo) => {
                            return(
                                <li className="task" todo={todo} key={todo.id}>
                                    <input className="taskCheckbox" type="checkbox" 
                                        checked={todo.done}
                                        onChange={(e) => updateTodo(e, todo.id)}
                                    />              
                                    <label className="taskLabel">{todo.title}</label>
                                    <span className="deleteTaskBtn"
                                        onClick={(e) => deleteTodo(todo.id)}>
                                        x
                                    </span>
                                </li>
                            )       
                        })} 	    
                    </ul>
                </div>
            </div>
        )
    }
}

export default TodosContainer;