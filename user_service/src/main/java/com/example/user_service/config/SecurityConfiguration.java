package com.example.user_service.config;

import com.example.user_service.model.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // this line configures Cross-Origin Resource Sharing (CORS) and disables Cross-Site Request Forgery (CSRF) protection. It allows requests from different origins and disables CSRF protection since the application is using JWT-based authentication, which is stateless and does not rely on CSRF tokens.
                // You are using another token mechanism. You want to simplify interactions between a client and the server(so...disable csrf).
                .csrf(AbstractHttpConfigurer::disable)
                // initiates the configuration of authorization rules for incoming requests.
                .authorizeHttpRequests((authorize) -> authorize
//                        .requestMatchers("/user/**").hasRole(UserRole.ADMIN.name())
//                        .requestMatchers("/device/**").hasRole(UserRole.ADMIN.name())
//                        .requestMatchers("/device/find/**").hasAnyRole(UserRole.CLIENT.name(),UserRole.ADMIN.name())
//                        .requestMatchers("/login/**").permitAll()
                        .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated()
                )
                // configuration the session management, This means that the application will not create or use HTTP session for storing user state
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                // sets the custom authentication provider to be used for authenticating users
                .authenticationProvider(authenticationProvider)
                // this filter will process JWT-based authentication for incoming requests.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
