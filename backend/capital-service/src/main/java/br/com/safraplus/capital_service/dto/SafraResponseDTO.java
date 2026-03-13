package br.com.safraplus.capital_service.dto;

import br.com.safraplus.capital_service.model.Safra;

import java.time.LocalDate;

public record SafraResponseDTO(
        Long id,
        String name,
        String cropType,
        LocalDate startDate,
        LocalDate endDate,
        Long propertyId
) {

    public static SafraResponseDTO fromEntity(Safra safra){
        return new SafraResponseDTO(
                safra.getId(),
                safra.getName(),
                safra.getCropType(),
                safra.getStartDate(),
                safra.getEndDate(),
                safra.getProperty().getId()
        );
    }
}
