#!/bin/sh

openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in 'scripts/profiles/educscie71immapp_AdHoc.mobileprovision' -out 'scripts/profiles/educscie71immapp_AdHoc.mobileprovision.enc' -a
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/ios_development.cer -out scripts/certs/ios_development.cer.enc -a
#openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/apple.cer -out scripts/certs/apple.cer.enc -a
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/ios_distribution.cer -out scripts/certs/ios_distribution.cer.enc -a
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/ios_distribution.p12 -out scripts/certs/ios_distribution.p12.enc -a
