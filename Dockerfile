FROM tomcat:9-jdk14

MAINTAINER igor.khokhriakov@hzg.de

RUN apt-get update && apt-get install -y ssl-cert libtcnative-1

COPY target/beamtimedb.war /usr/local/tomcat/webapps/beamtimedb.war

COPY docker/server.xml \
     /usr/local/tomcat/conf/

ENV MONGODB_HOST=hzgxenvtest.desy.de