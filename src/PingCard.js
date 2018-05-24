import React, { Component } from 'react'
import { Card, Tag } from 'antd'
import { Row, Col } from 'react-flexbox-grid'
import serverList from './serverList.json'
import axios from 'axios'

async function ping(apiRoot, host, port) {
    const res = await axios.get(`${apiRoot}/${host}/${port}`)

    return res.data.status
}

function getInitState() {
    const state = {}

    for (const item of serverList) {
        state[item.name] = {
            'type': 'loading',
            'name': item.name,
        }
    }
    return state
}

class PingCard extends Component {
    state = getInitState()

    async componentDidMount() {
        for (const item of serverList) {
            ping(item.address, this.props.host, this.props.port)
                .then(isOnline => {
                    this.setState({
                        [item.name]: {
                            'type': isOnline === true ? 'online' : 'offline',
                            'name': item.name,
                        },
                    })
                })
        }
    }

    getTag(status) {
        if (status.type === 'loading') {
            return <Tag key={status.name} color="#2db7f5">{status.name}: Loading</Tag>
        } else if (status.type === 'online') {
            return <Tag key={status.name} color="#87d068">{status.name}: Up</Tag>
        }
        return <Tag key={status.name} color="#f50">{status.name}: Down</Tag>
    }

    render() {
        return (
            <Card
                title={this.props.host + ':' + this.props.port}
            >
                <Row>
                    {serverList.map(item =>
                        <Col style={{padding: '4px 0px'}}>
                            {this.getTag(this.state[item.name])}
                        </Col>
                    )}
                </Row>

            </Card>
        )
    }
}

export default PingCard
