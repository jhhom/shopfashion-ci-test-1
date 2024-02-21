package com.example.demo.scripts;

import java.nio.file.Files;
import java.nio.file.Path;
import org.jooq.codegen.GenerationTool;

public class GenerateJooqModels {
  public static void main(String[] args) {
    try {
      GenerationTool.generate(Files.readString(Path.of("jooq-config.xml")));
    } catch (Exception e) {
      System.out.println(e);
    }
  }
}
