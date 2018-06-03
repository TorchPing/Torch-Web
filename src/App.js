import React, { Component } from 'react'
import Navbar from './Navbar'
import Footbar from './Footbar'
import PingCard from './PingCard'
import { Row, Col } from 'react-flexbox-grid'
import { parseLink } from './utils'
import {
    Layout,
    Input,
    Button,
    InputNumber,
    Modal,
    message } from 'antd'
import uuid from 'uuid'
import './App.css'

const { TextArea } = Input

class App extends Component {
    state = {
        hosts: [],
        input: {
            host: 'www.baidu.com',
            port: 443,
        },
        text: '',
        displayModal: false,
    }

    addHost = (docs) => {
        this.setState(pre => {
            pre.hosts = [Object.assign({
                'uuid': uuid.v4(),
            }, docs), ...pre.hosts]
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

    updateText(event) {
        const value = event.target.value

        this.setState(pre => {
            pre.text = value
            return pre
        })
    }

    showModal = () => {
        this.setState({
            displayModal: true,
        })
    }

    handleCancel = () => {
        this.setState({
            displayModal: false,
        })
    }

    handleMultiAdd = () => {
        const lines = this.state.text.split('\n')
            .map(parseLink)
            .filter(link => link !== null)

        this.handleCancel()

        const action = async () => {
            let counter = 0

            for (const line of lines) {
                counter += 1
                this.addHost(line)
                message.loading(`Processing ${counter} of ${lines.length}`, 0.9)
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
            message.info('All node added', 1)
        }

        action()
    }

    updatePort(value) {
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
                                onClick={() => this.addHost(this.state.input)}
                                style={{ width: '20%' }}
                                type="primary">
                            Ping</Button>
                        </Input.Group>
                        <br />
                        <Input.Group compact>
                            <Button
                                onClick={this.showModal}
                                style={{ width: '50%' }}
                                type="primary">
                            批量测试</Button>

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
                                        <PingCard host={item.host} port={item.port} title={item.title} />
                                    </Col>
                                )
                            })}
                        </Row>
                    </Layout.Content>
                </Layout>
                <Modal
                    title = '批量添加'
                    visible = {this.state.displayModal}
                    onCancel = {this.handleCancel}
                    onOk = {this.handleMultiAdd}
                >
                    <TextArea
                        placeholder="Input context"
                        autosize={{ minRows: 6 }}
                        onChange={this.updateText.bind(this)} />
                    <small>使用 域名:端口或者 SSR 链接来测试 一行一个</small>
                </Modal>
                <Footbar />
            </div>
        )
    }
}

export default App
