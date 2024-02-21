package com.example.demo.cucumber;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class VersionStepDefinitions {

  @When("^the client calls /version$")
  public void the_client_issues_GET_version() throws Throwable {
    System.out.println("🔥 HOLY SHIT!!");
  }

  @Then("the client receives status code of {int}")
  public void the_client_receives_status_code_of(int statusCode) throws Throwable {
    System.out.println("🔥 HOLY SHIT!!");
    assertEquals(statusCode, 200);
  }
}
