#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# Go to actual app
cd SlackerReferenceApp

# Install dependencies
../node_modules/bower/bin/bower install
../node_modules/cordova/bin/cordova plugin add https://github.com/InternationalMixMob/CSCI-E-71_IMM_Slacker_Cordova_Plugin.git --variable SLACK_CLIENT_ID=${SLACK_CLIENT_ID} --variable SLACK_CLIENT_SECRET=${SLACK_CLIENT_SECRET}
../node_modules/cordova/bin/cordova prepare

# Build app
../node_modules/cordova/bin/cordova build android

# Navigate to generated apk
cd platforms/android/build/outputs/apk/

# Upload build
curl \
    -F "status=2" \
    -F "notify=2" \
    -F "notes=New version" \
    -F "notes_type=0" \
    -F "ipa=@android-debug.apk" \
    -H "X-HockeyAppToken: ${HOCKEY_TOKEN}" \
    https://rink.hockeyapp.net/api/2/apps/${HOCKEY_ID}/app_versions/upload
