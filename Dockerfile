FROM ubuntu:latest AS BUILDER

ARG DEBIAN_FRONTEND="noninteractive"

ENV NODE_ENV=development

# * Install NodeJS 18.
RUN apt update -y && \
    apt install wget -y

RUN wget -qO- https://deb.nodesource.com/setup_18.x | bash - &&\
    apt update -y && apt install nodejs -y

WORKDIR /app/atom-chat-code-challenge

COPY . .

RUN npm install && \
    npm run build

# * Stage 2

FROM ubuntu:latest AS FINAL

# * Install NodeJS 18.
RUN apt update -y && \
    apt install wget -y

RUN wget -qO- https://deb.nodesource.com/setup_18.x | bash - &&\
    apt update -y && apt install nodejs -y

WORKDIR /app/atom-chat-code-challenge

COPY --from=BUILDER /app/atom-chat-code-challenge/dist ./dist

COPY package.json .

COPY config/firebase/firebase-credentials.json ./dist/config/firebase/firebase-credentials.json

RUN npm install --omit=dev

CMD ["npm", "start"]