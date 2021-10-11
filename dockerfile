# syntax=docker/dockerfile:1

FROM node:latest as build-stage

WORKDIR /webgest_build_cnt

COPY ./ .

RUN npm install

# RUN npm rebuild node-sass

RUN npm run build

# ┏━━┓
# ┗┓┓┣━┳━┳┓┏━┳┳┓
# ┏┻┛┃┻┫╋┃┗┫╋┃┃┃
# ┗━━┻━┫┏┻━┻━╋┓┃
# ╋╋╋╋╋┗┛╋╋╋╋┗━┛

FROM nginx:1.21-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /webgest_build_cnt/dist/WebGest /usr/share/nginx/html
