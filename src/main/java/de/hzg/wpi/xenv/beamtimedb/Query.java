package de.hzg.wpi.xenv.beamtimedb;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 20.11.2019
 */
@Path("/query")
public class Query {

    @GET
    public Response get(){
        return Response.ok("Hi!").build();
    }
}
