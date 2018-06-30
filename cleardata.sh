#!/bin/sh
echo "delete from data;" | mysql -uroot -A thegame
sudo rm storage/*
