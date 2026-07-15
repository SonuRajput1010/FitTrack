package com.Fitness.gateway;

import com.Fitness.gateway.user.RegisterRequest;
import com.Fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String USER_ID_HEADER = "X-USER-ID";
    private static final String BEARER_PREFIX = "Bearer ";

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst(AUTHORIZATION_HEADER);
        RegisterRequest registerRequest = extractUserDetailsFromToken(token);

        if (registerRequest == null || registerRequest.getKeycloakId() == null) {
            return chain.filter(exchange);
        }

        String userId = registerRequest.getKeycloakId();

        return userService.validateUser(userId)
                .flatMap(userExists -> {
                    if (!userExists) {
                        log.info("User not found in User Service. Syncing user. keycloakId={}", userId);
                        return userService.registerUser(registerRequest).thenReturn(true);
                    }

                    log.info("User already exists. Skipping sync. keycloakId={}", userId);
                    return Mono.just(true);
                })
                .onErrorResume(error -> {
                    log.error("User sync failed. Continuing request. keycloakId={}", userId, error);
                    return Mono.just(false);
                })
                .then(Mono.defer(() -> {
                    ServerHttpRequest mutatedRequest = exchange.getRequest()
                            .mutate()
                            .header(USER_ID_HEADER, userId)
                            .build();

                    ServerWebExchange mutatedExchange = exchange
                            .mutate()
                            .request(mutatedRequest)
                            .build();

                    return chain.filter(mutatedExchange);
                }));
    }

    private RegisterRequest extractUserDetailsFromToken(String token) {
        try {
            if (token == null || !token.startsWith(BEARER_PREFIX)) {
                return null;
            }

            String tokenWithoutBearer = token.replace(BEARER_PREFIX, "").trim();

            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();

            registerRequest.setKeycloakId(claims.getSubject());
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));

            return registerRequest;
        } catch (Exception exception) {
            log.error("Failed to extract user details from JWT", exception);
            return null;
        }
    }
}