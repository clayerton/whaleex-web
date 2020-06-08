FROM registry.cn-hangzhou.aliyuncs.com/docker-base/nginx:1.10.2-12
MAINTAINER junjing.zhang@whaleex.net

ARG VERSION
ARG PROJECT
ARG PRODUCT
ENV PROJECT ${PROJECT}
ENV VERSION ${VERSION}
ENV PRODUCT ${PRODUCT}
ADD whaleex /whaleex
ENV WORKDIR /whaleex/${PROJECT}
RUN echo "cd /whaleex/${PROJECT};chmod +x run.sh;./run.sh" >> /usr/bin/whaleex-init

EXPOSE 8090

WORKDIR /whaleex/${PROJECT}
CMD ["/bin/bash", "/usr/bin/whaleex-init"]
