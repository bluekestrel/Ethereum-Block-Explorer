import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

class Explorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            stringData: [],
        }
    }

    componentDidMount() {
        this.callBackendAPI("/")
            .then((res) => {
                this.setState(
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

        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    };

    checkForNewBlock() {
        setInterval(() => {
            this.callBackendAPI("/poll")
            .then((res) => {
                if (!(this.state.data.includes(res.block.number))) {
                    this.setState((prevState) => (
                        {
                            data: [...prevState.data, res.block.number],
                            stringData: [...prevState.stringData, JSON.stringify(res.block)]
                        }
                    ));
                }
            })
            .catch(err => console.log(err));
        }, 10000)
    }

    render() {
        return (
            <div className="App">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ethereum Blocks</TableCell>
                                <TableCell align="right">Block Link</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.data.map((row) => (
                                <TableRow
                                    key={row}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {row}
                                </TableCell>
                                <TableCell align="right">"TODO add hyperlink to block data"</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default Explorer