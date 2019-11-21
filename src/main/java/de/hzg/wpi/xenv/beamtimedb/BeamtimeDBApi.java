package de.hzg.wpi.xenv.beamtimedb;

import com.google.common.collect.Sets;

import javax.servlet.ServletContext;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Context;
import java.util.Set;

/**
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 20.11.2019
 */
@ApplicationPath("/api")
public class BeamtimeDBApi extends Application {
    @Context
    public ServletContext context;


//    @Override
//    public Set<Object> getSingletons() {
//
//        super.getSingletons().add(new MongoDbClientProvider(context));
//
//        return super.getSingletons();
//    }
}
