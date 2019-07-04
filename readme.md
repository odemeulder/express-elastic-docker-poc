# Proof of concept Node + Express + Elasticsearch

## Set up elastic search

Start up application using `docker-compose`.
```bash
docker-compose up
```

Verify that application is running.
```bash
# web app
curl localhost:3000
# elastic search
curl localhost:9200/_cat/health
```

Need to create an index and bulk upload data. Including in this repo is a file with 1000 records. (`accounts.json`).
```bash
# create index named bank
curl -X PUT localhost:9200/bank
# bulk upload data
curl -H "Content-Type: application/json" \ 
-X POST "localhost:9200/bank/_bulk?pretty&refresh" \ 
--data-binary "@accounts.json"
# verify that data is uploaded
curl localhost:9200/_cat/indices
yellow open bank W75hjYY2TTC4l5y16WQV8A 1 1 1000 0 414.2kb 414.2kb
```
This show that we have one index with a 1000 records. The index health is yellow because we are not running a replica. [This page](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html) shows how to set up multiple replicas.