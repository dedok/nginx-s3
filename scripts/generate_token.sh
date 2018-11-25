#!/bin/bash
#
# (C)
#

EXPIRES=2147483647 # forever
BUCKET=''
SECRET=''


die() {
    echo "$0 failed, reason : $@" 1>&2 && exit 1
}


usage()
{
    cat << EOF
usage      :  $0 [--expires] [--bucket] [--secret]

--help | -h             - print this message
--expires               - a link expiration time
--bucket                - a s3 bucket name
--secret                - a secret string

Examples:

$0 --expires=2147483647 --bucket=my-s3-bucket --secret=secret

EOF
}


for option; do
  case $option in
    --help    | -h)
      usage && exit 0
      ;;
    --expires=*)
      EXPIRES=`expr "x$option" : "x--expires=\(.*\)"`
      ;;
    --bucket=*)
      BUCKET=`expr "x$option" : "x--bucket=\(.*\)"`
      ;;
    --secret=*)
      SECRET=`expr "x$option" : "x--secret=\(.*\)"`
      ;;
    * )
      die "unknown CLI parameter '$option', use --help|-h for help"
      ;;
  esac
done

[ x$SECRET = x'' ] && { die "--secret is empty"; }
[ x$BUCKET = x'' ] && { die "--bucket is empty"; }

echo -n "GET/${EXPIRES}/${BUCKET}:${SECRET}" | \
      openssl md5 -binary | openssl base64 | tr +/ -_ | tr -d =

