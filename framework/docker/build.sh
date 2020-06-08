PROJECT_NAME=$1
PROJECT_VERSION=$2
FRAMEWORK=$3

rm -rf dist build;
NO_DLL=true npm install --registry=http://registry.npm.taobao.org;
npm run build
mkdir vvv
mv build/* vvv
mv vvv build
if [ -f /usr/bin/deber ]; then
    echo Building deb file...
    echo "PROJECT_NAME=${PROJECT_NAME}" > Deberfile.env
    echo "PROJECT_VERSION=${PROJECT_VERSION}" >> Deberfile.env
    j2 -f env ${FRAMEWORK}/docker/Deberfile Deberfile.env> Deberfile
    /usr/bin/deber -app=${PROJECT_NAME} -version=${PROJECT_VERSION}
    if [ $? -ne 0 ]; then
        echo "-------------------------------deber error"
        exit 1
    fi
    echo Done.
fi
mkdir target/rpm
cp target/${PROJECT_NAME}-${PROJECT_VERSION}.deb target/rpm
if [ -f /usr/bin/deb_to_rpm.py ]; then
    echo Building rpm file...
    sudo /usr/bin/deb_to_rpm.py target/rpm
    mv target/rpm/${PROJECT_NAME}*.rpm target/${PROJECT_NAME}-${PROJECT_VERSION}.rpm
    if [ $? -ne 0 ]; then
        echo "-------------------------------rpm error"
        exit 1
    fi
    echo Done.
fi
