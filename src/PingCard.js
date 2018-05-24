import React, { Component } from 'react'
import { Card, Tag } from 'antd'
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
    console.log(state)
    return state
}

class PingCard extends Component {
    state = getInitState()

    async componentDidMount() {
        for (const item of serverList) {
            const itemOnline = await ping(item.address, this.props.host, this.props.port)
            this.setState({
                [item.name]: {
                    'type': itemOnline === true ? "online" : "offline",
                    'name': item.name,
                }
            })
        }
    }

    getTag(status) {
        console.log(status)
        if (status.type === "loading") {
            return <Tag key={status.name} color="#2db7f5">{status.name}: Loading</Tag>
        } else if (status.type === "online") {
            return <Tag key={status.name} color="#87d068">{status.name}: Up</Tag>
        }
        return <Tag key={status.name} color="#f50">{status.name}: Down</Tag>
    }

    render() {
        return (
            <Card
                title={this.props.host + ":" + this.props.port}
            >

            {serverList.map(item =>
                this.getTag(this.state[item.name])
            )}

            </Card>
        )
    }
}

export default PingCard
