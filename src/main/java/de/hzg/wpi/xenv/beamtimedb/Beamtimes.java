package de.hzg.wpi.xenv.beamtimedb;

import com.google.common.collect.Lists;
import com.mongodb.async.client.MongoDatabase;
import org.bson.BsonDocument;
import org.bson.BsonString;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.jboss.resteasy.annotations.GZIP;
import org.jboss.resteasy.core.ResteasyContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
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
@Path("/beamtimes")
@Produces(APPLICATION_JSON)
public class Beamtimes {
    private final Logger logger = LoggerFactory.getLogger(Beamtimes.class);

    @GET
    @GZIP
    public void get(@Context MongoDatabase mongoClient, @Suspended final AsyncResponse response){
        List<Document> result = Lists.newArrayList();
        mongoClient.getCollection("beamtimes")
                .find()
                .map(document ->
                        new Document("id", document.get("_id").toString())
                                .append("beamtimeId", document.getString("beamtimeId"))
                                .append("applicant", ((Document) document.get("applicant")).getString("username"))
                                .append("leader", ((Document) document.get("leader")).getString("username"))
                                .append("pi", ((Document) document.get("pi")).getString("username"))
                )
                .into(result,
                (aVoid, throwable) -> {
                    logger.debug("Done!");
                    response.resume(result);
        });
    }

    @POST
    @GZIP
    @Consumes(APPLICATION_JSON)
    public void query(@Context MongoDatabase mongoClient,
                    @Suspended final AsyncResponse response,
                      Bson query){
        List<String> result = Lists.newArrayList();
        mongoClient.getCollection("beamtimes")
                .find(query)
                .map(document -> {
                    document.put("id", document.get("_id").toString());
                    return document;
                })
                .map(Document::toJson)
                .into(result,
                        (aVoid, throwable) -> {
                            logger.debug("Done!");
                            response.resume(result);
                        });
    }

    @GET
    @GZIP
    @Path("/{id}")
    public void getBeamtime(@PathParam("id") String id,
                            @Suspended final AsyncResponse response) {
        Bson filter = new BsonDocument("beamtimeId", new BsonString(id));

        final MongoDatabase finalMongoDatabase = ResteasyContext.getContextData(MongoDatabase.class);

        finalMongoDatabase.getCollection("beamtimes")
                .find(filter)
                .map(document -> {
                    document.put("id", document.get("_id").toString());
                    return document;
                })
                .map(Document::toJson)
                .first((result, throwable) -> {
                    if (result == null) {
                        response.resume(Response.status(Response.Status.NOT_FOUND).entity(
                                new Object(){
                                    public String error = String.format("Beamtime with ID=%s was not found in %s",id,finalMongoDatabase.getName());
                                }
                        ).build());

                    } else {
                        logger.debug("Done!");
                        response.resume(result);
                    }
                });

    }

}
