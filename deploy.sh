#!/usr/bin/env bash
# Automated build and push to deployment repo
set -e

id="[Deploy Script]"

echo $id "Removing previous deploy build..."
rm -rf ./build/*
echo $id "Removing previous deploy build done."

echo $id "Running yarn build..."
yarn install && yarn build
echo $id "Done running build."

gcloud app deploy --quiet --project engage-yo-council

echo $id "Adding and commiting new files to deply Git..."
git add -A
git commit -m "Automated build and commit @ $(date)"
echo $id "Adding and commiting new files to deply Git done."

echo $id "Pushing to master..."
git push -f origin master
echo $id "Master push done."
popd

echo $id
echo $id "Deploy completed!"

