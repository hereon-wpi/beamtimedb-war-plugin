package de.hzg.wpi.xenv.beamtimedb;

import com.mongodb.async.client.MongoClient;
import com.mongodb.async.client.MongoDatabase;
import org.jboss.resteasy.core.ResteasyContext;

import javax.annotation.Priority;
import javax.servlet.ServletContext;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

/**
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 21.11.2019
 */
@Provider
@Priority(Priorities.USER + 200)
public class MongoDbProvider implements ContainerRequestFilter {

    public static final String BEAMTIME_DB = "beamtimedb";
    @Context
    public ServletContext context;

    @Override
    public void filter(ContainerRequestContext containerRequestContext) throws IOException {
        MongoClient mongoClient = (MongoClient) context.getAttribute(MongoClient.class.getSimpleName());
        MongoDatabase mongoDatabase = mongoClient.getDatabase(BEAMTIME_DB);
        // or provide custom MongoClientSettings
        ResteasyContext.pushContext(
                MongoDatabase.class,
                mongoDatabase);
    }
}
