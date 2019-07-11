import test from 'ava';
import cernGetSsoCookie from '.';
import axios from 'axios';

// For testing you must provide usercert.pem and userkey.pem in certs folder
const certificate = './certs/usercert.pem';
const key = './certs/userkey.pem';
test('cern-get-sso-cookie working properly with OMS', async t => {
    const url =
        'https://cmsoms.cern.ch/agg/api/v1/runs?sort=-run_number&page%5Blimit%5D=50&include=meta';
    try {
        const cookies = await cernGetSsoCookie({ url, certificate, key });
        const {
            data: { data }
        } = await axios.get(url, { headers: { Cookie: cookies } });
        t.is(Array.isArray(data), true);
    } catch (err) {
        console.log(err);
        throw err;
    }
});
