#/bin/bash

for dir in ./CH*/*/*/meetup; do (cp -Rp test "$dir"); done
