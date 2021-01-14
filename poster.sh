#!/bin/bash

for i in {1..10}
do
    ranNum=$[RANDOM%10+300]
    echo $ranNum
    echo 'posting ...'
    curl --header "Content-Type: application/json" --request POST --data '{"private_key":"6186fee6b8ae9759e14b76faeddab0760e2e259511347f31", "co2":300.1, "tempC": 32.4, "humidity": 10.0, "mic": 10.0,"auxPressure": 10.0,"auxTempC": 10.0,"aux001": 10.0,"aux002": 10.0}' http://192.168.1.163:3000/co2/data/3aa34536c1dec59353c073d23116e7b33a1988129f3042ba
    sleep 1
done


