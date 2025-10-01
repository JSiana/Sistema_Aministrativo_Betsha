package com.example.demo.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Converter(autoApply = true)
public class LocalDateTimeAtrributeConverter implements AttributeConverter<LocalDateTime, Timestamp>
{
    @Override
    public Timestamp convertToDatabaseColumn(LocalDateTime localDateTime){
        return (localDateTime == null) ? null: Timestamp.valueOf(localDateTime);
    }

    @Override
    public LocalDateTime convertToEntityAttribute(Timestamp sqlTimestamp){
        return (sqlTimestamp == null) ? null: sqlTimestamp.toLocalDateTime();
    }

}
