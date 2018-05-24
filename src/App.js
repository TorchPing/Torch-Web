import React, { Component } from 'react'
import Navbar from './Navbar'
import Footbar from './Footbar'
import PingCard from './PingCard'
import { Row, Col } from 'react-flexbox-grid'
import { Layout, Input, Button, InputNumber } from 'antd'
import uuid from 'uuid'
import './App.css'

class App extends Component {
    state = {
        'hosts': [],
        'input': {
            'host': 'www.baidu.com',
            'port': 443,
        },
    }

    addHost() {
        this.setState(pre => {
            pre.hosts = [Object.assign({
                'uuid': uuid.v4(),
            }, this.state.input), ...pre.hosts]
            return pre
        })
    }

    updateHost(event) {
        const value = event.target.value

        this.setState(pre => {
            pre.input.host = value
            return pre
        })
    }

    updatePort(event) {
        const value = event.target.value

        this.setState(pre => {
            pre.input.port = value
            return pre
        })
    }

    render() {
        return (
            <div>
                <Navbar />
                <Layout className="siteContext">
                    <Layout.Content style={{ padding: '16px 32px' }}>
                        <Input.Group compact>
                            <Input
                                value={this.state.input.host}
                                onChange={this.updateHost.bind(this)}
                                placeholder="Host"
                                style={{ width: '60%' }} />
                            <InputNumber
                                value={this.state.input.port}
                                onChange={this.updatePort.bind(this)}
                                placeholder="Port"
                                style={{ width: '20%' }} />
                            <Button
                                onClick={this.addHost.bind(this)}
                                style={{ width: '20%' }}
                                type="primary">
                            Ping</Button>
                        </Input.Group>
                        <Row>
                            {this.state.hosts.map(item => {
                                return (
                                    <Col
                                        key={item.uuid}
                                        xs={12}
                                        sm={6}
                                        md={6}
                                        lg={4}
                                        style={{ padding: '16px' }}>
                                        <PingCard host={item.host} port={item.port} />
                                    </Col>
                                )
                            })}
                        </Row>
                    </Layout.Content>
                </Layout>
                <Footbar />
            </div>
        )
    }
}

export default App
