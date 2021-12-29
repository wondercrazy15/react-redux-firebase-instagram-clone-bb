import { Container, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import fire from '../../../Firebase/Firebase';


import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';


function AllUsers({ firebase }) {

    const [allUser, setAllUser] = useState([]);

    useEffect(() => {
        let x = []
        fire.firestore().collection("users").get().then(res => {
            res.docs.forEach(user => {
                x = x.concat({ ...user.data() })
                // var data = { ...user.data() }
                setAllUser(x)
            })
        })
    }, [setAllUser])

    // console.log(allUser)


    const state = {
        columns: [{
            dataField: 'uid',
            text: 'Id'
        },
        {
            dataField: 'userName',
            text: 'userName',
            filter: textFilter()
        },
        {
            dataField: 'firstName',
            text: 'firstName',
            filter: textFilter()
        }]
    }
    return (
        <div>
            <Container maxWidth="xl">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <BootstrapTable
                        striped
                        hover
                        keyField='id'
                        data={allUser}
                        columns={state.columns}
                        filter={filterFactory()} />
                </Paper>
            </Container>
        </div>
    )
}

const mapStateToProps = ({ firebase }) => ({
    firebase,
});

export default connect(mapStateToProps)(AllUsers);