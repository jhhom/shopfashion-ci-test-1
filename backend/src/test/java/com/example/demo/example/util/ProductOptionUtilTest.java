package com.example.demo.example.util;

import com.example.demo.services.admin.generateproductvariant.GenerateProductVariantService;
import com.example.demo.services.admin.generateproductvariant.Util;
import com.example.demo.services.admin.productoptions.ProductOptionsDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.junit.jupiter.api.Test;

public class ProductOptionUtilTest {
  @Test
  void testFindPositionsToUpdate() throws JsonProcessingException {
    ObjectMapper om = new ObjectMapper();

    List<ProductOptionsDTO.OptionPosition> currentPositions =
        new ArrayList<>() {
          {
            add(new ProductOptionsDTO.OptionPosition("skirts_color", 1));
            add(new ProductOptionsDTO.OptionPosition("shorts_color", 2));
            add(new ProductOptionsDTO.OptionPosition("jeans_color", 3));
            add(new ProductOptionsDTO.OptionPosition("shirts_color", 4));
            add(new ProductOptionsDTO.OptionPosition("jackets_color", 5));
          }
        };

    var positionsToUpdate =
        com.example.demo.services.admin.productoptions.Util.findPositionsToUpdateGivenPositionToInsert(
            currentPositions, 1);
    String s = om.writerWithDefaultPrettyPrinter().writeValueAsString(positionsToUpdate);
    System.out.println(s);
  }

  @Test
  void testGenerateProductVariantFilter() throws JsonProcessingException {
    var red = new Util.Variant.Option("color", 1);
    var blue = new Util.Variant.Option("color", 2);
    var sizeS = new Util.Variant.Option("size", 3);
    var sizeM = new Util.Variant.Option("size", 4);

    ObjectWriter ow = new ObjectMapper().writerWithDefaultPrettyPrinter();

    var optionRedS =
        new ArrayList<Util.Variant.Option>() {
          {
            add(red);
            add(sizeS);
          }
        };

    var optionRedM =
        new ArrayList<Util.Variant.Option>() {
          {
            add(red);
            add(sizeS);
          }
        };

    var optionBlueS =
        new ArrayList<Util.Variant.Option>() {
          {
            add(blue);
            add(sizeS);
          }
        };

    var optionBlueM =
        new ArrayList<Util.Variant.Option>() {
          {
            add(blue);
            add(sizeM);
          }
        };

    List<Util.Variant> possibleVariants =
        new ArrayList<>() {
          {
            add(new Util.Variant("Red S", optionRedS));
            add(new Util.Variant("Red M", optionRedM));
            add(new Util.Variant("Blue S", optionBlueS));
            add(new Util.Variant("Blue M", optionBlueM));
          }
        };

    List<GenerateProductVariantService.DTO.GenerateProductVariant.Result.ExistingProductVariant>
        existingVariants =
            new ArrayList<>() {
              {
                add(
                    new GenerateProductVariantService.DTO
                        .GenerateProductVariant
                        .Result
                        .ExistingProductVariant(1, "Red-S", optionRedS));
                add(
                    new GenerateProductVariantService.DTO
                        .GenerateProductVariant
                        .Result
                        .ExistingProductVariant(1, "Red-M", optionRedM));
                add(
                    new GenerateProductVariantService.DTO
                        .GenerateProductVariant
                        .Result
                        .ExistingProductVariant(1, "Blue-S", optionBlueS));
              }
            };

    var possibleVariantsWithoutExistingVariants =
        possibleVariants.stream()
            .filter(
                possibleVariant -> {
                  return !existingVariants.stream()
                      .anyMatch(
                          existing -> {
                            var firstVariant =
                                existing.options().stream()
                                    .map(
                                        x -> {
                                          return ImmutablePair.of(x.code(), x.valueId());
                                        })
                                    .toList();
                            var secondVariant =
                                possibleVariant.options().stream()
                                    .map(
                                        x -> {
                                          return ImmutablePair.of(x.code(), x.valueId());
                                        })
                                    .toList();
                            return Util.isVariantEqual(firstVariant, secondVariant);
                          });
                })
            .toList();

    System.out.println(ow.writeValueAsString(possibleVariantsWithoutExistingVariants));
  }
}
