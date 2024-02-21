package com.example.demo.cucumber;

import static org.junit.Assert.assertEquals;

import io.cucumber.java.en.When;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@CucumberContextConfiguration
@ActiveProfiles("test")
@SpringBootTest
public class CucumberSpringConfiguration {}
