#!/bin/sh

openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in '../scripts/profiles/educscie71immapp_AdHoc.mobileprovision.enc' -d -a -out '../scripts/profiles/educscie71immapp_AdHoc.mobileprovision'
#openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in ../scripts/certs/apple.cer.enc -d -a -out ../scripts/certs/apple.cer
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in ../scripts/certs/ios_development.cer.enc -d -a -out ../scripts/certs/ios_development.cer
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in ../scripts/certs/ios_distribution.cer.enc -d -a -out ../scripts/certs/ios_distribution.cer
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in ../scripts/certs/ios_distribution.p12.enc -d -a -out ../scripts/certs/ios_distribution.p12
