version: '2'
services:
  {{ PROJECT_NAME }}:
    image: {{ REGISTRY_HOST }}/{{ PROJECT_GROUP }}/{{ PROJECT_NAME }}:{{ PROJECT_VERSION }}
    ports:
      - 3080:80
    environment:
      BASE: '/'
      GW_HOST: 'gw.ci.whaleex.net'
