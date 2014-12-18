package org.openhim.mediator;

import akka.actor.ActorSystem;
import akka.event.Logging;
import akka.event.LoggingAdapter;
import org.openhim.mediator.engine.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class MediatorMain {

    private static RoutingTable buildRoutingTable() throws RoutingTable.RouteAlreadyMappedException {
        RoutingTable routingTable = new RoutingTable();

        //TODO Configure routes here
        //...
        routingTable.addRoute("/mediator", DefaultOrchestrator.class);

        return routingTable;
    }

    private static StartupActorsConfig buildStartupActorsConfig() {
        StartupActorsConfig startupActors = new StartupActorsConfig();

        //TODO Add own startup actors here
        //...

        return startupActors;
    }

    private static MediatorConfig setupConfig() throws IOException, RoutingTable.RouteAlreadyMappedException {
        InputStream propsStream = MediatorMain.class.getClassLoader().getResourceAsStream("mediator.properties");
        Properties props = new Properties();
        props.load(propsStream);
        propsStream.close();

        MediatorConfig config = new MediatorConfig(
                props.getProperty("mediator.name"),
                props.getProperty("mediator.host"),
                Integer.parseInt(props.getProperty("mediator.port"))
        );

        config.setProperties(props);

        if (props.getProperty("mediator.timeout") != null) {
            config.setRootTimeout(Integer.parseInt(props.getProperty("mediator.timeout")));
        }

        config.setCoreHost(props.getProperty("core.host"));
        config.setCoreAPIUsername(props.getProperty("core.api.user"));
        config.setCoreAPIPassword(props.getProperty("core.api.password"));
        if (props.getProperty("core.api.port") != null) {
            config.setCoreAPIPort(Integer.parseInt(props.getProperty("core.api.port")));
        }

        config.setRoutingTable(buildRoutingTable());
        config.setStartupActors(buildStartupActorsConfig());

        InputStream regInfo = MediatorMain.class.getClassLoader().getResourceAsStream("mediator-registration-info.json");
        RegistrationConfig regConfig = new RegistrationConfig(regInfo);
        config.setRegistrationConfig(regConfig);

        return config;
    }

    public static void main(String... args) throws Exception {
        //setup actor system
        final ActorSystem system = ActorSystem.create("mediator");
        //setup logger for main
        final LoggingAdapter log = Logging.getLogger(system, "main");

        //setup actors
        log.info("Initializing mediator actors...");

        MediatorConfig config = setupConfig();
        final MediatorServer server = new MediatorServer(system, config);

        //setup shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                log.info("Shutting down mediator");
                server.stop();
                system.shutdown();
            }
        });

        log.info("Starting mediator server...");
        server.start();

        log.info(String.format("%s listening on %s:%s", config.getName(), config.getServerHost(), config.getServerPort()));
        while (true) {
            System.in.read();
        }
    }
}
