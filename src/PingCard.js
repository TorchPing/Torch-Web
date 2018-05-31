import React, {Component} from 'react'
import {Card, Tag, Popover} from 'antd'
import {Row, Col} from 'react-flexbox-grid'
import serverList from './serverList.json'
import axios from 'axios'

async function ping(apiRoot, host, port) {
    const res = await axios.get(`${apiRoot}/${host}/${port}`)

    return res.data
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
                .then(data => {
                    this.setState({
                        [item.name]: {
                            'type': data.status === true ? data.time : 'offline',
                            'name': item.name,
                        },
                    })
                })
                .catch(() => {
                    this.setState({
                        [item.name]: {
                            'type': 'error',
                            'name': item.name,
                        },
                    })
                })
        }
    }

    getTag(status) {
        if (status.type === 'loading') {
            return <Tag key={status.name} color="#2db7f5">{status.name}: Loading</Tag>
        } else if (status.type === 'offline') {
            return <Tag key={status.name} color="#f50">{status.name}: Down</Tag>
        } else if (status.type === 'error') {
            return <Tag key={status.name} color="#f50">{status.name}: Error</Tag>
        }
        return <Tag key={status.name} color="#87d068">
            {status.name}: {status.type === null ? '???' : status.type.toFixed(2)} ms
        </Tag>
    }

    render() {
        return (
            <Card
                title={(() => {
                    if (this.props.title === undefined) {
                        return this.props.host + ':' + this.props.port
                    }
                    return this.props.title
                }).bind(this)()}
            >
                <Row>
                    {serverList.map(item =>
                        <Col style={{padding: '4px 0px'}}>
                            <Popover content={item.info} title="赞助商信息">
                                {this.getTag(this.state[item.name])}
                            </Popover>
                        </Col>
                    )}
                </Row>

            </Card>
        )
    }
}

export default PingCard
