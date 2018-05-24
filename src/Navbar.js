import React, { Component } from 'react'
import { Menu, Icon, Layout } from 'antd';

class Navbar extends Component {
    render() {
        return (
            <Layout>
                <Layout.Header>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="mail">
                        <Icon type="appstore" />Torch
                        </Menu.Item>
                    </Menu>
                </Layout.Header>
            </Layout>
        )
    }
}

export default Navbar
