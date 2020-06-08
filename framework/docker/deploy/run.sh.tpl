#TARGET_FILE:/whaleex/{{PROJECT}}/run.sh
#!/usr/bin/env bash

BASE={{BASE | default('/')}}
GW_HOST={{GW_HOST | default('gw.qa.whaleex.net')}}

CUR=`pwd`
rm -rf root
mkdir -p root$BASE
cp -r vvv/* root$BASE
cd root$BASE

# 标题替换
sed -iE "s|XXX|{{APP_DESCRIPTION | default('desc')}}|" **/*.html *.html
# 替换base
echo "sed -iE 's|<base [^>]\+>|<base href=\\\"$BASE\\\">|g' **/*.html *.html" | bash

# 各种host替换
declare -A name_value=( \
  ["nativePublish"]="{{NATIVE_PUBLISH | default('')}}" \
  ["ws_api"]="{{WS_API | default('')}}" \
  ["ym_api"]="{{YM_API | default('')}}" \
  ["app_api"]="{{GW_HOST | default('')}}" \
  ["app_sapi"]="{{STATIC_API_URL | default('')}}" \
  ["cdn_url"]="{{CDN_URL | default('.')}}" \
  ["static_url"]="{{STATIC_URL | default('')}}" \
  ["cnzz_webid"]="{{CNZZ_WEB_ID | default('')}}" \
  ["system_maintenance"]="{{SYSTEM_MAINTENANCE | default('false')}}" \
  ["android_down_url"]="{{ANDROID_DOWN_URL | default('')}}" \
  ["ios_down_url"]="{{IOS_DOWN_URL | default('')}}" \
  ["order_resign"]="{{ORDER_RESIGN | default('false')}}" \
  ["minMineAsset"]="{{MIN_MINE_ASSET | default('30')}}" \
  ["disableMineList"]="{{DISABLE_MINE_LIST | default('')}}" \
  ["showMineTool"]="{{SHOW_MINE_TOOL | default('')}}" \
  ["faceBookAppId"]="{{FACEBOOK_APPID | default('')}}" \
  ["faceBookSms"]="{{FACEBOOK_SMS | default('')}}" \
  ["version"]="{{VERSION | default('')}}" \
)
for name in "${!name_value[@]}"; do
  value=${name_value[$name]};
  echo "sed -iE 's|$name:[^\"]*\"[^\"]*\"|$name: \"$value\"|g' **/*.html *.html" | bash
done

echo "sed -iE 's|/vvv/|$BASE|g' **/*.js *.js" | bash
echo "sed -iE 's|gw.qa.whaleex.net|$GW_HOST|g' **/*.js *.js" | bash
echo "sed -iE 's|/vvv/|$BASE|g' **/*.html *.html" | bash
echo "sed -iE 's|/vvv/|$BASE|g' **/*.css *.css" | bash
echo "sed -iE 's|/vvv/|$BASE|g' manifest.json" | bash
echo "sed -iE 's|https://cdn.whaleex.com.cn/|$CDN_URL|g' **/*.js *.js **/*.html *.html" | bash

cp index.html $CUR/root

if [ "{{ STRIP_PREFIX | default('') }}" ]; then
  cd $CUR/root
  cp -r {{ STRIP_PREFIX | default('') }}/* .
fi

nginx -g "daemon off;"
