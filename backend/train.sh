#! /bin/bash

. ./.venv/bin/activate
./scp
node ./util/fix.js
python ./model/train.py
