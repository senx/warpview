yarn version --new-version $1
(cd projects/warpview-ng && yarn version --new-version $1 )
yarn clean
yarn build
(cd dist/warpview && yarn publish --new-version $1 )
