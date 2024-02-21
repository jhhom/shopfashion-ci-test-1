package com.example.demo.services.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import javax.crypto.SecretKey;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtService {
  private final int sessionTimeInMinutes;

  private final SecretKey signingKey;

  private final String CLAIM_KEY_USER_ID = "userId";
  private final String CLAIM_KEY_USER_ROLE = "userRole";

  public JwtService(@Value("${jwt_key}") String jwtKey) {
    this.sessionTimeInMinutes = 24 * 60 * 3;

    this.signingKey = loadGeneratedKeyAsSigningKey(jwtKey);
  }

  public String toToken(String userEmail, Integer userId, UserRole userRole) {
    return Jwts.builder()
        .subject(userEmail)
        .claim(CLAIM_KEY_USER_ID, userId)
        .claim(CLAIM_KEY_USER_ROLE, userRole.toString())
        .expiration(expireTimeFromNow())
        .signWith(this.signingKey)
        .compact();
  }

  public Optional<DTO.User> getUserFromToken(String token) {
    try {
      Jws<Claims> claimsJws =
          Jwts.parser().verifyWith(this.signingKey).build().parseSignedClaims(token);

      var payload = claimsJws.getPayload();
      String userEmail = payload.getSubject();
      Object oUserId = payload.get(CLAIM_KEY_USER_ID);
      Object oUserRole = payload.get(CLAIM_KEY_USER_ROLE);

      Integer userId = null;
      UserRole userRole = null;

      if (oUserId instanceof Integer) {
        userId = (Integer) oUserId;
      }
      if (oUserRole instanceof String) {
        String sUserRole = (String) oUserRole;
        if (EnumUtils.isValidEnum(UserRole.class, sUserRole)) {
          userRole = UserRole.valueOf(sUserRole);
        }
      }

      if (userEmail == null || userId == null || userRole == null) {
        return Optional.empty();
      } else {
        return Optional.of(new DTO.User(userEmail, userId, userRole));
      }

    } catch (Exception e) {
      return Optional.empty();
    }
  }

  public Date expireTimeFromNow() {
    return new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(sessionTimeInMinutes));
  }

  public static void generateKey() {
    SecretKey key = Jwts.SIG.HS256.key().build();
    String secret = Encoders.BASE64.encode(key.getEncoded());
    System.out.println("Generated key: " + secret);
  }

  public static SecretKey loadGeneratedKeyAsSigningKey(String generatedKey) {
    SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(generatedKey));
    return key;
  }

  public static class DTO {
    public static record User(String userEmail, Integer userId, UserRole userRole) {}
  }

  public enum UserRole {
    ADMIN,
    CUSTOMER
  }
}
