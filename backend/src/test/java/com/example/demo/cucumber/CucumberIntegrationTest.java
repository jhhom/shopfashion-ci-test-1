package com.example.demo.cucumber;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import io.cucumber.spring.CucumberContextConfiguration;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    plugin = {"pretty", "html:target/cucumber/shopfashion"})
public class CucumberIntegrationTest {}
