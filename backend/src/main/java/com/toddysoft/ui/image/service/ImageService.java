package com.toddysoft.ui.image.service;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.jpeg.JpegDirectory;
import com.toddysoft.ui.image.entity.Image;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.List;

@Service
public class ImageService {
    private final Log log = LogFactory.getLog(getClass());

    public Image resizeImage(String inputImageData, int maxWidth, int maxHeight) {
        String[] split = inputImageData.split(",");

        // Read the byte-data into a buffered image.
        final ByteArrayInputStream imageIS = new ByteArrayInputStream(Base64.getDecoder().decode(split[1]));
        final BufferedImage inputImage;
        try {
            inputImage = ImageIO.read(imageIS);

            // Read the orientation information and rotate the image accordingly.
            BufferedImage rotatedImage = rotateImage(inputImage, imageIS);

            // Resize the image.
            final BufferedImage outputImage = resizeImage(rotatedImage, maxWidth, maxHeight);

            // Configure the JPEG compression.
            JPEGImageWriteParam jpegParams = new JPEGImageWriteParam(null);
            jpegParams.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            jpegParams.setCompressionQuality(0.9f);
            ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();

            // Output the result converted to a JPEG to a byte-data.
            ByteArrayOutputStream imageOS = new ByteArrayOutputStream();
            ImageOutputStream ios = ImageIO.createImageOutputStream(imageOS);
            writer.setOutput(ios);
            writer.write(null, new IIOImage(outputImage, null, null), jpegParams);

            final Image image = new Image();
            image.setWidth(outputImage.getWidth());
            image.setHeight(outputImage.getHeight());
            image.setImageData("data:image/jpeg;base64," + new String(Base64.getEncoder().encode(imageOS.toByteArray())));

            return image;
        }
        catch (IOException e) {
            log.error("Error resizing an image", e);
            return null;
        }
    }

    public BufferedImage rotateImage(BufferedImage inputImage, InputStream inputStream) {
        try {
            // Reset the input stream as it's probably currently pointing at the end of the file.
            inputStream.reset();

            // Read the image data and extract the metainformation from it.
            Metadata metadata = ImageMetadataReader.readMetadata(inputStream);

            int orientation = 1;
            ExifIFD0Directory exifIFD0Directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            if(exifIFD0Directory != null) {
                if(exifIFD0Directory.containsTag(ExifIFD0Directory.TAG_ORIENTATION)) {
                    try {
                        orientation = exifIFD0Directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
                    } catch (MetadataException e) {
                        log.error("Error getting the orientation metadata from an image", e);
                    }
                }

                int width = inputImage.getWidth();
                int height = inputImage.getHeight();
                int tmp;
                List<JpegDirectory> jpegDirectories =
                        (List<JpegDirectory>) metadata.getDirectoriesOfType(JpegDirectory.class);
                try {
                    for (JpegDirectory jpegDirectory : jpegDirectories) {
                        width = jpegDirectory.getImageWidth();
                        height = jpegDirectory.getImageHeight();
                    }
                } catch (MetadataException e) {
                    log.error("Error getting width and height metadata from an image", e);
                }

                // Initialize the transformation based on the orientation.
                AffineTransform transform = new AffineTransform();
                switch (orientation) {
                    // Do nothing
                    case 1:
                        break;
                    // Flip X
                    case 2:
                        transform.scale(-1.0, 1.0);
                        transform.translate(-width, 0);
                        break;
                    // PI rotation
                    case 3:
                        transform.translate(width, height);
                        transform.rotate(Math.PI);
                        tmp = width;
                        width = height;
                        height = tmp;
                        break;
                    // Flip Y
                    case 4:
                        transform.scale(1.0, -1.0);
                        transform.translate(0, -height);
                        break;
                    // -PI/2 and Flip X
                    case 5:
                        transform.rotate(-Math.PI / 2);
                        transform.scale(-1.0, 1.0);
                        tmp = width;
                        width = height;
                        height = tmp;
                        break;
                    // -PI/2 and -width
                    case 6:
                        transform.translate(height, 0);
                        transform.rotate(Math.PI / 2);
                        tmp = width;
                        width = height;
                        height = tmp;
                        break;
                    // PI/2 and Flip
                    case 7:
                        transform.scale(-1.0, 1.0);
                        transform.translate(-height, 0);
                        transform.translate(0, width);
                        transform.rotate(3 * Math.PI / 2);
                        tmp = width;
                        width = height;
                        height = tmp;
                        break;
                    // PI/2
                    case 8:
                        transform.translate(0, width);
                        transform.rotate(3 * Math.PI / 2);
                        tmp = width;
                        width = height;
                        height = tmp;
                        break;
                }

                // Perform the transformation.
                AffineTransformOp rotation = new AffineTransformOp(transform, AffineTransformOp.TYPE_BILINEAR);
                BufferedImage rotatedImage = new BufferedImage(
                        width, height, inputImage.getType());
                rotatedImage = rotation.filter(inputImage, rotatedImage);
                return rotatedImage;
            } else {
                return inputImage;
            }
        } catch (IOException e) {
            return inputImage;
        } catch (ImageProcessingException e) {
            return inputImage;
        }
    }

    public BufferedImage resizeImage(final BufferedImage aInputImage, final int aMaxWidth,
                                     final int aMaxHeight) {
        return resizeImage(aInputImage, aMaxWidth, aMaxHeight, false);
    }

    public BufferedImage resizeImage(final BufferedImage aInputImage, final int aMaxWidth,
                                     final int aMaxHeight, final boolean outboxing) {
        // Get some information about the original type and
        // format of the image.
        final int originalType = aInputImage.getType() == 0 ? BufferedImage.TYPE_INT_ARGB : aInputImage.getType();
        final int originalWidth = aInputImage.getWidth();
        final int originalHeight = aInputImage.getHeight();

        // Calculate the aspect-ratios of the old an new image
        // in order to find out which property has to be dominant
        // in the scaling process.
        final double oldAspectRatio = (double) originalHeight / (double) originalWidth;
        final double newAspectRatio = (double) aMaxHeight / (double) aMaxWidth;

        // Calculate the new size
        int newWidth = aMaxWidth;
        int newHeight = aMaxHeight;

        // Outboxing: the image is resized that it fills the given area completely
        // with a minimum of wasted image area.
        if(outboxing) {
            // Width is dominant.
            if (oldAspectRatio < newAspectRatio) {
                newWidth = (int) (((double) aMaxHeight / (double) originalHeight) * (double) originalWidth);
                newHeight = aMaxHeight;
            }
            // Height is dominant.
            else if (oldAspectRatio > newAspectRatio) {
                newWidth = aMaxWidth;
                newHeight = (int) (((double) aMaxWidth / (double) originalWidth) * (double) originalHeight);
            }
        }
        // The image is resized that no image-data is wasted and a minimum area of
        // the given box is not filled.
        else {
            // Height is dominant.
            if (oldAspectRatio > newAspectRatio) {
                newWidth = (int) (((double) aMaxHeight / (double) originalHeight) * (double) originalWidth);
                newHeight = aMaxHeight;
            }
            // Width is dominant.
            else if (oldAspectRatio < newAspectRatio) {
                newWidth = aMaxWidth;
                newHeight = (int) (((double) aMaxWidth / (double) originalWidth) * (double) originalHeight);
            }
        }

        // Prepare the resizing process.
        final BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, originalType);
        final Graphics2D g = resizedImage.createGraphics();
        g.setComposite(AlphaComposite.Src);
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Perform the resizing process.
        g.drawImage(aInputImage, 0, 0, newWidth, newHeight, null);
        g.dispose();

        return resizedImage;
    }
}
