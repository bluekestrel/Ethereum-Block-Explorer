import React from 'react';

class Explorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            count: 0,
        }
    }

    componentDidMount() {
        this.callBackendAPI("/")
            .then((res) => {
                this.setState(
                    {
                        data: res.message
                    },
                    () => {
                        this.checkForNewBlock();
                    }
                );
            })
            .catch(err => console.log(err));
    }

    // fetching the GET route from the Express server which matches the GET route from server.js
    callBackendAPI = async (route) => {
        const response = await fetch(`http://localhost:3042${route}`);
        const body = await response.json();
        console.log(body);

        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    };

    checkForNewBlock() {
        setInterval(() => {
            this.callBackendAPI("/poll")
            .then((res) => {
                this.setState(
                    {
                        data: JSON.stringify(res.block)
                    }
                );
            })
            .catch(err => console.log(err));
        }, 10000)
    }

    render() {
        return (
            <div className="App">
            <p className="App-intro">{this.state.data}</p>
            </div>
        );
    }
}

export default Explorer