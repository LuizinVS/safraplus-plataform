package br.com.safraplus.capital_service.controller;

import br.com.safraplus.capital_service.dto.PropertyRequestDTO;
import br.com.safraplus.capital_service.dto.PropertyResponseDTO;
import br.com.safraplus.capital_service.model.Property;
import br.com.safraplus.capital_service.model.User;
import br.com.safraplus.capital_service.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<PropertyResponseDTO> createProperty(
            @Valid @RequestBody PropertyRequestDTO propertyRequestDTO,
            @AuthenticationPrincipal User loggedInUser
            ){

        Property createdProperty = propertyService.createProperty(propertyRequestDTO, loggedInUser);

        PropertyResponseDTO responseDTO = PropertyResponseDTO.fromEntity(createdProperty);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponseDTO>> getUserProperties(@AuthenticationPrincipal User loggedInUser){
        List<Property> properties = propertyService.findPropertiesByOwner(loggedInUser);

        List<PropertyResponseDTO> responseDTOS = properties.stream()
                .map(PropertyResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOS);
    }

    @PutMapping("/{propertyId}")
    public ResponseEntity<PropertyResponseDTO> updateProperty(
            @PathVariable Long propertyId,
            @Valid @RequestBody PropertyRequestDTO propertyRequestDTO,
            @AuthenticationPrincipal User loggedInUser
    ){
        Property updatedProperty = propertyService.updateProperty(propertyId, propertyRequestDTO,loggedInUser);
        PropertyResponseDTO responseDTO = PropertyResponseDTO.fromEntity(updatedProperty);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal User loggedInUser
    ){
        propertyService.deleteProperty(propertyId, loggedInUser);

        return ResponseEntity.noContent().build();
    }
}
