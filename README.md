# An example of NGINX's configuration that makes flexible s3 proxy

# Features:
 * Hidden s3 Auth
 * Front with secure links

# Requires:
 * njs, https://github.com/nginx/njs, yum install nginx-module-njs
 * --with-http_ssl_module (built-in)
 * --with-http_secure_link_module (built-in)

# Install & test this (w/o compilation of NGINX

* Install NGINX and `requires`, here is explanation how: http://nginx.org/en/linux_packages.html
* Configure conf/aws_utils.js and conf/s3_proxy.conf
  * Should be replace the value of `$secret` variable to yours value
  * Should be replace the value of AWS_SECRET_KEY to yours value
  * Should be replace the value of AWS_ACCESS_KEY to yours value
* Install `requires` and configure /etc/nginx/nginx.conf
  * Add a line to /etc/nginx/nginx.conf: 'load_module modules/ngx_http_js_module.so;'
* Copy configured conf/aws_utils.js to /etc/nginx/
* Copy configured conf/s3_proxy.conf to /etc/nginx/conf.d/

* Generate access token using ./script/generate_token.sh
```bash
# Getting {md5 token}
# Notice. --secret should be the same as `$secret` (see the second step)
$> ./scripts/generate_token.sh --secret=my-secret --bucket=my-s3-bucket --expires=2147483647 # forever
2RfxcompilationXGk2c4x0NMkMHZZcfA
# Or see usage
$> ./scripts/generate_token.sh --help
```
* Requrest data:
```bash
# Getting data:
$> curl -H"Host: s3_proxy" 'http://localhost:80/{BUCKET}/{KEY}?e=2147483647&t=2RfxXGk2c4x0NMkMHZZcfA'

# Getting METHODs restriction (403):
$> curl -XPOST -H"Host: s3_proxy" 'http://localhost:80/{BUCKET}/{KEY}?e=2147483647&t=2RfxXGk2c4x0NMkMHZZcfA'

# Getting an access restriction (403):
$> curl -H"Host: s3_proxy" 'http://localhost:80/{BUCKET}/{KEY}?e=2147483647&t=WRONG'
$> curl -H"Host: s3_proxy" 'http://localhost:80/{BUCKET}/{KEY}?e=WRONG&t=2RfxXGk2c4x0NMkMHZZcfA'
```

