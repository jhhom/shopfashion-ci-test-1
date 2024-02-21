package com.example.demo.config;

import com.example.demo.logging.ApplicationLogger;
import com.example.demo.logging.Log;
import com.example.demo.logging.RequestId;
import org.jooq.DSLContext;
import org.jooq.ExecuteContext;
import org.jooq.ExecuteListener;
import org.jooq.SQLDialect;
import org.jooq.conf.Settings;
import org.jooq.impl.DSL;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator;
import org.springframework.jdbc.support.SQLExceptionTranslator;

public class JooqExecuteListener implements ExecuteListener {
  @Autowired private RequestId requestId;

  @Autowired private ApplicationLogger logger;

  /** Hook into the query execution lifecycle before executing queries */
  @Override
  public void executeStart(ExecuteContext ctx) {

    // Create a new DSLContext for logging rendering purposes
    // This DSLContext doesn't need a connection, only the SQLDialect...
    DSLContext create =
        DSL.using(
            ctx.dialect(),

            // ... and the flag for pretty-printing
            new Settings().withRenderFormatted(true));

    // If we're executing a query
    if (ctx.query() != null) {
      logger.log(new Log.InfoSQLQuery(requestId, create.renderInlined(ctx.query())));

    } else if (ctx.routine() != null) {
      logger.log(new Log.InfoSQLQuery(requestId, create.renderInlined(ctx.routine())));
    }
  }

  public void exception(ExecuteContext context) {
    SQLDialect dialect = context.configuration().dialect();
    SQLExceptionTranslator translator = new SQLErrorCodeSQLExceptionTranslator(dialect.name());
    context.exception(
        translator.translate("Access database using Jooq", context.sql(), context.sqlException()));
  }
}
