#/bin/bash

for dir in ./CH*/*/*/meetup; do (cd "$dir" && rm -Rf node_modules && rm .env); done
