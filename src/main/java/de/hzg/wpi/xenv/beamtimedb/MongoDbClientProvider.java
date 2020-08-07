package de.hzg.wpi.xenv.beamtimedb;

import com.mongodb.async.client.MongoClient;
import com.mongodb.async.client.MongoClients;
import org.jboss.resteasy.core.ResteasyContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Priority;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;

/**
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 20.11.2019
 */
@Priority(Priorities.USER + 100)
@Provider
@WebListener
public class MongoDbClientProvider implements ContainerRequestFilter, ServletContextListener {
    private final Logger logger = LoggerFactory.getLogger(MongoDbClientProvider.class);

    @Context
    public ServletContext context;

    @Override
    public void filter(ContainerRequestContext containerRequestContext) {
        MongoClient mongoClient = (MongoClient) context.getAttribute(MongoClient.class.getSimpleName());
        // or provide custom MongoClientSettings
        ResteasyContext.pushContext(
                MongoClient.class,
                mongoClient);
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        String mongodbHost = System.getenv("MONGODB_HOST");
        MongoClient mongoClient = MongoClients.create(String.format("mongodb://%s", mongodbHost));
        logger.info(String.format("MongoDB[%s] client has been created", mongodbHost));
        sce.getServletContext().setAttribute(MongoClient.class.getSimpleName(), mongoClient);

    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        String mongodbHost = sce.getServletContext().getInitParameter("mongodb.host");
        MongoClient mongoClient = (MongoClient) sce.getServletContext().getAttribute(MongoClient.class.getSimpleName());
        mongoClient.close();
        logger.info(String.format("MongoDB[%s] client has been closed", mongodbHost));
    }
}
