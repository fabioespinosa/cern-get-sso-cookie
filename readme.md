# cern-get-sso-cookie

> You give me a certificate, I give you a cookie you can use to query CERN services using SSO

## Install

```
    $ npm install cern-get-sso-cookie
```

## Usage

Certificates must be passwordless

```javascript
const axios = require('axios'); // Or whichever http agent you prefer
const getCookie = require('cern-get-sso-cookie');

const url_under_sso =
    'https://cmsoms.cern.ch/agg/api/v1/runs?sort=-run_number&page%5Blimit%5D=50&include=meta'; // Or any other API under SSO
const path_to_certificate = './path_to_usercert.pem';
const path_to_key = './path_to_userkey.pem';

// Get the cookie:
const cookie = getCookie({
    url: url_under_sso,
    certificate: path_to_certificate,
    key: path_to_key
});

const { data } = axios.get(url_under_sso, {
    headers: {
        Cookie: cookie
    }
});
```

# Development

## Running tests

```
    $ npm run test
```

# FAQ

## License

MIT © [Fabio Espinosa](http://fabioespinosa.mit.edu)
