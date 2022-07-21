#!/usr/bin/env sh

HOST="127.0.0.1"
PORT="12345"

# while getopts h:p: TIMED 2>/dev/null
# do
#     case $TIMED in
#        h) HOST=$OPTARG
#           ;;
#        p) PORT=$OPTARG
#           ;;
#     esac
# done

echo "Executing shopify-extensions-debug.sh ..."

# NOTE: The $@ is used to pass all the arguments to the script
dlv exec $HOME/src/github.com/shopify/shopify-cli-extensions/shopify-extensions --headless --listen="$HOST:$PORT" --api-version=2 -- $@
