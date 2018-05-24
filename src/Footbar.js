import React, { Component } from 'react'
import { Layout } from 'antd'

class Footbar extends Component {
    render() {
        return (
            <Layout>
                <Layout.Footer style={{ textAlign: 'center' }}r>
                    Torch, ©2018 Created by Indexyz
                </Layout.Footer>
            </Layout>
        )
    }
}

export default Footbar
