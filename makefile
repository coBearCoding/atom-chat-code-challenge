build:
	docker compose stop
	docker compose build
	docker compose up -d

run:
	docker compose stop
	docker compose up -d

stop:
	docker compose down



# * Linux support
build-linux:
	docker-compose down
	docker-compose build
	docker-compose up -d

run-linux:
	docker-compose down
	docker-compose up -d

stop-linux:
	docker-compose down