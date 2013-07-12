NODE_ENV:=test
MONGOLAB_DEVICES_URL:=mongodb://localhost:27017/devices_test
MONGOLAB_PEOPLE_URL:=mongodb://localhost:27017/people_test
MONGOLAB_JOBS_URL:=mongodb://localhost:27017/jobs_test
#DEBUG:=lelylan

NODE_PORT:=18003

ENV:=NODE_ENV=${NODE_ENV} MONGOLAB_DEVICES_URL=${MONGOLAB_DEVICES_URL} MONGOLAB_PEOPLE_URL=${MONGOLAB_PEOPLE_URL} MONGOLAB_JOBS_URL=${MONGOLAB_JOBS_URL} DEBUG=${DEBUG} NODE_PORT=${NODE_PORT}

test:
	${ENV} ./node_modules/.bin/mocha --recursive test

bail:
	${ENV} ./node_modules/.bin/mocha --recursive test --bail --reporter spec

ci:
	${ENV} ./node_modules/.bin/mocha --recursive --watch test

.PHONY: test
