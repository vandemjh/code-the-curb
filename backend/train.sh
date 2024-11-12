#! /bin/bash

. ./.venv/bin/activate
./scp.sh
node ./util/fix.js
python ./model/train.py
