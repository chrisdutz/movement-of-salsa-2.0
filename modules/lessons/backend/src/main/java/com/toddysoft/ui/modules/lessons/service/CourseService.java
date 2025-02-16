package com.toddysoft.ui.modules.lessons.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toddysoft.ui.modules.lessons.entity.Course;
import com.toddysoft.ui.modules.lessons.entity.Lesson;
import com.toddysoft.ui.modules.lessons.repository.CourseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class CourseService
{
    private final Logger logger = LoggerFactory.getLogger(CourseService.class);

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    //////////////////////////////////////////////
    // Service methods.
    //////////////////////////////////////////////

    @Transactional
    public Course createItem(Course course) {
        updateCoordinates(course);
        return courseRepository.save(course);
    }

    @Transactional(readOnly = true)
    public Course readItem(long id) {
        return courseRepository.getReferenceById(id);
    }

    @Transactional
    public Course updateItem(Course course) {
        updateCoordinates(course);
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteItem(Course course) {
        courseRepository.delete(course);
    }

    @Transactional(readOnly = true)
    public List<Course> listItems() {
        return courseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Course> listUpAndRunningCourses() {
        return courseRepository.findCoursesWithLessonsAfter(LocalDateTime.now());
    }

    protected void updateCoordinates(Course course) {
        Map<String, double[]> coordinates = new HashMap<>();
        RestClient restClient = null;
        ObjectMapper objectMapper = null;
        for (Lesson lesson : course.getLessons()) {
            // Only update the geo-coordinates, if the location has changed.
            if(lesson.getLocationLat() != null && lesson.getLocationLon() != null) {
                continue;
            }

            String location = lesson.getLocation();

            if (!coordinates.containsKey(lesson.getLocation())) {
                if (restClient == null) {
                    restClient = RestClient.create();
                    objectMapper = new ObjectMapper();
                }

                String response = restClient.get()
                        .uri("https://photon.komoot.io/api/?q={address}", URLEncoder.encode(location, StandardCharsets.UTF_8))
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .body(String.class);
                try {
                    JsonNode rootNode = objectMapper.readTree(response);
                    JsonNode features = rootNode.path("features");
                    if (features.isArray() && !features.isEmpty()) {
                        JsonNode geometry = features.get(0).path("geometry");
                        if (geometry.has("coordinates")) {
                            double lon = geometry.get("coordinates").get(0).asDouble();
                            double lat = geometry.get("coordinates").get(1).asDouble();
                            coordinates.put(location, new double[]{lat, lon});
                        } else {
                            logger.warn("Coordinates not found for location: {}", location);
                        }
                    } else {
                        logger.warn("Coordinates not found for location: {}", location);
                    }
                } catch (Exception e) {
                    logger.warn("Failed to parse geocoding response for location: {}", location, e);
                }
            }
            if(coordinates.containsKey(location)) {
                lesson.setLocationLon(coordinates.get(location)[0]);
                lesson.setLocationLat(coordinates.get(location)[1]);
            } else {
                lesson.setLocationLat(null);
                lesson.setLocationLon(null);
            }
        }
    }

}