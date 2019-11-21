package de.hzg.wpi.xenv.beamtimedb;

import com.google.common.collect.Lists;
import com.mongodb.async.client.MongoClient;
import org.jboss.resteasy.annotations.GZIP;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import java.util.List;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

/**
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 20.11.2019
 */
@Path("/query")
@Produces(APPLICATION_JSON)
public class Query {

    @GET
    @GZIP
    @Path("/list-databases")
    public void get(@Context MongoClient mongoClient, @Suspended final AsyncResponse response){
        List<String> result = Lists.newArrayList();
        mongoClient.listDatabaseNames()
                .forEach(result::add,
                        (aVoid, throwable) -> {
                            response.resume(result);
                        });
    }
}
