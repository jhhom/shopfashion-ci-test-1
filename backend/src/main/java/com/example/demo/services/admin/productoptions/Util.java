package com.example.demo.services.admin.productoptions;

import java.util.ArrayList;
import java.util.List;

public class Util {

  public static List<ProductOptionsDTO.OptionPosition> findPositionsToUpdateGivenPositionToInsert(
      List<ProductOptionsDTO.OptionPosition> currentPositions, int toInsertPosition) {
    // 1. check if current positions has conflict, if no just return empty array, if
    // yes, get all the positions that are bigger than to insert
    var hasConflictingPos = currentPositions.stream().anyMatch(x -> x.position == toInsertPosition);
    if (!hasConflictingPos) {
      return new ArrayList<ProductOptionsDTO.OptionPosition>();
    }

    // 2. first sort the array in ascending order from smallest to biggest position
    var biggerPositions = new ArrayList<>(
        currentPositions.stream()
            .filter(x -> x.position >= toInsertPosition)
            .sorted((a, b) -> a.position - b.position)
            .toList());

    // 3. then update the first position (which is the position same as the one to
    // insert)
    biggerPositions.get(0).position++;

    List<ProductOptionsDTO.OptionPosition> toUpdatePositions = new ArrayList<ProductOptionsDTO.OptionPosition>();
    toUpdatePositions.add(biggerPositions.get(0));

    // 4. check if the next item has the same position as the current one, if yes,
    // increment the next position
    for (int i = 0; i < biggerPositions.size() - 1; i++) {
      if (biggerPositions.get(i + 1).position == biggerPositions.get(i).position) {
        biggerPositions.get(i + 1).position++;
        toUpdatePositions.add(biggerPositions.get(i + 1));
      }
    }

    // 5. continue until there is no item left
    toUpdatePositions.sort((a, b) -> b.position - a.position);
    return toUpdatePositions;
  }
  
  
}
