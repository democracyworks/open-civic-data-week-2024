develop: clean build up

dev: develop

clean:
	docker compose rm -vf

build:
	docker compose build

up:
	docker compose up

shell:
	docker compose run open_civic_data_week_2024 \
		/bin/bash
