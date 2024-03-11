package com.example.demo.config;

import com.example.demo.filters.AuthorizationFilter;
import com.example.demo.filters.HttpLoggingFilter;
import com.example.demo.services.common.JwtService.UserRole;
import java.util.ArrayList;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public AuthorizationFilter authorizationFilter() {
    return new AuthorizationFilter();
  }

  @Bean
  public HttpLoggingFilter httpLoggingFilter() {
    return new HttpLoggingFilter();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    var config = new CorsConfiguration().applyPermitDefaultValues();
    config.setAllowedMethods(
        new ArrayList<>() {
          {
            add("*");
          }
        });
    config.setAllowedOrigins(
        new ArrayList<>() {
          {
            add("*");
          }
        });

    return http.cors(x -> x.configurationSource(req -> config))
        .csrf(x -> x.disable())
        .authorizeHttpRequests(
            authorize ->
                authorize
                    .requestMatchers("store/customers/**")
                    .hasRole(UserRole.CUSTOMER.name())
                    .requestMatchers("admin/**")
                    .hasRole(UserRole.ADMIN.name())
                    .anyRequest()
                    .permitAll())
        .addFilterBefore(httpLoggingFilter(), UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(authorizationFilter(), HttpLoggingFilter.class)
        .build();
  }
}
