package com.conecta.sorteio_api.configuration.security;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import com.conecta.sorteio_api.service.JwtService;
import com.conecta.sorteio_api.userSecurity.UserAuthService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class SecurityFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserAuthService userAuthService;

    public SecurityFilter(JwtService jwtService, UserAuthService userAuthService) {
        this.jwtService = jwtService;
        this.userAuthService = userAuthService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("é protegido " + getEndpoints(request));
        if (getEndpoints(request)) {

            String tokenFromRequest = getTokenFromRequest(request);

            if (tokenFromRequest != null) {
                try {
                    String userEmail = jwtService.validateToken(tokenFromRequest);

                    if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails user = userAuthService.loadUserByUsername(userEmail);
                        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(),
                                null, user.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } catch (Exception e) {
                    SecurityContextHolder.clearContext();
                }
            }
        }

        filterChain.doFilter(request, response);

    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String url = request.getHeader("Authorization");
        String token = null;

        if (url != null && url.startsWith("Bearer")) {
            token = url.replace("Bearer", "").trim();
        }

        if (request.getCookies() != null && token == null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equalsIgnoreCase("token")) {
                    token = cookie.getValue();
                }
            }
        }

        return token;

    }

    private boolean getEndpoints(HttpServletRequest servletRequest) {
        String endpoint = servletRequest.getRequestURI();
        System.out.println("Url vinda " + endpoint);

        String[] publicEndpoints = {
                "/login",
                "/register",
                "/forgot-password",
                "/api/webhook/kiwify",
                "/authentication/login",
                "/authentication/register",
                "/h2-console",
                "/style",
                "/js",
                "/images",
                "/fonts",
                "/api/password/send-code",
                "/api/password/reset",
                "api/password/validate-code",
                "/css/",
                "/api/login",
                "/api/register",

                
                "/ws",
                "/ws/", 
                "/app",
                "/topic"
        };

        return Arrays.stream(publicEndpoints).noneMatch(endpoint::startsWith);
    }

}
