package com.example.demo.config;

import com.example.demo.logging.RequestId;
import java.sql.Connection;
import java.sql.DriverManager;
import javax.sql.DataSource;
import org.apache.commons.lang3.RandomStringUtils;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.conf.Settings;
import org.jooq.impl.DSL;
import org.jooq.impl.DataSourceConnectionProvider;
import org.jooq.impl.DefaultConfiguration;
import org.jooq.impl.DefaultDSLContext;
import org.jooq.impl.DefaultExecuteListenerProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.context.annotation.RequestScope;

@Configuration
public class ProjectConfig {
  // @Autowired private DataSource dataSource;

  @Value("${spring.datasource.url}")
  private String dataSourceUrl;

  @Value("${spring.datasource.e2e.url}")
  private String e2eDataSourceUrl;

  @Value("${environment.e2e:#{false}}")
  public Boolean isE2EEnvironment;

  @Bean
  public DataSource dataSource() {
    DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
    dataSourceBuilder.driverClassName("org.postgresql.Driver");
    if (isE2EEnvironment != null && isE2EEnvironment) {
      dataSourceBuilder.url(e2eDataSourceUrl);
    } else {
      dataSourceBuilder.url(dataSourceUrl);
    }
    dataSourceBuilder.username("postgres");
    return dataSourceBuilder.build();
  }

  @Bean
  public DataSourceConnectionProvider connectionProvider() {
    return new DataSourceConnectionProvider(new TransactionAwareDataSourceProxy(dataSource()));
  }

  @Bean
  public DefaultDSLContext dsl() {
    return new DefaultDSLContext(configuration());
  }

  public DefaultConfiguration configuration() {
    Settings settings = new Settings().withExecuteLogging(true); // Defaults to true

    DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
    jooqConfiguration.set(connectionProvider());
    jooqConfiguration.set(new DefaultExecuteListenerProvider((jooqExecuteListener())));
    jooqConfiguration.set(SQLDialect.POSTGRES);
    jooqConfiguration.set(settings);

    return jooqConfiguration;
  }

  @Bean
  public JooqExecuteListener jooqExecuteListener() {
    return new JooqExecuteListener();
  }

  @Bean
  public Logger logger() {
    return LoggerFactory.getLogger("api");
  }

  @Bean
  @RequestScope
  public RequestId requestId() {
    return new RequestId(RandomStringUtils.randomAlphanumeric(12));
  }
}
