#!/bin/bash

for i in {1..10}
do
    ranNum=$[RANDOM%10+300]
    echo $ranNum
    echo 'posting ...'
    curl --header "Content-Type: application/json" --request POST --data '{"private_key":"c1d2aa10f964c5c24d42f11bcf1efb00a1e99f31cab96ebe", "co2":300.1, "tempC": 32.4, "humidity": 10.0, "mic": 10.0,"auxPressure": 10.0,"auxTempC": 10.0,"aux001": 10.0,"aux002": 10.0}' http://data.pvos.org/co2/data/89e9a8edc8661c8efb8050d01febc63ec739369ad1924a35
    sleep 1
done


