import * as React from 'react'
import Todo from './Todo'
import TodoForm from './TodoForm'
import {DB_CONFIG} from "../firebase/config"
import firebase from 'firebase/app'
import 'firebase/database'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.addTodo = this.addTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
        this.toggleTodo = this.toggleTodo.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.clearCompleted = this.clearCompleted.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.updateFilter = this.updateFilter.bind(this)
        this.app = firebase.initializeApp(DB_CONFIG);
        this.database = this.app.database().ref().child('todos');

        this.state = {
            todos: [],
            toggle: false,
            showing: "all"
        }
    }

    componentWillMount() {
        var tasks = [];
        this.database.on('value', (snap) => {

                snap.forEach((childSnap) => {

                    var task = {
                        'id': childSnap.key,
                        'title': childSnap.val().title,
                        'isCompleted': childSnap.val().isCompleted
                    }
                    tasks.push(task)
                });
                this.setState({todos: tasks});

                tasks = [];
            }
        )
    }

    addTodo(taskName) {
        const task = {
            title: taskName,
            isCompleted: false
        }
        this.database.push(task);

    }

    removeTodo(id) {

        this.database.child(id).remove();
    }

    toggleTodo(todo) {

        const task = {
            'id': todo.id,
            'title': todo.title,
            'isCompleted': !todo.isCompleted
        }
        this.database.child(todo.id).update(task)
    }

    toggleAll() {
        this.state.todos.map((todo) => {
            if (todo.isCompleted === this.state.toggle) {
                var updateTodo = {
                    "id": todo.id,
                    "title": todo.title,
                    "isCompleted": !this.state.toggle
                }
                this.database.child(todo.id).update(updateTodo);
            }
            this.setState({toggle: !this.state.toggle})

        })
    }

    updateTodo(todo, updatedName) {
        var updateTodo = {
            "id": todo.id,
            "title": updatedName,
            "isCompleted": todo.isCompleted
        }
        this.database.child(todo.id).update(updateTodo);
    }

    updateShow(str) {
        this.setState({showing: str});
    }

    updateFilter() {
        var temp = []
        if (this.state.showing === "all") {
            return this.state.todos
        }
        else if (this.state.showing === "active") {
            this.state.todos.map((todo) => {
                if (!todo.isCompleted) {
                    temp.push(todo)
                }
            })
            return temp;
        }
        else if (this.state.showing === "completed") {
            this.state.todos.map((todo) => {
                if (todo.isCompleted) {
                    temp.push(todo)
                }
            })
            return temp;
        }

    }

    clearCompleted() {
        this.state.todos.map((todo) => {
            if (todo.isCompleted) {
                this.database.child(todo.id).remove();
            }
        })
    }

    render() {
        let {todos} = this.state
        let completedCount = 0
        this.state.todos.forEach((todo) => {
            if (todo.isCompleted) {
                completedCount++
            }
        })
        let remainingCount = this.state.todos.length - completedCount
        let totalCount = remainingCount+completedCount
        // noinspection JSAnnotator
        return (
            <section className="todoform">
                <TodoForm addTodo={this.addTodo}/>
                <section className="main">
                    {todos.length > 0 &&
                    <input id="toggle-all" className="toggle-all" type="checkbox" checked={remainingCount===0}
                           onChange={this.toggleAll}/>}
                    <label htmlFor="toggle-all"/>
                    <ul className="todo">
                        {
                            this.updateFilter().map((todo) => {
                                return (
                                    <Todo key={todo.id} task={todo}
                                          removeTodo={this.removeTodo}
                                          toggleTodo={this.toggleTodo}
                                          updateTodo={this.updateTodo}
                                    />
                                )
                            })
                        }
                    </ul>
                </section>
                {totalCount > 0 &&
                    <footer className="footer">
                        {remainingCount > 0 && <span className="todo-count">
                        <strong>{remainingCount}</strong> item{remainingCount > 1 && 's'} left</span>}
                        <ul className="filters">
                            <li value="all">
                                <a href={"#/"} onClick={this.updateShow.bind(this, "all")}>All</a>
                            </li>
                            <li>
                                <a href={"#/active"} onClick={this.updateShow.bind(this, "active")}>Active</a>
                            </li>
                            <li>
                                <a href={"#/completed"} onClick={this.updateShow.bind(this, "completed")}>Completed</a>
                            </li>
                        </ul>
                        {completedCount > 0 &&
                        <button className="clear-completed" onClick={this.clearCompleted}>Clear completed</button>}
                    </footer>
                }
            </section>
        );
    }
}

ReactDOM.render(<Main/>, document.getElementById("app"))