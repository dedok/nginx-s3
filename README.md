# An example of NGINX's configuration that makes flexible s3 proxy

# Features:
 * Hidden s3 Auth
 * Front with secure links

# Requires:
 * njs, https://github.com/nginx/njs, yum install nginx-module-njs
 * --with-http_ssl_module (built-in)
 * --with-http_secure_link_module (built-in)

# How to run with NGINX w/o compilation:
1. Install NGINX and `requires`, here is explanation how: http://nginx.org/en/linux_packages.html
2. Configure conf/aws_utils.js
2.1. Should be replace the value of $secret variable to yours value
3. Configure conf/s3_proxy.conf
3.1. Should be replace the value of AWS_SECRET_KEY to yours value
3.2. Should be replace the value of AWS_ACCESS_KEY to yours value
4. Install `requires` Configure /etc/nginx/nginx.conf
4.1. Add a line to /etc/nginx/nginx.conf: 'load_module modules/ngx_http_js_module.so;'
4. Copy configured conf/aws_utils.js to /etc/nginx/
3. Copy configured conf/s3_proxy.conf to /etc/nginx/conf.d/
5. Generate access token using ./script/generate_token.sh
```bash
# Getting {md5 token} also store yours `expires`
$> ./scripts/generate_token.sh --secret=my-secret --bucket=my-s3-bucket --expires=2147483647 # forever
2RfxXGk2c4x0NMkMHZZcfA
# Or see usage
$> ./scripts/generate_token.sh --help
```
6. Requrest data:
```bash
# Getting data:
$> curl -H"Host: s3_proxy" 'http://localhost:80/{BUCKET}/{KEY}?e=2147483647&t=2RfxXGk2c4x0NMkMHZZcfA'

# Getting METHODs restriction (403):
$> curl -XPOST -H"Host: s3_proxy" 'http://localhost:80/{BUCKET}/{KEY}?e=2147483647&t=2RfxXGk2c4x0NMkMHZZcfA'

# Getting an access restriction (403):
$> curl -XPOST -H"Host: s3_proxy" 'http://localhost:80/{BUCKET}/{KEY}?e=2147483647&t=2RfxXGk2c4x0NMkMHZZcfA'
```

