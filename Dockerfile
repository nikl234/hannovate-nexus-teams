FROM ubuntu:latest

RUN apt update && apt upgrade -y
RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt install -y nodejs git

RUN npm install -g @microsoft/teamsapp-cli
RUN npm install -g @microsoft/teams-app-test-tool

WORKDIR /app
COPY . .

RUN echo $PATH
RUN ln /usr/bin/echo /usr/bin/xdg-open

CMD bash run.sh 

