import React from 'react';

class Explorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({ data: res.message }))
            .catch(err => console.log(err));
    }

    // fetching the GET route from the Express server which matches the GET route from server.js
    callBackendAPI = async () => {
        const response = await fetch('http://localhost:3042/');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    };

    render() {
        return (
            <div className="App">
            <p className="App-intro">{this.state.data}</p>
            </div>
        );
    }
}

export default Explorer