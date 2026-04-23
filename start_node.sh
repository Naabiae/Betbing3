#!/bin/bash
export PATH=$PATH:~/go/bin

L2_CHAIN_ID=movegame-1
DENOM=umin
OPERATOR=Validator

# Clean up any existing state
rm -rf ~/.minitia

minitiad init --chain-id=$L2_CHAIN_ID $OPERATOR

echo "swift trophy pact laugh term zone steel suffer monster tunnel alter isolate swear today gorilla achieve frequent close hurdle soft supply warm elegant mimic" | minitiad keys add Validator --recover --keyring-backend test

minitiad genesis add-genesis-validator Validator --keyring-backend test
minitiad genesis add-genesis-account $(minitiad keys show Validator -a --keyring-backend test) 100000000000000000$DENOM

# Start minitiad in background
minitiad start > minitiad.log 2>&1 &
echo $! > minitiad.pid
echo "Minitiad started in background."
