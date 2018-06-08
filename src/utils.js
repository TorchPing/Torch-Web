import base64 from './base64'
import axios from 'axios'

/**
 *
 * @param {string} origin
 */
function fillMissingPadding(origin) {
    if (origin.length % 4 !== 0) {
        let padding = ''

        for (let i = 0; i < origin.length % 4; i++) {
            padding += '='
        }

        return origin + padding
    }
    return origin
}

/**
 * URL-Safe Base64 Decode
 *
 * @param {string} encoded
 */
function urlSafeBase64Decode(encoded) {
    return base64.decode(
        fillMissingPadding(encoded.replace(/_/g, '/')
            .replace(/-/g, '+'))
    )
}

/**
 * https://shadowsocks.org/en/config/quick-guide.html
 * Origin ss://BASE64-ENCODED-STRING-WITHOUT-PADDING#TAG
 * Plain text ss://method:password@hostname:port
 *
 * @param link
 * @returns {Promise<{title: *, host: *, port: number}>}
 */
async function parseSSLink(link) {
    const split = link.split('#')
    const originLink = urlSafeBase64Decode(split[0].substr(5))
    const a = originLink.split(':')
    const port = Number(a[2])
    const host = a[1].split('@')[1]

    if (port >= 1 && port <= 65535 && host) {
        return {
            title: split[1] === '' ? host : split[1],
            host: host,
            port: Number(port),
        }
    }

    return null
}

/**
 *
 * @param {string} link
 * @returns {object} parsed object
 */
function parseSSRLink(link) {
    let originLink = urlSafeBase64Decode(link.substr(6))
    const decoded = {}

    const keys = ['server', 'server_port', 'portocol', 'method', 'obfs', 'password']

    for (const key of keys) {
        decoded[key] = originLink.substr(0, originLink.indexOf(':'))
        originLink = originLink.substr(originLink.indexOf(':') + 1)
    }
    const qs = JSON.parse(
        '{"' +
        decodeURI(originLink.substr(2))
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') + '"}')

    return {
        title: urlSafeBase64Decode(qs['remarks']),
        host: decoded['server'],
        port: Number(decoded['server_port']),
    }
}

/**
 * Parse normal link like google.com:443
 *
 * @param {string} origin
 */
function parseNormalLink(origin) {
    const splited = origin.split(':')

    if (splited.length === 2) {
        return {
            host: splited[0],
            port: Number(splited[1]),
        }
    } else if (origin.trim() === '') {
        return null
    }
    return {
        host: origin,
        port: 22,
    }
}

/**
 * Test ShadowsocksR Subscription link
 *
 * @param {string} origin
 */
async function parseSSRSubscription(origin) {
    const subscriptionLink = origin.substr(4)
    const reqURL = `https://cors-anywhere.herokuapp.com/${subscriptionLink}`
    const resp = await axios.get(reqURL)

    const r = urlSafeBase64Decode(resp.data)
        .split('\n')
        .map(item => item.trim())

    return Promise.all(r.map(parseLink))
}

/**
 * Get link parsed object
 *
 * @param {string} link
 * @returns {object} parsed object
 */
async function parseLink(link) {
    try {
        if (link.startsWith('ss://')) {
            return parseSSLink(link)
        }
        if (link.startsWith('ssr://')) {
            return parseSSRLink(link)
        }
        if (link.startsWith('sub:')) {
            return await parseSSRSubscription(link)
        }
        return parseNormalLink(link)
    } catch (e) {
        /**
         * Not need handle here
         * Paser error will skip this node
         */
    }
    return null
}

export {
    parseLink,
}
