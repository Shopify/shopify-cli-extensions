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

dlv debug . --headless --listen="$HOST:$PORT" --api-version=2 -- $@ # also add as needed: --accept-multiclient --continue
