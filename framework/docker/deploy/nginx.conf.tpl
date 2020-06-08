#TARGET_FILE:/etc/nginx/nginx.conf
worker_processes  1;

{% set VERSION_SPLIT = VERSION.split('-') %}


events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  text/html;
    sendfile        on;
    keepalive_timeout  65;
    # log file
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    # gzip
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen       80;
        server_name  {{PROJECT}};
        root /whaleex/{{PROJECT}}/root;

        location ~ .*\.(css|js|png|jpg)$ {
            add_header Cache-Control public;
        }
        location ^~ /{{PRODUCT}}/{{VERSION_SPLIT[0]}} {
            alias /whaleex/{{PROJECT}}/vvv/cards/;
        }
        location / {
            add_header Cache-Control no-cache;
            try_files $uri /index.html;
        }
    }
}
