
//
// (C)
//

var crypto = require('crypto')


/** XXX
 *  KEYS
 */
var AWS_ACCESS_KEY = PLEASE_ADD_A_VALUE_HERE;
var AWS_SECRET_KEY = PLEASE_ADD_A_VALUE_HERE;


function get_x_amz_date(r) {
  /* Example:
   * x-amz-date: %Y%m%dT%H%100M%SZ
   * x-awz-date: '20181125T115417Z';
   *
   */
  var now = new Date();

  return now.toISOString();
}


/**
 * Notice.
 * This function expects that $bucket, $key and $x_amz_date set by NGINX's
 * location capturing. Also it expects that
 *
 * Example:
 *   location ~ '^/([^/]+)/(.*)$' {
 *      set $bucket $1;
 *      set $key    $2;
 *      set x_amz_date '';
 *   }
 */
function get_aws_signature(r) {

  if (r.variables['bucket'].length == 0 ||
      r.variables['key'].length == 0 ||
      r.variables['x_amz_date'].length == 0)
  {
    r.error('\'bucket\' and/or \'key\' and/or \'x_amz_date\'\
            are not defined');
    r.return(500);
    r.finish();
    return '';
  }

  /* Example:
   * s = "$request_method\n\n\n\nx-amz-date:$x_amz_date\n/$bucket/$key";
   * Authorization: AWS ACCESS_KEY:base64(hmac(sha1, s))
   *
   *
   * Other solution to parse URI (i.e. w/o rewrite):
   * var cl = r.uri.match('^/([^/]+)/(.*)$');
   */
  var string_to_sign = r.method.toString() +
                       '\n\n\n\nx-amz-date:' + r.variables['x_amz_date'] +
                       '\n/' + r.variables['bucket'] + '/' +
                        r.variables['key'];

  var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).
                         update(string_to_sign).
                         digest('base64');

  return 'AWS ' + AWS_ACCESS_KEY + ':' + signature;
}


function get_box_host(r) {

  if (r.variables['bucket'].length == 0) {
    r.error('\'bucket\' is not defined');
    r.return(500);
    r.finish();
    return '';
  }

  /* Example:
   * XXX.hb.bizmrg.com
   */
  return r.variables['bucket'] + '.hb.bizmrg.com';
}

