package com.example.demo.services.admin.generateproductvariant;

import com.google.common.collect.Iterables;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.ImmutablePair;

public class Util {

  public static <T> List<List<T>> cartesianProduct(int i, List<T>... a) {
    if (i == a.length) {
      List<List<T>> result = new ArrayList<>();
      result.add(new ArrayList<T>());
      return result;
    }
    List<List<T>> next = cartesianProduct(i + 1, a);
    List<List<T>> result = new ArrayList<>();
    for (int j = 0; j < a[i].size(); j++) {
      for (int k = 0; k < next.size(); k++) {
        List<T> concat = new ArrayList<T>();
        concat.add(a[i].get(j));
        concat.addAll(next.get(k));
        result.add(concat);
      }
    }
    return result;
  }

  // ArrayList<Util.Variant>
  public static List<Util.Variant> generateVariant(
      List<ImmutablePair<String, Map<Integer, String>>> options) {
    HashMap<String, Map<Integer, String>> optionNames = new HashMap<String, Map<Integer, String>>();
    options.forEach(
        o -> {
          optionNames.put(o.left, o.right);
        });

    List<List<ImmutablePair<String, Integer>>> optionChoices =
        options.stream()
            .map(
                o -> {
                  return o.right.keySet().stream()
                      .map(
                          v -> {
                            return ImmutablePair.of(o.left, v);
                          })
                      .toList();
                })
            .toList();

    if (options.size() == 0) {
      return new ArrayList<>();
    }

    System.out.println("OOPTION CHOICES");
    System.out.println(optionChoices);

    // var variants = cartesianProduct(0, optionChoices.get(0),
    // optionChoices.get(1));
    List<List<ImmutablePair<String, Integer>>> variants =
        cartesianProduct(0, Iterables.toArray(optionChoices, List.class));

    return variants.stream()
        .map(
            p -> {
              var resultOptions =
                  p.stream()
                      .map(
                          _p -> {
                            return new Variant.Option(_p.left, _p.right);
                          })
                      .toList();
              String name =
                  String.join(
                      "-", p.stream().map(o -> optionNames.get(o.left).get(o.right)).toList());

              return new Util.Variant(name, resultOptions);
            })
        .toList();
  }

  /**
   * Determine if 2 variants are equal by checking their options
   *
   * @param variant1 - First variant, defined as a list of OPTION CODE -> OPTION VALUE ID
   * @param operand2 - Second variant, defined a list of OPTION CODE -> OPTION VALUE ID
   * @return TRUE if 2 variants are equal, FALSE otherwise
   */
  public static boolean isVariantEqual(
      List<ImmutablePair<String, Integer>> variant1,
      List<ImmutablePair<String, Integer>> variant2) {
    for (var v1 : variant1) {
      if (!variant2.stream()
          .anyMatch(
              v2 -> {
                return v2.left.equals(v1.left) && v2.right.equals(v1.right);
              })) {
        return false;
      }
    }

    for (var v2 : variant2) {
      if (!variant1.stream()
          .anyMatch(
              v1 -> {
                return v1.left.equals(v2.left) && v1.right.equals(v2.right);
              })) {
        return false;
      }
    }

    return true;
  }

  public static List<String> checkForConflictingVariantNames(List<String> names) {
    var seenNames = new HashSet<String>();
    var repeatedNames = new HashSet<String>();

    names.forEach(
        n -> {
          if (seenNames.contains(n)) {
            repeatedNames.add(n);
          }
          seenNames.add(n);
        });

    return repeatedNames.stream().collect(Collectors.toList());
  }

  public static List<List<String>> getConflictingVariants(List<Variant> variants) {
    var variantsGroupedByOptions = groupVariantsOfSameOptions(variants);

    var conflicting = new ArrayList<List<String>>();

    for (Map.Entry<String, List<String>> entry : variantsGroupedByOptions.entrySet()) {
      if (entry.getValue().size() > 1) {
        conflicting.add(entry.getValue());
      }
    }

    return conflicting;
  }

  public static Map<String, List<String>> groupVariantsOfSameOptions(List<Variant> variants) {
    Map<String, List<String>> conflictingEntries = new HashMap<String, List<String>>();

    variants.forEach(
        v -> {
          var mapCodeToValues = new TreeMap<String, Integer>();
          v.options.forEach(
              c -> {
                mapCodeToValues.put(c.code, c.valueId);
              });
          var key = mapCodeToValues.toString();
          var conflictingEntry = conflictingEntries.get(key);
          if (conflictingEntry != null) {
            conflictingEntry.add(v.name);
          } else {
            var conflictingVariants = new ArrayList<String>();
            conflictingVariants.add(v.name);
            conflictingEntries.put(key, conflictingVariants);
          }
        });
    return conflictingEntries;
  }

  public static record Variant(@NotNull String name, @NotNull List<Option> options) {

    public static record Option(@NotNull String code, @NotNull Integer valueId) {}
  }
}
