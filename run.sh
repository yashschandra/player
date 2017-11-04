#!/bin/bash

sudo service elasticsearch start
node index.js &
python manage.py runserver 8004
