#/bin/bash

for dir in ./CH*/*/*/meetup; do (cp ecosystem.config.js "$dir"); done
