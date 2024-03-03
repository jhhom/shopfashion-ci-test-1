package com.example.demo.logging;

import org.slf4j.Logger;
import org.springframework.stereotype.Component;

@Component
public class ApplicationLogger {
  private final Logger logger;

  public ApplicationLogger(Logger logger) {
    this.logger = logger;
  }

  public void log(Log.InfoSQLQuery sqlLog) {
    logger
        .atInfo()
        .addKeyValue("application_log", true)
        .addKeyValue("info", sqlLog)
        .log("new sql query");
  }

  public void log(Log.InfoHttpRequest requestLog) {
    logger
        .atInfo()
        .addKeyValue("application_log", true)
        .addKeyValue("info", requestLog)
        .log("http request");
  }

  public void log(Log.InfoHttpResponse responseLog) {
    logger
        .atInfo()
        .addKeyValue("application_log", true)
        .addKeyValue("info", responseLog)
        .log("http response");
  }

  public void log(Log.InfoMethodArgumentInvalidException argInvalidLog) {
    logger
        .atWarn()
        .addKeyValue("application_log", true)
        .addKeyValue("info", argInvalidLog)
        .log("http invalid argument");
  }

  public void log(Log.InfoApplicationException appExceptionLog) {
    logger
        .atInfo()
        .addKeyValue("application_log", true)
        .addKeyValue("info", appExceptionLog)
        .log("application exception");
  }

  public void log(Log.InfoUnexpectedException unexpectedExceptionLog) {
    logger
        .atError()
        .addKeyValue("application_log", true)
        .addKeyValue("info", unexpectedExceptionLog)
        .log("unexpected exception");
  }

  // custom log for business event
  public void log(Log.InfoCustom customLog, String message) {
    logger
        .atInfo()
        .addKeyValue("application_log", true)
        .addKeyValue("info", customLog)
        .log(message);
  }

  public void log(Log.InfoCustom customLog, String message, boolean debug) {
    if (debug) {
      logger
          .atDebug()
          .addKeyValue("application_log", true)
          .addKeyValue("info", customLog)
          .log(message);
    } else {
      logger
          .atInfo()
          .addKeyValue("application_log", true)
          .addKeyValue("info", customLog)
          .log(message);
    }
  }
}
