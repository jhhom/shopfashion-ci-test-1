package com.example.demo.example.util;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;

public class IsOnlyDigitsMatcher {
  public static Matcher<String> onlyDigits() {
    return new IsOnlyDigitsMatcher.IsOnlyDigits();
  }

  public static class IsOnlyDigits extends TypeSafeMatcher<String> {

    @Override
    protected boolean matchesSafely(String s) {
      try {
        Integer.parseInt(s);
        return true;
      } catch (NumberFormatException nfe) {
        return false;
      }
    }

    @Override
    public void describeTo(Description description) {
      description.appendText("only digits");
    }
  }
}
