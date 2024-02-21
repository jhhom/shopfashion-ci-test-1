package com.example.demo.example;

import static com.example.demo.jooqmodels.Tables.CUSTOMERS;
import static org.mockito.Mockito.when;

import com.example.demo.services.common.JwtService;
import com.example.demo.services.common.JwtService.DTO.User;
import com.example.demo.services.common.JwtService.UserRole;
import java.util.Optional;
import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public abstract class TestWithCurrentCustomer {

  @Autowired protected DSLContext ctx;

  @MockBean protected JwtService jwtService;

  protected String token = "james";
  protected String authHeader = "Bearer " + token;
  protected String email = "james@example.com";
  protected Integer customerId;

  protected void setupCustomerFixture() {
    customerId =
        ctx.insertInto(CUSTOMERS)
            .columns(CUSTOMERS.EMAIL, CUSTOMERS.PASSWORD)
            .values(email, "james123")
            .returning(CUSTOMERS.ID)
            .fetchOne(x -> x.getId());

    User user = new User(email, customerId, UserRole.CUSTOMER);

    when(jwtService.getUserFromToken(token)).thenReturn(Optional.of(user));
  }

  @BeforeEach
  public void setup() throws Exception {
    setupCustomerFixture();
  }
}
