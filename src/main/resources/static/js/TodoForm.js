import React from 'react';
import propTypes from 'prop-types';

class TodoForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newTitle: '',
        };

        this.handleUserInput = this.handleUserInput.bind(this);
        this.writeTodo = this.writeTodo.bind(this);
    }

    handleUserInput(e) {
        this.setState({
            newTitle: e.target.value
        })
    }

    writeTodo(e) {
        var key = e.keyCode || e.which;
        if (key == 13 && this.state.newTitle !== "") {
            this.props.addTodo(this.state.newTitle)
            this.setState({
                newTitle: '',
            })
        }

    }

    render() {
        return (
            <header className="header">
                <h1>todos</h1>
                <input className='new-todo'
                       placeholder="What needs to be done? "
                       value={this.state.newTitle}
                       onChange={this.handleUserInput}
                       onKeyPress={this.writeTodo}/>
            </header>

        )
    }
}

TodoForm.propTypes = {
    title: propTypes.string,
    isCompleted: propTypes.bool
}
export default TodoForm;