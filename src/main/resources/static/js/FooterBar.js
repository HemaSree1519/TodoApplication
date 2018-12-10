import * as React from "react";

class FooterBar extends React.Component{
    constructor(props){
        super(props)
    }
    render () {
        return (
            <footer className="footer">
                {this.props.activeCount > 0 && <span className="todo-count">
                        <strong>{this.props.activeCount}</strong> item{this.props.activeCount > 1 && 's'} left</span>}
                <ul className="filters">
                    <li>
                        <a href={"#/"} onClick={this.props.updateShow.bind(this, "all")}>All</a>
                    </li>
                    <li>
                        <a href={"#/active"} onClick={this.props.updateShow.bind(this, "active")}>Active</a>
                    </li>
                    <li>
                        <a href={"#/completed"} onClick={this.props.updateShow.bind(this, "completed")}>Completed</a>
                    </li>
                </ul>
                {this.props.completedCount > 0 &&
                <button className="clear-completed" onClick={this.props.clearCompleted}>Clear completed</button>}
            </footer>
        )
    }
}

export default FooterBar;