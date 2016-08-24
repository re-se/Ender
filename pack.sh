mkdir pack
cp -r ./dist pack
cp package.json pack
cd ./pack
npm install --production
cd ../
electron-packager ./pack Anitificator --platform=darwin --arch=x64 --version=0.36.1
rm -r pack
