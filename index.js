process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = async ({ url, certificate, key }) => {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
        cert: fs.readFileSync(certificate),
        key: fs.readFileSync(key),
        passphrase: ''
    });
    const axios_instance = axios.create({
        withCredentials: true,
        httpsAgent
    });
    const response = await axios_instance.get(url, {
        maxRedirects: 0,
        validateStatus: function(status) {
            return status >= 200 && status < 303;
        }
    });

    const response_redirect_url = response.headers.location;
    const authentication_url = _construct_certificate_authentication_url(
        response_redirect_url
    );
    const authentication_response = await axios_instance.get(
        authentication_url
    );

    const { post_url, form_data } = _extract_login_form(
        authentication_response.data
    );

    const stringified_form_data = querystring.stringify(form_data);

    const final_response = await axios_instance.post(
        post_url,
        stringified_form_data,
        {
            maxRedirects: 0,
            validateStatus: function(status) {
                return status >= 200 && status < 303;
            }
        }
    );
    const cookies = final_response.headers['set-cookie'].toString();
    return cookies;
};

const _construct_certificate_authentication_url = response_redirect_url => {
    const [base, query] = response_redirect_url.split('/adfs/ls/');
    const certificate_authentication_part = 'auth/sslclient/';
    const new_path = `/adfs/ls/${certificate_authentication_part}`;
    return `${base}${new_path}${query}`;
};

const _extract_login_form = response_content => {
    const $ = cheerio.load(response_content);
    const post_url = $('body form').attr('action');
    const form_data = {};
    $('input').each((i, elem) => {
        const { name, value } = elem.attribs;
        form_data[name] = value;
    });
    return { post_url, form_data };
};
