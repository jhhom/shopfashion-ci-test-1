package com.example.demo.services.common;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Optional;
import java.util.function.Function;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MediaService {
  private final String ASSET_SERVER_URL;
  private final String ASSET_PATH = "src/main/resources/static";

  private final String ASSET_PRODUCT_IMAGE_PATH = "products/images";

  public MediaService(@Value("${server.port}") String runningPort) {
    this.ASSET_SERVER_URL = "http://localhost:" + runningPort + "/static";
  }

  /**
   * @return a tuple of: (1) the media key, (2) the size of the file saved in number of bytes
   * @throws IOException
   */
  public ImmutablePair<Path, Integer> saveMedia(String filename, String base64) throws IOException {
    String base64Data = base64.split("base64,")[1];

    byte[] decodedMedia = Base64.getDecoder().decode(base64Data);
    String randomFolderPath = RandomStringUtils.randomAlphanumeric(15);

    Path mediaFolder = Paths.get(ASSET_PRODUCT_IMAGE_PATH, randomFolderPath);
    Path mediaFolderFullPath = Paths.get(ASSET_PATH, mediaFolder.toString());
    Path mediaKey = Paths.get(mediaFolder.toString(), filename);
    Path mediaFullPath = Paths.get(ASSET_PATH, mediaKey.toString());

    Files.createDirectories(mediaFolderFullPath);
    Files.write(mediaFullPath, decodedMedia);

    return ImmutablePair.of(mediaKey, decodedMedia.length);
  }

  public String mediaUrl(String mediaKey) {
    if (mediaKey.equals("") || mediaKey == null) {
      return null;
    }
    return ASSET_SERVER_URL + "/" + mediaKey;
  }

  public Path mediaPath(String mediaKey) {
    return Path.of(ASSET_PATH, mediaKey);
  }

  public void removeFile(String mediaKey) throws IOException {
    System.out.println("MEDIA KEY: " + mediaKey);
    Path path = mediaPath(mediaKey);
    System.out.println("MEDIA PATH: " + path);
    Files.delete(path);
  }

  public Path overwriteExistingMedia(
      String base64, Function<Optional<String>, String> mediaFilename) throws IOException {
    Optional<String> fileExtension = extractFileExtensionFromBase64(base64);
    String filename = mediaFilename.apply(fileExtension);
    var savedMedia = saveMedia(filename, base64);

    return savedMedia.left;
  }

  public static String productImageFilename(String productName, Optional<String> fileExtension) {
    if (fileExtension.isPresent()) {
      return productName + "." + fileExtension.get();
    } else {
      return productName;
    }
  }

  public static Optional<String> extractFileExtensionFromBase64(String base64) {
    String[] s = base64.split(";");
    if (s.length == 0) {
      return Optional.empty();
    }
    s = s[0].split("/");
    if (s.length < 2) {
      return Optional.empty();
    }
    return Optional.of(s[1]);
  }
}
