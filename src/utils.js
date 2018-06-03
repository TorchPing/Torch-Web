import base64 from './base64'

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
 *
 * @param {string} link
 * @returns {object} parsed object
 */
function parseSSRLink(link) {
    let originLink = urlSafeBase64Decode(link.substr(6))
    const decoded = { }

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
            .replace(/=/g,'":"') + '"}')

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
    } else if (origin === '') {
        return null
    }
    return {
        host: origin,
        port: 22,
    }
}

/**
 * Get link parsed object
 *
 * @param {string} link
 * @returns {object} parsed object
 */
function parseLink(link) {
    try {
        if (link.startsWith('ssr://')) {
            return parseSSRLink(link)
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
