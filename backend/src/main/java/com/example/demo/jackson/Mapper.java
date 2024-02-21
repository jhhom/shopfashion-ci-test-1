package com.example.demo.jackson;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.module.SimpleModule;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Mapper {
  public static ObjectWriter createMapper() {
    ObjectMapper mapper = new ObjectMapper();

    final SimpleModule localDateTimeSerialization = new SimpleModule();
    localDateTimeSerialization.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer());
    localDateTimeSerialization.addDeserializer(
        LocalDateTime.class, new LocalDateTimeDeserializer());

    final SimpleModule localDateSerialization = new SimpleModule();
    localDateSerialization.addSerializer(LocalDate.class, new LocalDateSerializer());
    localDateSerialization.addDeserializer(LocalDate.class, new LocalDateDeserializer());

    mapper.registerModule(localDateTimeSerialization);
    mapper.registerModule(localDateSerialization);

    return mapper.writerWithDefaultPrettyPrinter();
  }
}
