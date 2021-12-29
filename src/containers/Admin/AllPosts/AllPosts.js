import { Container, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import fire from '../../../Firebase/Firebase';


import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';


function AllUsers({ firebase }) {

    const [allPost, setAllPost] = useState([]);

    useEffect(() => {
        let x = []
        fire.firestore().collection("posts").get().then(res => {
            res.docs.forEach(user => {
                x = x.concat({ ...user.data() })
                // var data = { ...user.data() }
                setAllPost(x)
            })
        })
    }, [setAllPost])

    // console.log(allPost)


    const state = {
        columns: [{
            dataField: 'authorId',
            text: 'authorId'
        },
        {
            dataField: 'title',
            text: 'title',
            filter: textFilter()
        },
        {
            dataField: 'description',
            text: 'description',
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
                        data={allPost}
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