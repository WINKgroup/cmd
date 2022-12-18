#!/bin/bash
for (( i=1; i<=5; i++ ))
do
    echo "normal log"
    echo "error log" 1>&2
    sleep 1
done