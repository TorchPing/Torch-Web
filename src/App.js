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
import { Helmet } from 'react-helmet'

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
            pre.hosts = [Object.assign({}, docs, {
                uuid: uuid.v4(),
            }), ...pre.hosts]
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

    reTest = () => {
        const action = async () => {
            const oldTests = this.state.hosts
            let counter = 0

            this.setState(state => {
                state.hosts = []
                return state
            })

            for (const item of oldTests.reverse()) {
                counter += 1
                item.uuid = null
                this.addHost(item)
                message.loading(`Processing ${counter} of ${oldTests.length}`, 0.9)
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }

        action().catch(err => { console.log(err) })
    }

    handleCancel = () => {
        this.setState({
            displayModal: false,
        })
    }

    handleMultiAdd = () => {
        this.handleCancel()

        message.info('Processing links, please wait')

        const action = async () => {
            let counter = 0
            const lines = (await Promise.all(this.state.text.split('\n')
                .map(item => item.trim())
                .map(parseLink)))
                .reduce((previous, current) => {
                    console.log(current)
                    if (current === null) {
                        message.error('在解析部分链接时出现问题，请检查键入信息', 5)
                    }
                    if (Array.isArray(current)) {
                        return [...current, ...previous]
                    }
                    return [current, ...previous]
                }, [])
                .filter(link => link !== null)

            for (const line of lines) {
                counter += 1
                this.addHost(line)
                message.loading(`Processing ${counter} of ${lines.length}`, 0.9)
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
            message.success('节点添加完毕！部分检测可能尚未完成，请耐心等待……', 3)
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
                <Helmet>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-97074604-2" />
                    <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'UA-97074604-2');`}} />
                </Helmet>
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
                            <Button icon="search"
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
                                icon="database"
                                type="primary">
                                批量测试</Button>
                            <Button
                                onClick={this.reTest}
                                style={{ width: '50%' }}
                                icon="retweet"
                                type="normal">
                                重新测试</Button>
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
                    title='批量添加'
                    visible={this.state.displayModal}
                    onCancel={this.handleCancel}
                    onOk={this.handleMultiAdd}
                >
                    <TextArea
                        placeholder="Input context"
                        autosize={{ minRows: 6 }}
                        onChange={this.updateText.bind(this)} />
                    <small>目前支持以下链接格式：</small>
                    <small>
                        <li>
                            <ul><code>域名:端口 (IP:PORT)</code></ul>
                            <ul><code>SSR 链接 (ssr://)</code></ul>
                            <ul><code>sub:SSR订阅地址 (sub:https://ADDRESS)</code></ul>
                            <ul><code>SS 链接 (ss://)</code></ul>
                        </li>
                    </small>
                    <small>
                        一行一个链接，一次可混合多种链接检测
                    </small>
                </Modal>
                <Footbar />
            </div>
        )
    }
}

export default App
