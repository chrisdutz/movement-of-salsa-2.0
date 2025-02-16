package com.toddysoft.ui.modules.lessons.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;

public class LocalDateTimeConvertFromUTCDeserializer extends JsonDeserializer<LocalDateTime> {
    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        // Parse the value as an OffsetDateTime (UTC)
        try {
            OffsetDateTime odt = OffsetDateTime.parse(value);
            // Convert to your local time zone (e.g., Europe/Berlin)
            ZonedDateTime zdt = odt.atZoneSameInstant(ZoneId.of("Europe/Berlin"));
            // Return the local date and time
            return zdt.toLocalDateTime();
        } catch (DateTimeParseException e) {
            return LocalDateTime.parse(value);
        }
    }
}