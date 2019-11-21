autocannon -c 1000 http://localhost:18080/beamtimedb/api/beamtimes/11006704

autocannon -c 1000 -m POST -H "Content-Type:application/json" -b "{\"beamtimeId\":\"11006704\"}" http://localhost:18080/beamtimedb/api/beamtimes