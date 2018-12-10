import * as React from 'react'
import Todo from './Todo'
import TodoForm from './TodoForm'
import {DB_CONFIG} from "../firebase/config"
import firebase from 'firebase/app'
import 'firebase/database'
import FooterBar from "./FooterBar";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.addTodo = this.addTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
        this.toggleTodo = this.toggleTodo.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.clearCompleted = this.clearCompleted.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.updateShow = this.updateShow.bind(this);
        this.updateFilter = this.updateFilter.bind(this)
        this.app = firebase.initializeApp(DB_CONFIG);
        this.database = this.app.database().ref().child('todos');

        this.state = {
            todos: [],
            toggle: false,
            filter: "all"
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
        const temp = {
            title: taskName,
            isCompleted: false
        }
        this.database.push(temp);

    }

    removeTodo(id) {

        this.database.child(id).remove();
    }

    toggleTodo(todo) {

        const temp = {
            'id': todo.id,
            'title': todo.title,
            'isCompleted': !todo.isCompleted
        }
        this.database.child(todo.id).update(temp)
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
        this.setState({filter: str});
    }

    updateFilter() {
        var temp = []
        if (this.state.filter === "all") {
            return this.state.todos
        }
        else if (this.state.filter === "active") {
            this.state.todos.map((todo) => {
                if (!todo.isCompleted) {
                    temp.push(todo)
                }
            })
            return temp;
        }
        else if (this.state.filter === "completed") {
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
        let activeCount = this.state.todos.length - completedCount
        let totalCount = this.state.todos.length
        // noinspection JSAnnotator
        return (
            <section className="todoform">
                <TodoForm
                    addTodo={this.addTodo}
                />
                <section className="main">
                    {todos.length > 0 &&
                    <input id="toggle-all"
                           className="toggle-all"
                           type="checkbox"
                           checked={activeCount === 0}
                           onChange={this.toggleAll}
                    />}
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
                <FooterBar
                    activeCount={activeCount}
                    updateShow={this.updateShow}
                    completedCount={completedCount}
                    clearCompleted={this.clearCompleted}
                />
                }
            </section>
        );
    }
}

ReactDOM.render(<Main/>, document.getElementById("app"))