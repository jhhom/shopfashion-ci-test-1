package com.example.demo.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Validator;
import java.beans.PropertyEditorSupport;
import org.springframework.util.StringUtils;

public class QueryEditor<T extends Object> extends PropertyEditorSupport {
  private ObjectMapper objectMapper;
  private final Validator validator;
  private final Class<T> editorClass;

  public QueryEditor(ObjectMapper objectMapper, Validator validator, Class<T> editorClass) {
    this.objectMapper = objectMapper;
    this.validator = validator;
    this.editorClass = editorClass;
  }

  @Override
  public void setAsText(String text) throws IllegalArgumentException {
    if (!StringUtils.hasText(text)) {
      setValue(null);
    } else {
      T query;
      try {
        query = objectMapper.readValue(text, editorClass);
        var violations = validator.validate(query);

        if (violations.size() != 0) {
          throw new RuntimeException("name is blank!!");
        }
      } catch (JsonProcessingException e) {
        throw new IllegalArgumentException(e);
      }
      setValue(query);
    }
  }
}
