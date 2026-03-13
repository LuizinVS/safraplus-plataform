package br.com.safraplus.capital_service.dto;

import br.com.safraplus.capital_service.model.Property;

import java.time.LocalDateTime;

public record PropertyResponseDTO(
        Long propertyId,
        String propertyName,
        String location,
        Integer areaInHectares,
        String description,
        LocalDateTime createdAt
) {

    public static PropertyResponseDTO fromEntity (Property property){
        return new PropertyResponseDTO(
                property.getId(),
                property.getPropertyName(),
                property.getLocation(),
                property.getAreaInHectares(),
                property.getDescription(),
                property.getCreatedAt()
        );
    }
}
