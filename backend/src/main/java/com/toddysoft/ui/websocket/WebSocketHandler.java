
package com.toddysoft.ui.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toddysoft.ui.security.entity.User;
import com.toddysoft.ui.security.service.JwtService;
import com.toddysoft.ui.security.service.UsersService;
import com.toddysoft.ui.websocket.event.LogoutEvent;
import com.toddysoft.ui.websocket.event.UiApplicationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.lang.Nullable;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler implements org.springframework.web.socket.WebSocketHandler {

    Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);

    private final Map<String, SessionContainer> openSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final JwtService jwtService;
    private final UsersService usersService;

    public WebSocketHandler(JwtService jwtService, UsersService usersService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
    }

    /**
     * ApplicationEvent listener forwarding all ApplicationEvents from this application to all connected clients.
     * @param uiApplicationEvent event that we want to be forwarded.
     */
    @EventListener
    public void onApplicationEvent(UiApplicationEvent<?> uiApplicationEvent) {
        openSessions.forEach((s, sessionContainer) -> {
            // TODO: Do the check if this user is allowed to receive the message.
            try {
                sessionContainer.getSession().sendMessage(new TextMessage(objectMapper.writeValueAsString(uiApplicationEvent)));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    /**
     * Register a new web-socket session.
     * @param session the new web-socket session.
     */
    @Override
    public void afterConnectionEstablished(@Nullable WebSocketSession session) throws Exception {
        if((session != null) && (session.getUri() != null)) {
            MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUri(session.getUri()).build().getQueryParams();
            String token = queryParams.getFirst("token");
            if(token == null) {
                logger.warn("Missing 'token' query parameter");
                throw new Exception("Missing 'token' query parameter");
            }
            String username = jwtService.extractUsername(token);
            Optional<User> userOptional = usersService.readByUsername(username);
            if(userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<SessionContainer> existingSessionContainer = openSessions.values().stream().filter(sessionContainer -> sessionContainer.getUser().getId().equals(user.getId())).findFirst();
                // One user can only be online from one client at the same time,
                // If a session for a user is already established, send a logout event
                // to that session and then close it before creating a new session.
                if(existingSessionContainer.isPresent()) {
                    WebSocketSession existingSession = existingSessionContainer.get().getSession();
                    try {
                        // Send a logout event.
                        existingSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(new LogoutEvent(user.getUsername()))));
                        // Close the session.
                        existingSession.close(CloseStatus.POLICY_VIOLATION);

                        logger.info("Logging out user {} from pre-existing session", user.getUsername());
                    } catch (IOException e) {
                        logger.warn("Got error logging out the existing session", e);
                    }
                }
                openSessions.put(session.getId(), new SessionContainer(session, user));
            } else {
                logger.warn("Couldn't find user with name {}", username);
                throw new Exception("Couldn't find user with name " + username);
            }
        }
    }

    /**
     * Remove a web-socket session from the list.
     * @param session the web-socket session we want to remove
     * @param closeStatus the status of the closed session
     */
    @Override
    public void afterConnectionClosed(@Nullable WebSocketSession session, @Nullable CloseStatus closeStatus) {
        if((session != null) && (closeStatus != null)) {
            openSessions.remove(session.getId());
        }
    }

    /**
     * Handle an incoming message on the web-socket session
     * (this should actually not happen, as we only use the web-sockets for server-to-client communication)
     * @param session the web-socket session the message is coming in on
     * @param message the message
     */
    @Override
    public void handleMessage(@Nullable WebSocketSession session, @Nullable WebSocketMessage<?> message) {
        System.out.println("handleMessage");
    }

    /**
     * Callback for handling transport errors.
     * @param session the web-socket session causing the error
     * @param exception the error that happened
     */
    @Override
    public void handleTransportError(@Nullable WebSocketSession session, @Nullable Throwable exception) {
        System.out.println("handleTransportError");
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    public static class SessionContainer {
        private final WebSocketSession session;
        private final User user;

        public SessionContainer(WebSocketSession session, User user) {
            this.session = session;
            this.user = user;
        }

        public WebSocketSession getSession() {
            return session;
        }

        public User getUser() {
            return user;
        }
    }

}
