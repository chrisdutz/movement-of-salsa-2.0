package com.toddysoft.ui.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward all non-API and non-static resource requests to index.html
        // (Technically all urls that don't contain a dot, which is usually used for ".css", ".js", ".png" files)
        registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ensure that static resources like CSS, JS, etc., are properly served
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

}
