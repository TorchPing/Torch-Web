import React, { Component } from 'react'
import Navbar from './Navbar'
import Footbar from './Footbar'
import PingCard from './PingCard'
import { Row, Col } from 'react-flexbox-grid'
import { Layout, Input, Button, InputNumber } from 'antd'
import './App.css'

class App extends Component {
    state = {
        'hosts': [{
            'host': 'www.baidu.com',
            'port': 443,
        }, {
            'host': 'www.google.com',
            'port': 443,
        }]
    }

    render() {
        return (
            <div>
                <Navbar />
                <Layout className="siteContext">
                    <Layout.Content style={{ padding: '16px 32px' }}>
                        <Input.Group compact>
                            <Input placeholder="Host" style={{ width: '70%' }} defaultValue="www.baidu.com" />
                            <InputNumber placeholder="Port" style={{ width: '15%' }} defaultValue="443" />
                            <Button style={{ width: '15%' }} type="primary">Add</Button>
                        </Input.Group>
                        <Row>
                            {this.state.hosts.map((item, i) => {
                                return (<Col key={i} xs={12} sm={6} md={6} lg={4} style={{ padding: '16px' }}>
                                    <PingCard host={item.host} port={item.port} />
                                </Col>)
                            })}
                        </Row>
                    </Layout.Content>
                </Layout>
                <Footbar />
            </div>
        )
    }
}

export default App;
