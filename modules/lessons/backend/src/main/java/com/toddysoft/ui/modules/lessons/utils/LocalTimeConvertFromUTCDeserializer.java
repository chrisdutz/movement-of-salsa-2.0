package com.toddysoft.ui.modules.lessons.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeParseException;

public class LocalTimeConvertFromUTCDeserializer extends JsonDeserializer<LocalTime> {
    @Override
    public LocalTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        try {
            // Parse the value as an OffsetDateTime (UTC)
            OffsetDateTime odt = OffsetDateTime.parse(value);
            // Convert to your local time zone (e.g., Europe/Berlin)
            ZonedDateTime zdt = odt.atZoneSameInstant(ZoneId.of("Europe/Berlin"));
            // Return the local date and time
            return zdt.toLocalTime();
        } catch (DateTimeParseException e) {
            return LocalTime.parse(value);
        }
    }
}