import React, { Component } from 'react'
import { Layout } from 'antd'

class Footbar extends Component {
    render() {
        return (
            <Layout>
                <Layout.Footer style={{ textAlign: 'center' }}>
                    <a href="https://github.com/Indexyz/Torch-Web">Torch</a>, ©2018 Created by <a href="https://blog.indexyz.me">Indexyz</a>
                </Layout.Footer>
            </Layout>
        )
    }
}

export default Footbar
