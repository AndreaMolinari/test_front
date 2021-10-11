# syntax=docker/dockerfile:1

FROM node:latest as build-stage

WORKDIR /webtrax_build_cnt

COPY ./ .

RUN npm install

RUN npm run build

# ? RUN mkdir ./dist
# ? RUN mkdir ./dist/WebTrax
# ? RUN touch ./dist/WebTrax/index.html
# ? RUN echo "Quel cavolo che mi pare" > ./dist/WebTrax/index.html

# ┏━━┓
# ┗┓┓┣━┳━┳┓┏━┳┳┓
# ┏┻┛┃┻┫╋┃┗┫╋┃┃┃
# ┗━━┻━┫┏┻━┻━╋┓┃
# ╋╋╋╋╋┗┛╋╋╋╋┗━┛

FROM nginx:1.21-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /webtrax_build_cnt/dist/WebTrax /usr/share/nginx/html

