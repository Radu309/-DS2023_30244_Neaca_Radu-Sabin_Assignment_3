package com.example.user_service.config;

import com.example.user_service.model.Token;
import com.example.user_service.repository.TokenRepository;
import com.example.user_service.repository.UserRepository;
import com.example.user_service.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal
            (@NonNull HttpServletRequest request,
             @NonNull HttpServletResponse response,
             @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String email;
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authHeader.substring(7);
        if(tokenRepository.findByToken(jwt).isPresent()){
            if(!tokenRepository.findByToken(jwt).get().getDate().before(new Date(System.currentTimeMillis()))){
                email = jwtService.extractUsername(jwt);
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);
                    var isTokenValid = tokenRepository.findByToken(jwt)
                            .map(t -> !t.isExpired())
                            .orElse(false);
                    if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
                filterChain.doFilter(request, response);
            }
            else
                filterChain.doFilter(request, response);
        }else
            filterChain.doFilter(request, response);
    }
}
